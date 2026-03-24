import React, { useState, useEffect } from 'react';
import axios from 'axios';

const translations = {
  en: {
    title: 'Staff Schedule',
    subtitle: 'Manage staff shifts, duty status and fatigue alerts',
    onDuty: 'On Duty', offDuty: 'Off Duty', fatigue: 'Fatigue Alert',
    total: 'Total Staff', department: 'Department', shift: 'Shift',
    hours: 'Hours on Duty', status: 'Status', all: 'All',
    doctors: 'Doctors', nurses: 'Nurses', addStaff: 'Add Staff',
    name: 'Full Name', role: 'Role', phone: 'Phone',
    email: 'Email', shiftStart: 'Shift Start', shiftEnd: 'Shift End',
    specialization: 'Specialization', add: 'Add Staff Member',
    doctor: 'Doctor', nurse: 'Nurse', technician: 'Technician',
  },
  hi: {
    title: 'स्टाफ शेड्यूल',
    subtitle: 'स्टाफ शिफ्ट, ड्यूटी स्थिति और थकान अलर्ट प्रबंधित करें',
    onDuty: 'ड्यूटी पर', offDuty: 'ड्यूटी से बाहर', fatigue: 'थकान अलर्ट',
    total: 'कुल स्टाफ', department: 'विभाग', shift: 'शिफ्ट',
    hours: 'ड्यूटी घंटे', status: 'स्थिति', all: 'सभी',
    doctors: 'डॉक्टर', nurses: 'नर्स', addStaff: 'स्टाफ जोड़ें',
    name: 'पूरा नाम', role: 'भूमिका', phone: 'फोन',
    email: 'ईमेल', shiftStart: 'शिफ्ट शुरू', shiftEnd: 'शिफ्ट समाप्त',
    specialization: 'विशेषज्ञता', add: 'स्टाफ सदस्य जोड़ें',
    doctor: 'डॉक्टर', nurse: 'नर्स', technician: 'तकनीशियन',
  }
};

