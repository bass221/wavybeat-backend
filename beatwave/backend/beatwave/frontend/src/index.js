// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './Context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CartProvider>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}       // ⛔ prevent click
        pauseOnHover
        draggable={false}          // ⛔ prevent drag
        closeButton={false}        // ⛔ hide close button
        theme="colored"
      />
    </BrowserRouter>
  </CartProvider>
);

