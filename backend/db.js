const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://yvelmencedanub:TTvRwpvktH1dXhHd@fyp.stpzo.mongodb.net/Node-API?retryWrites=true&w=majority&appName=FYP";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit the process on failure
  }
};

module.exports = connectDB;

