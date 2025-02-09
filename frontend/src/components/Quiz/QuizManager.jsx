import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import QuizSelection from './QuizSelection';
import AddQuizForm from './AddQuiz';

function UnifiedQuizPage() {
  const [currentView, setCurrentView] = useState('selection');
  const { user } = useUser();
  
  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin';

  const handleGoToAddQuiz = () => setCurrentView('addQuiz');
  const handleGoToQuizSelection = () => setCurrentView('selection');

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-900">
      <div className="p-6 max-w-4xl w-full shadow-lg rounded-lg">
        {currentView === 'selection' && (
          <>
            <QuizSelection />
            {/* Only show Add Quiz button for admin users */}
            {isAdmin && (
              <div className="text-center">
                <br />
                <button
                  onClick={handleGoToAddQuiz}
                  className="max-w-xs px-4 py-2 bg-purple-500 font-semibold text-white rounded-md hover:bg-purple-700 focus:outline-none"
                >
                  Go to Add Quiz
                </button>
              </div>
            )}
          </>
        )}
        {currentView === 'addQuiz' && (
          <>
            <AddQuizForm />
            <div className="text-center">
              <br />
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