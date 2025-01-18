import React from 'react'

function QuizQuestion({ currentQuestion, totalQuestions, questionData, selectedOption, onAnswerSelect }) {
  return (
    <div className="question-section px-4 py-6 sm:px-8 md:px-12">
      <div className="question-num text-lg mb-4">
        Question {currentQuestion + 1} of {totalQuestions}
      </div>
      <div className="question-text text-2xl font-bold text-gray-800 mb-5">
        {questionData.question}
      </div>
      {questionData.image && (
        <img
          src={questionData.image}
          alt="Question Illustration"
          className="quiz-image w-full sm:w-72 h-48 object-contain border border-gray-300 p-2 bg-gray-200 mb-5"
        />
      )}
      <div className="answer-section flex flex-col gap-2">
        {questionData.answerOptions.map((answer, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
            className={`w-full sm:w-3/4 bg-blue-500 text-white p-3 rounded-md text-left transition-all duration-300 
              ${selectedOption === index ? 'bg-green-500' : 'hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'}`}
          >
            {answer.answerText}
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuizQuestion
