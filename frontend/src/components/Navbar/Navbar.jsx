import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { FaBars, FaTimes } from 'react-icons/fa';

const NavLinks = () => (
  <>
    <SignedIn>
      <Link to="/chatbot" className="hover:underline">ChatBot</Link>
      <Link to="/forum" className="hover:underline">Forum</Link>
      <Link to="/quizzes" className="hover:underline">Quiz</Link>
      <Link to="/tissuelist" className="hover:underline">Lists of Tissues</Link>

      <UserButton afterSignOutUrl="/" />
    </SignedIn>
    <SignedOut>
      <Link to="/login" className="hover:underline">Log In</Link>
      <Link to="/signup" className="hover:underline">Sign Up</Link>
      <Link to="/forum" className="hover:underline">Forum</Link>
    </SignedOut>
  </>
);

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-pink-500 text-white p-4 h-16">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-lg font-bold hover:underline">Tissue Finder</Link>

        {/* Hamburger menu for mobile */}
        <div className="block lg:hidden">
          <button onClick={toggleMenu} className="text-white text-2xl">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-4 items-center">
          <NavLinks />
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-16 left-0 w-full bg-pink-500 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col items-center space-y-4 py-4">
            <NavLinks />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
