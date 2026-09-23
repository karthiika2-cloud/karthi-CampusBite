import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AuthModal from './pages/AuthModal';

import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackOrderPage from './pages/TrackOrderPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMenu from './pages/admin/AdminMenu';

import { Sparkles, Shield, User, Utensils } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [trackOrderNumber, setTrackOrderNumber] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState('login');
  const [toasts, setToasts] = useState([]);

  const { user, isAdmin, loginAsStudent, loginAsAdmin } = useAuth();

  // Helper for toasts
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync with window hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash.startsWith('track/')) {
        const orderNum = hash.split('/')[1];
        setTrackOrderNumber(orderNum);
        setActiveTab('track');
      } else if (hash === 'menu' || hash === 'cart' || hash === 'checkout' || hash === 'orders' || hash === 'track' || hash === 'admin' || hash === 'admin-dashboard' || hash === 'admin-orders' || hash === 'admin-menu') {
        if (hash === 'admin') {
          setActiveTab('admin-dashboard');
        } else {
          setActiveTab(hash);
        }
      } else {
        setActiveTab('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on initial mount
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when tab changes
  const navigateTo = (tab) => {
    setActiveTab(tab);
    window.location.hash = `#/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackSpecificOrder = (orderNum) => {
    setTrackOrderNumber(orderNum);
    navigateTo(`track/${orderNum}`);
  };

  const handleOrderCreated = (order) => {
    setTrackOrderNumber(order.order_number);
    addToast(`Order #${order.order_number} confirmed! Sent to kitchen.`, 'success');
    navigateTo(`track/${order.order_number}`);
  };

  const handleOpenAuth = (defaultTab = 'login') => {
    setAuthModalDefaultTab(defaultTab);
    setIsAuthModalOpen(true);
  };

  // Guard for admin tabs
  const renderContent = () => {
    if (activeTab.startsWith('admin') && !isAdmin) {
      return (
        <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '440px', margin: '0 auto', background: 'white', padding: '3rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <Shield size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.45rem', marginBottom: '0.5rem' }}>Staff Portal Authentication</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Please sign in with authorized canteen staff credentials to access kitchen and menu management.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => handleOpenAuth('admin')}
              >
                Sign In as Canteen Staff
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={async () => {
                  await loginAsAdmin();
                  addToast('Switched to Canteen Admin role!', 'info');
                }}
              >
                ⚡ One-Click Demo Admin Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            onNavigate={navigateTo}
            onAddToCartToast={(msg) => addToast(msg, 'success')}
          />
        );
      case 'menu':
        return (
          <MenuPage
            onAddToCartToast={(msg) => addToast(msg, 'success')}
          />
        );
      case 'cart':
        return (
          <CartPage
            onNavigate={navigateTo}
            onOpenAuthModal={() => handleOpenAuth('login')}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            onNavigate={navigateTo}
            onOrderCreated={handleOrderCreated}
          />
        );
      case 'track':
        return (
          <TrackOrderPage
            initialOrderNumber={trackOrderNumber}
            onNavigate={navigateTo}
          />
        );
      case 'orders':
        return (
          <OrderHistoryPage
            onTrackOrder={handleTrackSpecificOrder}
            onNavigate={navigateTo}
            onOpenAuthModal={() => handleOpenAuth('login')}
          />
        );
      case 'admin-dashboard':
        return <AdminDashboard onNavigateTab={navigateTo} />;
      case 'admin-orders':
        return (
          <AdminOrders
            onStatusUpdatedToast={(msg) => addToast(msg, 'info')}
          />
        );
      case 'admin-menu':
        return (
          <AdminMenu
            onToast={(msg) => addToast(msg, 'success')}
          />
        );
      default:
        return <HomePage onNavigate={navigateTo} onAddToCartToast={(msg) => addToast(msg, 'success')} />;
    }
  };

  return (
    <div className="app-container">
      {/* Interactive Bootcamp Demo Switcher Ribbon */}
      <div
        style={{
          background: '#1e293b',
          color: '#cbd5e1',
          fontSize: '0.78rem',
          padding: '0.4rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          borderBottom: '1px solid #334155'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={14} color="#f59e0b" />
          <span><strong>Bootcamp Demo Switcher:</strong> Quick toggle roles:</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={async () => {
              await loginAsStudent();
              addToast('Logged in as Student: Rahul Sharma', 'info');
              navigateTo('menu');
            }}
            style={{
              background: user?.email === 'rahul@campus.edu' ? 'var(--primary)' : '#334155',
              color: 'white',
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            🧑‍🎓 Student Mode (Rahul)
          </button>

          <button
            onClick={async () => {
              await loginAsAdmin();
              addToast('Logged in as Canteen Manager (Admin)', 'info');
              navigateTo('admin-dashboard');
            }}
            style={{
              background: isAdmin ? 'var(--secondary)' : '#334155',
              color: 'white',
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            👨‍🍳 Admin Kitchen Portal
          </button>
        </div>
      </div>

      <Navbar
        onOpenAuthModal={() => handleOpenAuth('login')}
        activeTab={activeTab}
        setActiveTab={navigateTo}
      />

      <main className="main-content">
        {renderContent()}
      </main>

      <Footer
        onAdminClick={() => {
          if (isAdmin) {
            navigateTo('admin-dashboard');
          } else {
            handleOpenAuth('admin');
          }
        }}
      />

      <Toast toasts={toasts} onDismiss={removeToast} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalDefaultTab}
        onAuthSuccess={() => addToast('Authentication successful!', 'success')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
