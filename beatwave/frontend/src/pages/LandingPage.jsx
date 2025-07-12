import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';

const LandingPage = () => {
  const [featuredBeats, setFeaturedBeats] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/beats');
        setFeaturedBeats(res.data.slice(0, 3)); // Limit to first 3
      } catch (err) {
        console.error('❌ Failed to fetch featured beats:', err);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <Hero />

      {/* Featured Beats Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-pink-400 mb-8">🔥 Featured Beats</h2>

        {featuredBeats.length === 0 ? (
          <p className="text-center text-gray-400">No featured beats available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredBeats.map((beat) => (
              <div
                key={beat._id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-md p-4 flex flex-col transition transform hover:scale-105 duration-200"
              >
                {beat.imagePath && (
                  <img
                    src={`http://localhost:5000/${beat.imagePath}`}
                    alt={beat.title}
                    className="w-full h-40 object-cover rounded-lg mb-3 border border-pink-500"
                  />
                )}
                <h3 className="text-lg font-semibold text-white mb-1">{beat.title}</h3>
                <p className="text-pink-400 font-medium mb-2">${beat.price}</p>
                <audio
                  controls
                  className="mt-auto bg-gray-700 rounded w-full"
                  src={`http://localhost:5000/${beat.filePath.replace(/\\/g, '/')}`}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;
