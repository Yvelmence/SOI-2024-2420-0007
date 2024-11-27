const mongoose = require('mongoose');

// Define the Question schema
const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  answerOptions: [
    {
      answerText: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  image: { type: String, required: false }, // Optional field for image
});

// Create the Question model
const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
