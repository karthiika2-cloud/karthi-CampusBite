import React, { useEffect, useState } from 'react';
import { ArrowRight, Flame, Clock, Sparkles, ShoppingBag, ShieldCheck, Zap, ChevronRight, Award } from 'lucide-react';
import FoodCard from '../components/FoodCard';

export default function HomePage({ onNavigate, onAddToCartToast }) {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/menu?category=All')
      .then(res => res.json())
      .then(data => {
        // Select top 6 popular items
        const items = data.items || [];
        setFeaturedItems(items.slice(0, 6));
      })
      .catch(err => console.error('Error fetching featured items', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles size={16} /> College Smart Canteen Platform
              </div>

              <h1 className="hero-title">
                Order Food. <br />
                <span className="highlight">Skip the Queue.</span>
              </h1>

              <p className="hero-subtitle">
                No more waiting in long lines between classes. Browse the hot campus menu, order in seconds, pay smoothly, and pick up your hot food right when it's ready.
              </p>

              <div className="hero-actions">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => onNavigate('menu')}
                >
                  <ShoppingBag size={20} /> Browse Canteen Menu
                </button>

                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => onNavigate('track')}
                >
                  <Clock size={20} /> Track Active Order
                </button>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">~12 min</span>
                  <span className="stat-label">Average Prep Time</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">3</span>
                  <span className="stat-label">Express Counters</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Fresh & Hygienic</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Imagery */}
            <div className="hero-visual">
              <div className="hero-card-stack">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"
                  alt="Delicious campus food"
                  className="hero-main-img"
                />

                {/* Floating Micro Card 1 */}
                <div className="floating-pill top-left">
                  <div style={{ width: '36px', height: '36px', background: '#dcfce7', borderRadius: '50%', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Express Pickup</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ready in 8 mins</div>
                  </div>
                </div>

                {/* Floating Micro Card 2 */}
                <div className="floating-pill bottom-right">
                  <div style={{ width: '36px', height: '36px', background: '#ffedd5', borderRadius: '50%', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Flame size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Hot Butter Dosa</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹40 • Most Popular</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How CampusBite Works Section */}
      <section style={{ padding: '4rem 0', background: 'white', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">Fast & Simple</span>
            <h2 className="section-title">How CampusBite Works</h2>
            <p className="section-subtitle">Get your favorite canteen food in three straightforward steps</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginTop: '2.5rem' }}>
            {/* Step 1 */}
            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#ffedd5', color: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.25rem', fontWeight: 800 }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Choose Your Food</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Browse breakfast, meals, snacks, and fresh beverages with live pricing, photo previews, and dietary tags.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#e0f2fe', color: '#0284c7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.25rem', fontWeight: 800 }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Instant Simulated Pay</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Pay seamlessly with mock UPI QR, card, or choose Cash on Pickup. Receive your unique digital Order ID instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#dcfce7', color: '#16a34a', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.25rem', fontWeight: 800 }}>
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Track & Collect</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Watch live kitchen updates from Order Received to Ready for Pickup. Head to the counter and collect hot food!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tag">Today's Specials</span>
              <h2 className="section-title">Campus Favorites</h2>
              <p className="section-subtitle">Top rated dishes freshly cooked at our campus counters</p>
            </div>

            <button
              className="btn btn-outline-primary"
              onClick={() => onNavigate('menu')}
            >
              View Full Menu <ChevronRight size={18} />
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading canteen specials...
            </div>
          ) : (
            <div className="food-grid">
              {featuredItems.map(food => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onAddToCartToast={onAddToCartToast}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Campus Canteen Banner Callout */}
      <section style={{ padding: '0 0 4rem' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              color: 'white',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem 2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2rem',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ maxWidth: '580px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(234, 88, 12, 0.2)', color: '#fdba74', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                <Award size={14} /> Student Favorite
              </div>
              <h3 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>
                Craving Hot Samosas or South Indian Meals?
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6 }}>
                Order from your classroom before the bell rings and skip the canteen lunchtime rush completely!
              </p>
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('menu')}
            >
              Order Food Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
