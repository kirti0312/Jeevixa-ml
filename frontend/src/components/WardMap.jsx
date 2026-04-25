import React, { useState, useEffect } from 'react';
import axios from 'axios';

const translations = {
  en: {
    title: 'Ward Map', subtitle: 'Real-time ward occupancy and infection risk',
    occupied: 'Occupied', critical: 'Critical', low: 'Low Risk',
    medium: 'Medium Risk', high: 'High Risk', beds: 'Beds',
    infections: 'Infections', hygiene: 'Hygiene', air: 'Air Quality',
    lastDisinfected: 'Last Disinfected', hoursAgo: 'hrs ago',
  },
  hi: {
    title: 'वार्ड मैप', subtitle: 'रियल-टाइम वार्ड अधिभोग और संक्रमण जोखिम',
    occupied: 'भरा हुआ', critical: 'गंभीर', low: 'कम जोखिम',
    medium: 'मध्यम जोखिम', high: 'उच्च जोखिम', beds: 'बेड',
    infections: 'संक्रमण', hygiene: 'स्वच्छता', air: 'वायु गुणवत्ता',
    lastDisinfected: 'अंतिम कीटाणुशोधन', hoursAgo: 'घंटे पहले',
  }
};

export default function WardMap({ language }) {
  const t = translations[language] || translations.en;
  const [wards, setWards] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
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

  const getOccupancyColor = (occ) => {
    if (occ >= 90) return '#6B1E2E';
    if (occ >= 70) return '#8B6000';
    return '#2D6A2D';
  };

  const getHoursAgo = (date) => {
  if (!date) return 'Unknown';
  const diff = Math.abs(new Date() - new Date(date));
  const hrs = Math.round(diff / (1000 * 60 * 60));
  return hrs;
};

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg-primary)',
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.25rem', color: '#6B1E2E',
      }}>
        ✦ Loading Ward Map...
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
          marginBottom: '0.25rem',
        }}>
          {t.title}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {t.subtitle}
        </p>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', gap: '1rem', marginBottom: '1.5rem',
        flexWrap: 'wrap',
      }}>
        {[
          { label: t.low, color: '#2D6A2D', bg: 'rgba(45,106,45,0.08)' },
          { label: t.medium, color: '#8B6000', bg: 'rgba(139,96,0,0.08)' },
          { label: t.high, color: '#6B1E2E', bg: 'rgba(107,30,46,0.08)' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0.35rem 0.75rem', borderRadius: '20px',
            background: item.bg, border: `1px solid ${item.color}33`,
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: item.color,
            }} />
            <span style={{ fontSize: '0.75rem', color: item.color, fontWeight: '500' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: selected ? '1fr 380px' : '1fr',
        gap: '1.5rem',
      }}>

        {/* Ward Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem', alignContent: 'start',
        }}>
          {wards.map((ward, i) => (
            <div
              key={i}
              onClick={() => setSelected(selected?.wardName === ward.wardName ? null : ward)}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${selected?.wardName === ward.wardName
                  ? getRiskColor(ward.risk)
                  : 'var(--border)'}`,
                borderRadius: '16px', padding: '1.25rem',
                cursor: 'pointer', transition: 'all 0.3s ease',
                position: 'relative', overflow: 'hidden',
                animation: `fadeUp 0.5s ease ${i * 0.05}s both`,
                boxShadow: selected?.wardName === ward.wardName
                  ? `0 8px 24px ${getRiskColor(ward.risk)}22`
                  : 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${getRiskColor(ward.risk)}22`;
              }}
              onMouseLeave={e => {
                if (selected?.wardName !== ward.wardName) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Top accent */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: getRiskColor(ward.risk),
              }} />

              {/* Ward name */}
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '0.95rem', fontWeight: '600',
                color: 'var(--text-primary)', marginBottom: '0.75rem',
              }}>
                {ward.wardName}
              </div>

              {/* Occupancy */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: '4px',
                }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {t.occupied}
                  </span>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: '600',
                    color: getOccupancyColor(ward.occupancy),
                  }}>
                    {ward.occupancy}%
                  </span>
                </div>
                <div style={{
                  height: '4px', background: 'var(--border)',
                  borderRadius: '2px', overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', borderRadius: '2px',
                    width: `${ward.occupancy}%`,
                    background: getOccupancyColor(ward.occupancy),
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>

              {/* Risk Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '3px 10px', borderRadius: '20px',
                background: getRiskBg(ward.risk),
                border: `1px solid ${getRiskColor(ward.risk)}33`,
              }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: getRiskColor(ward.risk),
                }} />
                <span style={{
                  fontSize: '0.65rem', color: getRiskColor(ward.risk),
                  fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  {ward.risk} risk · {ward.score}
                </span>
              </div>

              {/* Active infections */}
              {ward.activeInfections > 0 && (
                <div style={{
                  marginTop: '0.5rem', fontSize: '0.7rem',
                  color: '#6B1E2E', fontWeight: '500',
                }}>
                  ⚠️ {ward.activeInfections} active infection{ward.activeInfections > 1 ? 's' : ''}
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
              alignItems: 'flex-start', marginBottom: '1.5rem',
            }}>
              <div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.25rem', color: 'var(--text-primary)',
                }}>
                  {selected.wardName}
                </h3>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '3px 10px', borderRadius: '20px', marginTop: '4px',
                  background: getRiskBg(selected.risk),
                }}>
                  <span style={{ fontSize: '0.7rem', color: getRiskColor(selected.risk), fontWeight: '500' }}>
                    {selected.risk?.toUpperCase()} INFECTION RISK
                  </span>
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

            {/* Risk Score */}
            <div style={{
              background: getRiskBg(selected.risk),
              borderRadius: '12px', padding: '1rem',
              textAlign: 'center', marginBottom: '1.5rem',
              border: `1px solid ${getRiskColor(selected.risk)}22`,
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '3rem', fontWeight: '700',
                color: getRiskColor(selected.risk), lineHeight: '1',
              }}>
                {selected.score}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Infection Risk Score / 100
              </div>
            </div>

            {/* Stats */}
           {[
  { label: 'Total Beds', value: `${Math.round(selected.occupancy * 20 / 100)} / 20`, icon: '🛏️' },
  { label: 'Occupancy', value: `${selected.occupancy}%`, icon: '📊' },
  { label: 'Department', value: selected.department, icon: '🏢' },
  { label: 'Active Infections', value: selected.activeInfections, icon: '🦠' },
  { label: 'Last Disinfected', value: `${getHoursAgo(selected.lastDisinfection)} ${t.hoursAgo}`, icon: '🔬' },
].map((stat, i) => (
  <div key={i} style={{
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '0.6rem 0',
    borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
  }}>
    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
      {stat.icon} {stat.label}
    </span>
    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>
      {stat.value}
    </span>
  </div>
))}
            
          </div>
        )}
      </div>
    </div>
  );
}