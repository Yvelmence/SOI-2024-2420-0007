// server.js
const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const connectDB = require('./db');
const Question = require('./quiz_questions_db');
const User = require('./user_model');


const app = express();
const PORT = process.env.PORT || 3000;

// Model configuration for Teachable Machine
const MODEL_CLASSES = ["Lung", "Kidney"];
const TEACHABLE_MACHINE_URL = 'https://teachablemachine.withgoogle.com/models/n_3HlXZM5/';
let model;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Set up Multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

// Load the model when server starts
loadModel();

// ============================
// Forum Schemas
// ============================

const forumPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  userId: { type: String, required: true },
  userName: { type: String },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const forumCommentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  text: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const ForumPost = mongoose.model("ForumPost", forumPostSchema);
const ForumComment = mongoose.model("ForumComment", forumCommentSchema);

// ============================
// Quiz Endpoints
// ============================

app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ message: 'Error fetching questions', error: err.message });
  }
});

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

// New API route to handle creation of quizzes and their questions
app.post('/api/create-quiz', async (req, res) => {
  const { quizName, questions } = req.body;

  if (!quizName || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "Quiz name and at least one question are required" });
  }

  try {
    // Step 1: Create a quiz metadata entry in the 'quizzes' collection
    const collectionName = `questions${Date.now()}`;
    const quizResult = await mongoose.connection.collection('quizzes').insertOne({
      quizName,
      collectionName,
    });
    const quizId = quizResult.insertedId;

    // Step 2: Create the collection for questions dynamically
    const questionsCollection = mongoose.connection.collection(collectionName);
    
    // Add the questions to the dynamically created collection
    const questionEntries = questions.map((q, index) => ({
      quiz_id: quizId,
      question: q.question,
      image: q.image || '',
      answerOptions: q.answerOptions,
    }));
    
    await questionsCollection.insertMany(questionEntries);

    res.status(201).json({
      message: `Quiz "${quizName}" created successfully!`,
      quizId: quizId,
      collectionName: collectionName,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Error creating quiz", error: error.message });
  }
});


// ============================
// Forum Admin Routes (Should be before regular routes)
// ============================

app.delete('/api/forum/admin/:id', async (req, res) => {
  const { adminId } = req.body;
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    await ForumComment.deleteMany({ postId: req.params.id });
    await ForumPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Forum post and comments deleted successfully" });
  } catch (err) {
    console.error('Error deleting forum post:', err);
    res.status(500).json({ message: 'Error deleting forum post', error: err.message });
  }
});

app.delete('/api/forum/admin/comments/:commentId', async (req, res) => {
  const { adminId } = req.body;
  try {
    const deletedComment = await ForumComment.findByIdAndDelete(req.params.commentId);
    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
});

// ============================
// Forum Regular Routes
// ============================

app.get('/api/forum', async (req, res) => {
  try {
    const posts = await ForumPost.find({}).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching forum posts:', err);
    res.status(500).json({ message: 'Error fetching forum posts', error: err.message });
  }
});

app.post('/api/forum', async (req, res) => {
  const { title, content, imageUrl, userId, userName } = req.body;
  const newPost = new ForumPost({ title, content, imageUrl, userId, userName });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error('Error creating forum post:', err);
    res.status(400).json({ message: 'Error creating forum post', error: err.message });
  }
});

app.put('/api/forum/:id', async (req, res) => {
  const { title, content, imageUrl, userId } = req.body;
  try {
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

app.delete('/api/forum/:id', async (req, res) => {
  const { userId } = req.body;
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await ForumPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Forum post deleted successfully" });
  } catch (err) {
    console.error('Error deleting forum post:', err);
    res.status(500).json({ message: 'Error deleting forum post', error: err.message });
  }
});

app.get('/api/forum/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error('Error fetching forum post:', err);
    res.status(500).json({ message: 'Error fetching forum post', error: err.message });
  }
});

