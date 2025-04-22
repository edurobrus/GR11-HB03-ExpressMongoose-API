const PaymentMethod = require('../models/PaymentMethod'); // Ruta a tu modelo
const mongoose = require('mongoose');
const paymentMethods = [
    {
      type: "Credit Card",
      details: "**** **** **** 1234 - Visa",
      user_id: new mongoose.Types.ObjectId(),  // ID de un usuario ficticio
      stripe_customer_id: "cus_Nfz5jfQ3qR3qRo"  // Formato típico de Stripe
    },
    {
      type: "PayPal",
      details: "usuario_empresarial@correo.com",
      user_id: new mongoose.Types.ObjectId(),
      stripe_customer_id: "cus_rK9pLmZt8yT2Xv"
    },
    {
      type: "Bank Transfer",
      details: "ES91 2100 0418 4502 0005 1332",
      user_id: new mongoose.Types.ObjectId(),
      stripe_customer_id: "cus_45HsDf7w6yPq1a"
    },
    {
      type: "Credit Card",
      details: "**** **** **** 5678 - Mastercard",
      user_id: new mongoose.Types.ObjectId(),
      stripe_customer_id: "cus_9b3FgT4r2QnX7z"
    }
  ];
// Insertar datos
const connectDB = async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/cbd', { // Cambia el nombre de la BD
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('✅ Conectado a MongoDB');
    } catch (err) {
      console.error('❌ Error de conexión:', err);
      process.exit(1);
    }
  };
  
  // Insertar datos
  const insertData = async () => {
    try {
      await connectDB();
      await PaymentMethod.deleteMany(); // Opcional: Limpiar la colección primero
      const result = await PaymentMethod.insertMany(paymentMethods);
      console.log(`🗃️ Insertados ${result.length} métodos de pago`);
      process.exit(0);
    } catch (err) {
      console.error('❌ Error al insertar:', err);
      process.exit(1);
    }
  };
  
  insertData();