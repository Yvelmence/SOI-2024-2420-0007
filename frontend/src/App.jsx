import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

import './index.css'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import Quiz from './pages/Quiz'


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
            path="/quiz"
            element={
              <>
                <SignedIn>
                  <Quiz />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          {/* Auth routes */}
          <Route
            path="/login"
            element={
              <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <SignIn routing="path" path="/login" />
              </div>}
          />
          <Route
            path="/signup"
            element={
              <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <SignUp routing="path" path="/signup" />
              </div>}

          />
        </Routes>
      </div>
    </Router>
  )
}

export default App