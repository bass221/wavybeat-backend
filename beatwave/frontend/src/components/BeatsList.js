import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../Context/CartContext';

const API_URL = process.env.REACT_APP_API_URL;

function BeatsList() {
  const [beats, setBeats] = useState([]);
  const [filteredBeats, setFilteredBeats] = useState([]);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const { addToCart } = useCart();

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    fetchBeats();
  }, []);

  const fetchBeats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/beats`);
      setBeats(res.data);
      setFilteredBeats(res.data);
    } catch (err) {
      console.error('❌ Error fetching beats:', err);
    }
  };

  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = beats.filter(
      (beat) =>
        beat.title.toLowerCase().includes(searchLower) &&
        (genreFilter === 'All' || beat.genre === genreFilter)
    );
    setFilteredBeats(filtered);
  }, [search, genreFilter, beats]);

  const handleBuyNow = async (beat) => {
    try {
      const res = await axios.post(`${API_URL}/api/payment/create-checkout-session`, {
        items: [{ ...beat, quantity: 1 }],
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error('❌ Stripe checkout error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this beat?')) return;

    const token = localStorage.getItem('token');

    try {
      await axios.delete(`${API_URL}/api/beats/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBeats((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error('❌ Error deleting beat:', err);
      alert('Failed to delete beat');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h3 className="text-3xl font-bold text-pink-500 mb-6 text-center">🎧 Available Beats</h3>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
        >
          <option value="All">All Genres</option>
          <option value="Trap">Trap</option>
          <option value="RnB">RnB</option>
          <option value="Soulful">Soulful</option>
          <option value="UK Drill">UK Drill</option>
        </select>
      </div>

      {filteredBeats.length === 0 ? (
        <p className="text-center text-gray-400">No beats found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBeats.map((beat) => (
            <div key={beat._id} className="bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col">
              {beat.imagePath && (
                <img
                  src={`${API_URL}/${beat.imagePath}`}
                  alt={beat.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4 flex flex-col flex-grow">
                <h4 className="text-xl font-bold mb-1">{beat.title}</h4>
                <p className="text-sm text-gray-400">Genre: {beat.genre}</p>
                <p className="text-lg text-green-400 font-semibold mb-4">${beat.price}</p>

                {beat.filePath ? (
                  <audio
                    controls
                    src={`${API_URL}/${beat.filePath.replace(/\\/g, '/')}`}
                    className="w-full rounded-lg border-2 border-pink-500"
                  />
                ) : (
                  <p className="text-red-500 mt-2">❌ No audio file</p>
                )}

                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <button
                    onClick={() => addToCart(beat)}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 transition-all text-white px-4 py-2 rounded-lg"
                  >
                    🛒 Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(beat)}
                    className="flex-1 bg-green-600 hover:bg-green-700 transition-all text-white px-4 py-2 rounded-lg"
                  >
                    💳 Buy Now
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(beat._id)}
                      className="w-full bg-red-600 hover:bg-red-700 transition-all text-white px-4 py-2 rounded-lg"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BeatsList;
