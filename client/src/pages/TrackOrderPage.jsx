import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, AlertCircle, Clock, ShoppingBag } from 'lucide-react';
import OrderTracker from '../components/OrderTracker';
import { useAuth } from '../context/AuthContext';

export default function TrackOrderPage({ initialOrderNumber, onNavigate }) {
  const [orderNumberInput, setOrderNumberInput] = useState(initialOrderNumber || '');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const { token } = useAuth();

  // Load initial order or recent order from localStorage if available
  useEffect(() => {
    const targetOrder = initialOrderNumber || localStorage.getItem('campusbite_last_order');
    if (targetOrder) {
      setOrderNumberInput(targetOrder);
      fetchOrder(targetOrder);
    }
  }, [initialOrderNumber]);

  // Polling for live status updates every 4 seconds when tracking an active order
  useEffect(() => {
    if (!currentOrder || currentOrder.order_status === 'Completed' || currentOrder.order_status === 'Cancelled') {
      return;
    }

    const interval = setInterval(() => {
      fetch(`/api/orders/track/${currentOrder.order_number}`)
        .then(res => res.json())
        .then(data => {
          if (data.order) {
            setCurrentOrder(data.order);
          }
        })
        .catch(err => console.error('Polling error', err));
    }, 4000);

    return () => clearInterval(interval);
  }, [currentOrder]);

  const fetchOrder = (orderNum) => {
    if (!orderNum || !orderNum.trim()) return;
    setLoading(true);
    setError('');

    const formatted = orderNum.trim().toUpperCase();

    fetch(`/api/orders/track/${formatted}`)
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Order not found');
        return data;
      })
      .then(data => {
        setCurrentOrder(data.order);
        localStorage.setItem('campusbite_last_order', data.order.order_number);
      })
      .catch(err => {
        setError(err.message || 'Unable to find an order with this ID. Please verify your order token.');
        setCurrentOrder(null);
      })
      .finally(() => setLoading(false));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrder(orderNumberInput);
  };

  const handleCancelOrder = async (orderId) => {
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel order.');

      // Refresh order state
      fetchOrder(currentOrder.order_number);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <div className="section-header">
        <span className="section-tag">Live Kitchen Tracking</span>
        <h1 className="section-title">Track Your Order</h1>
        <p className="section-subtitle">
          Follow your meal's preparation live from the kitchen to the pickup counter.
        </p>
      </div>

      {/* Order Search Bar */}
      <form onSubmit={handleSearchSubmit} style={{ maxWidth: '540px', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <div className="search-box" style={{ flex: 1 }}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Enter Order ID (e.g. CB-1041)"
              value={orderNumberInput}
              onChange={e => setOrderNumberInput(e.target.value.toUpperCase())}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <RefreshCw size={16} className="spinner" /> : 'Track'}
          </button>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
          Tip: Try demo order IDs: <strong>CB-1041</strong>, <strong>CB-1042</strong>, or place a new order!
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div style={{ maxWidth: '640px', margin: '0 auto 2rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#b91c1c' }}>
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 700 }}>Order Lookup Failed</div>
            <div style={{ fontSize: '0.88rem' }}>{error}</div>
          </div>
        </div>
      )}

      {/* Order Tracker Display */}
      {currentOrder ? (
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)', display: 'inline-block' }}></span>
              Live kitchen polling active
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => fetchOrder(currentOrder.order_number)}
              title="Refresh status"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <OrderTracker
            order={currentOrder}
            onCancelOrder={handleCancelOrder}
            isCancelling={isCancelling}
          />
        </div>
      ) : !loading && !error ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', maxWidth: '520px', margin: '0 auto' }}>
          <Clock size={48} color="var(--primary)" style={{ margin: '0 auto 1rem', display: 'block' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Active Order Selected</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Enter your digital order token above or explore the canteen menu to place a fresh meal order.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('menu')}>
            <ShoppingBag size={18} /> Browse Menu
          </button>
        </div>
      ) : null}
    </div>
  );
}
