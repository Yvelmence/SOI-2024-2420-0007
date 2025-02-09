import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const AddQuizForm = () => {
  const navigate = useNavigate();
  const { user } = useUser();
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

  // Check if user is admin and redirect if not
  useEffect(() => {
    if (!user || user.publicMetadata?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // If user is not admin, don't render the form
  if (!user || user.publicMetadata?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Your existing handlers
  const handleQuizNameChange = (e) => {
    setQuizName(e.target.value);
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerOptionChange = (questionIndex, optionIndex, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answerOptions[optionIndex].answerText = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answerOptions = updatedQuestions[questionIndex].answerOptions.map((option, i) => ({
      ...option,
      isCorrect: i === optionIndex
    }));
    setQuestions(updatedQuestions);
  };

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

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}` // Add user ID for backend validation
        },
        body: JSON.stringify({ 
          quizName, 
          questions,
          userId: user.id // Include user ID in the payload
        }),
      });
  
      const quizData = await quizResponse.json();
      if (!quizResponse.ok) throw new Error(quizData.message);
  
      alert(`Quiz "${quizName}" created successfully!`);
      navigate('/');
    } catch (err) {
      console.error('Error:', err);
      alert('There was an error creating the quiz.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 shadow-xl rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Create New Quiz</h2>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Back
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div>
              <h3 className="text-xl font-semibold text-gray-700">Questions:</h3>
              {questions.map((question, questionIndex) => (
                <div key={questionIndex} className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
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

                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                    disabled={questions.length === 1}
                  >
                    Remove Question
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addQuestion}
                className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none"
              >
                Add Question
              </button>
            </div>

            <div className="text-center">
              <button 
                type="submit" 
                className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none"
              >
                Create Quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddQuizForm;