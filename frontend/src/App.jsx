import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

import './index.css'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Login from './pages/Login'
import Signup from './pages/Signup'


function App() {
  return (
    <Router>
      <div className="min-h-screen">
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
            element={<SignIn routing="path" path="/login" />} 
          />
          <Route 
            path="/signup" 
            element={<SignUp routing="path" path="/signup" />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App