const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const Question = require('./quiz_questions_db');
const User = require('./user_model');
const mongoose = require('mongoose');


const app = express();
const PORT = 5000;

// Model configuration
const MODEL_CLASSES = ["Kidney", "Lung"];
const MODEL_URL = path.resolve(__dirname, 'model');
let model;

// Load the TensorFlow model
const loadModel = async () => {
  try {
    console.log('Loading model...');
    const modelPath = `file://${path.resolve(__dirname, 'model/model.json')}`;
    model = await tf.loadLayersModel(modelPath);
    console.log('Model loaded successfully.');
  } catch (error) {
    console.error('Error loading model:', error);
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Connect to MongoDB
connectDB();

// Quiz Questions Endpoint
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ message: 'Error fetching questions', error: err.message });
  }
});

// Image Prediction Endpoint
app.post('/predict', upload.single('image'), async (req, res) => {
  if (!model) {
    return res.status(500).send({ error: 'Model not loaded' });
  }

  if (!req.file) {
    return res.status(400).send({ error: 'No image uploaded' });
  }

  try {
    const tensor = tf.tidy(() => {
      const decodedImage = tf.node.decodeImage(req.file.buffer);
      console.log('Decoded Image:', decodedImage);
      return decodedImage
        .resizeBilinear([224, 224])
        .toFloat()
        .div(255.0)
        .expandDims();
    });

    const predictions = await model.predict(tensor).data();
    tensor.dispose();
    console.log('Prepared Tensor:', tensor);

    const predictedIndex = Array.from(predictions).indexOf(Math.max(...predictions));
    console.log('Predicted Index:', predictedIndex);

    const confidence = (predictions[predictedIndex] * 100).toFixed(2);
    console.log('Raw predictions:', predictions);

    res.send({
      label: MODEL_CLASSES[predictedIndex],
      confidence: `${confidence}%`,
    });
  } catch (error) {
    console.error('Error in prediction:', error);
    res.status(500).send({ error: 'Prediction failed' });
  }
});

// Endpoint to fetch all quizzes metadata
app.get('/api/quizzes', async (req, res) => {
  try {
    const quizzes = await mongoose.connection.collection('quizzes').find().toArray();
    res.json(quizzes); // Send metadata for all quizzes
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ message: 'Error fetching quizzes', error: err.message });
  }
});

// Dynamic endpoint to fetch quiz questions based on collectionName from /api/quizzes
app.get('/api/quizzes/:collectionName', async (req, res) => {
  const { collectionName } = req.params;

  try {
    // Fetch questions from the dynamic collectionName
    const questions = await mongoose.connection.collection(collectionName).find().toArray();
    res.json(questions); // Send questions back to the frontend
  } catch (err) {
    console.error('Error fetching quiz questions:', err);
    res.status(500).json({ message: 'Error fetching quiz questions', error: err.message });
  }
});

// Fallback route if collection is not found
app.get('/api/:collectionName', async (req, res) => {
  const { collectionName } = req.params;

  try {
    const questions = await mongoose.connection.collection(collectionName).find().toArray();
    if (!questions) {
      return res.status(404).json({ message: `Collection ${collectionName} not found` });
    }
    res.json(questions);
  } catch (err) {
    console.error(`Error fetching data from collection ${collectionName}:`, err);
    res.status(500).json({ message: 'Error fetching collection data', error: err.message });
  }
});



// Initialize server
loadModel();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});