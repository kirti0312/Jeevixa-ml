import React, { useState, useEffect } from 'react';
import axios from 'axios';

const translations = {
  en: {
    title: 'Patient Management',
    subtitle: 'View, register and manage all hospital patients',
    total: 'Total Patients', admitted: 'Admitted',
    critical: 'Critical', discharged: 'Discharged',
    register: 'Register Patient', name: 'Patient Name',
    age: 'Age', gender: 'Gender', phone: 'Phone',
    condition: 'Condition', severity: 'Severity',
    department: 'Department', doctor: 'Attending Doctor',
    blood: 'Blood Group', discharge: 'Discharge',
    all: 'All', observation: 'Observation',
    male: 'Male', female: 'Female', other: 'Other',
    low: 'Low', medium: 'Medium', high: 'High',
    criticalS: 'Critical', address: 'Address',
  },
  hi: {
    title: 'मरीज प्रबंधन',
    subtitle: 'सभी अस्पताल मरीजों को देखें, पंजीकृत करें और प्रबंधित करें',
    total: 'कुल मरीज', admitted: 'भर्ती',
    critical: 'गंभीर', discharged: 'छुट्टी',
    register: 'मरीज पंजीकृत करें', name: 'मरीज का नाम',
    age: 'उम्र', gender: 'लिंग', phone: 'फोन',
    condition: 'स्थिति', severity: 'गंभीरता',
    department: 'विभाग', doctor: 'डॉक्टर',
    blood: 'रक्त समूह', discharge: 'छुट्टी दें',
    all: 'सभी', observation: 'निगरानी',
    male: 'पुरुष', female: 'महिला', other: 'अन्य',
    low: 'कम', medium: 'मध्यम', high: 'उच्च',
    criticalS: 'गंभीर', address: 'पता',
  }
};