export default function StaffSchedule({ language }) {
  const t = translations[language] || translations.en;
  const [staff, setStaff] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    name: '', role: 'doctor', department: '',
    phone: '', email: '', shiftStart: '08:00',
    shiftEnd: '20:00', specialization: '',
  });

  useEffect(() => {
    fetchStaff();
    const interval = setInterval(fetchStaff, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get('https://jeevixa-backend-nm1z.onrender.com/api/staff');
      setStaff(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.department || !form.phone) return;
    setAdding(true);
    try {
      await axios.post('https://jeevixa-backend-nm1z.onrender.com/api/staff/add', {
        ...form, hoursOnDuty: 0,
        isOnDuty: true, fatigueAlert: false,
      });
      setForm({
        name: '', role: 'doctor', department: '',
        phone: '', email: '', shiftStart: '08:00',
        shiftEnd: '20:00', specialization: '',
      });
      setShowForm(false);
      fetchStaff();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const getRoleIcon = (role) => {
    if (role === 'doctor') return '🩺';
    if (role === 'nurse') return '💉';
    if (role === 'technician') return '🔬';
    return '👤';
  };

  const getRoleColor = (role) => {
    if (role === 'doctor') return '#1E3A6B';
    if (role === 'nurse') return '#2D6A2D';
    return '#8B6000';
  };

  const filteredStaff = filter === 'all'
    ? staff
    : filter === 'fatigue'
      ? staff.filter(s => s.fatigueAlert)
      : staff.filter(s => s.role === filter);

  const onDutyCount = staff.filter(s => s.isOnDuty).length;
  const fatigueCount = staff.filter(s => s.fatigueAlert).length;
  const doctorCount = staff.filter(s => s.role === 'doctor').length;
  const nurseCount = staff.filter(s => s.role === 'nurse').length;

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
        ✦ Loading Staff Data...
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
          + {t.addStaff}
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: '1rem', marginBottom: '1.5rem',
      }}>
        {[
          { label: t.total, value: staff.length, color: '#1E3A6B', bg: 'rgba(30,58,107,0.08)' },
          { label: t.onDuty, value: onDutyCount, color: '#2D6A2D', bg: 'rgba(45,106,45,0.08)' },
          { label: t.fatigue, value: fatigueCount, color: '#6B1E2E', bg: 'rgba(107,30,46,0.08)' },
          { label: t.doctors, value: doctorCount, color: '#8B6000', bg: 'rgba(139,96,0,0.08)' },
        ].map((s, i) => (
          <div key={i} style={{
            background: s.bg, border: `1px solid ${s.color}22`,
            borderRadius: '12px', padding: '1.25rem',
            textAlign: 'center', animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
          }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem', fontWeight: '700', color: s.color,
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Fatigue Alert Banner */}
      {fatigueCount > 0 && (
        <div style={{
          background: 'rgba(107,30,46,0.06)',
          border: '1px solid rgba(107,30,46,0.2)',
          borderRadius: '12px', padding: '1rem 1.5rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
          marginBottom: '1.5rem',
          animation: 'fadeUp 0.5s ease both',
        }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6B1E2E' }}>
              {fatigueCount} staff member{fatigueCount > 1 ? 's' : ''} showing fatigue alerts
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Staff on duty for 10+ hours — consider shift rotation to prevent medical errors
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Form */}
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
            {t.addStaff}
          </h3>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: '1rem', marginBottom: '1rem',
          }}>
            <div>
              <label style={labelStyle}>{t.name}</label>
              <input
                style={inputStyle} placeholder="Dr. Full Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#C4956A'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>{t.role}</label>
              <select
                style={inputStyle}
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="doctor">{t.doctor}</option>
                <option value="nurse">{t.nurse}</option>
                <option value="technician">{t.technician}</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t.department}</label>
              <input
                style={inputStyle} placeholder="e.g. Cardiology"
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#C4956A'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>{t.phone}</label>
              <input
                style={inputStyle} placeholder="Phone number"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#C4956A'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>{t.shiftStart}</label>
              <input
                style={inputStyle} type="time"
                value={form.shiftStart}
                onChange={e => setForm({ ...form, shiftStart: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>{t.shiftEnd}</label>
              <input
                style={inputStyle} type="time"
                value={form.shiftEnd}
                onChange={e => setForm({ ...form, shiftEnd: e.target.value })}
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
                fontWeight: '500',
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
          { value: 'all', label: t.all },
          { value: 'doctor', label: t.doctors },
          { value: 'nurse', label: t.nurses },
          { value: 'fatigue', label: t.fatigue },
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
          </button>
        ))}
      </div>

      {/* Staff Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
      }}>
        {filteredStaff.map((member, i) => (
          <div key={i} style={{
            background: 'var(--bg-card)',
            border: `1px solid ${member.fatigueAlert ? 'rgba(107,30,46,0.3)' : 'var(--border)'}`,
            borderRadius: '16px', padding: '1.25rem',
            transition: 'all 0.3s ease',
            animation: `fadeUp 0.5s ease ${i * 0.05}s both`,
            position: 'relative', overflow: 'hidden',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(107,30,46,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
              background: member.fatigueAlert
                ? '#6B1E2E'
                : getRoleColor(member.role),
            }} />

            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: '0.875rem', marginBottom: '1rem',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: `${getRoleColor(member.role)}15`,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.25rem',
                flexShrink: 0,
              }}>
                {getRoleIcon(member.role)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.875rem', fontWeight: '600',
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap', overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {member.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {member.specialization || member.role} · {member.department}
                </div>
              </div>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: member.isOnDuty ? '#2D6A2D' : '#9B7B6A',
                flexShrink: 0,
              }} />
            </div>

            {/* Details */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem', marginBottom: '0.875rem',
            }}>
              {[
                { label: 'Shift', value: `${member.shiftStart}–${member.shiftEnd}` },
                { label: 'Hours', value: `${member.hoursOnDuty}h on duty` },
              ].map((item, j) => (
                <div key={j} style={{
                  padding: '0.5rem 0.75rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Status */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.65rem', padding: '3px 10px',
                borderRadius: '20px', fontWeight: '500',
                background: member.isOnDuty
                  ? 'rgba(45,106,45,0.1)' : 'rgba(155,123,106,0.1)',
                color: member.isOnDuty ? '#2D6A2D' : '#9B7B6A',
                border: `1px solid ${member.isOnDuty ? '#2D6A2D' : '#9B7B6A'}22`,
              }}>
                {member.isOnDuty ? `● ${t.onDuty}` : `○ ${t.offDuty}`}
              </span>
              {member.fatigueAlert && (
                <span style={{
                  fontSize: '0.65rem', padding: '3px 10px',
                  borderRadius: '20px', fontWeight: '500',
                  background: 'rgba(107,30,46,0.1)',
                  color: '#6B1E2E',
                  border: '1px solid rgba(107,30,46,0.2)',
                  animation: 'pulse 2s infinite',
                }}>
                  ⚠️ {t.fatigue}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}