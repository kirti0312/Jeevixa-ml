import React, { useState, useEffect } from 'react';
import axios from 'axios';

const translations = {
  en: {
    title: 'Medicine Tracker',
    subtitle: 'Track expiry dates, waste and environmental impact',
    expired: 'Expired', expiringSoon: 'Expiring Soon',
    safe: 'Safe', totalWaste: 'Total Waste Cost',
    co2Impact: 'CO₂ Impact', allMeds: 'All Medicines',
    name: 'Medicine', ward: 'Ward', expiry: 'Expiry Date',
    qty: 'Quantity', status: 'Status', cost: 'Waste Cost',
    days: 'days left', daysAgo: 'days ago',
    addMedicine: 'Add Medicine', medName: 'Medicine Name',
    quantity: 'Quantity', expiryDate: 'Expiry Date',
    category: 'Category', costPerUnit: 'Cost Per Unit (₹)',
    wardName: 'Ward', add: 'Add Medicine',
  },
  hi: {
    title: 'दवा ट्रैकर',
    subtitle: 'एक्सपायरी तारीख, कचरा और पर्यावरणीय प्रभाव ट्रैक करें',
    expired: 'एक्सपायर', expiringSoon: 'जल्द एक्सपायर',
    safe: 'सुरक्षित', totalWaste: 'कुल कचरा लागत',
    co2Impact: 'CO₂ प्रभाव', allMeds: 'सभी दवाएं',
    name: 'दवा', ward: 'वार्ड', expiry: 'एक्सपायरी तारीख',
    qty: 'मात्रा', status: 'स्थिति', cost: 'कचरा लागत',
    days: 'दिन बचे', daysAgo: 'दिन पहले',
    addMedicine: 'दवा जोड़ें', medName: 'दवा का नाम',
    quantity: 'मात्रा', expiryDate: 'एक्सपायरी तारीख',
    category: 'श्रेणी', costPerUnit: 'प्रति इकाई लागत (₹)',
    wardName: 'वार्ड', add: 'दवा जोड़ें',
  }
};

