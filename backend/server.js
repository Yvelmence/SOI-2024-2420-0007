// server.js

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

// ============================
// Existing Endpoints
// ============================

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

// Other quiz endpoints
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

// ============================
// Forum Endpoints using Mongoose
// ============================

// Define Schema & Model for Forum Posts
const forumPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },      // URL or base64 string for the image
  userId: { type: String, required: true },
  tags: [String],                  // Optional: tags or categories
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }        // Optional: update this field on edits
});
const ForumPost = mongoose.model("ForumPost", forumPostSchema);

// Define Schema & Model for Forum Comments
const forumCommentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  text: { type: String, required: true },
  userId: { type: String, required: true },  // Who posted the comment
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});
const ForumComment = mongoose.model("ForumComment", forumCommentSchema);

// GET: Retrieve all forum posts
app.get('/api/forum', async (req, res) => {
  try {
    // Query: find all forum posts and sort by creation date (newest first)
    const posts = await ForumPost.find({}).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching forum posts:', err);
    res.status(500).json({ message: 'Error fetching forum posts', error: err.message });
  }
});

// POST: Create a new forum post
app.post('/api/forum', async (req, res) => {
  // Log the received data for debugging
  console.log("Received POST body:", req.body);
  const { title, content, imageUrl, userId } = req.body;
  const newPost = new ForumPost({ title, content, imageUrl, userId });
  try {
    await newPost.save();
    console.log("New post created:", newPost);
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating forum post:', err);
    res.status(400).json({ message: 'Error creating forum post', error: err.message });
  }
});

// PUT: Update a forum post (users can only update their own posts via frontend validation)
app.put('/api/forum/:id', async (req, res) => {
  const { title, content, imageUrl, userId } = req.body;
  try {
    // Update the forum post with new data and return the updated document
    const updatedPost = await ForumPost.findByIdAndUpdate(
      req.params.id,
      { title, content, imageUrl, userId, updatedAt: new Date() },
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    console.error('Error updating forum post:', err);
    res.status(400).json({ message: 'Error updating forum post', error: err.message });
  }
});

// DELETE: Delete a forum post
app.delete('/api/forum/:id', async (req, res) => {
  try {
    await ForumPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Forum post deleted successfully" });
  } catch (err) {
    console.error('Error deleting forum post:', err);
    res.status(500).json({ message: 'Error deleting forum post', error: err.message });
  }
});

// GET: Retrieve comments for a specific forum post
app.get('/api/forum/:id/comments', async (req, res) => {
  try {
    // Query: find all comments with the matching postId and sort them by createdAt (newest first)
    const comments = await ForumComment.find({ postId: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
});

// POST: Add a comment to a specific forum post
app.post('/api/forum/:id/comments', async (req, res) => {
  const { text, userId } = req.body;  // Optionally include userId for the comment
  const newComment = new ForumComment({ postId: req.params.id, text, userId });
  try {
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(400).json({ message: 'Error adding comment', error: err.message });
  }
});
