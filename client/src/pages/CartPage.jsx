import React from 'react';
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Utensils, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage({ onNavigate, onOpenAuthModal }) {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    convenienceFee,
    grandTotal,
    specialInstructions,
    setSpecialInstructions
  } = useCart();

  const { user } = useAuth();

  const handleProceedToCheckout = () => {
    if (!user) {
      onOpenAuthModal();
      return;
    }
    onNavigate('checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem' }}>
        <div
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'var(--primary-light)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              margin: '0 auto 1.5rem'
            }}
          >
            <ShoppingBag size={40} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Your Tray is Empty</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5 }}>
            Looks like you haven't picked anything delicious from our campus canteen yet. Browse the menu to add hot snacks, meals, or drinks!
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('menu')}
          >
            Browse Canteen Menu <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="section-tag">Review Selection</span>
          <h1 className="section-title">Your Food Tray</h1>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={clearCart}
          style={{ color: 'var(--danger)', borderColor: '#fca5a5' }}
        >
          <Trash2 size={15} /> Clear Tray
        </button>
      </div>

      <div className="cart-layout">
        {/* Left: Items list */}
        <div className="cart-items-card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Utensils size={18} color="var(--primary)" /> Selected Items ({items.reduce((s, i) => s + i.quantity, 0)})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map(item => (
              <div key={item.food_id} className="cart-item-row">
                <div className="cart-item-info">
                  <img src={item.image} alt={item.name} className="cart-thumb" />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <div className={`diet-badge ${item.is_veg === 1 ? 'veg' : 'non-veg'}`} style={{ width: '16px', height: '16px' }}>
                        <div className="diet-symbol" style={{ width: '6px', height: '6px' }}></div>
                      </div>
                      <h4 className="cart-item-title">{item.name}</h4>
                    </div>
                    <div className="cart-item-price">₹{item.price} each</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  {/* Quantity Stepper */}
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.food_id, item.quantity - 1)}
                      title="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.food_id, item.quantity + 1)}
                      title="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div style={{ minWidth: '60px', textAlign: 'right', fontWeight: 800, fontSize: '1.05rem', color: 'var(--dark)' }}>
                    ₹{item.price * item.quantity}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.food_id)}
                    style={{ color: 'var(--text-light)', padding: '4px', transition: 'var(--transition)' }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Kitchen instructions */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquare size={16} color="var(--primary)" /> Special Kitchen Instructions (Optional)
            </label>
            <input
              type="text"
              className="form-input"
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less spicy, extra sambar, hot filter coffee, etc."
            />
          </div>
        </div>

        {/* Right: Bill Summary */}
        <div className="cart-summary-card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Order Bill Details</h3>

          <div className="cart-breakdown-row">
            <span>Items Subtotal</span>
            <strong>₹{subtotal}</strong>
          </div>

          <div className="cart-breakdown-row">
            <span>Canteen Eco Packaging & Tray Fee</span>
            <span>₹{convenienceFee}</span>
          </div>

          <div className="cart-breakdown-row total-row">
            <span>Grand Total</span>
            <span style={{ color: 'var(--primary)' }}>₹{grandTotal}</span>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-md)', padding: '0.85rem', margin: '1.25rem 0', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={20} color="var(--secondary)" style={{ flexShrink: 0 }} />
            <span>Digital receipt & instant kitchen token will be generated upon checkout.</span>
          </div>

          <button
            className="btn btn-primary btn-block btn-lg"
            onClick={handleProceedToCheckout}
          >
            {user ? 'Proceed to Checkout' : 'Sign In to Order'} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
