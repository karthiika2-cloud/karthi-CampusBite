import React from 'react';
import { Plus, Minus, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FoodCard({ food, onAddToCartToast }) {
  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const quantity = getItemQuantity(food.id);

  const handleAdd = () => {
    addToCart(food, 1);
    if (onAddToCartToast) {
      onAddToCartToast(`Added "${food.name}" to tray!`);
    }
  };

  const handleIncrease = () => {
    updateQuantity(food.id, quantity + 1);
  };

  const handleDecrease = () => {
    updateQuantity(food.id, quantity - 1);
  };

  return (
    <div className={`food-card ${food.availability === 0 ? 'out-of-stock' : ''}`}>
      <div className="food-image-wrapper">
        <img
          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'}
          alt={food.name}
          className="food-card-img"
          loading="lazy"
        />

        <div className="food-tag-container">
          {/* Veg / Non-Veg Indicator */}
          <div
            className={`diet-badge ${food.is_veg === 1 ? 'veg' : 'non-veg'}`}
            title={food.is_veg === 1 ? 'Pure Vegetarian' : 'Non-Vegetarian'}
          >
            <div className="diet-symbol"></div>
          </div>

          {/* Prep time */}
          {food.preparation_time && (
            <div className="prep-time-badge">
              <Clock size={12} />
              <span>{food.preparation_time}m</span>
            </div>
          )}
        </div>

        {food.availability === 0 && (
          <div className="out-of-stock-overlay">
            <span>Sold Out Today</span>
          </div>
        )}
      </div>

      <div className="food-card-content">
        <span className="food-category-label">{food.category}</span>
        <h3 className="food-name">{food.name}</h3>
        <p className="food-desc">{food.description}</p>

        <div className="food-card-footer">
          <div className="food-price">₹{food.price}</div>

          {food.availability === 0 ? (
            <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
              Unavailable
            </button>
          ) : quantity > 0 ? (
            <div className="qty-control">
              <button
                className="qty-btn"
                onClick={handleDecrease}
                title="Decrease quantity"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={handleIncrease}
                title="Increase quantity"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAdd}
              aria-label={`Add ${food.name} to cart`}
            >
              <Plus size={16} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
