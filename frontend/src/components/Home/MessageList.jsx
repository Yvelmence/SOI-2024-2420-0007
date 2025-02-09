import React from 'react';

function MessageList({ messages }) {
  return (
    <div className="p-4 space-y-6 w-full">
      {messages.map((message, index) => (
        <div key={index} className="flex flex-col space-y-3 animate-fadeIn">
          {message.image && (
            <img 
              src={message.image} 
              alt="Uploaded content" 
              className="max-w-sm rounded-xl shadow-lg mx-auto border border-gray-700/50"
            />
          )}
          {message.text && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 text-white shadow-lg max-w-2xl mx-auto w-full">
              {message.text}
            </div>
          )}
          {message.component && (
            <div className="w-full max-w-2xl mx-auto">
              {message.component}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MessageList;
