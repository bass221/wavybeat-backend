// src/pages/Profile.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cartItems');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>You are not logged in. Please <span className="text-pink-400 cursor-pointer" onClick={() => navigate('/login')}>login</span>.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-10 px-6">
      <div className="max-w-md mx-auto bg-gray-900 rounded-xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-pink-500 text-center">👤 Your Profile</h2>

        <p className="mb-4"><span className="font-semibold text-gray-400">Username:</span> {user.username || 'N/A'}</p>
        <p className="mb-4"><span className="font-semibold text-gray-400">Email:</span> {user.email || 'N/A'}</p>
        <p className="mb-4"><span className="font-semibold text-gray-400">Role:</span> {user.isAdmin ? 'Admin' : 'User'}</p>

        <button
          onClick={() => navigate('/orders')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-4"
        >
          📦 View Order History
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
