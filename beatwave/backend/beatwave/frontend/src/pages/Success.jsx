import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Success = () => {
  const [message, setMessage] = useState('⏳ Processing your order...');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const saveOrder = async () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const token = localStorage.getItem('token');

      if (cartItems.length === 0 || !token) {
        setMessage('⚠️ No items to save or you are not logged in.');
        return;
      }

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/orders`,
          {
            items: cartItems,
            total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrderId(res.data._id);
        setMessage('✅ Your order was placed successfully!');
        localStorage.removeItem('cartItems');
      } catch (err) {
        console.error('❌ Error saving order:', err);
        setMessage('❌ Failed to save your order.');
      }
    };

    saveOrder();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col justify-center items-center px-4">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-xl text-center max-w-lg w-full">
        <h2 className="text-4xl font-bold text-green-400 mb-4">🎉 Order Success</h2>
        <p className="text-lg text-gray-300 mb-4">{message}</p>
        {orderId && (
          <p className="text-sm text-pink-400 mb-4">
            🧾 Order ID: <span className="font-mono">{orderId}</span>
          </p>
        )}
        <a
          href="/"
          className="inline-block mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300"
        >
          🔙 Back to Home
        </a>
      </div>
    </div>
  );
};

export default Success;
