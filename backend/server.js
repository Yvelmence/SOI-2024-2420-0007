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
const PORT = 3000;

// Model configuration for Teachable Machine
const MODEL_CLASSES = ["Lung", "Kidney"];
const TEACHABLE_MACHINE_URL = 'https://teachablemachine.withgoogle.com/models/n_3HlXZM5/';
let model;

// Load the Teachable Machine model
const loadModel = async () => {
  try {
    console.log('Loading Teachable Machine model...');
    model = await tf.loadLayersModel(TEACHABLE_MACHINE_URL + 'model.json');
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

// Updated Image Prediction Endpoint for Teachable Machine
app.post('/predict', upload.single('image'), async (req, res) => {
  if (!model) {
    return res.status(500).send({ error: 'Model not loaded' });
  }

  if (!req.file) {
    return res.status(400).send({ error: 'No image uploaded' });
  }

  try {
    // Process image according to Teachable Machine's requirements
    const tensor = tf.tidy(() => {
      const decodedImage = tf.node.decodeImage(req.file.buffer);
      // Teachable Machine models typically expect 224x224 images
      const resized = tf.image.resizeBilinear(decodedImage, [224, 224]);
      // Normalize to [-1, 1]
      const normalized = resized.toFloat().div(127.5).sub(1);
      return normalized.expandDims();
    });

    const predictions = await model.predict(tensor).data();
    tensor.dispose();

    const predictedIndex = Array.from(predictions).indexOf(Math.max(...predictions));
    const confidence = (predictions[predictedIndex] * 100).toFixed(2);

    res.send({
      label: MODEL_CLASSES[predictedIndex],
      confidence: `${confidence}%`,
    });
  } catch (error) {
    console.error('Error in prediction:', error);
    res.status(500).send({ error: 'Prediction failed' });
  }
});

// Other endpoints remain the same...
app.get('/api/quizzes', async (req, res) => {
  try {
    const quizzes = await mongoose.connection.collection('quizzes').find().toArray();
    res.json(quizzes);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ message: 'Error fetching quizzes', error: err.message });
  }
});

app.get('/api/quizzes/:collectionName', async (req, res) => {
  const { collectionName } = req.params;
  try {
    const questions = await mongoose.connection.collection(collectionName).find().toArray();
    res.json(questions);
  } catch (err) {
    console.error('Error fetching quiz questions:', err);
    res.status(500).json({ message: 'Error fetching quiz questions', error: err.message });
  }
});

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