import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(!!token);
    setIsAdmin(user?.isAdmin === true);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-pink-500">🎵 Wavy Beats</Link>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden text-2xl focus:outline-none">
          ☰
        </button>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-6 text-lg">
          <li><Link to="/" className="hover:text-pink-400">Home</Link></li>
          <li><Link to="/beats" className="hover:text-pink-400">Browse</Link></li>
          <li><Link to="/upload" className="hover:text-pink-400">Upload</Link></li>
          <li><Link to="/cart" className="hover:text-pink-400">Cart</Link></li>
          {isAdmin && <li><Link to="/admin" className="hover:text-pink-400">Admin</Link></li>}
          <li><Link to="/profile" className="hover:text-pink-400">Profile</Link></li>
          <li><Link to="/contact" className="hover:text-pink-400">Contact</Link></li>
          {!isLoggedIn && (
            <>
              <li><Link to="/login" className="hover:text-pink-400">Login</Link></li>
              <li><Link to="/register" className="hover:text-pink-400">Sign Up</Link></li>
            </>
          )}
          <li><Link to="/about" className="hover:text-pink-500">About</Link></li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden bg-black px-4 pb-4 flex flex-col gap-3 text-lg">
          <Link to="/" onClick={toggleMenu}>Home</Link>
          <Link to="/beats" onClick={toggleMenu}>Browse</Link>
          <Link to="/upload" onClick={toggleMenu}>Upload</Link>
          <Link to="/cart" onClick={toggleMenu}>Cart</Link>
          {isAdmin && <Link to="/admin" onClick={toggleMenu}>Admin</Link>}
          <Link to="/profile" onClick={toggleMenu}>Profile</Link>
          <Link to="/contact" onClick={toggleMenu}>Contact</Link>
          {!isLoggedIn && (
            <>
              <Link to="/login" onClick={toggleMenu}>Login</Link>
              <Link to="/register" onClick={toggleMenu}>Sign Up</Link>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
