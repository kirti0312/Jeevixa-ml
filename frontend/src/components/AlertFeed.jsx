import React, { useState, useEffect } from 'react';
import axios from 'axios';

const translations = {
  en: {
    title: 'Alert Feed',
    subtitle: 'Live hospital alerts and notifications',
    all: 'All', critical: 'Critical', warning: 'Warning', info: 'Info',
    markRead: 'Mark All Read', resolve: 'Resolve',
    noAlerts: 'No alerts found', timeAgo: 'ago',
    unread: 'Unread', resolved: 'Resolved',
  },
  hi: {
    title: 'अलर्ट फीड',
    subtitle: 'लाइव अस्पताल अलर्ट और सूचनाएं',
    all: 'सभी', critical: 'गंभीर', warning: 'चेतावनी', info: 'जानकारी',
    markRead: 'सभी पढ़े हुए', resolve: 'हल करें',
    noAlerts: 'कोई अलर्ट नहीं', timeAgo: 'पहले',
    unread: 'अपठित', resolved: 'हल किया',
  }
};

export default function AlertFeed({ language }) {
  const t = translations[language] || translations.en;
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put('http://localhost:5000/api/alerts/read-all');
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const resolveAlert = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/alerts/${id}/resolve`, {
        resolvedBy: 'Admin'
      });
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
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

  const getAlertBorder = (type) => {
    if (type === 'critical') return '#6B1E2E';
    if (type === 'warning') return '#8B6000';
    return '#1E3A6B';
  };

  const getTimeAgo = (date) => {
    const diff = Math.abs(new Date() - new Date(date));
    const mins = Math.round(diff / 60000);
    if (mins < 60) return `${mins} mins ${t.timeAgo}`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs} hrs ${t.timeAgo}`;
    return `${Math.round(hrs / 24)} days ${t.timeAgo}`;
  };

  const filteredAlerts = filter === 'all'
    ? alerts
    : alerts.filter(a => a.type === filter);

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const criticalCount = alerts.filter(a => a.type === 'critical' && !a.isResolved).length;

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg-primary)',
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.25rem', color: '#6B1E2E',
      }}>
        ✦ Loading Alerts...
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
          onClick={markAllRead}
          style={{
            background: 'transparent', color: '#6B1E2E',
            border: '1px solid #6B1E2E', padding: '0.75rem 1.25rem',
            borderRadius: '10px', fontSize: '0.875rem',
            fontWeight: '500', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => { e.target.style.background = '#6B1E2E'; e.target.style.color = '#FAF7F2'; }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#6B1E2E'; }}
        >
          ✓ {t.markRead}
        </button>
      </div>

      {/* Summary */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: '1rem', marginBottom: '1.5rem',
      }}>
        {[
          { label: 'Total Alerts', value: alerts.length, color: '#1E3A6B', bg: 'rgba(30,58,107,0.08)' },
          { label: t.critical, value: criticalCount, color: '#6B1E2E', bg: 'rgba(107,30,46,0.08)' },
          { label: t.unread, value: unreadCount, color: '#8B6000', bg: 'rgba(139,96,0,0.08)' },
          { label: t.resolved, value: alerts.filter(a => a.isResolved).length, color: '#2D6A2D', bg: 'rgba(45,106,45,0.08)' },
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

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { value: 'all', label: t.all },
          { value: 'critical', label: t.critical },
          { value: 'warning', label: t.warning },
          { value: 'info', label: t.info },
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
            <span style={{
              marginLeft: '6px', fontSize: '0.65rem',
              background: filter === f.value ? '#6B1E2E' : 'var(--border)',
              color: filter === f.value ? '#FAF7F2' : 'var(--text-muted)',
              padding: '1px 6px', borderRadius: '10px',
            }}>
              {f.value === 'all' ? alerts.length : alerts.filter(a => a.type === f.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredAlerts.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '3rem',
            color: 'var(--text-muted)', fontSize: '0.875rem',
          }}>
            {t.noAlerts}
          </div>
        ) : (
          filteredAlerts.map((alert, i) => (
            <div
              key={i}
              style={{
                background: alert.isRead ? 'var(--bg-card)' : getAlertBg(alert.type),
                border: `1px solid ${alert.isRead ? 'var(--border)' : getAlertBorder(alert.type) + '33'}`,
                borderLeft: `4px solid ${getAlertColor(alert.type)}`,
                borderRadius: '12px', padding: '1.25rem',
                display: 'flex', alignItems: 'flex-start',
                gap: '1rem', transition: 'all 0.3s ease',
                animation: `fadeUp 0.5s ease ${i * 0.05}s both`,
                opacity: alert.isResolved ? 0.6 : 1,
              }}
            >
              {/* Icon */}
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: getAlertBg(alert.type),
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1rem',
                flexShrink: 0,
              }}>
                {alert.type === 'critical' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: '0.5rem', marginBottom: '0.35rem',
                }}>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: '600',
                    color: getAlertColor(alert.type),
                    textTransform: 'uppercase', letterSpacing: '1px',
                  }}>
                    {alert.type}
                  </span>
                  <span style={{
                    fontSize: '0.65rem', padding: '1px 8px',
                    borderRadius: '10px', background: 'var(--bg-secondary)',
                    color: 'var(--text-muted)',
                  }}>
                    {alert.category}
                  </span>
                  {!alert.isRead && (
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: getAlertColor(alert.type),
                      display: 'inline-block',
                    }} />
                  )}
                </div>
                <div style={{
                  fontSize: '0.875rem', color: 'var(--text-primary)',
                  lineHeight: '1.5', marginBottom: '0.5rem',
                }}>
                  {alert.message}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: '1rem',
                }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    🏥 {alert.ward}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    🕐 {getTimeAgo(alert.createdAt)}
                  </span>
                  {alert.isResolved && (
                    <span style={{
                      fontSize: '0.7rem', color: '#2D6A2D',
                      fontWeight: '500',
                    }}>
                      ✅ Resolved
                    </span>
                  )}
                </div>
              </div>

              {/* Resolve Button */}
              {!alert.isResolved && (
                <button
                  onClick={() => resolveAlert(alert._id)}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${getAlertColor(alert.type)}`,
                    color: getAlertColor(alert.type),
                    padding: '0.35rem 0.875rem',
                    borderRadius: '8px', fontSize: '0.75rem',
                    cursor: 'pointer', flexShrink: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = getAlertColor(alert.type);
                    e.target.style.color = '#FAF7F2';
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = getAlertColor(alert.type);
                  }}
                >
                  {t.resolve}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}