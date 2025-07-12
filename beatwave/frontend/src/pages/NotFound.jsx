// frontend/src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center">
      <h1 className="text-6xl font-bold text-pink-500">404</h1>
      <p className="text-xl mt-4">Oops! Page not found.</p>
      <Link to="/" className="mt-6 bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
