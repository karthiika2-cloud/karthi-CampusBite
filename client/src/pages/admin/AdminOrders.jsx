import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, ChefHat, CheckCircle, BellRing, CheckCheck, XCircle, ArrowRight, Filter, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

const STATUS_FILTERS = ['All', 'Pending', 'Order Received', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'];

export default function AdminOrders({ onStatusUpdatedToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = () => {
    setLoading(true);
    let url = `/api/admin/orders?status=${encodeURIComponent(selectedStatus)}`;
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
      })
      .catch(err => console.error('Failed to load orders', err))
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order status');

      // Update local state
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, order_status: newStatus, payment_status: newStatus === 'Completed' ? 'Paid' : o.payment_status } : o))
      );

      if (onStatusUpdatedToast) {
        onStatusUpdatedToast(data.message || `Order status updated to ${newStatus}`);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getNextAction = (status) => {
    switch (status) {
      case 'Order Received':
        return { label: 'Confirm Order', nextStatus: 'Confirmed', icon: CheckCircle, className: 'btn-primary' };
      case 'Confirmed':
        return { label: 'Start Cooking', nextStatus: 'Preparing', icon: ChefHat, className: 'btn-primary' };
      case 'Preparing':
        return { label: 'Mark Ready', nextStatus: 'Ready for Pickup', icon: BellRing, className: 'btn-success' };
      case 'Ready for Pickup':
        return { label: 'Complete Handover', nextStatus: 'Completed', icon: CheckCheck, className: 'btn-secondary' };
      default:
        return null;
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="section-tag">Kitchen Queue</span>
          <h1 className="section-title">Order Management</h1>
          <p className="section-subtitle">
            Monitor incoming orders, transition kitchen prep stages, and complete student pickups.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={fetchOrders}>
          <RefreshCw size={14} /> Refresh Queue
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Order ID (CB-...), student name, or student ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchOrders()}
          />
        </div>

        {/* Status Filters */}
        <div className="category-pills">
          {STATUS_FILTERS.map(st => (
            <button
              key={st}
              className={`category-pill ${selectedStatus === st ? 'active' : ''}`}
              onClick={() => setSelectedStatus(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Student</th>
                <th>Items Ordered</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Quick Transition</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                    Loading kitchen orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                    No orders found matching the filter "{selectedStatus}".
                  </td>
                </tr>
              ) : (
                orders.map(order => {
                  const nextAction = getNextAction(order.order_status);

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)', fontSize: '1rem' }}>
                          #{order.order_number}
                        </strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 700 }}>{order.student_name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ID: {order.student_id}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: '2px' }}>
                          📍 {order.pickup_location}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', maxWidth: '280px' }}>
                          {order.items && order.items.map((itm, i) => (
                            <span key={i} style={{ fontSize: '0.86rem' }}>
                              <strong>{itm.quantity}x</strong> {itm.food_name}
                            </span>
                          ))}
                          {order.special_instructions && (
                            <span style={{ fontSize: '0.78rem', color: '#b45309', background: '#fef3c7', padding: '0.2rem 0.4rem', borderRadius: '4px', marginTop: '2px' }}>
                              Note: {order.special_instructions}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--dark)' }}>
                          ₹{order.total_amount}
                        </strong>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{order.payment_method}</div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: order.payment_status === 'Paid' ? 'var(--secondary)' : 'var(--warning)'
                          }}
                        >
                          ● {order.payment_status}
                        </span>
                      </td>

                      <td>
                        <div style={{ marginBottom: '0.4rem' }}>
                          <StatusBadge status={order.order_status} />
                        </div>
                        {/* Status Dropdown Override */}
                        <select
                          className="form-select"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem', height: 'auto', minWidth: '130px' }}
                          value={order.order_status}
                          disabled={updatingId === order.id}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="Order Received">Order Received</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready for Pickup">Ready for Pickup</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        {nextAction ? (
                          <button
                            className={`btn ${nextAction.className} btn-sm`}
                            disabled={updatingId === order.id}
                            onClick={() => handleStatusChange(order.id, nextAction.nextStatus)}
                          >
                            <nextAction.icon size={14} />
                            <span>{updatingId === order.id ? 'Updating...' : nextAction.label}</span>
                          </button>
                        ) : order.order_status === 'Completed' ? (
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            Archived
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.82rem', color: 'var(--danger)' }}>
                            Cancelled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
