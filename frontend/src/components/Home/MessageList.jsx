import React from 'react'

function MessageList({ messages }) {
    return (
        <div className="flex flex-col items-start justify-start w-[80%] h-4/5 overflow-y-auto p-2.5">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`${msg.image ? 'self-end bg-slate-200' : 'self-start bg-green-600'
                        } text-black mt-1.5 mb-1.5 mx-0 p-2.5 rounded-lg max-w-[50%] break-words`}
                >
                    {msg.image && (
                        <img src={msg.image} alt="Uploaded" className="mb-2 max-w-80 rounded-lg" />
                    )}
                    {msg.text}
                </div>
            ))}
        </div>
    )
}

export default MessageList