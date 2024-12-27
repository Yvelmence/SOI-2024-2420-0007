import React, { useState, useEffect } from 'react'
import QuizQuestion from '../components/Quiz/QuizQuestion'
import QuizResult from '../components/Quiz/QuizResult'

function Quiz() {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [answerDetails, setAnswerDetails] = useState([])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/questions')
        if (!response.ok) throw new Error('Failed to fetch questions')
        const data = await response.json()
        setQuestions(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [])

  const handleAnswerOptionClick = (index) => {
    setSelectedOption(index)
  }

  const handleSubmit = () => {
    if (selectedOption !== null) {
      const currentQ = questions[currentQuestion]
      const isCorrect = currentQ.answerOptions[selectedOption].isCorrect

      if (isCorrect) setScore(score + 1)

      setAnswerDetails((prevDetails) => [
        ...prevDetails,
        {
          questionText: currentQ.question,
          selectedAnswer: currentQ.answerOptions[selectedOption].answerText,
          correctAnswer: currentQ.answerOptions.find((opt) => opt.isCorrect).answerText,
          isCorrect: isCorrect,
        },
      ])

      const nextQuestion = currentQuestion + 1
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion)
      } else {
        setShowScore(true)
      }
      setSelectedOption(null)
    } else {
      alert('Please select an answer before submitting.')
    }
  }

  if (loading) return <div className="text-center p-4">Loading questions...</div>
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>

  return (
    <div className="quiz-container p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md">
      {showScore ? (
        <QuizResult
          score={score}
          totalQuestions={questions.length}
          answerDetails={answerDetails}
        />
      ) : (
        <QuizQuestion
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          questionData={questions[currentQuestion]}
          selectedOption={selectedOption}
          onAnswerSelect={handleAnswerOptionClick}
        />
      )}
    </div>
  )
}

export default Quiz