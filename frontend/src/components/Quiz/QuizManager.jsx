import React, { useState } from 'react';
import QuizSelection from './QuizSelection'; // Your existing QuizSelection component
import AddQuizForm from './AddQuiz'; // Your existing AddQuizForm component

function UnifiedQuizPage() {
  // State to track which view is active
  const [currentView, setCurrentView] = useState('selection'); // Default to Quiz Selection

  // Handlers to toggle between views
  const handleGoToAddQuiz = () => setCurrentView('addQuiz');
  const handleGoToQuizSelection = () => setCurrentView('selection');

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-900">
      <div className="p-6 max-w-4xl w-full shadow-lg rounded-lg">
        {currentView === 'selection' && (
          <>
            <QuizSelection />
            <div className="text-center">
                <br></br>
              <button
                onClick={handleGoToAddQuiz}
                className="max-w-xs px-4 py-2 bg-purple-500 font-semibold text-white rounded-md hover:bg-purple-700 focus:outline-none"
              >
                Go to Add Quiz
              </button>
            </div>
          </>
        )}
        {currentView === 'addQuiz' && (
          <>
            <AddQuizForm />
            <div className="text-center">
            <br></br>
              <button
                onClick={handleGoToQuizSelection}
                className="max-w-xs px-4 py-2 bg-purple-500 font-semibold text-white rounded-md hover:bg-purple-700 focus:outline-none"
              >
                Back to Quiz Selection
              </button>
            </div>
          </>
        )}
      </div> 
    </div>
  );
}

export default UnifiedQuizPage;
