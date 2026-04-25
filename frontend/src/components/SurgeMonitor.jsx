import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const translations = {
  en: {
    title: 'Patient Surge Monitor',
    subtitle: 'AI-powered admission prediction for next 4 hours',
    expected: 'Expected Admissions', staffRec: 'Staff Recommendation',
    alertLevel: 'Alert Level', currentHour: 'Current Hour',
    next4hrs: 'Next 4 Hours Forecast', historical: 'Historical Pattern',
    low: 'LOW', medium: 'MEDIUM', high: 'HIGH',
    admissions: 'admissions', prepare: 'Prepare Now',
  },
  hi: {
    title: 'मरीज भीड़ मॉनिटर',
    subtitle: 'अगले 4 घंटों के लिए AI-संचालित प्रवेश पूर्वानुमान',
    expected: 'अपेक्षित प्रवेश', staffRec: 'स्टाफ सिफारिश',
    alertLevel: 'अलर्ट स्तर', currentHour: 'वर्तमान घंटा',
    next4hrs: 'अगले 4 घंटे पूर्वानुमान', historical: 'ऐतिहासिक पैटर्न',
    low: 'कम', medium: 'मध्यम', high: 'उच्च',
    admissions: 'प्रवेश', prepare: 'अभी तैयारी करें',
  }
};

const historicalData = [
  { hour: '06:00', admissions: 5 },
  { hour: '07:00', admissions: 8 },
  { hour: '08:00', admissions: 12 },
  { hour: '09:00', admissions: 15 },
  { hour: '10:00', admissions: 14 },
  { hour: '11:00', admissions: 13 },
  { hour: '12:00', admissions: 10 },
  { hour: '13:00', admissions: 11 },
  { hour: '14:00', admissions: 13 },
  { hour: '15:00', admissions: 14 },
  { hour: '16:00', admissions: 15 },
  { hour: '17:00', admissions: 14 },
  { hour: '18:00', admissions: 16 },
  { hour: '19:00', admissions: 18 },
  { hour: '20:00', admissions: 15 },
  { hour: '21:00', admissions: 12 },
  { hour: '22:00', admissions: 8 },
  { hour: '23:00', admissions: 5 },
];

