import React, { useState, useEffect } from 'react';
import axios from 'axios';

const translations = {
  en: {
    title: 'AI Bed Allotment', subtitle: 'Smart bed assignment powered by AI',
    name: 'Patient Name', age: 'Age', gender: 'Gender',
    condition: 'Medical Condition', severity: 'Severity',
    equipment: 'Equipment Needed', phone: 'Phone Number',
    blood: 'Blood Group', doctor: 'Attending Doctor',
    assign: 'Assign Bed with AI', assigning: 'AI is thinking...',
    result: 'Bed Assigned!', allBeds: 'All Beds Status',
    available: 'Available', occupied: 'Occupied', maintenance: 'Maintenance',
    male: 'Male', female: 'Female', other: 'Other',
    low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical',
  },
  hi: {
    title: 'AI बेड आवंटन', subtitle: 'AI द्वारा स्मार्ट बेड आवंटन',
    name: 'मरीज का नाम', age: 'उम्र', gender: 'लिंग',
    condition: 'चिकित्सा स्थिति', severity: 'गंभीरता',
    equipment: 'आवश्यक उपकरण', phone: 'फोन नंबर',
    blood: 'रक्त समूह', doctor: 'उपस्थित डॉक्टर',
    assign: 'AI से बेड आवंटित करें', assigning: 'AI सोच रहा है...',
    result: 'बेड आवंटित!', allBeds: 'सभी बेड की स्थिति',
    available: 'उपलब्ध', occupied: 'भरा हुआ', maintenance: 'रखरखाव',
    male: 'पुरुष', female: 'महिला', other: 'अन्य',
    low: 'कम', medium: 'मध्यम', high: 'उच्च', critical: 'गंभीर',
  }
};

