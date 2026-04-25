import React, { useState, useEffect } from 'react';
import axios from 'axios';

const translations = {
  en: {
    title: 'Infection Control Monitor',
    subtitle: 'Real-time infection risk tracking per ward',
    riskScore: 'Risk Score', occupancy: 'Occupancy',
    airQuality: 'Air Quality', hygiene: 'Hand Hygiene',
    infections: 'Active Infections', lastDisinfected: 'Last Disinfected',
    hoursAgo: 'hrs ago', uvCycles: 'UV-C Cycles Today',
    low: 'LOW RISK', medium: 'MEDIUM RISK', high: 'HIGH RISK',
    allWards: 'All Wards', highOnly: 'High Risk Only',
    summary: 'Summary', totalWards: 'Total Wards',
    criticalWards: 'Critical Wards', avgScore: 'Avg Risk Score',
    uvToday: 'UV-C Today',
  },
  hi: {
    title: 'संक्रमण नियंत्रण मॉनिटर',
    subtitle: 'प्रत्येक वार्ड की रियल-टाइम संक्रमण जोखिम ट्रैकिंग',
    riskScore: 'जोखिम स्कोर', occupancy: 'अधिभोग',
    airQuality: 'वायु गुणवत्ता', hygiene: 'हाथ स्वच्छता',
    infections: 'सक्रिय संक्रमण', lastDisinfected: 'अंतिम कीटाणुशोधन',
    hoursAgo: 'घंटे पहले', uvCycles: 'आज UV-C चक्र',
    low: 'कम जोखिम', medium: 'मध्यम जोखिम', high: 'उच्च जोखिम',
    allWards: 'सभी वार्ड', highOnly: 'केवल उच्च जोखिम',
    summary: 'सारांश', totalWards: 'कुल वार्ड',
    criticalWards: 'गंभीर वार्ड', avgScore: 'औसत जोखिम स्कोर',
    uvToday: 'आज UV-C',
  }
};

