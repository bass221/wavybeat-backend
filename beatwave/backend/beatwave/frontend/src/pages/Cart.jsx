import React from 'react';
import { useCart } from '../Context/CartContext';
import axios from 'axios';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/payment/create-checkout-session`, {
        items: cartItems,
      });
      window.location.href = res.data.url; // ✅ Redirect to Stripe
    } catch (err) {
      console.error('❌ Stripe checkout error:', err);
      alert('Failed to start checkout.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-pink-500">💿 Your Beat Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">Your cart is empty. Start adding some fire 🎧</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cartItems.map((item, idx) => (
              <div key={idx} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
                <img
                  src={`${process.env.REACT_APP_API_URL}/${item.imagePath}`}
                  alt={item.title}
                  className="border-4 border-red-500 w-full h-52 object-cover rounded-t-xl"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold mb-1">{item.title}</h2>
                  <p className="text-pink-400 text-lg mb-4">${item.price}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-l"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-r"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="mt-auto bg-red-600 hover:bg-red-700 transition-colors text-white px-4 py-2 rounded-lg"
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="mt-12 text-right">
            <p className="text-2xl font-semibold mb-4">
              Total: <span className="text-green-400">${total.toFixed(2)}</span>
            </p>
            <button
              onClick={handleCheckout}
              className="bg-pink-600 hover:bg-pink-700 transition-all text-white text-lg font-bold px-6 py-3 rounded-lg shadow-md"
            >
              🛍️ Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
