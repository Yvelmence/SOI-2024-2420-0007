import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

import './index.css'
import Navbar from './components/Navbar/Navbar'
import ChatBot from './pages/ChatBot'
import Quiz from './pages/Quiz'
import Home from './pages/Home'
import QuizSelection from './components/Quiz/QuizSelection'


function App() {
  return (
    <Router>
      <div className="h-screen overflow-hidden">
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />

          {/* Protected routes */}

          <Route
            path="/chatbot"
            element={
              <ChatBot />
            } />

          <Route
            path="/quizzes"
            element={
              <>
                <SignedIn>
                  <QuizSelection />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/quiz/:collectionName"
            element={
              <Quiz />
            }
          />

          {/* Auth routes */}
          <Route
            path="/login"
            element={
              <div
                className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/jtrp260418.webp')",
                }}
              >
                <div className="absolute inset-0 bg-black opacity-25"></div>
                <div className="relative z-10">
                  <SignIn routing="path" path="/login" />
                </div>
              </div>
            }
          />
          <Route
            path="/signup"
            element={
              <div
                className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/jtrp260418.webp')",
                }}
              >
                <div className="absolute inset-0 bg-black opacity-25"></div>
                <div className="relative z-10">
                  <SignUp routing="path" path="/signup" />
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App