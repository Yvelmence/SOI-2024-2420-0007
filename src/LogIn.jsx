import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setFeedback('Login successful!');
      setTimeout(() => {
        navigate('/');
      }, 1500); // Redirect after 1.5 seconds
    } catch (error) {
      setFeedback('Invalid username or password.');
    }
    console.log('Logging in with', username, password);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">
          Log In
        </button>
      </form>
      {feedback && (
        <div className={`mt-4 p-2 rounded ${feedback === 'Login successful!' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
};

export default LogIn;