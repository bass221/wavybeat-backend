import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [beats, setBeats] = useState([]);
  const [selectedBeat, setSelectedBeat] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', genre: '', price: '' });
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const beatsPerPage = 10;
  const token = localStorage.getItem('token');

  const fetchBeats = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/beats`);
      setBeats(res.data);
    } catch (err) {
      console.error('Error fetching beats:', err);
    }
  };

  useEffect(() => {
    fetchBeats();
  }, []);

  const handleDelete = async (beatId) => {
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/beats/${beatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('✅ Beat deleted successfully');
      fetchBeats();
    } catch (err) {
      console.error('❌ Error deleting beat:', err);
      alert('❌ Failed to delete beat');
    }
  };

  const openEditModal = (beat) => {
    setSelectedBeat(beat);
    setEditForm({ title: beat.title, genre: beat.genre, price: beat.price });
  };

  const closeEditModal = () => setSelectedBeat(null);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/beats/${selectedBeat._id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Beat updated');
      closeEditModal();
      fetchBeats();
    } catch (err) {
      console.error('Update error:', err);
      setMessage('❌ Failed to update beat');
    }
  };

  const indexOfLast = currentPage * beatsPerPage;
  const indexOfFirst = indexOfLast - beatsPerPage;
  const currentBeats = beats.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(beats.length / beatsPerPage);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-pink-500">🎧 Admin Panel</h2>
      {message && <p className="text-center text-yellow-400 mb-4">{message}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-pink-400">
              <th className="p-3">Title</th>
              <th className="p-3">Genre</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBeats.map((beat) => (
              <tr key={beat._id} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="p-3">{beat.title}</td>
                <td className="p-3">{beat.genre}</td>
                <td className="p-3">${beat.price}</td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => openEditModal(beat)}
                    className="text-yellow-400 hover:text-yellow-300 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(beat._id)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-1 rounded-lg text-sm ${
              currentPage === i + 1
                ? 'bg-pink-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      {selectedBeat && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-black">
            <h3 className="text-xl font-bold mb-4 text-center">Edit Beat</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                placeholder="Title"
                className="w-full px-4 py-2 border rounded outline-none"
              />
              <select
                name="genre"
                value={editForm.genre}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border rounded outline-none"
              >
                <option value="">Select Genre</option>
                <option value="Trap">Trap</option>
                <option value="RnB">RnB</option>
                <option value="Soulful">Soulful</option>
                <option value="UK Drill">UK Drill</option>
              </select>
              <input
                name="price"
                type="number"
                value={editForm.price}
                onChange={handleEditChange}
                placeholder="Price"
                className="w-full px-4 py-2 border rounded outline-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
