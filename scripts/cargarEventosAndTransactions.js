const mongoose = require('mongoose');
require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Event = require('../models/Event');
const User = require('../models/User');
const Location = require('../models/location');
const Transaction = require('../models/Transaction');

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

// Datos de prueba manuales
const EVENT_NAMES = [
  "Concierto de Rock", "Taller de Cocina", "Conferencia Tech", 
  "Exposición de Arte", "Maratón Urbano", "Festival de Cine",
  "Clase de Yoga", "Seminario de Marketing", "Feria de Empleo",
  "Torneo de Fútbol", "Show de Stand-up", "Curso de Fotografía"
];

const EVENT_DESCRIPTIONS = [
  "Un evento increíble para disfrutar con amigos",
  "Aprende nuevas habilidades con expertos",
  "Conoce las últimas tendencias del sector",
  "Experiencia cultural única",
  "Evento deportivo para todos los niveles",
  "Networking y aprendizaje combinados"
];

const FIRST_NAMES = ["Ana", "Carlos", "María", "Juan", "Lucía"];
const LAST_NAMES = ["Gómez", "Pérez", "López", "Martínez", "Rodríguez"];

async function generateTestData() {
  try {
    // 1. Obtener usuarios y ubicaciones existentes
    const existingUsers = await User.find().limit(5);
    const existingLocations = await Location.find().limit(3);
    
    if (existingUsers.length === 0 || existingLocations.length === 0) {
      throw new Error('No hay suficientes usuarios o ubicaciones en la base de datos');
    }

    console.log(`Usando ${existingUsers.length} usuarios existentes`);
    console.log(`Usando ${existingLocations.length} ubicaciones existentes`);

    // 2. Crear 50 eventos aleatorios
    const events = [];
    
    for (let i = 0; i < 50; i++) {
      const randomUser = existingUsers[Math.floor(Math.random() * existingUsers.length)];
      const randomLocation = existingLocations[Math.floor(Math.random() * existingLocations.length)];
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 30));
      
      const event = new Event({
        name: EVENT_NAMES[i % EVENT_NAMES.length] + (i > EVENT_NAMES.length ? ` ${Math.floor(i / EVENT_NAMES.length) + 1}` : ''),
        description: EVENT_DESCRIPTIONS[Math.floor(Math.random() * EVENT_DESCRIPTIONS.length)],
        date: eventDate,
        locations: [randomLocation._id],
        organizer_id: randomUser._id,
        price: 10 + Math.floor(Math.random() * 90) + Math.round(Math.random() * 100) / 100,
        status: ['active', 'canceled', 'completed'][Math.floor(Math.random() * 3)]
      });
      
      events.push(await event.save());
    }
    console.log(`${events.length} eventos creados`);

    // 3. Crear transacciones con Stripe
    const transactions = [];
    for (const event of events) {
      const randomUser = existingUsers[Math.floor(Math.random() * existingUsers.length)];
      
      // Crear Payment Intent en Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(event.price * 100),
        currency: 'eur',
        metadata: {
          eventId: event._id.toString(),
          userId: randomUser._id.toString()
        },
        description: `Pago para evento: ${event.name}`
      });

      const transaction = new Transaction({
        user_id: randomUser._id,
        event_id: event._id,
        amount: event.price,
        status: ['pending', 'completed', 'refunded'][Math.floor(Math.random() * 3)],
        stripe_payment_intent_id: paymentIntent.id
      });

      transactions.push(await transaction.save());
    }
    console.log(`${transactions.length} transacciones creadas`);

    console.log('✅ Datos de prueba generados exitosamente');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error al generar datos de prueba:', error);
    process.exit(1);
  }
}

// Ejecutar el generador
generateTestData();