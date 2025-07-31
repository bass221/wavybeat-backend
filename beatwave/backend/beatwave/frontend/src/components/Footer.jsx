// frontend/src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Wavy Beats.BassSagna All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="/" className="hover:text-pink-500">Home</Link>
          <Link to="/about" className="hover:text-pink-500">About</Link>
          <a href="mailto:sagnabass6@gmail.com" className="hover:text-pink-500">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