export default function MedicineTracker({ language }) {
  const t = translations[language] || translations.en;
  const [medicines, setMedicines] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', quantity: '', expiryDate: '',
    ward: '', category: 'Analgesic', costPerUnit: '',
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/medicine');
      setMedicines(res.data.medicines);
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.quantity || !form.expiryDate || !form.ward) return;
    setAdding(true);
    try {
      await axios.post('http://localhost:5000/api/medicine', {
        ...form,
        quantity: parseInt(form.quantity),
        costPerUnit: parseFloat(form.costPerUnit) || 0,
      });
      setForm({ name: '', quantity: '', expiryDate: '', ward: '', category: 'Analgesic', costPerUnit: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'expired') return '#6B1E2E';
    if (status === 'expiring') return '#8B6000';
    return '#2D6A2D';
  };

  const getStatusBg = (status) => {
    if (status === 'expired') return 'rgba(107,30,46,0.08)';
    if (status === 'expiring') return 'rgba(139,96,0,0.08)';
    return 'rgba(45,106,45,0.08)';
  };

  const getStatusLabel = (status) => {
    if (status === 'expired') return t.expired;
    if (status === 'expiring') return t.expiringSoon;
    return t.safe;
  };

  const filteredMeds = filter === 'all'
    ? medicines
    : medicines.filter(m => m.status === filter);

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.875rem',
    border: '1px solid var(--border)', borderRadius: '8px',
    background: 'var(--bg-primary)', color: 'var(--text-primary)',
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem',
    outline: 'none', transition: 'all 0.2s ease',
  };

  const labelStyle = {
    fontSize: '0.65rem', color: 'var(--text-muted)',
    letterSpacing: '1px', textTransform: 'uppercase',
    display: 'block', marginBottom: '0.35rem',
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg-primary)',
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.25rem', color: '#6B1E2E',
      }}>
        ✦ Loading Medicine Data...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      padding: '2rem', fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.75rem', color: 'var(--text-primary)',
          }}>
            {t.title}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {t.subtitle}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: '#6B1E2E', color: '#FAF7F2',
            border: 'none', padding: '0.75rem 1.25rem',
            borderRadius: '10px', fontSize: '0.875rem',
            fontWeight: '500', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => e.target.style.background = '#4A0F1E'}
          onMouseLeave={e => e.target.style.background = '#6B1E2E'}
        >
          + {t.addMedicine}
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          gap: '1rem', marginBottom: '1.5rem',
        }}>
          {[
            { label: 'Total Medicines', value: summary.totalMedicines, color: '#1E3A6B', bg: 'rgba(30,58,107,0.08)' },
            { label: t.expired, value: summary.expiredCount, color: '#6B1E2E', bg: 'rgba(107,30,46,0.08)' },
            { label: t.expiringSoon, value: summary.expiringSoonCount, color: '#8B6000', bg: 'rgba(139,96,0,0.08)' },
            { label: t.totalWaste, value: `₹${parseFloat(summary.totalWasteCost).toLocaleString()}`, color: '#6B1E2E', bg: 'rgba(107,30,46,0.08)' },
          ].map((s, i) => (
            <div key={i} style={{
              background: s.bg, border: `1px solid ${s.color}22`,
              borderRadius: '12px', padding: '1.25rem',
              textAlign: 'center', animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.75rem', fontWeight: '700', color: s.color,
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CO2 Impact Banner */}
      {summary && (
        <div style={{
          background: 'rgba(45,106,45,0.06)',
          border: '1px solid rgba(45,106,45,0.15)',
          borderRadius: '12px', padding: '1rem 1.5rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <span style={{ fontSize: '1.5rem' }}>🌿</span>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#2D6A2D' }}>
              {t.co2Impact}: {summary.totalCo2Impact} kg CO₂ from pharmaceutical waste
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Proper disposal and redistribution can reduce this significantly
            </div>
          </div>
        </div>
      )}

      {/* Add Medicine Form */}
      {showForm && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem',
          marginBottom: '1.5rem', animation: 'fadeUp 0.3s ease both',
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem', color: 'var(--text-primary)',
            marginBottom: '1rem',
          }}>
            {t.addMedicine}
          </h3>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: '1rem', marginBottom: '1rem',
          }}>
            <div>
              <label style={labelStyle}>{t.medName}</label>
              <input
                style={inputStyle} placeholder="e.g. Paracetamol 500mg"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                onFocus={e => { e.target.style.borderColor = '#C4956A'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t.quantity}</label>
              <input
                style={inputStyle} type="number" placeholder="e.g. 500"
                value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })}
                onFocus={e => { e.target.style.borderColor = '#C4956A'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t.expiryDate}</label>
              <input
                style={inputStyle} type="date"
                value={form.expiryDate}
                onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                onFocus={e => { e.target.style.borderColor = '#C4956A'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t.wardName}</label>
              <input
                style={inputStyle} placeholder="e.g. ICU"
                value={form.ward}
                onChange={e => setForm({ ...form, ward: e.target.value })}
                onFocus={e => { e.target.style.borderColor = '#C4956A'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t.category}</label>
              <select
                style={inputStyle}
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                {['Analgesic', 'Antibiotic', 'IV Fluid', 'Hormone', 'Steroid', 'Emergency Drug', 'PPE', 'Consumable', 'Other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t.costPerUnit}</label>
              <input
                style={inputStyle} type="number" placeholder="e.g. 25"
                value={form.costPerUnit}
                onChange={e => setForm({ ...form, costPerUnit: e.target.value })}
                onFocus={e => { e.target.style.borderColor = '#C4956A'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleAdd}
              disabled={adding}
              style={{
                background: '#6B1E2E', color: '#FAF7F2',
                border: 'none', padding: '0.75rem 1.5rem',
                borderRadius: '8px', fontSize: '0.875rem',
                cursor: adding ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: '500', transition: 'all 0.3s ease',
              }}
            >
              {adding ? 'Adding...' : `+ ${t.add}`}
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                background: 'transparent', color: 'var(--text-muted)',
                border: '1px solid var(--border)', padding: '0.75rem 1.5rem',
                borderRadius: '8px', fontSize: '0.875rem',
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { value: 'all', label: t.allMeds },
          { value: 'expired', label: t.expired },
          { value: 'expiring', label: t.expiringSoon },
          { value: 'ok', label: t.safe },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: '20px',
              border: `1px solid ${filter === f.value ? '#6B1E2E' : 'var(--border)'}`,
              background: filter === f.value ? 'rgba(107,30,46,0.08)' : 'transparent',
              color: filter === f.value ? '#6B1E2E' : 'var(--text-muted)',
              fontSize: '0.8rem', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s ease', fontWeight: '500',
            }}
          >
            {f.label}
            {f.value !== 'all' && (
              <span style={{
                marginLeft: '6px', fontSize: '0.65rem',
                background: filter === f.value ? '#6B1E2E' : 'var(--border)',
                color: filter === f.value ? '#FAF7F2' : 'var(--text-muted)',
                padding: '1px 6px', borderRadius: '10px',
              }}>
                {medicines.filter(m => m.status === f.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Medicine Table */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '16px', overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {[t.name, t.ward, t.qty, t.expiry, t.status, t.cost, t.co2Impact].map(h => (
                <th key={h} style={{
                  padding: '0.875rem 1rem', textAlign: 'left',
                  fontSize: '0.65rem', color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '1px',
                  fontWeight: '500', borderBottom: '1px solid var(--border)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMeds.map((med, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.2s ease',
                  background: med.isExpired
                    ? 'rgba(107,30,46,0.02)' : 'transparent',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(107,30,46,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = med.isExpired ? 'rgba(107,30,46,0.02)' : 'transparent'}
              >
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                    {med.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {med.category}
                  </div>
                </td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {med.ward}
                </td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                  {med.quantity}
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                    {new Date(med.expiryDate).toLocaleDateString('en-IN')}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: getStatusColor(med.status),
                  }}>
                    {med.daysUntilExpiry < 0
                      ? `${Math.abs(med.daysUntilExpiry)} ${t.daysAgo}`
                      : `${med.daysUntilExpiry} ${t.days}`}
                  </div>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span style={{
                    fontSize: '0.65rem', padding: '3px 10px',
                    borderRadius: '20px', fontWeight: '500',
                    background: getStatusBg(med.status),
                    color: getStatusColor(med.status),
                    border: `1px solid ${getStatusColor(med.status)}33`,
                  }}>
                    {getStatusLabel(med.status)}
                  </span>
                </td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#6B1E2E', fontWeight: '500' }}>
                  {med.wasteCost > 0 ? `₹${med.wasteCost.toLocaleString()}` : '—'}
                </td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#2D6A2D' }}>
                  {med.co2Impact} kg
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}