export default function BedAllotment({ language }) {
  const t = translations[language] || translations.en;
  const [form, setForm] = useState({
    name: '', age: '', gender: 'male', phone: '',
    condition: '', severity: 'medium', equipmentNeeded: [],
    bloodGroup: 'O+', attendingDoctor: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [beds, setBeds] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => { fetchBeds(); }, []);

  const fetchBeds = async () => {
    try {
      const res = await axios.get('https://jeevixa-backend-nm1z.onrender.com/api/beds');
      setBeds(res.data);
    } catch (err) { console.error(err); }
  };

  const equipmentOptions = ['ventilator', 'oxygen', 'monitor', 'dialysis', 'defibrillator'];

  const toggleEquipment = (eq) => {
    setForm(prev => ({
      ...prev,
      equipmentNeeded: prev.equipmentNeeded.includes(eq)
        ? prev.equipmentNeeded.filter(e => e !== eq)
        : [...prev.equipmentNeeded, eq]
    }));
  };

  const handleAssign = async () => {
    if (!form.name || !form.condition || !form.age) {
      setError('Please fill patient name, age and condition');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      // First assign bed
const bedRes = await axios.post('https://jeevixa-backend-nm1z.onrender.com/api/beds/allot', {
  patientName: form.name,
  condition: form.condition,
  severity: form.severity,
  equipmentNeeded: form.equipmentNeeded,
});

// Then register patient with bed info
await axios.post('https://jeevixa-backend-nm1z.onrender.com/api/patients/register', {
  ...form,
  age: parseInt(form.age),
  department: bedRes.data.assignedBed?.department || 'General',
  assignedBed: bedRes.data.assignedBed?.bedNumber || null,
  assignedWard: bedRes.data.assignedBed?.wardName || bedRes.data.assignedBed?.ward || null,
});
      setResult(bedRes.data);
      fetchBeds();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const availableCount = beds.filter(b => b.status === 'available').length;
  const occupiedCount = beds.filter(b => b.status === 'occupied').length;
  const maintenanceCount = beds.filter(b => b.status === 'maintenance').length;

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    border: '1px solid var(--border)', borderRadius: '10px',
    background: 'var(--bg-primary)', color: 'var(--text-primary)',
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem',
    outline: 'none', transition: 'all 0.2s ease',
  };

  const labelStyle = {
    fontSize: '0.7rem', color: 'var(--text-muted)',
    letterSpacing: '1px', textTransform: 'uppercase',
    display: 'block', marginBottom: '0.4rem',
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      padding: '2rem', fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
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

      {/* Stats Row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        gap: '1rem', marginBottom: '1.5rem',
      }}>
        {[
          { label: t.available, value: availableCount, color: '#2D6A2D', bg: 'rgba(45,106,45,0.08)' },
          { label: t.occupied, value: occupiedCount, color: '#6B1E2E', bg: 'rgba(107,30,46,0.08)' },
          { label: t.maintenance, value: maintenanceCount, color: '#8B6000', bg: 'rgba(139,96,0,0.08)' },
        ].map((s, i) => (
          <div key={i} style={{
            background: s.bg, border: `1px solid ${s.color}22`,
            borderRadius: '12px', padding: '1.25rem', textAlign: 'center',
          }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem', fontWeight: '700', color: s.color,
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Form */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem',
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.1rem', color: 'var(--text-primary)',
            marginBottom: '1.5rem',
          }}>
            Patient Registration
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>{t.name}</label>
              <input
                style={inputStyle} placeholder="Full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                onFocus={e => { e.target.style.borderColor = '#C4956A'; e.target.style.boxShadow = '0 0 0 3px rgba(196,149,106,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t.age}</label>
              <input
                style={inputStyle} placeholder="Age" type="number"
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
                onFocus={e => { e.target.style.borderColor = '#C4956A'; e.target.style.boxShadow = '0 0 0 3px rgba(196,149,106,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>{t.gender}</label>
              <select
                style={inputStyle}
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}
              >
                <option value="male">{t.male}</option>
                <option value="female">{t.female}</option>
                <option value="other">{t.other}</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t.phone}</label>
              <input
                style={inputStyle} placeholder="Phone number"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                onFocus={e => { e.target.style.borderColor = '#C4956A'; e.target.style.boxShadow = '0 0 0 3px rgba(196,149,106,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>{t.condition}</label>
            <input
              style={inputStyle}
              placeholder="e.g. Cardiac Arrest, Fracture, Fever"
              value={form.condition}
              onChange={e => setForm({ ...form, condition: e.target.value })}
              onFocus={e => { e.target.style.borderColor = '#C4956A'; e.target.style.boxShadow = '0 0 0 3px rgba(196,149,106,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>{t.severity}</label>
              <select
                style={inputStyle}
                value={form.severity}
                onChange={e => setForm({ ...form, severity: e.target.value })}
              >
                <option value="low">{t.low}</option>
                <option value="medium">{t.medium}</option>
                <option value="high">{t.high}</option>
                <option value="critical">{t.critical}</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t.blood}</label>
              <select
                style={inputStyle}
                value={form.bloodGroup}
                onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
              >
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>{t.doctor}</label>
            <input
              style={inputStyle} placeholder="Doctor name"
              value={form.attendingDoctor}
              onChange={e => setForm({ ...form, attendingDoctor: e.target.value })}
              onFocus={e => { e.target.style.borderColor = '#C4956A'; e.target.style.boxShadow = '0 0 0 3px rgba(196,149,106,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Equipment */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>{t.equipment}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {equipmentOptions.map(eq => (
                <div
                  key={eq}
                  onClick={() => toggleEquipment(eq)}
                  style={{
                    padding: '0.35rem 0.875rem', borderRadius: '20px',
                    border: `1px solid ${form.equipmentNeeded.includes(eq) ? '#6B1E2E' : 'var(--border)'}`,
                    background: form.equipmentNeeded.includes(eq) ? 'rgba(107,30,46,0.08)' : 'transparent',
                    color: form.equipmentNeeded.includes(eq) ? '#6B1E2E' : 'var(--text-muted)',
                    fontSize: '0.75rem', cursor: 'pointer',
                    transition: 'all 0.2s ease', fontWeight: '500',
                  }}
                >
                  {eq}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem', borderRadius: '8px',
              background: 'rgba(107,30,46,0.08)',
              color: '#6B1E2E', fontSize: '0.8rem',
              marginBottom: '1rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleAssign}
            disabled={loading}
            style={{
              width: '100%', padding: '0.875rem',
              background: loading ? '#9B7B6A' : '#6B1E2E',
              color: '#FAF7F2', border: 'none',
              borderRadius: '10px', fontSize: '0.875rem',
              fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(107,30,46,0.25)',
            }}
          >
            {loading ? `🤖 ${t.assigning}` : `🤖 ${t.assign}`}
          </button>
        </div>

        {/* Result + Bed Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Result */}
          {result && (
            <div style={{
              background: result.success ? 'rgba(45,106,45,0.06)' : 'rgba(107,30,46,0.06)',
              border: `1px solid ${result.success ? '#2D6A2D' : '#6B1E2E'}33`,
              borderRadius: '16px', padding: '1.5rem',
              animation: 'fadeUp 0.4s ease both',
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.1rem',
                color: result.success ? '#2D6A2D' : '#6B1E2E',
                marginBottom: '1rem',
              }}>
                {result.success ? `✅ ${t.result}` : '❌ No Beds Available'}
              </div>
              {result.success && result.assignedBed && (
                <>
                  {[
                    { label: 'Bed Number', value: result.assignedBed.bedNumber },
                    { label: 'Ward', value: result.assignedBed.ward },
                    { label: 'Department', value: result.assignedBed.department },
                    { label: 'Infection Risk', value: result.assignedBed.infectionRisk },
                    { label: 'Equipment', value: result.assignedBed.equipment?.join(', ') || 'Standard' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '0.5rem 0',
                      borderBottom: i < 4 ? '1px solid rgba(45,106,45,0.1)' : 'none',
                    }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.label}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                  <div style={{
                    marginTop: '1rem', padding: '0.75rem',
                    background: 'rgba(45,106,45,0.08)', borderRadius: '8px',
                    fontSize: '0.8rem', color: '#2D6A2D',
                  }}>
                    🤖 AI Reason: {result.reason}
                  </div>
                </>
              )}
              {!result.success && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ⏰ Estimated wait: {result.suggestedWait}
                </div>
              )}
            </div>
          )}

          {/* Bed Grid */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem', flex: 1,
          }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1rem', color: 'var(--text-primary)',
              marginBottom: '1rem',
            }}>
              {t.allBeds}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(55px, 1fr))',
              gap: '0.5rem', maxHeight: '400px', overflowY: 'auto',
            }}>
              {beds.map((bed, i) => (
                <div
                  key={i}
                  title={`${bed.bedNumber} — ${bed.status}${bed.currentPatient ? ` (${bed.currentPatient})` : ''}`}
                  style={{
                    padding: '0.5rem 0.25rem', borderRadius: '8px',
                    border: `1px solid ${bed.status === 'available'
                      ? '#2D6A2D44' : bed.status === 'maintenance'
                        ? '#8B600044' : '#6B1E2E44'}`,
                    background: bed.status === 'available'
                      ? 'rgba(45,106,45,0.08)' : bed.status === 'maintenance'
                        ? 'rgba(139,96,0,0.08)' : 'rgba(107,30,46,0.08)',
                    textAlign: 'center', cursor: 'default',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    fontSize: '0.6rem', fontWeight: '600',
                    color: bed.status === 'available'
                      ? '#2D6A2D' : bed.status === 'maintenance'
                        ? '#8B6000' : '#6B1E2E',
                  }}>
                    {bed.bedNumber}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {[
                { color: '#2D6A2D', label: t.available },
                { color: '#6B1E2E', label: t.occupied },
                { color: '#8B6000', label: t.maintenance },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}