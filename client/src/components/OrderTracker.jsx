import React, { useState } from 'react';
import { Clock, CheckCircle, ChefHat, BellRing, CheckCheck, XCircle, MapPin, Receipt, AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge';

const STAGES = [
  { id: 'Order Received', label: 'Order Placed', icon: Clock },
  { id: 'Confirmed', label: 'Confirmed', icon: CheckCircle },
  { id: 'Preparing', label: 'In Kitchen', icon: ChefHat },
  { id: 'Ready for Pickup', label: 'Ready for Pickup', icon: BellRing },
  { id: 'Completed', label: 'Picked Up', icon: CheckCheck }
];

export default function OrderTracker({ order, onCancelOrder, isCancelling }) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!order) return null;

  const isCancelled = order.order_status === 'Cancelled';
  const currentStageIndex = STAGES.findIndex(s => s.id === order.order_status);

  // Calculate progress width percentage
  let progressPercent = 0;
  if (currentStageIndex >= 0) {
    progressPercent = (currentStageIndex / (STAGES.length - 1)) * 100;
  }

  // Can cancel if order is received or confirmed
  const canCancel = order.order_status === 'Order Received' || order.order_status === 'Confirmed';

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    if (onCancelOrder) {
      onCancelOrder(order.id);
    }
  };

  return (
    <div className="order-tracker-card">
      <div className="tracker-header">
        <div className="order-meta-group">
          <span className="order-badge-id">#{order.order_number}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <StatusBadge status={order.order_status} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {new Date(order.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Ordered by: <strong style={{ color: 'var(--dark)' }}>{order.student_name}</strong> ({order.student_id})
            </div>
          </div>
        </div>

        {canCancel && (
          <button
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--danger)', borderColor: '#fca5a5' }}
            onClick={() => setShowCancelModal(true)}
            disabled={isCancelling}
          >
            <XCircle size={15} /> {isCancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      {/* Visual Stepper */}
      {isCancelled ? (
        <div
          style={{
            background: 'var(--danger-light)',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            textAlign: 'center',
            color: 'var(--danger)',
            margin: '1.5rem 0'
          }}
        >
          <XCircle size={40} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
          <h3 style={{ color: 'var(--danger)', marginBottom: '0.25rem' }}>This order was cancelled</h3>
          <p style={{ fontSize: '0.9rem', color: '#7f1d1d' }}>
            If you paid online via UPI/Card, the mock refund of ₹{order.total_amount} will reflect immediately.
          </p>
        </div>
      ) : (
        <div className="stepper-container">
          <div className="stepper-line-bg"></div>
          <div className="stepper-line-fill" style={{ width: `${progressPercent}%` }}></div>

          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = currentStageIndex > idx;
            const isCurrent = currentStageIndex === idx;

            return (
              <div
                key={stage.id}
                className={`step-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div className="step-circle">
                  {isCompleted ? <CheckCheck size={20} /> : <Icon size={20} />}
                </div>
                <span className="step-label">{stage.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Tracker Details Grid */}
      <div className="tracker-details-grid">
        <div className="detail-block">
          <span className="detail-label">Pickup Location</span>
          <div className="detail-val" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={16} color="var(--primary)" />
            {order.pickup_location || 'Main Canteen Counter 1'}
          </div>
        </div>

        <div className="detail-block">
          <span className="detail-label">Estimated Wait Time</span>
          <div className="detail-val" style={{ color: order.order_status === 'Ready for Pickup' ? 'var(--secondary)' : 'var(--primary)' }}>
            {order.order_status === 'Ready for Pickup' ? '🎉 Ready at the counter!' : order.estimated_time || '10-15 mins'}
          </div>
        </div>

        <div className="detail-block">
          <span className="detail-label">Payment Method & Status</span>
          <div className="detail-val">
            {order.payment_method} • <span style={{ color: order.payment_status === 'Paid' ? 'var(--secondary)' : 'var(--warning)' }}>{order.payment_status}</span>
          </div>
        </div>

        <div className="detail-block">
          <span className="detail-label">Total Amount</span>
          <div className="detail-val" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>
            ₹{order.total_amount}
          </div>
        </div>
      </div>

      {/* Items Summary list */}
      {order.items && order.items.length > 0 && (
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Receipt size={16} /> Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.92rem',
                  padding: '0.35rem 0',
                  borderBottom: '1px dashed var(--border-light)'
                }}
              >
                <span>
                  <strong>{item.quantity}x</strong> {item.food_name}
                </span>
                <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {order.special_instructions && (
            <div style={{ marginTop: '0.85rem', fontSize: '0.85rem', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <strong>Instructions:</strong> {order.special_instructions}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Cancel */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', background: '#fee2e2', borderRadius: '50%', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <AlertTriangle size={28} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Cancel Order #{order.order_number}?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to cancel this order? The canteen kitchen will be notified immediately.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>
                Keep Order
              </button>
              <button className="btn btn-danger" onClick={handleConfirmCancel}>
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
