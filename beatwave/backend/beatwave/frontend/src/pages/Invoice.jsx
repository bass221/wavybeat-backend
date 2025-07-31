// src/pages/Invoice.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>⚠️ No order data found. Return to your <button onClick={() => navigate('/orders')}>Order History</button>.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: 600, margin: 'auto' }}>
      <h2>🧾 Invoice</h2>
      <p><strong>Invoice ID:</strong> {order._id}</p>
      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>User:</strong> {order.userEmail || 'Customer'}</p>
      <hr />
      <h4>Beats:</h4>
      <ul>
        {order.beats.map((item, idx) => (
          <li key={idx}>
            🎵 {item.title} — ${item.price}
          </li>
        ))}
      </ul>
      <h3>Total: ${order.total}</h3>
      <br />
      <button onClick={handlePrint}>🖨️ Print Invoice</button>
    </div>
  );
};

export default Invoice;
