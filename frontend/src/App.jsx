import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

import './index.css';
import Navbar from './components/Navbar/Navbar';
import Analyser from './pages/Analyser';
import Quiz from './pages/Quiz';
import Home from './pages/Home';
import QuizSelection from './components/Quiz/QuizSelection';
import UnifiedQuizPage from './components/Quiz/QuizManager';
import TissueDetails from './pages/TissueDetails';
import TissueList from './pages/TissueList';
import Information from './pages/Information';
import Forum from './pages/Forum';
import ForumPost from './pages/ForumPost';

function App() {
  return (
    <Router>
      <div className="h-screen overflow-hidden flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/analyser" element={<Analyser />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<ForumPost />} />
            <Route path="/tissue/:name" element={<TissueDetails />} />
            <Route path="/tissuelist" element={<TissueList />} />
            <Route path="/information/:name" element={<Information />} />

            {/* Protected Routes */}
            <Route
              path="/quizzes"
              element={
                <>
                  <SignedIn>
                    <UnifiedQuizPage />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route path="/quiz/:collectionName" element={<Quiz />} />

            {/* Auth Routes - Updated with catch-all patterns */}
            <Route
              path="/login/*"
              element={
                <div
                  className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: "url('/images/jtrp260418.webp')",
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-25"></div>
                  <div className="relative z-10 max-w-xs w-full">
                    <SignIn routing="path" path="/login" />
                  </div>
                </div>
              }
            />
            <Route
              path="/signup/*"
              element={
                <div
                  className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: "url('/images/jtrp260418.webp')",
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-25"></div>
                  <div className="relative z-10 max-w-xs w-full">
                    <SignUp routing="path" path="/signup" />
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;