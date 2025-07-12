// src/pages/UploadBeat.jsx
import React, { useState } from 'react';
import axios from 'axios';

const UploadBeat = () => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('genre', genre);
    formData.append('price', price);
    formData.append('audio', audioFile);
    if (imageFile) formData.append('image', imageFile);
    if (zipFile) formData.append('zip', zipFile);

    try {
      await axios.post('http://localhost:5000/api/beats/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('✅ Beat uploaded successfully!');
      setTitle('');
      setGenre('');
      setPrice('');
      setAudioFile(null);
      setImageFile(null);
      setZipFile(null);
    } catch (err) {
      console.error('❌ Upload error:', err);
      setMessage('❌ Upload failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-pink-500 mb-6 text-center">⬆️ Upload New Beat</h2>
        {message && (
          <p className="mb-4 text-center text-sm text-yellow-400">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white"
            required
          />

          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white"
            required
          >
            <option value="">Select Genre</option>
            <option value="Trap">Trap</option>
            <option value="RnB">RnB</option>
            <option value="Soulful">Soulful</option>
            <option value="UK Drill">UK Drill</option>
          </select>

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white"
            required
          />

          <label className="block text-sm font-medium text-gray-300">
            🎵 Upload Audio File (MP3)
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
            className="w-full text-white"
            required
          />

          <label className="block text-sm font-medium text-gray-300">
            🖼️ Upload Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full text-white"
          />

          <label className="block text-sm font-medium text-gray-300">
            📦 Upload ZIP of Beat Stems (optional)
          </label>
          <input
            type="file"
            accept=".zip,.rar,.7z"
            onChange={(e) => setZipFile(e.target.files[0])}
            className="w-full text-white"
          />

          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg"
          >
            ⬆️ Upload Beat
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadBeat;
