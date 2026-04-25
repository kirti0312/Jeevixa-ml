
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const translations = {
  en: {
    title: 'Hospital Dashboard', subtitle: 'Live overview of Jeevixa Smart Hospital',
    beds: 'Bed Occupancy', green: 'Green Score', infections: 'Infection Index',
    co2: 'CO₂ Today', critical: 'Critical Patients', recentPatients: 'Recent Patients',
    staffDuty: 'Staff On Duty', liveAlerts: 'Live Alerts', surgeTitle: 'Patient Surge Forecast',
    good: 'Good', warning: 'Warning', critical2: 'Critical',
  },
  hi: {
    title: 'अस्पताल डैशबोर्ड', subtitle: 'जीविक्सा स्मार्ट अस्पताल का लाइव अवलोकन',
    beds: 'बेड अधिभोग', green: 'ग्रीन स्कोर', infections: 'संक्रमण सूचकांक',
    co2: 'आज CO₂', critical: 'गंभीर मरीज', recentPatients: 'हालिया मरीज',
    staffDuty: 'ड्यूटी पर स्टाफ', liveAlerts: 'लाइव अलर्ट', surgeTitle: 'मरीज भीड़ पूर्वानुमान',
    good: 'अच्छा', warning: 'चेतावनी', critical2: 'गंभीर',
  }
};

