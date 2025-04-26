const Event = require('../models/Event');
const User = require('../models/User');
const Location = require('../models/location');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const eventController = {
  // Crear evento con query params
  createEvent: async (req, res) => {
    try {
      const { 
        name, 
        description, 
        date, 
        locations, 
        price, 
        category 
      } = req.query;

      // Validar parámetros obligatorios
      if (!name || !description || !date || !locations || !price || !category) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
      }

      const organizer_id = req.userId;
      const locationsArray = locations.split(',');

      // Validar ubicaciones
      const validLocations = await Location.find({ 
        _id: { $in: locationsArray } 
      });
      
      if (validLocations.length !== locationsArray.length) {
        return res.status(400).json({ error: 'Ubicaciones no válidas' });
      }

      // Crear nuevo evento
      const newEvent = await Event.create({
        name,
        description,
        date: new Date(date),
        locations: locationsArray,
        organizer_id,
        price: Number(price),
        category,
        status: 'active',
        participants: []
      });

      // Actualizar usuario organizador
      await User.findByIdAndUpdate(
        organizer_id,
        { $push: { events: newEvent._id } }
      );

      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error creando evento',
        details: error.message 
      });
    }
  },

  // Eliminar evento por query param
  deleteEvent: async (req, res) => {
    try {
      const { id } = req.query;
      const userId = req.userId;

      if (!id) return res.status(400).json({ error: 'ID requerido' });

      // Validar ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID de evento no válido' });
      }

      // Buscar y verificar organizador
      const event = await Event.findById(id);
      if (!event) return res.status(404).json({ error: 'Evento no encontrado' });
      
      if (event.organizer_id.toString() !== userId) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      // Eliminar evento
      await Event.findByIdAndDelete(id);

      // Eliminar referencia en usuarios
      await User.updateMany(
        { events: id },
        { $pull: { events: id } }
      );

      res.json({ message: 'Evento eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ 
        error: 'Error eliminando evento',
        details: error.message 
      });
    }
  },

  // Actualizar evento por query param
  updateEvent: async (req, res) => {
    try {
      const { id, ...updateData } = req.query;
      const userId = req.userId;

      if (!id) return res.status(400).json({ error: 'ID requerido' });

      // Validar ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID de evento no válido' });
      }

      // Verificar organizador
      const existingEvent = await Event.findById(id);
      if (!existingEvent) return res.status(404).json({ error: 'Evento no encontrado' });
      
      if (existingEvent.organizer_id.toString() !== userId) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      // Convertir tipos de datos
      if (updateData.price) updateData.price = Number(updateData.price);
      if (updateData.locations) updateData.locations = updateData.locations.split(',');
      if (updateData.date) updateData.date = new Date(updateData.date);

      // Actualizar evento
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error actualizando evento',
        details: error.message 
      });
    }
  },
    getEventById: async (req, res) => {
        try {
            const eventId = req.params.id;
            const userId = req.userId;
            
            if (!mongoose.Types.ObjectId.isValid(eventId)) {
                return res.status(400).json({ error: 'ID de evento no válido' });
            }
    
            const event = await Event.findById(eventId)
                .populate('organizer_id', 'name email')
                .populate('locations', 'name address');
    
            if (!event) {
                return res.status(404).json({ error: 'Evento no encontrado' });
            }
    
            res.json(event);
        } catch (error) {
            res.status(500).json({ 
                error: 'Error al obtener el evento',
                details: error.message 
            });
        }
    },
    createTransaction: async (req, res) => {
      try {
          const { eventId } = req.params;
          const userId = req.userId;
  
          // 1. Validar que el evento exista y obtener su precio
          const event = await Event.findById(eventId);
          if (!event) {
              return res.status(404).json({ message: 'Evento no encontrado' });
          }
  
          // 2. Crear la sesión de pago en Stripe
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: event.name,
                        description: event.description,
                    },
                    unit_amount: Math.round(event.price * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'https://example.com/success', // URL genérica como fallback
            cancel_url: 'https://example.com/cancel',  // URL genérica como fallback
            metadata: {
                eventId: eventId.toString(),
                userId: userId.toString()
            }
        });
  
          // 3. Crear la transacción en la base de datos
          const newTransaction = new Transaction({
              user_id: userId,
              event_id: eventId,
              amount: event.price,
              status: 'pending',
              stripe_payment_intent_id: session.payment_intent
          });
  
          await newTransaction.save();

          if (!event.participants.includes(userId)) {
              event.participants.push(userId);
              await event.save();
          }
    
          // 4. Responder con los datos necesarios para el frontend
          res.status(201).json({
              payment_url: session.url,
              client_secret: session.payment_intent,
              amount: event.price,
              currency: 'eur',
              transaction_id: newTransaction._id
          });
  
      } catch (error) {
          console.error('Error en createTransaction:', error);
          res.status(500).json({ 
              message: 'Error al procesar el pago',
              error: error.message 
          });
      }
  }
    
};

module.exports = eventController;