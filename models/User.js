const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    age: Number,
    email: String,
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    preferences: { type: Map, of: String }
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Comparar contraseñas
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);