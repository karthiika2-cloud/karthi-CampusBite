import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCheck, IndianRupee, Flame, ArrowUpRight, TrendingUp, RefreshCw, ChefHat, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

export default function AdminDashboard({ onNavigateTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = () => {
    setLoading(true);
    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
      })
      .catch(err => console.error('Failed to load admin stats', err))
      .finally(() => setLoading(false));
  };

  if (loading && !stats) {
    return (
      <div className="container" style={{ padding: '3rem 1.25rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading kitchen intelligence & dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      {/* Admin Top Header Banner */}
      <div className="admin-header">
        <div className="admin-header-bg-glow"></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span className="role-pill admin" style={{ display: 'inline-block', marginBottom: '0.4rem' }}>
                Canteen Staff Portal
              </span>
              <h1 style={{ color: 'white', fontSize: '2.1rem' }}>Canteen Kitchen Operations</h1>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                Real-time monitor for campus incoming orders, kitchen queues, and daily canteen revenue.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => onNavigateTab('admin-orders')}
              >
                <ChefHat size={18} /> Manage Live Orders
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => onNavigateTab('admin-menu')}
              >
                <Layers size={18} /> Menu Management
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={fetchStats}
                title="Refresh Metrics"
                style={{ padding: '0.5rem' }}
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics KPI Metrics Cards */}
      <div className="admin-stats-grid">
        {/* Total Orders Today */}
        <div className="admin-stat-card">
          <div className="stat-icon-box orange">
            <ShoppingBag />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders Today</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--dark)', fontFamily: 'var(--font-heading)' }}>
              {stats?.totalOrders || 0}
            </div>
          </div>
        </div>

        {/* Pending Orders In Kitchen */}
        <div className="admin-stat-card">
          <div className="stat-icon-box blue">
            <Clock />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>In Queue / Cooking</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', fontFamily: 'var(--font-heading)' }}>
              {stats?.pendingOrders || 0}
            </div>
          </div>
        </div>

        {/* Ready / Completed */}
        <div className="admin-stat-card">
          <div className="stat-icon-box green">
            <CheckCheck />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Completed Orders</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', fontFamily: 'var(--font-heading)' }}>
              {stats?.completedOrders || 0}
            </div>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="admin-stat-card">
          <div className="stat-icon-box purple">
            <IndianRupee />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Today's Revenue</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#9333ea', fontFamily: 'var(--font-heading)' }}>
              ₹{stats?.todayRevenue || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Dish Highlight & Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={32} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 800 }}>
              Top Selling Campus Dish
            </span>
            <h3 style={{ fontSize: '1.25rem', marginTop: '0.2rem', marginBottom: '0.25rem' }}>
              {stats?.popularItem || 'Butter Masala Dosa'}
            </h3>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Total ordered: <strong>{stats?.popularItemSold || 1} portions</strong>
            </span>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Active Canteen Categories
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {stats?.categoryStats && stats.categoryStats.map(cat => (
              <span
                key={cat.category}
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--dark)'
                }}
              >
                {cat.category}: <strong>{cat.count} items</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table Preview */}
      <div className="table-card">
        <div className="table-header-bar">
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Recent Incoming Orders</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Quick view of latest kitchen tokens. Go to Order Management for full controls.
            </p>
          </div>

          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => onNavigateTab('admin-orders')}
          >
            View All Orders & Kitchen Queue <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Student</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map(ord => (
                  <tr key={ord.id}>
                    <td>
                      <strong style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                        #{ord.order_number}
                      </strong>
                    </td>
                    <td>
                      <div><strong>{ord.student_name}</strong></div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ord.student_id}</div>
                    </td>
                    <td>
                      <strong>₹{ord.total_amount}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem' }}>
                        {ord.payment_method} ({ord.payment_status})
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={ord.order_status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No orders registered today yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