export default function InfectionMonitor({ language }) {
  const t = translations[language] || translations.en;
  const [wards, setWards] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/infection');
      setWards(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    if (risk === 'high') return '#6B1E2E';
    if (risk === 'medium') return '#8B6000';
    return '#2D6A2D';
  };

  const getRiskBg = (risk) => {
    if (risk === 'high') return 'rgba(107,30,46,0.08)';
    if (risk === 'medium') return 'rgba(139,96,0,0.08)';
    return 'rgba(45,106,45,0.08)';
  };

  const getRiskLabel = (risk) => {
    if (risk === 'high') return t.high;
    if (risk === 'medium') return t.medium;
    return t.low;
  };

  const getHoursAgo = (date) => {
  if (!date) return 'Unknown';
  const diff = Math.abs(new Date() - new Date(date));
  const hrs = Math.round(diff / (1000 * 60 * 60));
  return hrs;
};

  const filteredWards = filter === 'high'
    ? wards.filter(w => w.risk === 'high')
    : wards;

  const avgScore = wards.length > 0
    ? (wards.reduce((sum, w) => sum + w.score, 0) / wards.length).toFixed(1)
    : 0;

  const highRiskCount = wards.filter(w => w.risk === 'high').length;

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg-primary)',
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.25rem', color: '#6B1E2E',
      }}>
        ✦ Loading Infection Data...
      </div>
    );
  }

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

      {/* Summary Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: '1rem', marginBottom: '1.5rem',
      }}>
        {[
          { label: t.totalWards, value: wards.length, color: '#1E3A6B', bg: 'rgba(30,58,107,0.08)' },
          { label: t.criticalWards, value: highRiskCount, color: '#6B1E2E', bg: 'rgba(107,30,46,0.08)' },
          { label: t.avgScore, value: avgScore, color: '#8B6000', bg: 'rgba(139,96,0,0.08)' },
          { label: t.uvToday, value: '14', color: '#2D6A2D', bg: 'rgba(45,106,45,0.08)' },
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

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { value: 'all', label: t.allWards },
          { value: 'high', label: t.highOnly },
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

        {/* Ward Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem', alignContent: 'start',
        }}>
          {filteredWards.map((ward, i) => (
            <div
              key={i}
              onClick={() => setSelected(selected?.wardName === ward.wardName ? null : ward)}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${selected?.wardName === ward.wardName
                  ? getRiskColor(ward.risk) : 'var(--border)'}`,
                borderRadius: '16px', padding: '1.5rem',
                cursor: 'pointer', transition: 'all 0.3s ease',
                position: 'relative', overflow: 'hidden',
                animation: `fadeUp 0.5s ease ${i * 0.05}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${getRiskColor(ward.risk)}22`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Top bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: getRiskColor(ward.risk),
              }} />

              {/* Ward name + risk */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '1rem',
              }}>
                <div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1rem', fontWeight: '600',
                    color: 'var(--text-primary)',
                  }}>
                    {ward.wardName}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {ward.department}
                  </div>
                </div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.75rem', fontWeight: '700',
                  color: getRiskColor(ward.risk),
                }}>
                  {ward.score}
                </div>
              </div>

              {/* Risk badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '3px 10px', borderRadius: '20px',
                background: getRiskBg(ward.risk),
                border: `1px solid ${getRiskColor(ward.risk)}33`,
                marginBottom: '1rem',
              }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: getRiskColor(ward.risk),
                  animation: ward.risk === 'high' ? 'pulse 1.5s infinite' : 'none',
                }} />
                <span style={{
                  fontSize: '0.65rem', color: getRiskColor(ward.risk),
                  fontWeight: '500', letterSpacing: '0.5px',
                }}>
                  {getRiskLabel(ward.risk)}
                </span>
              </div>

              {/* Stats bars */}
              {[
                { label: t.occupancy, value: ward.occupancy, max: 100 },
                { label: t.airQuality, value: ward.airQuality, max: 100 },
                { label: t.hygiene, value: ward.handHygiene, max: 100 },
              ].map((stat, j) => (
                <div key={j} style={{ marginBottom: '0.5rem' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: '3px',
                  }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stat.label}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                      {stat.value}%
                    </span>
                  </div>
                  <div style={{
                    height: '3px', background: 'var(--border)',
                    borderRadius: '2px', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '2px',
                      width: `${(stat.value / stat.max) * 100}%`,
                      background: getRiskColor(ward.risk),
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              ))}

              {/* Active infections */}
              {ward.activeInfections > 0 && (
                <div style={{
                  marginTop: '0.75rem', padding: '0.5rem 0.75rem',
                  borderRadius: '8px', background: 'rgba(107,30,46,0.06)',
                  fontSize: '0.75rem', color: '#6B1E2E', fontWeight: '500',
                }}>
                  🦠 {ward.activeInfections} active infection{ward.activeInfections > 1 ? 's' : ''} detected
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.5rem',
            height: 'fit-content', position: 'sticky', top: '2rem',
            animation: 'slideIn 0.3s ease both',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '1.5rem',
            }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.1rem', color: 'var(--text-primary)',
              }}>
                {selected.wardName}
              </h3>
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

            {/* Big Score */}
            <div style={{
              textAlign: 'center', padding: '1.5rem',
              background: getRiskBg(selected.risk),
              borderRadius: '12px', marginBottom: '1.5rem',
              border: `1px solid ${getRiskColor(selected.risk)}22`,
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '4rem', fontWeight: '700',
                color: getRiskColor(selected.risk), lineHeight: '1',
              }}>
                {selected.score}
              </div>
              <div style={{
                fontSize: '0.75rem', color: getRiskColor(selected.risk),
                marginTop: '0.5rem', fontWeight: '500',
                letterSpacing: '1px',
              }}>
                {getRiskLabel(selected.risk)}
              </div>
            </div>

            {/* Risk Factors */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                fontSize: '0.65rem', color: 'var(--text-muted)',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}>
                Risk Factors
              </div>
              {[
                { label: t.occupancy, value: `${selected.occupancy}%`, icon: '🛏️' },
                { label: t.infections, value: selected.activeInfections, icon: '🦠' },
                { label: t.airQuality, value: `${selected.airQuality}/100`, icon: '💨' },
                { label: t.hygiene, value: `${selected.handHygiene}%`, icon: '🧼' },
                { label: t.lastDisinfected, value: `${getHoursAgo(selected.lastDisinfection)} ${t.hoursAgo}`, icon: '🔬' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '0.6rem 0',
                  borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {item.icon} {item.label}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div style={{
              padding: '0.875rem', borderRadius: '10px',
              background: selected.risk === 'high'
                ? 'rgba(107,30,46,0.06)' : 'rgba(45,106,45,0.06)',
              border: `1px solid ${getRiskColor(selected.risk)}22`,
              fontSize: '0.8rem',
              color: getRiskColor(selected.risk),
              lineHeight: '1.5',
            }}>
              {selected.risk === 'high'
                ? '⚠️ Immediate action required. Schedule UV-C disinfection and activate isolation protocol.'
                : selected.risk === 'medium'
                  ? '⚡ Monitor closely. Consider additional hygiene measures.'
                  : '✅ Ward is operating safely. Maintain current protocols.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}