export default function SurgeMonitor({ language }) {
  const t = translations[language] || translations.en;
  const [surge, setSurge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurge();
    const interval = setInterval(fetchSurge, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchSurge = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/surge');
      setSurge(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAlertColor = (level) => {
    if (level === 'high') return '#6B1E2E';
    if (level === 'medium') return '#8B6000';
    return '#2D6A2D';
  };

  const getAlertBg = (level) => {
    if (level === 'high') return 'rgba(107,30,46,0.08)';
    if (level === 'medium') return 'rgba(139,96,0,0.08)';
    return 'rgba(45,106,45,0.08)';
  };

  const getAlertLabel = (level) => {
    if (level === 'high') return t.high;
    if (level === 'medium') return t.medium;
    return t.low;
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg-primary)',
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.25rem', color: '#6B1E2E',
      }}>
        ✦ Loading Surge Data...
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

      {/* KPI Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: '1rem', marginBottom: '1.5rem',
      }}>
        {[
          {
            label: t.expected, icon: '👥',
            value: surge?.totalExpected || 0,
            sub: `${t.admissions} expected`,
            color: getAlertColor(surge?.alertLevel),
            bg: getAlertBg(surge?.alertLevel),
          },
          {
            label: t.alertLevel, icon: '🚨',
            value: getAlertLabel(surge?.alertLevel),
            sub: 'Current status',
            color: getAlertColor(surge?.alertLevel),
            bg: getAlertBg(surge?.alertLevel),
          },
          {
            label: t.currentHour, icon: '🕐',
            value: surge?.currentHour || '--',
            sub: 'Local time',
            color: '#1E3A6B',
            bg: 'rgba(30,58,107,0.08)',
          },
          {
            label: 'Staff Needed', icon: '👨‍⚕️',
            value: Math.ceil((surge?.totalExpected || 0) / 10),
            sub: 'extra staff recommended',
            color: '#2D6A2D',
            bg: 'rgba(45,106,45,0.08)',
          },
        ].map((kpi, i) => (
          <div key={i} style={{
            background: kpi.bg,
            border: `1px solid ${kpi.color}22`,
            borderRadius: '12px', padding: '1.25rem',
            animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
            transition: 'all 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{
              fontSize: '0.65rem', color: 'var(--text-muted)',
              letterSpacing: '1px', textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}>
              {kpi.icon} {kpi.label}
            </div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.75rem', fontWeight: '700',
              color: kpi.color, lineHeight: '1',
              marginBottom: '0.25rem',
            }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Staff Recommendation Banner */}
      {surge?.staffRecommendation && (
        <div style={{
          background: getAlertBg(surge.alertLevel),
          border: `1px solid ${getAlertColor(surge.alertLevel)}22`,
          borderRadius: '12px', padding: '1rem 1.5rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
          marginBottom: '1.5rem',
          animation: 'fadeUp 0.5s ease 0.4s both',
        }}>
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '0.875rem', fontWeight: '500',
              color: getAlertColor(surge.alertLevel),
            }}>
              {surge.staffRecommendation}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Based on historical admission patterns and current occupancy
            </div>
          </div>
          <button style={{
            background: getAlertColor(surge.alertLevel),
            color: '#FAF7F2', border: 'none',
            padding: '0.5rem 1rem', borderRadius: '8px',
            fontSize: '0.8rem', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: '500', flexShrink: 0,
          }}>
            {t.prepare} →
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Next 4 Hours */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem',
          animation: 'fadeUp 0.5s ease 0.5s both',
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem', color: 'var(--text-primary)',
            marginBottom: '1.25rem',
          }}>
            {t.next4hrs}
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={surge?.next4Hours || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,30,46,0.08)" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#9B7B6A' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9B7B6A' }} />
              <Tooltip
                contentStyle={{
                  background: '#FFFFFF', border: '1px solid #E8D5C4',
                  borderRadius: '8px', fontSize: '0.75rem',
                }}
              />
              <Bar
                dataKey="expected" fill="#6B1E2E"
                radius={[4, 4, 0, 0]}
                name="Expected Admissions"
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Hour breakdown */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            gap: '0.5rem', marginTop: '1rem',
          }}>
            {(surge?.next4Hours || []).map((h, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: '0.75rem 0.5rem',
                background: 'var(--bg-secondary)', borderRadius: '8px',
                border: '1px solid var(--border)',
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.25rem', fontWeight: '700',
                  color: '#6B1E2E',
                }}>
                  {h.expected}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {h.hour}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Pattern */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem',
          animation: 'fadeUp 0.5s ease 0.6s both',
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem', color: 'var(--text-primary)',
            marginBottom: '1.25rem',
          }}>
            {t.historical}
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,30,46,0.08)" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 9, fill: '#9B7B6A' }}
                interval={2}
              />
              <YAxis tick={{ fontSize: 11, fill: '#9B7B6A' }} />
              <Tooltip
                contentStyle={{
                  background: '#FFFFFF', border: '1px solid #E8D5C4',
                  borderRadius: '8px', fontSize: '0.75rem',
                }}
              />
              <Line
                type="monotone" dataKey="admissions"
                stroke="#C4956A" strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: '#6B1E2E' }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Peak hours */}
          <div style={{
            marginTop: '1rem', padding: '0.875rem',
            background: 'rgba(107,30,46,0.04)',
            borderRadius: '8px', border: '1px solid rgba(107,30,46,0.08)',
          }}>
            <div style={{
              fontSize: '0.7rem', color: 'var(--text-muted)',
              letterSpacing: '1px', textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}>
              Peak Hours
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['09:00', '16:00', '19:00'].map(h => (
                <span key={h} style={{
                  padding: '3px 10px', borderRadius: '20px',
                  background: 'rgba(107,30,46,0.08)',
                  border: '1px solid rgba(107,30,46,0.15)',
                  fontSize: '0.75rem', color: '#6B1E2E',
                  fontWeight: '500',
                }}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}