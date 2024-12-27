import React from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

function Navbar() {
  return (
    <nav className="bg-green-600 text-white p-4 h-16">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="hover:underline">Tissue Finder</Link>
        <div className="flex space-x-4 items-center">
          <SignedIn>
            <Link to="/quiz" className="hover:underline">Quiz</Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link to="/login" className="hover:underline">Log In</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  )
}

export default Navbar