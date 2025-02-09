import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function QuizSelection() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/quizzes')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched quizzes:', data);
        setQuizzes(data);
      })
      .catch((err) => console.error('Error fetching quizzes:', err));
  }, []);

  const handleQuizSelection = (collectionName) => {
    navigate(`/quiz/${collectionName}`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Header Section */}
      <div className="px-6 py-8 sm:py-12">
        <h1 className="text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Select Your Quiz
        </h1>
        <p className="text-gray-400 text-center max-w-2xl mx-auto">
          Choose from our collection of carefully crafted quizzes to test your knowledge
        </p>
      </div>

      {/* Quiz Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 group"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {quiz.quizName}
                </h3>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleQuizSelection(quiz.collectionName)}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl font-semibold text-white hover:from-pink-600 hover:to-violet-600 transition-all duration-200 shadow-lg hover:shadow-pink-500/25 flex items-center justify-center gap-2 group"
                  >
                    <span>Start Quiz</span>
                    <svg 
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 7l5 5m0 0l-5 5m5-5H6" 
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizSelection;