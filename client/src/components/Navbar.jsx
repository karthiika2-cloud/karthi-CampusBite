import React, { useState } from 'react';
import { Utensils, ShoppingBag, User, LogOut, Shield, Menu as MenuIcon, X, Clock, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenAuthModal, activeTab, setActiveTab }) {
  const { user, logout, isAdmin } = useAuth();
  const { totalCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <a
            href="#/"
            className="brand-logo"
            onClick={(e) => {
              e.preventDefault();
              navigate('home');
            }}
          >
            <div className="brand-icon-wrapper">
              <Utensils size={22} />
            </div>
            <div className="brand-name">
              Campus<span>Bite</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="nav-links">
            <button
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => navigate('home')}
            >
              Home
            </button>
            <button
              className={`nav-link ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => navigate('menu')}
            >
              Menu
            </button>
            {user && (
              <button
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => navigate('orders')}
              >
                My Orders
              </button>
            )}
            <button
              className={`nav-link ${activeTab === 'track' ? 'active' : ''}`}
              onClick={() => navigate('track')}
            >
              <Clock size={16} /> Track Order
            </button>
            {isAdmin && (
              <button
                className={`nav-link ${activeTab.startsWith('admin') ? 'active' : ''}`}
                onClick={() => navigate('admin-dashboard')}
                style={{ color: '#d97706', fontWeight: 700 }}
              >
                <Shield size={16} /> Admin Portal
              </button>
            )}
          </nav>

          {/* Right Actions */}
          <div className="nav-actions">
            {/* Cart Button */}
            <button
              className="cart-btn"
              onClick={() => navigate('cart')}
              aria-label="View tray and checkout"
              title="View tray"
            >
              <ShoppingBag size={20} />
              {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
            </button>

            {/* User Profile or Login */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    lineHeight: 1.2
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--dark)' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <span className={`role-pill ${user.role}`}>
                    {user.role}
                  </span>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={logout}
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={onOpenAuthModal}
              >
                <User size={16} /> Sign In
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', padding: '0.5rem' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1rem 0 1.5rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <button
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => navigate('home')}
            >
              Home
            </button>
            <button
              className={`nav-link ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => navigate('menu')}
            >
              Menu
            </button>
            {user && (
              <button
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => navigate('orders')}
              >
                My Orders
              </button>
            )}
            <button
              className={`nav-link ${activeTab === 'track' ? 'active' : ''}`}
              onClick={() => navigate('track')}
            >
              Track Order Status
            </button>
            <button
              className={`nav-link ${activeTab === 'cart' ? 'active' : ''}`}
              onClick={() => navigate('cart')}
            >
              Food Tray ({totalCount})
            </button>
            {isAdmin && (
              <button
                className={`nav-link ${activeTab.startsWith('admin') ? 'active' : ''}`}
                onClick={() => navigate('admin-dashboard')}
                style={{ color: '#d97706', fontWeight: 700 }}
              >
                Admin Dashboard & Live Kitchen
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
