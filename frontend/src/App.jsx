import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

// Quiz Component
const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answerDetails, setAnswerDetails] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/questions');
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerOptionClick = (index) => {
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      const currentQ = questions[currentQuestion];
      const isCorrect = currentQ.answerOptions[selectedOption].isCorrect;

      if (isCorrect) setScore(score + 1);

      setAnswerDetails((prevDetails) => [
        ...prevDetails,
        {
          questionText: currentQ.question,
          selectedAnswer: currentQ.answerOptions[selectedOption].answerText,
          correctAnswer: currentQ.answerOptions.find((opt) => opt.isCorrect).answerText,
          isCorrect: isCorrect,
        },
      ]);

      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
      }
      setSelectedOption(null);
    } else {
      alert('Please select an answer before submitting.');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
    }
  };

  if (loading) return <div className="text-center p-4">Loading questions...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="quiz-container p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md">
      {showScore ? (
        <div className="score-section text-center">
          <p className="text-2xl font-bold text-blue-500">You scored {score} out of {questions.length}</p>
          <p className="text-xl">Correct Answers: {score}</p>
          <p className="text-xl">Incorrect Answers: {questions.length - score}</p>

          <div className="summary-section mt-5">
            <h3 className="text-xl font-semibold">Question Summary</h3>
            <table className="w-full mt-4 table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-3 py-2 border">Question</th>
                  <th className="px-3 py-2 border">Your Answer</th>
                  <th className="px-3 py-2 border">Correct Answer</th>
                  <th className="px-3 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {answerDetails.map((detail, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 border">{detail.questionText}</td>
                    <td className="px-3 py-2 border">{detail.selectedAnswer}</td>
                    <td className="px-3 py-2 border">{detail.correctAnswer}</td>
                    <td className={`px-3 py-2 border ${detail.isCorrect ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}`}>
                      {detail.isCorrect ? 'Correct' : 'Incorrect'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="question-section">
          <div className="question-num text-lg mb-4">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <div className="question-text text-2xl font-bold text-gray-800 mb-5">
            {questions[currentQuestion].question}
          </div>
          {questions[currentQuestion].image && (
            <img
              src={questions[currentQuestion].image}
              alt="Question Illustration"
              className="quiz-image w-72 h-48 object-contain border border-gray-300 p-2 bg-gray-200 mb-5"
            />
          )}
          <div className="answer-section flex flex-col gap-2">
            {questions[currentQuestion].answerOptions.map((answerOption, index) => (
              <button
                key={index}
                onClick={() => handleAnswerOptionClick(index)}
                className={`w-3/4 bg-blue-500 text-white p-3 rounded-md text-left transition-all duration-300 
                  ${selectedOption === index ? 'bg-green-500' : 'hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'}
                `}
              >
                {answerOption.answerText}
              </button>
            ))}
          </div>

          <div className="navigation-buttons flex justify-between mt-5">
            <button
              onClick={handlePrevious}
              className="previous-button px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            <button
              onClick={handleSubmit}
              className="submit-button px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
              disabled={selectedOption === null}
            >
              {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Placeholder Components
const SignUp = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
    <p>Sign up form coming soon...</p>
  </div>
);

const LogIn = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Log In</h1>
    <p>Login form coming soon...</p>
  </div>
);

// Home Component
const Home = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);

  const handleSend = async () => {
    if (input.trim() || image) {
      const userMessage = { image, text: input };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInput("");

      if (image) {
        try {
          const predictionText = await predictImage(image);
          const botMessage = {
            image: null,
            text: `Prediction: ${predictionText}`,
          };
          setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
          console.error("Prediction error:", error);
          const errorMessage = {
            image: null,
            text: `Error: ${error.message}. Please try again.`,
          };
          setMessages(prevMessages => [...prevMessages, errorMessage]);
        }
      }
      setImage(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const predictImage = async (imageUrl) => {
    try {
      const formData = new FormData();
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      formData.append('image', blob);

      const res = await axios.post('http://localhost:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return `${res.data.label} (${res.data.confidence} confidence)`;
    } catch (error) {
      throw new Error("Failed to get prediction from the server");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
      <div className="flex flex-col items-start justify-start w-[80%] h-4/5 overflow-y-auto p-2.5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.image ? 'self-end bg-slate-200' : 'self-start bg-green-600'
            } text-black mt-1.5 mb-1.5 mx-0 p-2.5 rounded-lg max-w-[50%] break-words`}
          >
            {msg.image && (
              <img src={msg.image} alt="Uploaded" className="mb-2 max-w-80 rounded-lg" />
            )}
            {msg.text}
          </div>
        ))}
      </div>

      {image && (
        <div className="mb-2.5">
          <img
            src={image}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-green-500"
          />
        </div>
      )}

      <div className="flex flex-col items-center justify-center w-[100%] h-[20%] p-2.5">
        <div className="flex items-center w-[70%] justify-between">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-[30%] p-2.5 m-2.5"
          />
          <button
            onClick={handleSend}
            className="w-[20%] p-2.5 rounded-lg border-none outline-none bg-green-600 text-white cursor-pointer hover:opacity-75"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <nav className="bg-green-600 text-white p-4 h-16">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="hover:underline">Tissue Finder</Link>
            <div className="flex space-x-4">
              <Link to="/quiz" className="hover:underline">Quiz</Link>
              <Link to="/login" className="hover:underline">Log In</Link>
              <Link to="/signup" className="hover:underline">Sign Up</Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;