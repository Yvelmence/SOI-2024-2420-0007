import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddQuizForm = () => {
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState([
    { 
      question: '', 
      answerOptions: [
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false }
      ]
    }
  ]);
  
  const navigate = useNavigate();

  // Handle input change for quiz name
  const handleQuizNameChange = (e) => {
    setQuizName(e.target.value);
  };

  // Handle input change for question text
  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = e.target.value;
    setQuestions(updatedQuestions);
  };

  // Handle input change for answer text
  const handleAnswerOptionChange = (questionIndex, optionIndex, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answerOptions[optionIndex].answerText = e.target.value;
    setQuestions(updatedQuestions);
  };

  // Handle checkbox change for correct answer selection
  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    
    // Ensure only one correct answer per question
    updatedQuestions[questionIndex].answerOptions = updatedQuestions[questionIndex].answerOptions.map((option, i) => ({
      ...option,
      isCorrect: i === optionIndex // Set the selected option as correct, others as false
    }));
    
    setQuestions(updatedQuestions);
  };

  // Add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { 
        question: '', 
        answerOptions: [
          { answerText: '', isCorrect: false },
          { answerText: '', isCorrect: false },
          { answerText: '', isCorrect: false },
          { answerText: '', isCorrect: false }
        ]
      }
    ]);
  };

  // Remove a question
  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!quizName.trim()) {
      alert("Quiz name cannot be empty!");
      return;
    }
  
    if (questions.some(q => !q.question.trim() || q.answerOptions.some(opt => !opt.answerText.trim()))) {
      alert("Please fill in all questions and answer options.");
      return;
    }
  
    if (questions.some(q => !q.answerOptions.some(opt => opt.isCorrect))) {
      alert("Each question must have at least one correct answer.");
      return;
    }
  
    try {
      const quizResponse = await fetch('http://localhost:3000/api/create-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizName, questions }),
      });
  
      const quizData = await quizResponse.json();
      if (!quizResponse.ok) throw new Error(quizData.message);
  
      alert(`Quiz "${quizName}" created successfully!`);
      navigate('/');  // Redirect to the homepage or another page
    } catch (err) {
      console.error('Error:', err);
      alert('There was an error creating the quiz.');
    }
  };
  

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create New Quiz</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quiz Name Input */}
        <div>
          <label htmlFor="quizName" className="block text-lg font-medium text-gray-700">Quiz Name:</label>
          <input
            type="text"
            id="quizName"
            value={quizName}
            onChange={handleQuizNameChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Questions List */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700">Questions:</h3>
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
              {/* Question Input */}
              <div>
                <label htmlFor={`question-${questionIndex}`} className="block text-gray-700 font-medium">
                  Question {questionIndex + 1}:
                </label>
                <input
                  type="text"
                  id={`question-${questionIndex}`}
                  value={question.question}
                  onChange={(e) => handleQuestionChange(questionIndex, e)}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Answer Options */}
              <div className="mt-4">
                <label className="block text-gray-700 font-medium">Answer Options:</label>
                {question.answerOptions.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center mt-2">
                    <input
                      type="text"
                      value={option.answerText}
                      onChange={(e) => handleAnswerOptionChange(questionIndex, optionIndex, e)}
                      required
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={() => handleCorrectAnswerChange(questionIndex, optionIndex)}
                      className="ml-3 w-5 h-5 accent-blue-500"
                    />
                    <label className="ml-2 text-gray-700">Correct</label>
                  </div>
                  
                ))}
              </div>
              

              {/* Remove Question Button */}
              <button
                type="button"
                onClick={() => removeQuestion(questionIndex)}
                className="mt-4 text-Black px-4 py-2 bg-pink-500 font-semibold text-white rounded-md hover:bg-pink-700 focus:outline-none"
              >
                Remove Question
              </button>
            </div>
          ))}

          {/* Add Question Button */}
          <button
            type="button"
            onClick={addQuestion}
            className="mt-4 text-white px-4 py-2 bg-pink-500 font-semibold text-white rounded-md hover:bg-pink-700 focus:outline-none"
          >
            Add Question
          </button>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="max-w-xs px-4 py-2 bg-pink-500 font-semibold text-white rounded-md hover:bg-pink-700 focus:outline-none">
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuizForm;
