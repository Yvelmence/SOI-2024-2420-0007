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
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Title */}
      <div className="p-6 text-center bg-gray-800 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-white">Select a Quiz</h1>
      </div>

      {/* Quiz List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left border-collapse mx-auto bg-gray-800 text-white">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-3 border-b text-lg text-white text-center">Quiz Name</th>
                <th className="px-4 py-3 border-b text-lg text-white text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 border-b text-center text-white">{quiz.quizName}</td>
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
    </div>
  );
}

export default QuizSelection;
