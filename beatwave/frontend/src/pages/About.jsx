// frontend/src/pages/About.jsx
import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-pink-500">🎵 About Wavy Beats</h1>
        <p className="text-lg leading-relaxed">
          Wavy Beats is a curated platform for unique and high-quality beats, crafted by passionate producers for creators and artists around the world. Whether you're a rapper, filmmaker, or content creator, Wavy Beats brings sound to your vision.
        </p>
        <p className="mt-4 text-lg">
          👨🏾‍💻 Built by <strong>Bassirou Sagna</strong>, A Senegalese music lover and full-stack developer based in Malaysia.
        </p>
      </div>
    </div>
  );
};

export default About;
