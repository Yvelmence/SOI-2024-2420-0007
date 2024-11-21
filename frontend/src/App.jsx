import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';


// Create placeholder components for new routes (Quiz, Sign Up, Sign in Pages)
const Quiz = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Page</h1>
      <p>Quiz content coming soon...</p>
    </div>
  );
};

const SignUp = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <p>Sign up form coming soon...</p>
    </div>
  );
};

const LogIn = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>
      <p>Login form coming soon...</p>
    </div>
  );
};





const Home = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);

  const handleSend = async () => {
    if (input.trim() || image) {
      const userMessage = { image, text: input };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInput("");

      if (image) {
        try {
          const predictionText = await predictImage(image);
          const botMessage = {
            image: null,
            text: `Prediction: ${predictionText}`,
          };
          setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
          console.error("Prediction error:", error);
          const errorMessage = {
            image: null,
            text: `Error: ${error.message}. Please try again.`,
          };
          setMessages(prevMessages => [...prevMessages, errorMessage]);
        }
      }
      setImage(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const predictImage = async (imageUrl) => {
    try {
      const formData = new FormData();
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      formData.append('image', blob);

      const res = await axios.post('http://localhost:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return `${res.data.label} (${res.data.confidence} confidence)`;
    } catch (error) {
      throw new Error("Failed to get prediction from the server");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
      <div className="flex flex-col items-start justify-start w-[80%] h-4/5 overflow-y-auto p-2.5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.image ? 'self-end bg-slate-200' : 'self-start bg-green-600'
            } text-black mt-1.5 mb-1.5 mx-0 p-2.5 rounded-lg max-w-[50%] break-words`}
          >
            {msg.image && (
              <img src={msg.image} alt="Uploaded" className="mb-2 max-w-80 rounded-lg" />
            )}
            {msg.text}
          </div>
        ))}
      </div>

      {image && (
        <div className="mb-2.5">
          <img
            src={image}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-green-500"
          />
        </div>
      )}

      <div className="flex flex-col items-center justify-center w-[100%] h-[20%] p-2.5">
        <div className="flex items-center w-[70%] justify-between">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-[30%] p-2.5 m-2.5"
          />
          <button
            onClick={handleSend}
            className="w-[20%] p-2.5 rounded-lg border-none outline-none bg-green-600 text-white cursor-pointer hover:opacity-75"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <nav className="bg-green-600 text-white p-4 h-16">
          <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="hover:underline">Tissue Finder</Link>
            <div className="flex space-x-4">
              <Link to="/quiz" className="hover:underline">Quiz</Link>
              <Link to="/login" className="hover:underline">Log In</Link>
              <Link to="/signup" className="hover:underline">Sign Up</Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
