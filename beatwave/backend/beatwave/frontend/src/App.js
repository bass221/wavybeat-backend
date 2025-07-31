// src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import UploadBeat from './pages/UploadBeat';
import BeatsList from './components/BeatsList';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Login from './pages/login';
import Register from './pages/register';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import OrderHistory from './pages/OrderHistory';
import Invoice from './pages/Invoice';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from './Context/CartContext';
import Contact from './pages/Contact';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword'; // or correct path
import About from './pages/About';
import NotFound from './pages/NotFound';

const App = () => {
  const { cartItems } = useCart();

  const token = localStorage.getItem('token');
  let user = {};
  try {
      user = JSON.parse(localStorage.getItem('user')) || {};
    } catch (err) {
      user = {};
  }
  const isLoggedIn = !!token;
  const isAdmin = user?.isAdmin === true;

  // Reusable protected route
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!isLoggedIn) {
      return (
        <div className="p-4 text-center text-red-600">
          🔒 You must <Link to="/login" className="underline">login</Link> to access this page.
        </div>
      );
    }

    if (adminOnly && !isAdmin) {
      return (
        <div className="p-4 text-center text-red-600">
          🚫 Only admins can access this page.
        </div>
      );
    }

    return children;
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      <Navbar cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/beats" element={<BeatsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/contact" element={<Contact />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadBeat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default App;
