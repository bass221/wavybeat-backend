// src/Context/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (beat) => {
    setCartItems((prevItems) => {
      const exists = prevItems.some((item) => item._id === beat._id);
      if (exists) {
        toast.info(`${beat.title} is already in your cart`);
        return prevItems;
      }

      toast.success(`${beat.title} added to cart`);
      return [...prevItems, { ...beat, quantity: 1 }];
    });
  };

  const removeFromCart = (beatId) => {
    const item = cartItems.find((i) => i._id === beatId);
    try {
      toast.error(`${item?.title} removed from cart`);
    } catch (err) {
      console.warn('Toast error:', err);
    }

    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== beatId)
    );
  };

  const increaseQuantity = (beatId) => {
    const item = cartItems.find((i) => i._id === beatId);
    try {
      toast.info(`Increased ${item?.title} quantity`);
    } catch (err) {
      console.warn('Toast error:', err);
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === beatId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (beatId) => {
    const item = cartItems.find((i) => i._id === beatId);
    try {
      toast.info(`Decreased ${item?.title} quantity`);
    } catch (err) {
      console.warn('Toast error:', err);
    }

    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item._id === beatId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ✅ NEW: Direct updateQuantity function
  const updateQuantity = (beatId, newQty) => {
    if (newQty < 1) return;
    const item = cartItems.find((i) => i._id === beatId);
    try {
      toast.info(`Updated ${item?.title} quantity to ${newQty}`);
    } catch (err) {
      console.warn('Toast error:', err);
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === beatId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    try {
      toast.warn('Cart cleared');
    } catch (err) {
      console.warn('Toast error:', err);
    }

    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity, // ✅ make sure it's exported here
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
