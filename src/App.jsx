import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import './App.css';
import LogIn from './LogIn'
import Protected from './Protected'

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

// Create a Home component with the existing main content
const Home = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const [model, setModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Starting model load...");
        const modelURL = "https://teachablemachine.withgoogle.com/models/405H74K5D/";
        const loadedModel = await tf.loadLayersModel(modelURL + "model.json");
        console.log("Model loaded:", loadedModel);
        setModel(loadedModel);
        setIsModelLoading(false);
      } catch (error) {
        console.error("Error loading model:", error);
        setIsModelLoading(false);
      }
    };
    loadModel();
  }, []);

  const handleSend = async () => {
    if (input.trim() || image) {
      const userMessage = { image, text: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      if (image) {
        try {
          if (isModelLoading) {
            throw new Error("Model is still loading");
          }
          if (!model) {
            throw new Error("Model not loaded properly");
          }
          const predictionText = await predictImage(image);
          const botMessage = {
            image: null,
            text: `Prediction: ${predictionText}`,
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
          console.error("Detailed prediction error:", error);
          const errorMessage = {
            image: null,
            text: `Error: ${error.message}. Please try again.`,
          };
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
      }
      setImage(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file.name, file.type);
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const predictImage = async (imageUrl) => {
    if (!model) {
      throw new Error("Model not loaded");
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;

      img.onload = async () => {
        try {
          console.log("Image loaded, dimensions:", img.width, "x", img.height);

          const canvas = document.createElement('canvas');
          canvas.width = 224;
          canvas.height = 224;
          const ctx = canvas.getContext('2d');

          ctx.drawImage(img, 0, 0, 224, 224);
          console.log("Image drawn to canvas");

          let tensor = tf.browser.fromPixels(canvas)
            .toFloat()
            .div(255.0)
            .expandDims();

          console.log("Tensor shape:", tensor.shape);
          console.log("Running prediction...");
          const predictions = await model.predict(tensor).data();
          console.log("Raw predictions:", Array.from(predictions));

          const classes = ["Spinal Cord Tissue", "Small Intestine Tissue"];
          const predictedIndex = Array.from(predictions).indexOf(Math.max(...predictions));
          const confidence = (predictions[predictedIndex] * 100).toFixed(2);

          tensor.dispose();
          resolve(`${classes[predictedIndex]} (${confidence}% confidence)`);

        } catch (error) {
          console.error("Error in prediction pipeline:", error);
          reject(error);
        }
      };

      img.onerror = (error) => {
        console.error("Error loading image:", error);
        reject(new Error("Failed to load image"));
      };
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
      {isModelLoading && (
        <div className="absolute top-20 left-4 bg-yellow-100 text-yellow-800 p-2 rounded">
          Loading model...
        </div>
      )}
      <div className="flex flex-col items-start justify-start w-[80%] h-4/5 overflow-y-auto p-2.5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${msg.image ? 'self-end bg-slate-200' : 'self-start bg-green-600'
              } text-black mt-1.5 mb-1.5 mx-0 p-2.5 rounded-lg max-w-[50%] break-words`}
          >
            {msg.image && (
              <img src={msg.image} alt="Uploaded" className="mb-2 max-w-full rounded-lg" />
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
          {/* Select image */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-[30%] p-2.5 m-2.5"
          />
          {/* Send Button */}
          <button
            onClick={handleSend}
            className="w-[20%] p-2.5 rounded-lg border-none outline-none bg-green-600 text-white cursor-pointer hover:opacity-75"
            disabled={isModelLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// const App = () => {
//   return (
//     <Router>
//       <div>
//         <nav>
//           <Link to="/">Home</Link>
//           <Link to="/login">Log In</Link>
//           <Link to="/protected">Protected</Link>
//         </nav>
//         <Routes>
//           <Route path="/login" element={<LogIn />} />
//           <Route path="/protected" element={<Protected />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <nav className="bg-green-600 text-white p-4 h-16">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="text-xl font-bold hover:text-green-200">
              Tissue Classifier
            </Link>
            <div className="space-x-6">
              {/* Nav Elements */}
              <Link to="/quiz" className="hover:text-green-200">Quiz</Link>
              <Link to="/signup" className="hover:text-green-200">Sign Up</Link>
              <Link to="/login" className="hover:text-green-200">Log In</Link>
              <Link to="/protected" className="hover:text-green-200">Protected</Link>
            </div>
          </div>
        </nav>
        
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/protected" element={<Protected />} />
        </Routes>
      </div>
    </Router>
  );
};
// Main App component with navigation
// function App() {
//   return (

//     // Navbar
//     <Router>
//       <div className="min-h-screen">
//         <nav className="bg-green-600 text-white p-4 h-16">
//           <div className="container mx-auto flex items-center justify-between">
//             <Link to="/" className="text-xl font-bold hover:text-green-200">
//               Tissue Classifier
//             </Link>
//             <div className="space-x-6">
//               {/* Nav Elements */}
//               <Link to="/quiz" className="hover:text-green-200">Quiz</Link>
//               <Link to="/signup" className="hover:text-green-200">Sign Up</Link>
//               <Link to="/login" className="hover:text-green-200">Log In</Link>
//             </div>
//           </div>
//         </nav>
        
//         {/* Routes */}
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/quiz" element={<Quiz />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/login" element={<LogIn />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

export default App;
