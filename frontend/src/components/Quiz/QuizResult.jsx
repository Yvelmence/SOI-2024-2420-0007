import React from 'react'

function QuizResult({ score, totalQuestions, answerDetails }) {
    return (
        <div className="score-section text-center">
            <p className="text-2xl font-bold text-blue-500">
                You scored {score} out of {totalQuestions}
            </p>
            <p className="text-xl">Correct Answers: {score}</p>
            <p className="text-xl">Incorrect Answers: {totalQuestions - score}</p>

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
    )
}

export default QuizResult