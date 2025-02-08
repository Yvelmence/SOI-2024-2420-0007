import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Quiz() {
  const { collectionName } = useParams();  // Get the collectionName from the URL params
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answerDetails, setAnswerDetails] = useState([]);

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/${collectionName}`);
        if (!response.ok) throw new Error('Failed to fetch questions');
  
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    if (collectionName) {
      fetchQuestions();
    }
  }, [collectionName]);

  // Handle answer option selection and scoring
  const handleAnswerOptionClick = (index) => {
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      const currentQ = questions[currentQuestion];
      const isCorrect = currentQ.answerOptions[selectedOption].isCorrect;

      // Update score
      if (isCorrect) setScore(score + 1);

      // Save answers
      setAnswerDetails((prevDetails) => [
        ...prevDetails,
        {
          questionText: currentQ.question,
          selectedAnswer: currentQ.answerOptions[selectedOption].answerText,
          correctAnswer: currentQ.answerOptions.find((opt) => opt.isCorrect).answerText,
          isCorrect: isCorrect,
        },
      ]);

      // Move to next question or submit
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
      setSelectedOption(null); // Reset selected option when moving back
    }
    setAnswerDetails((prevDetails) => prevDetails.slice(0, currentQuestion - 1));
  };

  // Loading and error handling
  if (loading) return <div className="text-center p-4">Loading questions...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-900"> {/* Keep the original page background */}
      {showScore ? (
        <div className="score-section text-center">
          <p className="text-2xl font-bold text-white">You scored {score} out of {questions.length}</p>
          <p className="text-xl text-white">Correct Answers: {score}</p>
          <p className="text-xl text-white">Incorrect Answers: {questions.length - score}</p>

          {/* Answer Summary Table */}
          <div className="summary-section mt-5">
            <h3 className="text-xl font-semibold text-white">Question Summary</h3>
            <table className="w-full mt-4 table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 border">Question</th>
                  <th className="px-3 py-2 border">Your Answer</th>
                  <th className="px-3 py-2 border">Correct Answer</th>
                  <th className="px-3 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {answerDetails.map((detail, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 border text-white">{detail.questionText}</td>
                    <td className="px-3 py-2 border text-white">{detail.selectedAnswer}</td>
                    <td className="px-3 py-2 border text-white">{detail.correctAnswer}</td>
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
        <div className="question-section text-center p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto bg-gray-800"> {/* Added a contrasting background */}
          <div className="question-num text-lg mb-4 text-white"> {/* Changed to white color for question number */}
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <div className="question-text text-2xl font-semibold text-gray-100 mb-5"> {/* Light text for contrast */}
            {questions[currentQuestion].question}
          </div>
          {questions[currentQuestion].image && (
            <img
              src={questions[currentQuestion].image}
              alt="Question Illustration"
              className="quiz-image w-72 h-48 object-contain border border-gray-700 p-2 bg-gray-800 mb-5"
            />
          )}
          <div className="answer-section flex flex-col items-center gap-2">
            {questions[currentQuestion].answerOptions.map((answerOption, index) => (
              <button
                key={index}
                onClick={() => handleAnswerOptionClick(index)}
                className={`w-3/4 bg-teal-500 text-white p-3 rounded-md text-left transition-all duration-300 
                  ${selectedOption === index ? 'bg-teal-700' : 'hover:bg-teal-600 focus:ring-2 focus:ring-teal-500'}`} // Updated to teal color for answers
              >
                {answerOption.answerText}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons flex justify-between mt-5 w-full max-w-md mx-auto">
            <button
              onClick={handlePrevious}
              className="previous-button px-4 py-2 bg-blue-500 text-gray-900 rounded-md disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
              disabled={currentQuestion === 0}
            >
              Previous
            </button>

            <button
              onClick={handleSubmit}
              className="submit-button px-4 py-2 bg-blue-500 text-gray-900 rounded-md disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
              disabled={selectedOption === null}
            >
              {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
