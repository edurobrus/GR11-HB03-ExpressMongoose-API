const Item = require('../models/Item');

// GET /api/items - Obtiene todos los ítems
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los ítems' });
  }
};

// GET /api/items/:id - Obtiene un ítem por ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Ítem no encontrado' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el ítem' });
  }
};

// POST /api/items - Crea un nuevo ítem
exports.createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el ítem' });
  }
};

// PUT /api/items/:id - Actualiza un ítem por ID
exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ error: 'Ítem no encontrado' });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el ítem' });
  }
};

// DELETE /api/items/:id - Elimina un ítem por ID
exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: 'Ítem no encontrado' });
    res.json({ message: 'Ítem eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el ítem' });
  }
};
