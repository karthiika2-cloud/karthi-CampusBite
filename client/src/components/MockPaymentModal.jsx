import React, { useState, useEffect } from 'react';
import { X, QrCode, CreditCard, Banknote, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MockPaymentModal({
  isOpen,
  onClose,
  totalAmount,
  onPaymentComplete,
  studentName,
  studentId
}) {
  const [method, setMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  // Card mock state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(studentName || 'Student Name');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('123');

  // UPI mock state
  const [upiId, setUpiId] = useState('student@oksbi');
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 mins countdown

  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setIsSuccess(false);
      setPaymentResult(null);
      setTimerSeconds(300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && method === 'UPI' && !isSuccess && timerSeconds > 0) {
      const interval = setInterval(() => {
        setTimerSeconds(s => (s > 0 ? s - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, method, isSuccess, timerSeconds]);

  if (!isOpen) return null;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);

    // Simulate realistic 1.2s gateway communication
    setTimeout(async () => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if canvas-confetti is not loaded
      }

      // Delegate actual order creation to parent
      try {
        const result = await onPaymentComplete(method);
        setPaymentResult(result);
      } catch (err) {
        setIsSuccess(false);
        alert(err.message || 'Payment processing failed');
      }
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={isProcessing ? undefined : onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {!isProcessing && !isSuccess && (
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Loader2 size={54} color="var(--primary)" className="spinner" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Processing Mock Payment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Simulating secure campus gateway authorization for ₹{totalAmount}...
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Success State */}
        {isSuccess && paymentResult && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ width: '70px', height: '70px', background: '#dcfce7', borderRadius: '50%', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={44} />
            </div>
            <span className="role-pill" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
              Simulated Payment Successful
            </span>
            <h2 style={{ fontSize: '1.75rem', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
              Order Confirmed!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Your order has been sent to the canteen kitchen.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Order Number</span>
                <strong style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)', fontSize: '1.1rem' }}>
                  #{paymentResult.order_number}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Transaction ID</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--dark)' }}>
                  {paymentResult.transaction_id}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Amount Paid</span>
                <strong>₹{paymentResult.total_amount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pickup Counter</span>
                <strong>{paymentResult.pickup_location}</strong>
              </div>
            </div>

            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={() => {
                onClose();
                window.location.hash = `#/track/${paymentResult.order_number}`;
              }}
            >
              Track Order Live <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Payment Selection State */}
        {!isProcessing && !isSuccess && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="section-tag">Campus Checkout</span>
              <h3 style={{ fontSize: '1.45rem', marginTop: '0.2rem' }}>Choose Payment Method</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Total payable amount: <strong style={{ color: 'var(--dark)', fontSize: '1.05rem' }}>₹{totalAmount}</strong>
              </p>
            </div>

            {/* Sandbox Notice Banner */}
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#92400e' }}>
              <ShieldCheck size={18} style={{ flexShrink: 0 }} />
              <span><strong>Sandbox Prototype:</strong> No real bank charges will be made. You can safely simulate payment!</span>
            </div>

            {/* Payment Method Cards */}
            <div className="payment-methods-grid">
              <div
                className={`payment-method-card ${method === 'UPI' ? 'selected' : ''}`}
                onClick={() => setMethod('UPI')}
              >
                <QrCode className="method-icon" />
                <span className="method-title">UPI QR / App</span>
              </div>

              <div
                className={`payment-method-card ${method === 'Card' ? 'selected' : ''}`}
                onClick={() => setMethod('Card')}
              >
                <CreditCard className="method-icon" />
                <span className="method-title">Debit / Card</span>
              </div>

              <div
                className={`payment-method-card ${method === 'Cash on Pickup' ? 'selected' : ''}`}
                onClick={() => setMethod('Cash on Pickup')}
              >
                <Banknote className="method-icon" />
                <span className="method-title">Cash on Pickup</span>
              </div>
            </div>

            {/* UPI Option Form */}
            {method === 'UPI' && (
              <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'inline-block', background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--border)', boxShadow: 'var(--shadow-sm)', marginBottom: '0.75rem' }}>
                  {/* Clean SVG Mock QR Code */}
                  <svg width="150" height="150" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="white" />
                    <rect x="10" y="10" width="30" height="30" stroke="#0f172a" strokeWidth="6" fill="white" />
                    <rect x="20" y="20" width="10" height="10" fill="#0f172a" />
                    <rect x="60" y="10" width="30" height="30" stroke="#0f172a" strokeWidth="6" fill="white" />
                    <rect x="70" y="20" width="10" height="10" fill="#0f172a" />
                    <rect x="10" y="60" width="30" height="30" stroke="#0f172a" strokeWidth="6" fill="white" />
                    <rect x="20" y="70" width="10" height="10" fill="#0f172a" />
                    <rect x="46" y="14" width="8" height="8" fill="#ea580c" />
                    <rect x="46" y="28" width="8" height="8" fill="#0f172a" />
                    <rect x="46" y="64" width="8" height="8" fill="#0f172a" />
                    <rect x="64" y="46" width="8" height="8" fill="#ea580c" />
                    <rect x="78" y="60" width="12" height="12" fill="#0f172a" />
                    <rect x="60" y="78" width="14" height="12" fill="#0f172a" />
                    <circle cx="50" cy="50" r="7" fill="#ea580c" />
                  </svg>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Scan with GPay, PhonePe, or Paytm • Expires in: <strong style={{ color: 'var(--primary)' }}>{formatTimer(timerSeconds)}</strong>
                </div>

                <div className="form-group" style={{ textAlign: 'left', marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Or Pay via UPI ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="example@upi"
                  />
                </div>
              </div>
            )}

            {/* Card Option Form */}
            {method === 'Card' && (
              <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    placeholder="Student Name"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Valid Thru</label>
                    <input
                      type="text"
                      className="form-input"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">CVV</label>
                    <input
                      type="password"
                      maxLength="3"
                      className="form-input"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cash on Pickup Form */}
            {method === 'Cash on Pickup' && (
              <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ width: '50px', height: '50px', background: '#e0f2fe', color: '#0284c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <Banknote size={26} />
                </div>
                <h4 style={{ marginBottom: '0.4rem' }}>Pay at Canteen Counter</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  You will pay <strong>₹{totalAmount}</strong> in cash at the counter when collecting your meal tray.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={handleProcessPayment}
            >
              {method === 'Cash on Pickup'
                ? `Confirm Order (Pay ₹${totalAmount} on Pickup)`
                : `Simulate Successful ₹${totalAmount} Payment`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
