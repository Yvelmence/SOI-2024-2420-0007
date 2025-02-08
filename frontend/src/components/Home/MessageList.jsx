import React from 'react';

function MessageList({ messages }) {
  return (
    <div className="p-4 space-y-4 w-full">
      {messages.map((message, index) => (
        <div key={index} className="flex flex-col space-y-2">
          {message.image && (
            <img 
              src={message.image} 
              alt="Uploaded content" 
              className="max-w-xs rounded-lg mx-auto"
            />
          )}
          {message.text && (
            <p className="text-white bg-gray-700 rounded-lg p-3">
              {message.text}
            </p>
          )}
          {message.component && message.component}
        </div>
      ))}
    </div>
  );
}

export default MessageList;
