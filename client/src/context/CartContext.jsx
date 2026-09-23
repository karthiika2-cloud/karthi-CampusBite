import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('campusbite_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [specialInstructions, setSpecialInstructions] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Main Canteen Counter 1');

  useEffect(() => {
    try {
      localStorage.setItem('campusbite_cart', JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [items]);

  const addToCart = (foodItem, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.food_id === foodItem.id);
      if (existing) {
        return prev.map(i =>
          i.food_id === foodItem.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          food_id: foodItem.id,
          name: foodItem.name,
          price: foodItem.price,
          image: foodItem.image,
          is_veg: foodItem.is_veg,
          category: foodItem.category,
          quantity
        }
      ];
    });
  };

  const updateQuantity = (foodId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(foodId);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.food_id === foodId ? { ...i, quantity: newQty } : i))
    );
  };

  const removeFromCart = (foodId) => {
    setItems(prev => prev.filter(i => i.food_id !== foodId));
  };

  const clearCart = () => {
    setItems([]);
    setSpecialInstructions('');
    localStorage.removeItem('campusbite_cart');
  };

  const getItemQuantity = (foodId) => {
    const item = items.find(i => i.food_id === foodId);
    return item ? item.quantity : 0;
  };

  // Calculations
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const convenienceFee = items.length > 0 ? 5 : 0; // ₹5 packaging & platform fee
  const grandTotal = subtotal + convenienceFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        totalCount,
        subtotal,
        convenienceFee,
        grandTotal,
        specialInstructions,
        setSpecialInstructions,
        pickupLocation,
        setPickupLocation
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