export default function Patients({ language }) {
  const t = translations[language] || translations.en;
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [discharging, setDischarging] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: '', age: '', gender: 'male', phone: '',
    address: '', condition: '', severity: 'medium',
    department: 'General', bloodGroup: 'O+',
    attendingDoctor: '', notes: '',
  });

  useEffect(() => {
    fetchPatients();
    const interval = setInterval(fetchPatients, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients');
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!form.name || !form.age || !form.condition || !form.phone) return;
    setAdding(true);
    try {
      await axios.post('http://localhost:5000/api/patients/register', {
        ...form, age: parseInt(form.age),
      });
      setForm({
        name: '', age: '', gender: 'male', phone: '',
        address: '', condition: '', severity: 'medium',
        department: 'General', bloodGroup: 'O+',
        attendingDoctor: '', notes: '',
      });
      setShowForm(false);
      fetchPatients();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleDischarge = async (id) => {
    setDischarging(id);
    try {
      await axios.put(`http://localhost:5000/api/patients/${id}/discharge`);
      fetchPatients();
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDischarging(null);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity === 'critical') return '#6B1E2E';
    if (severity === 'high') return '#8B6000';
    if (severity === 'medium') return '#1E3A6B';
    return '#2D6A2D';
  };

  const getStatusColor = (status) => {
    if (status === 'critical') return '#6B1E2E';
    if (status === 'admitted') return '#1E3A6B';
    if (status === 'under observation') return '#8B6000';
    return '#2D6A2D';
  };

  const filteredPatients = filter === 'all'
    ? patients
    : patients.filter(p => p.status === filter);

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
        ✦ Loading Patients...
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
          + {t.register}
        </button>
      </div>

      {/* Summary */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: '1rem', marginBottom: '1.5rem',
      }}>
        {[
          { label: t.total, value: patients.length, color: '#1E3A6B', bg: 'rgba(30,58,107,0.08)' },
          { label: t.admitted, value: patients.filter(p => p.status === 'admitted').length, color: '#2D6A2D', bg: 'rgba(45,106,45,0.08)' },
          { label: t.critical, value: patients.filter(p => p.status === 'critical').length, color: '#6B1E2E', bg: 'rgba(107,30,46,0.08)' },
          { label: t.discharged, value: patients.filter(p => p.status === 'discharged').length, color: '#9B7B6A', bg: 'rgba(155,123,106,0.08)' },
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

      {/* Register Form */}
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
            {t.register}
          </h3>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: '1rem', marginBottom: '1rem',
          }}>
            <div>
              <label style={labelStyle}>{t.name}</label>
              <input style={inputStyle} placeholder="Full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#C4956A'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>{t.age}</label>
              <input style={inputStyle} type="number" placeholder="Age"
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#C4956A'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>{t.gender}</label>
              <select style={inputStyle} value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="male">{t.male}</option>
                <option value="female">{t.female}</option>
                <option value="other">{t.other}</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t.phone}</label>
              <input style={inputStyle} placeholder="Phone"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#C4956A'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>{t.condition}</label>
              <input style={inputStyle} placeholder="e.g. Cardiac Arrest"
                value={form.condition}
                onChange={e => setForm({ ...form, condition: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#C4956A'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>{t.severity}</label>
              <select style={inputStyle} value={form.severity}
                onChange={e => setForm({ ...form, severity: e.target.value })}>
                <option value="low">{t.low}</option>
                <option value="medium">{t.medium}</option>
                <option value="high">{t.high}</option>
                <option value="critical">{t.criticalS}</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t.department}</label>
              <select style={inputStyle} value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}>
                {['General', 'Cardiology', 'Orthopedics', 'Pediatrics',
                  'Neurology', 'Oncology', 'Emergency', 'Maternity',
                  'Psychiatry', 'Nephrology'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t.blood}</label>
              <select style={inputStyle} value={form.bloodGroup}
                onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t.doctor}</label>
              <input style={inputStyle} placeholder="Doctor name"
                value={form.attendingDoctor}
                onChange={e => setForm({ ...form, attendingDoctor: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#C4956A'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleRegister}
              disabled={adding}
              style={{
                background: '#6B1E2E', color: '#FAF7F2',
                border: 'none', padding: '0.75rem 1.5rem',
                borderRadius: '8px', fontSize: '0.875rem',
                cursor: adding ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif", fontWeight: '500',
              }}
            >
              {adding ? 'Registering...' : `+ ${t.register}`}
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
          { value: 'admitted', label: t.admitted },
          { value: 'critical', label: t.critical },
          { value: 'under observation', label: t.observation },
          { value: 'discharged', label: t.discharged },
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: selected ? '1fr 360px' : '1fr',
        gap: '1.5rem',
      }}>

        {/* Patients Table */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                {[t.name, t.age, t.condition, t.department, t.severity, 'Status', ''].map(h => (
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
              {filteredPatients.map((p, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.2s ease',
                    cursor: 'pointer',
                    background: selected?._id === p._id
                      ? 'rgba(107,30,46,0.03)' : 'transparent',
                  }}
                  onClick={() => setSelected(selected?._id === p._id ? null : p)}
                  onMouseEnter={e => {
                    if (selected?._id !== p._id)
                      e.currentTarget.style.background = 'rgba(107,30,46,0.02)';
                  }}
                  onMouseLeave={e => {
                    if (selected?._id !== p._id)
                      e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{
                      fontSize: '0.875rem', fontWeight: '500',
                      color: 'var(--text-primary)',
                    }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {p.gender} · {p.bloodGroup}
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {p.age}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                    {p.condition}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {p.department}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{
                      fontSize: '0.65rem', padding: '3px 10px',
                      borderRadius: '20px', fontWeight: '500',
                      background: `${getSeverityColor(p.severity)}15`,
                      color: getSeverityColor(p.severity),
                    }}>
                      {p.severity}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{
                      fontSize: '0.65rem', padding: '3px 10px',
                      borderRadius: '20px', fontWeight: '500',
                      background: `${getStatusColor(p.status)}15`,
                      color: getStatusColor(p.status),
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {p.status !== 'discharged' && (
                      <button
                        onClick={e => { e.stopPropagation(); handleDischarge(p._id); }}
                        disabled={discharging === p._id}
                        style={{
                          background: 'transparent',
                          border: '1px solid #2D6A2D',
                          color: '#2D6A2D', padding: '0.35rem 0.875rem',
                          borderRadius: '8px', fontSize: '0.75rem',
                          cursor: discharging === p._id ? 'not-allowed' : 'pointer',
                          fontFamily: "'DM Sans', sans-serif",
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => {
                          e.target.style.background = '#2D6A2D';
                          e.target.style.color = '#FAF7F2';
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#2D6A2D';
                        }}
                      >
                        {discharging === p._id ? '...' : `✓ ${t.discharge}`}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Patient Detail Panel */}
        {selected && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem',
            height: 'fit-content', position: 'sticky', top: '2rem',
            animation: 'slideIn 0.3s ease both',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginBottom: '1.5rem',
            }}>
              <div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.1rem', color: 'var(--text-primary)',
                }}>
                  {selected.name}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {selected.age} yrs · {selected.gender} · {selected.bloodGroup}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', color: 'var(--text-muted)',
                  fontSize: '1.25rem',
                }}
              >
                ×
              </button>
            </div>

            {/* Status Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: '20px', marginBottom: '1.5rem',
              background: `${getStatusColor(selected.status)}15`,
              border: `1px solid ${getStatusColor(selected.status)}33`,
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: getStatusColor(selected.status),
                animation: selected.status === 'critical' ? 'pulse 1.5s infinite' : 'none',
              }} />
              <span style={{
                fontSize: '0.75rem', color: getStatusColor(selected.status),
                fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                {selected.status}
              </span>
            </div>

            {/* Details */}
            {[
              { label: 'Condition', value: selected.condition, icon: '🏥' },
              { label: 'Severity', value: selected.severity, icon: '⚠️' },
              { label: 'Department', value: selected.department, icon: '🏢' },
              { label: 'Assigned Ward', value: selected.assignedWard || 'Not assigned', icon: '🛏️' },
              { label: 'Assigned Bed', value: selected.assignedBed || 'Not assigned', icon: '🔢' },
              { label: 'Attending Doctor', value: selected.attendingDoctor || 'Not assigned', icon: '🩺' },
              { label: 'Phone', value: selected.phone, icon: '📞' },
              { label: 'Address', value: selected.address || 'Not provided', icon: '📍' },
              { label: 'Admitted', value: new Date(selected.admissionDate).toLocaleDateString('en-IN'), icon: '📅' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', padding: '0.6rem 0',
                borderBottom: i < 8 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {item.icon} {item.label}
                </span>
                <span style={{
                  fontSize: '0.8rem', fontWeight: '500',
                  color: 'var(--text-primary)', textAlign: 'right',
                  maxWidth: '55%',
                }}>
                  {item.value}
                </span>
              </div>
            ))}

            {/* Discharge Button */}
            {selected.status !== 'discharged' && (
              <button
                onClick={() => handleDischarge(selected._id)}
                disabled={discharging === selected._id}
                style={{
                  width: '100%', padding: '0.75rem',
                  background: '#2D6A2D', color: '#FAF7F2',
                  border: 'none', borderRadius: '10px',
                  fontSize: '0.875rem', fontWeight: '500',
                  cursor: 'pointer', marginTop: '1rem',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => e.target.style.background = '#1A4A1A'}
                onMouseLeave={e => e.target.style.background = '#2D6A2D'}
              >
                {discharging === selected._id ? 'Discharging...' : `✓ ${t.discharge} Patient`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}