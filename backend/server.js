const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const Question = require('./quiz_questions_db');
const User = require('./user_model');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;







// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware setup
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  
  if ([...validImageTypes, ...validVideoTypes].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Connect to MongoDB
connectDB();

// Schema Definitions
const forumPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  fileUrl: { type: String },
  fileType: { type: String }, // 'image' or 'video'
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const forumCommentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  text: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const ForumPost = mongoose.model("ForumPost", forumPostSchema);
const ForumComment = mongoose.model("ForumComment", forumCommentSchema);

// ============================
// Forum Post Endpoints
// ============================

// GET: Fetch all forum posts
app.get('/api/forumposts', async (req, res) => {
  try {
    const posts = await ForumPost.find({}).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching forum posts:', err);
    res.status(500).json({ message: 'Error fetching forum posts', error: err.message });
  }
});

// POST: Create a new forum post
app.post('/api/forum', upload.single('file'), async (req, res) => {
  try {
    const { title, content, userId, userName } = req.body;
    
    const postData = {
      title,
      content,
      userId,
      userName,
      createdAt: new Date()
    };

    if (req.file) {
      postData.fileUrl = `/uploads/${req.file.filename}`;
      postData.fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
    }

    const newPost = new ForumPost(postData);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error('Error creating forum post:', err);
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
      });
    }
    res.status(400).json({ message: 'Error creating forum post', error: err.message });
  }
});

// GET: Retrieve a single forum post
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

// PUT: Update a forum post
app.put('/api/forum/:id', upload.single('file'), async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updateData = {
      title,
      content,
      updatedAt: new Date()
    };

    if (req.file) {
      // Delete old file if it exists
      if (post.fileUrl) {
        const oldFilePath = path.join(__dirname, post.fileUrl);
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error('Error deleting old file:', err);
        });
      }

      updateData.fileUrl = `/uploads/${req.file.filename}`;
      updateData.fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
    }

    const updatedPost = await ForumPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    console.error('Error updating forum post:', err);
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
      });
    }
    res.status(400).json({ message: 'Error updating forum post', error: err.message });
  }
});

// DELETE: Delete a forum post
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

    // Delete associated file if it exists
    if (post.fileUrl) {
      const filePath = path.join(__dirname, post.fileUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    await ForumPost.findByIdAndDelete(req.params.id);
    await ForumComment.deleteMany({ postId: req.params.id });
    
    res.json({ message: "Forum post and associated comments deleted successfully" });
  } catch (err) {
    console.error('Error deleting forum post:', err);
    res.status(500).json({ message: 'Error deleting forum post', error: err.message });
  }
});

// Admin route to delete any post
app.delete('/api/forum/admin/:id', async (req, res) => {
  const { adminId } = req.body;
  try {
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete associated file if it exists
    if (post.fileUrl) {
      const filePath = path.join(__dirname, post.fileUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    await ForumPost.findByIdAndDelete(req.params.id);
    await ForumComment.deleteMany({ postId: req.params.id });
    
    res.json({ message: "Forum post and associated comments deleted successfully" });
  } catch (err) {
    console.error('Error deleting forum post:', err);
    res.status(500).json({ message: 'Error deleting forum post', error: err.message });
  }
});

// ============================
// Comment Endpoints
// ============================

// GET: Retrieve comments for a post
app.get('/api/forum/:id/comments', async (req, res) => {
  try {
    const comments = await ForumComment.find({ postId: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
});

// POST: Add a comment
app.post('/api/forum/:id/comments', async (req, res) => {
  const { text, userId, userName } = req.body;
  const newComment = new ForumComment({ 
    postId: req.params.id, 
    text, 
    userId,
    userName,
    createdAt: new Date()
  });
  
  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(400).json({ message: 'Error adding comment', error: err.message });
  }
});

// PUT: Edit a comment
app.put('/api/forum/comments/:commentId', async (req, res) => {
  const { text, userId } = req.body;
  try {
    const comment = await ForumComment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    comment.text = text;
    comment.updatedAt = new Date();
    await comment.save();
    
    res.json(comment);
  } catch (err) {
    console.error('Error updating comment:', err);
    res.status(500).json({ message: 'Error updating comment', error: err.message });
  }
});

// DELETE: Delete a comment
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

// Admin route to delete any comment
app.delete('/api/forum/admin/comments/:commentId', async (req, res) => {
  const { adminId } = req.body;
  try {
    const comment = await ForumComment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await ForumComment.findByIdAndDelete(req.params.commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 50MB.' });
    }
    return res.status(400).json({ message: 'Error uploading file.', error: err.message });
  }
  
  if (req.file) {
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
    });
  }
  
  console.error(err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});






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
