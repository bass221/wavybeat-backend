// src/pages/OrderHistory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('🔒 You must be logged in to view order history.');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err);
      setMessage('❌ Could not load orders. Please try again later.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📜 Order History</h2>
      {message && <p>{message}</p>}

      {orders.length === 0 && !message ? (
        <p>No orders yet.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Beats</th>
              <th>Total ($)</th>
              <th>Date</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>

                {/* ✅ Use <ul> inside <td> to prevent invalid nesting */}
                <td>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {order.beats.map((b, i) => (
                      <li key={i}>🎵 {b.title} — ${b.price}</li>
                    ))}
                  </ul>
                </td>

                <td>${order.total}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  <Link to="/invoice" state={{ order }}>📄 View Invoice</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
