import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Check, X, Image, AlertTriangle, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['Breakfast', 'Meals', 'Snacks', 'Beverages', 'Fast Food'];

const PHOTO_PRESETS = [
  { name: 'South Indian Idli/Dosa', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80' },
  { name: 'Crispy Butter Dosa', url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80' },
  { name: 'Veg Meals Thali', url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80' },
  { name: 'Fried Rice Wok', url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80' },
  { name: 'Punjabi Samosa', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80' },
  { name: 'Grilled Sandwich', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80' },
  { name: 'Fresh Citrus Juice', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80' },
  { name: 'Masala Chai', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80' },
  { name: 'Filter Coffee', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80' },
  { name: 'Burger & Fries', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80' },
  { name: 'Chicken Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80' },
  { name: 'Paneer Masala', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80' }
];

export default function AdminMenu({ onToast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Breakfast');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [availability, setAvailability] = useState(true);
  const [prepTime, setPrepTime] = useState(10);
  const [formError, setFormError] = useState('');

  const { token } = useAuth();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoading(true);
    fetch('/api/menu?allStatus=true')
      .then(res => res.json())
      .then(data => {
        setItems(data.items || []);
      })
      .catch(err => console.error('Failed to load menu items', err))
      .finally(() => setLoading(false));
  };

  const handleOpenAddModal = () => {
    setSelectedItem(null);
    setName('');
    setCategory('Breakfast');
    setDescription('');
    setPrice('');
    setImage(PHOTO_PRESETS[0].url);
    setIsVeg(true);
    setAvailability(true);
    setPrepTime(10);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setName(item.name);
    setCategory(item.category);
    setDescription(item.description || '');
    setPrice(item.price);
    setImage(item.image || '');
    setIsVeg(item.is_veg === 1);
    setAvailability(item.availability === 1);
    setPrepTime(item.preparation_time || 10);
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Food name is required');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setFormError('Please enter a valid positive price');
      return;
    }

    const payload = {
      name: name.trim(),
      category,
      description: description.trim(),
      price: parseFloat(price),
      image: image.trim(),
      is_veg: isVeg ? 1 : 0,
      availability: availability ? 1 : 0,
      preparation_time: parseInt(prepTime) || 10
    };

    try {
      const url = selectedItem ? `/api/menu/${selectedItem.id}` : '/api/menu';
      const method = selectedItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save food item');

      setModalOpen(false);
      fetchItems();
      if (onToast) onToast(selectedItem ? `Updated "${name}"!` : `Added "${name}" to canteen menu!`);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const res = await fetch(`/api/menu/${item.id}/availability`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to toggle availability');

      setItems(prev =>
        prev.map(i => (i.id === item.id ? { ...i, availability: data.availability } : i))
      );
      if (onToast) onToast(data.message);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    try {
      const res = await fetch(`/api/menu/${selectedItem.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete item');

      setDeleteModalOpen(false);
      fetchItems();
      if (onToast) onToast(data.message);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="section-tag">Canteen Catalog</span>
          <h1 className="section-title">Menu Management</h1>
          <p className="section-subtitle">
            Add new campus dishes, edit prices, update food photos, and toggle stock availability in real-time.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} /> Add New Food Item
        </button>
      </div>

      {/* Menu Management Table */}
      <div className="table-card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Food Item</th>
                <th>Category</th>
                <th>Type</th>
                <th>Price</th>
                <th>Prep Time</th>
                <th>Availability</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                    Loading canteen menu...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                    No food items found. Add your first canteen item above!
                  </td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700 }}>{item.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="category-pill" style={{ padding: '0.2rem 0.6rem', fontSize: '0.78rem' }}>
                        {item.category}
                      </span>
                    </td>

                    <td>
                      <div className={`diet-badge ${item.is_veg === 1 ? 'veg' : 'non-veg'}`} title={item.is_veg === 1 ? 'Vegetarian' : 'Non-Vegetarian'}>
                        <div className="diet-symbol"></div>
                      </div>
                    </td>

                    <td>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--dark)' }}>₹{item.price}</strong>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.preparation_time || 10} mins</span>
                    </td>

                    <td>
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.3rem 0.7rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: item.availability === 1 ? '#dcfce7' : '#fee2e2',
                          color: item.availability === 1 ? '#15803d' : '#b91c1c'
                        }}
                      >
                        {item.availability === 1 ? (
                          <>
                            <Check size={12} /> In Stock
                          </>
                        ) : (
                          <>
                            <X size={12} /> Out of Stock
                          </>
                        )}
                      </button>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEditModal(item)}
                          title="Edit food details"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--danger)', borderColor: '#fca5a5' }}
                          onClick={() => {
                            setSelectedItem(item);
                            setDeleteModalOpen(true);
                          }}
                          title="Delete food"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Food Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.45rem', marginBottom: '0.25rem' }}>
              {selectedItem ? 'Edit Food Item' : 'Add New Food to Canteen'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Fill in details below. Changes reflect on the student menu immediately.
            </p>

            {formError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveItem}>
              <div className="form-group">
                <label className="form-label">Food Dish Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Masala Dosa with Sambar"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹ INR)</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    className="form-input"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="e.g. 40"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Dietary Type</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                    <button
                      type="button"
                      className={`btn btn-sm ${isVeg ? 'btn-success' : 'btn-secondary'}`}
                      style={{ flex: 1 }}
                      onClick={() => setIsVeg(true)}
                    >
                      🌱 Pure Veg
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${!isVeg ? 'btn-danger' : 'btn-secondary'}`}
                      style={{ flex: 1 }}
                      onClick={() => setIsVeg(false)}
                    >
                      🍗 Non-Veg
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Est. Prep Time (mins)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={prepTime}
                    onChange={e => setPrepTime(e.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Description</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Crispy, fragrant, served with chutneys..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Food Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="https://..."
                />

                {/* Preset image picker */}
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Quick presets for demo testing:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {PHOTO_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                        onClick={() => setImage(p.url)}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0 1.5rem' }}>
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={availability}
                  onChange={e => setAvailability(e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <label htmlFor="availCheck" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                  Mark item as In-Stock and available to order today
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedItem ? 'Save Changes' : 'Add Food Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {deleteModalOpen && selectedItem && (
        <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', background: '#fee2e2', borderRadius: '50%', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <AlertTriangle size={28} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Delete "{selectedItem.name}"?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              This will remove the item from the canteen menu catalog permanently.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteItem}>
                Yes, Delete Food
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