app.get('/api/forum/:id/comments', async (req, res) => {
  try {
    const comments = await ForumComment.find({ postId: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
});

app.post('/api/forum/:id/comments', async (req, res) => {
  const { text, userId, userName } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Comment cannot be empty' });
  }
  const newComment = new ForumComment({ 
    postId: req.params.id, 
    text: text.trim(), 
    userId,
    userName
  });
  try {
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(400).json({ message: 'Error adding comment', error: err.message });
  }
});

app.put('/api/forum/comments/:commentId', async (req, res) => {
  const { text, userId } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Comment cannot be empty' });
  }
  try {
    const comment = await ForumComment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    comment.text = text.trim();
    comment.updatedAt = new Date();
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error('Error updating comment:', err);
    res.status(500).json({ message: 'Error updating comment', error: err.message });
  }
});

app.delete('/api/forum/comments/:commentId', async (req, res) => {
  const { userId } = req.body;
  try {
    const comment = await ForumComment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await ForumComment.findByIdAndDelete(req.params.commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
});


















// ============================
// Tissue Routes
// ============================
// Add this with the other schemas
const tissueSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Tissue name is required'],
    trim: true
  },
  img: { 
    type: String,    // Store base64 image string
    required: [true, 'Tissue image is required']
  },
  info: { 
    type: String, 
    required: [true, 'Tissue information is required'],
    trim: true
  },
  userId: { 
    type: String, 
    required: [true, 'User ID is required']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date 
  }
});

const Tissue = mongoose.model('Tissue', tissueSchema);

// Add these routes before the error handling middleware
// ============================
// Tissue Routes
// ============================

app.get('/api/tissues', async (req, res) => {
  try {
    const tissues = await Tissue.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json(tissues);
  } catch (err) {
    console.error('Error fetching tissues:', err);
    res.status(500).json({ 
      message: 'Error fetching tissues', 
      error: err.message 
    });
  }
});

app.post('/api/tissues', async (req, res) => {
  try {
    const { name, img, info, userId } = req.body;
    
    if (!name?.trim() || !img || !info?.trim() || !userId) {
      return res.status(400).json({ 
        message: 'All fields are required: name, image, info, and userId' 
      });
    }

    if (!img.startsWith('data:image/')) {
      return res.status(400).json({ 
        message: 'Invalid image format. Must be a base64 image string' 
      });
    }

    const newTissue = new Tissue({
      name: name.trim(),
      img,
      info: info.trim(),
      userId
    });

    const savedTissue = await newTissue.save();
    res.status(201).json(savedTissue);
  } catch (err) {
    console.error('Error creating tissue:', err);
    res.status(400).json({ 
      message: 'Error creating tissue', 
      error: err.message 
    });
  }
});

app.put('/api/tissues/:id', async (req, res) => {
  try {
    const { name, img, info, userId } = req.body;
    
    if (!name?.trim() || !info?.trim() || !userId) {
      return res.status(400).json({ 
        message: 'Name, info, and userId are required' 
      });
    }

    const updateData = {
      name: name.trim(),
      info: info.trim(),
      userId,
      updatedAt: new Date()
    };

    if (img) {
      if (!img.startsWith('data:image/')) {
        return res.status(400).json({ 
          message: 'Invalid image format. Must be a base64 image string' 
        });
      }
      updateData.img = img;
    }

    const tissue = await Tissue.findById(req.params.id);
    if (!tissue) {
      return res.status(404).json({ message: 'Tissue not found' });
    }

    const updatedTissue = await Tissue.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,
        runValidators: true,
        select: '-__v'
      }
    );

    res.json(updatedTissue);
  } catch (err) {
    console.error('Error updating tissue:', err);
    res.status(400).json({ 
      message: 'Error updating tissue', 
      error: err.message 
    });
  }
});

app.delete('/api/tissues/:id', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const tissue = await Tissue.findById(req.params.id);
    if (!tissue) {
      return res.status(404).json({ message: 'Tissue not found' });
    }

    await Tissue.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tissue deleted successfully' });
  } catch (err) {
    console.error('Error deleting tissue:', err);
    res.status(500).json({ 
      message: 'Error deleting tissue', 
      error: err.message 
    });
  }
});

app.get('/api/tissues/:id', async (req, res) => {
  try {
    const tissue = await Tissue.findById(req.params.id).select('-__v');
    if (!tissue) {
      return res.status(404).json({ message: 'Tissue not found' });
    }
    res.json(tissue);
  } catch (err) {
    console.error('Error fetching tissue:', err);
    res.status(500).json({ 
      message: 'Error fetching tissue', 
      error: err.message 
    });
  }
});

// ============================
// Image Prediction Endpoint
// ============================

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
      const resized = tf.image.resizeBilinear(decodedImage, [224, 224]);
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});