export default function Dashboard({ user, language }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
  const t = translations[language] || translations.en;
  const [wards, setWards] = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [surge, setSurge] = useState(null);
  const [green, setGreen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    try {
      const [wardsRes, patientsRes, staffRes, alertsRes, surgeRes, greenRes] = await Promise.all([
        axios.get('http://localhost:5000/api/infection'),
        axios.get('http://localhost:5000/api/patients'),
        axios.get('http://localhost:5000/api/staff'),
        axios.get('http://localhost:5000/api/alerts'),
        axios.get('http://localhost:5000/api/surge'),
        axios.get('http://localhost:5000/api/green'),
      ]);
      setWards(wardsRes.data);
      setPatients(patientsRes.data.slice(0, 5));
      setStaff(staffRes.data.filter(s => s.isOnDuty).slice(0, 6));
      setAlerts(alertsRes.data.slice(0, 5));
      setSurge(surgeRes.data);
      setGreen(greenRes.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalBeds = 120;
  const occupiedBeds = 84;
  const occupancyPercent = Math.round((occupiedBeds / totalBeds) * 100);
  const criticalPatients = patients.filter(p => p.status === 'critical').length;
  const avgInfection = wards.length > 0
    ? (wards.reduce((sum, w) => sum + w.score, 0) / wards.length).toFixed(1)
    : 0;

  const kpis = [
    {
      label: t.beds, value: `${occupancyPercent}%`,
      sub: `${occupiedBeds}/${totalBeds} beds`,
      trend: '▲ +4%', trendColor: '#8B6000',
      color: '#6B1E2E', bg: 'rgba(107,30,46,0.05)',
    },
    {
      label: t.green, value: green?.greenScore || 72,
      sub: green?.status || 'Good',
      trend: '▼ −2 pts', trendColor: '#2D6A2D',
      color: '#2D6A2D', bg: 'rgba(45,106,45,0.05)',
    },
    {
      label: t.infections, value: avgInfection,
      sub: 'per 1000 days',
      trend: '▼ −0.3', trendColor: '#2D6A2D',
      color: '#1E3A6B', bg: 'rgba(30,58,107,0.05)',
    },
    {
      label: t.co2, value: '1.8t',
      sub: 'tonnes CO₂',
      trend: '▼ −8%', trendColor: '#2D6A2D',
      color: '#2D6A2D', bg: 'rgba(45,106,45,0.05)',
    },
    {
      label: t.critical, value: criticalPatients || 3,
      sub: 'need attention',
      trend: '▲ +2', trendColor: '#6B1E2E',
      color: '#6B1E2E', bg: 'rgba(107,30,46,0.05)',
    },
  ];

  const getSeverityColor = (severity) => {
    if (severity === 'critical') return '#6B1E2E';
    if (severity === 'high') return '#8B6000';
    if (severity === 'medium') return '#1E3A6B';
    return '#2D6A2D';
  };

  const getAlertColor = (type) => {
    if (type === 'critical') return '#6B1E2E';
    if (type === 'warning') return '#8B6000';
    return '#1E3A6B';
  };

  const getAlertBg = (type) => {
    if (type === 'critical') return 'rgba(107,30,46,0.06)';
    if (type === 'warning') return 'rgba(139,96,0,0.06)';
    return 'rgba(30,58,107,0.06)';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', flexDirection: 'column', gap: '1rem',
        background: 'var(--bg-primary)',
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.5rem', color: '#6B1E2E',
        }}>
          ✦ Loading Jeevixa...
        </div>
        <div style={{ fontSize: '0.875rem', color: '#9B7B6A' }}>
          Fetching live hospital data
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      padding: '2rem', fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem', animation: 'fadeUp 0.5s ease both' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.75rem', color: 'var(--text-primary)',
          marginBottom: '0.25rem',
        }}>
          {t.title}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {t.subtitle} · Welcome back, {user?.name}
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        //gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)',
        gap: '1rem', marginBottom: '1.5rem',
      }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px', padding: '1.25rem',
            position: 'relative', overflow: 'hidden',
            transition: 'all 0.3s ease',
            animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
            cursor: 'default',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(107,30,46,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
              background: `linear-gradient(90deg, ${kpi.color}, #C4956A)`,
            }} />
            <div style={{
              fontSize: '0.65rem', color: 'var(--text-muted)',
              letterSpacing: '1px', textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}>
              {kpi.label}
            </div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.75rem', fontWeight: '700',
              color: kpi.color, lineHeight: '1',
              marginBottom: '0.25rem',
            }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              {kpi.sub}
            </div>
            <div style={{ fontSize: '0.7rem', color: kpi.trendColor, fontWeight: '500' }}>
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 - Surge Chart + Alerts */}
      <div style={{
        display: 'grid',
       //  gridTemplateColumns: '1.5fr 1fr',
       gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr',
        gap: '1.5rem', marginBottom: '1.5rem',
      }}>

        {/* Surge Chart */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem',
          animation: 'fadeUp 0.5s ease 0.5s both',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1rem', color: 'var(--text-primary)',
            }}>
              {t.surgeTitle}
            </h3>
            {surge && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {surge.staffRecommendation}
              </p>
            )}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={surge?.next4Hours || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,30,46,0.08)" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#9B7B6A' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9B7B6A' }} />
              <Tooltip
                contentStyle={{
                  background: '#FFFFFF', border: '1px solid #E8D5C4',
                  borderRadius: '8px', fontSize: '0.75rem',
                }}
              />
              <Line
                type="monotone" dataKey="expected"
                stroke="#6B1E2E" strokeWidth={2}
                dot={{ fill: '#C4956A', r: 4 }}
                activeDot={{ r: 6, fill: '#6B1E2E' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem',
          animation: 'fadeUp 0.5s ease 0.6s both',
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem', color: 'var(--text-primary)',
            marginBottom: '1rem',
          }}>
            {t.liveAlerts}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {alerts.map((alert, i) => (
              <div key={i} style={{
                padding: '0.75rem', borderRadius: '8px',
                background: getAlertBg(alert.type),
                borderLeft: `3px solid ${getAlertColor(alert.type)}`,
              }}>
                <div style={{
                  fontSize: '0.75rem', fontWeight: '500',
                  color: getAlertColor(alert.type),
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  marginBottom: '2px',
                }}>
                  {alert.type}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {alert.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 - Patients + Staff */}
      <div style={{
        display: 'grid',
        //  gridTemplateColumns: '1.5fr 1fr',
        gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr',
        gap: '1.5rem',
      }}>

        {/* Recent Patients */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem',
          animation: 'fadeUp 0.5s ease 0.7s both',
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem', color: 'var(--text-primary)',
            marginBottom: '1rem',
          }}>
            {t.recentPatients}
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Patient', 'Condition', 'Ward', 'Severity', 'Status'].map(h => (
                  <th key={h} style={{
                    fontSize: '0.65rem', color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '1px',
                    padding: '0 0.75rem 0.75rem', textAlign: 'left',
                    fontWeight: '500',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <tr key={i} style={{
                  borderTop: '1px solid var(--border)',
                  transition: 'background 0.2s ease',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(107,30,46,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                    {p.name}
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {p.condition}
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {p.assignedWard || p.department}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.65rem', padding: '2px 8px',
                      borderRadius: '10px', fontWeight: '500',
                      background: `${getSeverityColor(p.severity)}15`,
                      color: getSeverityColor(p.severity),
                    }}>
                      {p.severity}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.65rem', padding: '2px 8px',
                      borderRadius: '10px',
                      background: p.status === 'critical' ? 'rgba(107,30,46,0.1)' : 'rgba(45,106,45,0.1)',
                      color: p.status === 'critical' ? '#6B1E2E' : '#2D6A2D',
                    }}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Staff On Duty */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem',
          animation: 'fadeUp 0.5s ease 0.8s both',
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem', color: 'var(--text-primary)',
            marginBottom: '1rem',
          }}>
            {t.staffDuty}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {staff.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem', borderRadius: '10px',
                background: s.fatigueAlert ? 'rgba(139,96,0,0.06)' : 'rgba(107,30,46,0.03)',
                border: `1px solid ${s.fatigueAlert ? 'rgba(139,96,0,0.15)' : 'var(--border)'}`,
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: s.role === 'doctor' ? 'rgba(30,58,107,0.1)' : 'rgba(45,106,45,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', flexShrink: 0,
                }}>
                  {s.role === 'doctor' ? '🩺' : '💉'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.8rem', fontWeight: '500',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {s.department} · {s.shiftStart}–{s.shiftEnd}
                  </div>
                </div>
                {s.fatigueAlert && (
                  <span style={{
                    fontSize: '0.65rem', padding: '2px 6px',
                    borderRadius: '8px', background: 'rgba(139,96,0,0.1)',
                    color: '#8B6000', flexShrink: 0,
                  }}>
                    ⚠️ Fatigue
                  </span>
                )}
                {!s.fatigueAlert && (
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#2D6A2D', flexShrink: 0,
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}