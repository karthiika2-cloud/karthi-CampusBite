import React, { useState, useEffect } from 'react';
import { Search, Filter, Leaf, Coffee, Pizza, UtensilsCrossed, Sparkles, X } from 'lucide-react';
import FoodCard from '../components/FoodCard';

const CATEGORIES = ['All', 'Breakfast', 'Meals', 'Snacks', 'Beverages', 'Fast Food'];

export default function MenuPage({ onAddToCartToast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, [selectedCategory, vegOnly]);

  const fetchMenu = () => {
    setLoading(true);
    let url = `/api/menu?category=${encodeURIComponent(selectedCategory)}`;
    if (vegOnly) {
      url += '&vegOnly=true';
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setItems(data.items || []);
      })
      .catch(err => console.error('Failed to fetch menu', err))
      .finally(() => setLoading(false));
  };

  // Client-side search filtering for instant response
  const filteredItems = items.filter(item => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      item.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <div className="section-header">
        <span className="section-tag">Campus Canteen Menu</span>
        <h1 className="section-title">Fresh Daily Kitchen</h1>
        <p className="section-subtitle">
          Prepared fresh daily at college canteen counters. Order early to guarantee hot availability!
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filters-bar">
        <div className="search-and-toggles">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search idli, dosa, biryani, coffee, samosa..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Veg Only Toggle Button */}
          <button
            type="button"
            className={`diet-toggle-btn ${vegOnly ? 'active' : ''}`}
            onClick={() => setVegOnly(!vegOnly)}
          >
            <div className={`diet-badge veg`} style={{ width: '18px', height: '18px' }}>
              <div className="diet-symbol" style={{ width: '7px', height: '7px' }}></div>
            </div>
            <span>Pure Veg Only</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <span>
          Showing <strong>{filteredItems.length}</strong> items in <strong>{selectedCategory}</strong>
          {vegOnly ? ' (Veg Only)' : ''}
        </span>
      </div>

      {/* Food Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading appetizing menu items...
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <UtensilsCrossed size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem', display: 'block' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>No dishes match your filter</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Try clearing your search query or switching categories.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setVegOnly(false);
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="food-grid">
          {filteredItems.map(food => (
            <FoodCard
              key={food.id}
              food={food}
              onAddToCartToast={onAddToCartToast}
            />
          ))}
        </div>
      )}
    </div>
  );
}
