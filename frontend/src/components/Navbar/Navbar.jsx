import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { FaBars, FaTimes } from 'react-icons/fa';

const NavLinks = () => (
  <>
    <SignedIn>
      <Link to="/chatbot" className="hover:text-purple-200 transition-colors">ChatBot</Link>
      <Link to="/forum" className="hover:text-pink-200 transition-colors">Forum</Link>
      <Link to="/quizzes" className="hover:text-pink-200 transition-colors">Quiz</Link>
      <Link to="/tissuelist" className="hover:text-pink-200 transition-colors">Lists of Tissues</Link>

      <UserButton afterSignOutUrl="/" />
    </SignedIn>
    <SignedOut>
      <Link to="/login" className="hover:text-pink-200 transition-colors">Log In</Link>
      <Link to="/signup" className="hover:text-pink-200 transition-colors">Sign Up</Link>
      <Link to="/forum" className="hover:text-pink-200 transition-colors">Forum</Link>
    </SignedOut>
  </>
);

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-l from-pink-500 via-pink-450 to-pink-500 text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-pink-200 transition-colors">Tissue Finder</Link>

        {/* Hamburger menu for mobile */}
        <div className="block lg:hidden">
          <button onClick={toggleMenu} className="text-white text-2xl">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-6 items-center text-lg font-medium">
          <NavLinks />
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-16 left-0 w-full bg-pink-500 z-50 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col items-center space-y-4 py-4 text-lg font-medium">
            <NavLinks />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
