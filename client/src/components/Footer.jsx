import React from 'react';
import { Utensils, Clock, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onAdminClick }) {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '3.5rem 0 2rem', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'white', marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800 }}>
              <div style={{ width: '36px', height: '36px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Utensils size={18} />
              </div>
              Campus<span style={{ color: 'var(--primary)' }}>Bite</span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              The digital smart canteen food ordering platform for our campus. Order fresh meals, skip the rush, pay smoothly, and enjoy hot food on time.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
              <ShieldCheck size={16} color="var(--secondary)" />
              <span>Campus Health & Hygiene Certified</span>
            </div>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '1rem' }}>Canteen Operating Hours</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--primary)" />
                <span><strong>Mon - Fri:</strong> 8:00 AM – 8:30 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--primary)" />
                <span><strong>Saturday:</strong> 8:30 AM – 6:00 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                <Clock size={16} />
                <span><strong>Sunday:</strong> Breakfast Only (8 AM - 12 PM)</span>
              </div>
            </div>
          </div>

          {/* Pickup Counters */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '1rem' }}>Active Pickup Counters</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Counter 1:</strong> Main Hot Meals & South Indian Breakfast</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Counter 2:</strong> Fast Food, Sandwiches & Snacks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Counter 3:</strong> Fresh Juices, Milkshakes & Filter Coffee</span>
              </div>
            </div>
          </div>

          {/* Quick Staff Access */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '1rem' }}>Campus Portal</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              Are you a member of canteen management or kitchen staff?
            </p>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={onAdminClick}
              style={{ color: 'white', borderColor: 'var(--primary)' }}
            >
              Access Admin Kitchen Dashboard
            </button>
            <div style={{ marginTop: '1.25rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={14} />
              <span>Campus Helpline: Ext. 4022</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem' }}>
          <div>
            © {new Date().getFullYear()} CampusBite System. College Smart Canteen Initiative.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Built for college students with <Heart size={14} color="var(--primary)" fill="var(--primary)" />
          </div>
        </div>
      </div>
    </footer>
  );
}
