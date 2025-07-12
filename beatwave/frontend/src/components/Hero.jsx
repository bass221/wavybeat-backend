import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-black to-gray-900 text-white py-20 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          🎧 Welcome to <span className="text-pink-500">Wavy Beats</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Buy high-quality beats from talented producers. Trap, RnB, Soulful, UK Drill & more.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            to="/beats"
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-full transition duration-200"
          >
            🎵 Browse Beats
          </Link>
          <Link
            to="/upload"
            className="border border-white hover:bg-white hover:text-black font-bold py-3 px-6 rounded-full transition duration-200"
          >
            ⬆️ Upload Your Beats
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
