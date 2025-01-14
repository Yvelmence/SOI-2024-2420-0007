import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function QuizSelection() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  // Fetch quizzes metadata from the backend
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
    <div className="quiz-container p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-blue-500 mb-6">Select a Quiz</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left border-collapse mx-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-10 py-3 border-b text-lg text-center">Quiz Name</th>
              <th className="px-10 py-3 border-b text-lg text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b text-gray-700 text-center">{quiz.quizName}</td>
                <td className="px-6 py-4 border-b text-center">
                  <button
                    onClick={() => handleQuizSelection(quiz.collectionName)}
                    className="w-full max-w-xs px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                  >
                    Start Quiz
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  
}

export default QuizSelection;


