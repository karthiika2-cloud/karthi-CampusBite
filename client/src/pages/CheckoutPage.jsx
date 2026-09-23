import React, { useState } from 'react';
import { MapPin, Clock, User, Phone, CheckCircle, Shield, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import MockPaymentModal from '../components/MockPaymentModal';

const PICKUP_COUNTERS = [
  { id: 'Main Canteen Counter 1', label: 'Main Canteen Counter 1 (Hot Meals & Breakfast)' },
  { id: 'Snack Counter 2', label: 'Snack Counter 2 (Sandwiches, Samosa & Fast Food)' },
  { id: 'Beverage Counter 3', label: 'Beverage Counter 3 (Tea, Filter Coffee & Juices)' }
];

export default function CheckoutPage({ onNavigate, onOrderCreated }) {
  const { items, subtotal, convenienceFee, grandTotal, pickupLocation, setPickupLocation, specialInstructions, clearCart } = useCart();
  const { user, token } = useAuth();

  const [studentName, setStudentName] = useState(user?.name || '');
  const [studentId, setStudentId] = useState(user?.student_id || '');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h3>No items to checkout</h3>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => onNavigate('menu')}>
          Return to Menu
        </button>
      </div>
    );
  }

  const handleOpenPayment = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentId.trim()) {
      setError('Please provide student name and ID for order token verification.');
      return;
    }
    setError('');
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = async (paymentMethod) => {
    // Post order to Express backend
    const orderPayload = {
      items: items.map(item => ({
        food_id: item.food_id,
        quantity: item.quantity
      })),
      payment_method: paymentMethod,
      pickup_location: pickupLocation,
      special_instructions: specialInstructions
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderPayload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to place order.');
    }

    clearCart();
    if (onOrderCreated) {
      onOrderCreated(data.order);
    }
    return data.order;
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <button
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.25rem' }}
        onClick={() => onNavigate('cart')}
      >
        <ArrowLeft size={16} /> Back to Tray
      </button>

      <div className="section-header">
        <span className="section-tag">Final Step</span>
        <h1 className="section-title">Order Checkout</h1>
        <p className="section-subtitle">Confirm your pickup counter and proceed to mock payment</p>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <div className="cart-layout">
        {/* Left Form: Details and Counter */}
        <div className="cart-items-card">
          <form onSubmit={handleOpenPayment}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="var(--primary)" /> Student Verification
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Student Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Student ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contact Mobile (For Ready SMS / Call)</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '1.5rem 0' }} />

            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--primary)" /> Pickup Counter Selection
            </h3>

            <div className="form-group">
              <label className="form-label">Select Canteen Station</label>
              <select
                className="form-select"
                value={pickupLocation}
                onChange={e => setPickupLocation(e.target.value)}
              >
                {PICKUP_COUNTERS.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Estimated Prep Time Indicator */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
              <Clock size={20} color="var(--primary)" />
              <div>
                <strong style={{ fontSize: '0.92rem' }}>Estimated Kitchen Preparation Time:</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Approximately 12-15 minutes once confirmed by canteen kitchen.
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: '2rem' }}
            >
              Choose Payment Method (Pay ₹{grandTotal}) <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* Right Summary */}
        <div className="cart-summary-card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Order Items ({items.reduce((s, i) => s + i.quantity, 0)})</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem', maxHeight: '240px', overflowY: 'auto' }}>
            {items.map(item => (
              <div key={item.food_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>
                  <strong>{item.quantity}x</strong> {item.name}
                </span>
                <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
            <div className="cart-breakdown-row">
              <span>Items Total</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="cart-breakdown-row">
              <span>Packaging Charge</span>
              <span>₹{convenienceFee}</span>
            </div>
            <div className="cart-breakdown-row total-row">
              <span>Payable Amount</span>
              <span style={{ color: 'var(--primary)' }}>₹{grandTotal}</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            * By proceeding, you will test the mock sandbox payment. Real food tokens will be logged in the canteen database.
          </div>
        </div>
      </div>

      {/* Mock Payment Gateway Modal */}
      <MockPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={grandTotal}
        onPaymentComplete={handlePaymentComplete}
        studentName={studentName}
        studentId={studentId}
      />
    </div>
  );
}
