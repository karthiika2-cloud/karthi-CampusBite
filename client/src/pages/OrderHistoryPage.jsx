import React, { useState, useEffect } from 'react';
import { Clock, ShoppingBag, Eye, ArrowRight, RefreshCw, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

export default function OrderHistoryPage({ onTrackOrder, onNavigate, onOpenAuthModal }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/orders/my-orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
      })
      .catch(err => console.error('Failed to load orders', err))
      .finally(() => setLoading(false));
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', background: 'white', padding: '3rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <Clock size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h2>Sign in to view your orders</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>
            Track current and past meal tokens by signing in with your student account.
          </p>
          <button className="btn btn-primary" onClick={onOpenAuthModal}>
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="section-tag">Student Dashboard</span>
          <h1 className="section-title">My Canteen Orders</h1>
          <p className="section-subtitle">
            Order history for <strong>{user.name}</strong> ({user.student_id})
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={fetchOrders}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          Loading your previous orders...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <ShoppingBag size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem', display: 'block' }} />
          <h3>No past orders recorded yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem' }}>
            When you order food from the campus canteen, your receipts and order tokens will show up here.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('menu')}>
            Order Food Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map(order => (
            <div
              key={order.id}
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--dark)' }}>
                    #{order.order_number}
                  </span>
                  <StatusBadge status={order.order_status} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} />
                    {new Date(order.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onTrackOrder(order.order_number)}
                  >
                    <Eye size={14} /> Track Status
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--dark)' }}>
                      <strong>{item.quantity}x</strong> {item.food_name}
                    </span>
                    <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed var(--border-light)', paddingTop: '0.75rem', fontSize: '0.88rem' }}>
                <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CreditCard size={15} />
                  <span>{order.payment_method} ({order.payment_status})</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--dark)' }}>
                  Total: ₹{order.total_amount}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
