import React from 'react';

function QuizResult({ score, totalQuestions, answerDetails }) {
    return (
        <div className="score-section px-4 py-6 sm:px-8 md:px-12">
            <p className="text-2xl font-bold text-blue-500">
                You scored {score} out of {totalQuestions}
            </p>
            <p className="text-xl">Correct Answers: {score}</p>
            <p className="text-xl">Incorrect Answers: {totalQuestions - score}</p>

            <div className="summary-section mt-5">
                <h3 className="text-xl font-semibold">Question Summary</h3>
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full table-auto border-collapse text-sm sm:text-base">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-3 py-2 border text-left">Question</th>
                                <th className="px-3 py-2 border text-left">Your Answer</th>
                                <th className="px-3 py-2 border text-left">Correct Answer</th>
                                <th className="px-3 py-2 border text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {answerDetails.map((detail, index) => (
                                <tr key={index}>
                                    <td className="px-3 py-2 border break-words">{detail.questionText}</td>
                                    <td className="px-3 py-2 border break-words">{detail.selectedAnswer}</td>
                                    <td className="px-3 py-2 border break-words">{detail.correctAnswer}</td>
                                    <td className={`px-3 py-2 border ${detail.isCorrect ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}`}>
                                        {detail.isCorrect ? 'Correct' : 'Incorrect'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default QuizResult;
