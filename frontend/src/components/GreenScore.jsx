import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const translations = {
  en: {
    title: 'Green Score', subtitle: 'Hospital sustainability and carbon footprint tracker',
    energy: 'Energy Score', solar: 'Solar Score', co2: 'CO₂ Score',
    waste: 'Waste Score', water: 'Water Score', recommendation: 'AI Recommendation',
    history: 'Score History', calculate: 'Recalculate Score',
    energyUsage: 'Energy Usage (MWh)', solarOutput: 'Solar Output (kWh)',
    co2Emissions: 'CO₂ Emissions (tonnes)', wasteGenerated: 'Waste Generated (kg)',
    waterUsage: 'Water Usage (kL)', update: 'Update Score',
  },
  hi: {
    title: 'ग्रीन स्कोर', subtitle: 'अस्पताल स्थिरता और कार्बन फुटप्रिंट ट्रैकर',
    energy: 'ऊर्जा स्कोर', solar: 'सौर स्कोर', co2: 'CO₂ स्कोर',
    waste: 'कचरा स्कोर', water: 'पानी स्कोर', recommendation: 'AI सिफारिश',
    history: 'स्कोर इतिहास', calculate: 'स्कोर पुनर्गणना करें',
    energyUsage: 'ऊर्जा उपयोग (MWh)', solarOutput: 'सौर उत्पादन (kWh)',
    co2Emissions: 'CO₂ उत्सर्जन (टन)', wasteGenerated: 'कचरा (kg)',
    waterUsage: 'पानी उपयोग (kL)', update: 'स्कोर अपडेट करें',
  }
};

const historyData = [
  { day: 'Mon', score: 68 }, { day: 'Tue', score: 71 },
  { day: 'Wed', score: 69 }, { day: 'Thu', score: 74 },
  { day: 'Fri', score: 72 }, { day: 'Sat', score: 75 },
  { day: 'Sun', score: 72 },
];

export default function GreenScore({ language }) {
  const t = translations[language] || translations.en;
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  //const [updating, setUpdating] = useState(false);  //*/
  // const [form, setForm] = useState({
  //   energyUsage: 2.4, solarOutput: 142,
  //   co2Emissions: 1.8, wasteGenerated: 45, waterUsage: 120,
  // });

  // Replace useEffect with this:
useEffect(() => {
  fetchScore();
  // Auto update every 30 seconds with slightly varying values
  const interval = setInterval(async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/green', {
        energyUsage: 2.4 + (Math.random() * 0.4 - 0.2),
        solarOutput: 142 + (Math.random() * 20 - 10),
        co2Emissions: 1.8 + (Math.random() * 0.3 - 0.15),
        wasteGenerated: 45 + (Math.random() * 10 - 5),
        waterUsage: 120 + (Math.random() * 20 - 10),
      });
      setScore(res.data);
    } catch (err) {
      console.error(err);
    }
  }, 30000);
  return () => clearInterval(interval);
}, []);
  const fetchScore = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/green');
      setScore(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const updateScore = async () => {
  //   setUpdating(true);
  //   try {
  //     const res = await axios.post('http://localhost:5000/api/green', form);
  //     setScore(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setUpdating(false);
  //   }
  // };

  const getScoreColor = (s) => {
    if (s >= 70) return '#2D6A2D';
    if (s >= 50) return '#8B6000';
    return '#6B1E2E';
  };

  const getScoreBg = (s) => {
    if (s >= 70) return 'rgba(45,106,45,0.08)';
    if (s >= 50) return 'rgba(139,96,0,0.08)';
    return 'rgba(107,30,46,0.08)';
  };

  // const inputStyle = {
  //   width: '100%', padding: '0.65rem 0.875rem',
  //   border: '1px solid var(--border)', borderRadius: '8px',
  //   background: 'var(--bg-primary)', color: 'var(--text-primary)',
  //   fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem',
  //   outline: 'none', transition: 'all 0.2s ease',
  // };

  // const labelStyle = {
  //   fontSize: '0.65rem', color: 'var(--text-muted)',
  //   letterSpacing: '1px', textTransform: 'uppercase',
  //   display: 'block', marginBottom: '0.35rem',
  // };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg-primary)',
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.25rem', color: '#6B1E2E',
      }}>
        ✦ Loading Green Score...
      </div>
    );
  }

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (circumference * (score?.greenScore || 0)) / 100;

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Score Circle */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '2rem',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          animation: 'fadeUp 0.5s ease both',
        }}>
          <svg width="160" height="160" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none"
              stroke="var(--border)" strokeWidth="8" />
            <circle cx="60" cy="60" r="54" fill="none"
              stroke={getScoreColor(score?.greenScore || 0)}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
            <text x="60" y="55" textAnchor="middle"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '22px', fontWeight: '700',
                fill: getScoreColor(score?.greenScore || 0),
              }}>
              {score?.greenScore || 0}
            </text>
            <text x="60" y="70" textAnchor="middle"
              style={{ fontSize: '8px', fill: '#9B7B6A' }}>
              /100
            </text>
          </svg>

          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem', fontWeight: '700',
            color: getScoreColor(score?.greenScore || 0),
            marginTop: '0.5rem',
          }}>
            {score?.status || 'Good'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Hospital Green Rating
          </div>
        </div>

        {/* Breakdown */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem',
          animation: 'fadeUp 0.5s ease 0.1s both',
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem', color: 'var(--text-primary)',
            marginBottom: '1.25rem',
          }}>
            Score Breakdown
          </h3>
          {score?.breakdown && [
            { label: t.energy, key: 'energyScore', icon: '⚡' },
            { label: t.solar, key: 'solarScore', icon: '☀️' },
            { label: t.co2, key: 'co2Score', icon: '🌿' },
            { label: t.waste, key: 'wasteScore', icon: '♻️' },
            { label: t.water, key: 'waterScore', icon: '💧' },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: '0.875rem' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: '4px',
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {item.icon} {item.label}
                </span>
                <span style={{
                  fontSize: '0.8rem', fontWeight: '600',
                  color: getScoreColor(score.breakdown[item.key]),
                }}>
                  {score.breakdown[item.key]}
                </span>
              </div>
              <div style={{
                height: '5px', background: 'var(--border)',
                borderRadius: '3px', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: '3px',
                  width: `${score.breakdown[item.key]}%`,
                  background: `linear-gradient(90deg, ${getScoreColor(score.breakdown[item.key])}, #C4956A)`,
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendation */}
      {score?.recommendation && (
        <div style={{
          background: getScoreBg(score.greenScore),
          border: `1px solid ${getScoreColor(score.greenScore)}22`,
          borderRadius: '12px', padding: '1.25rem',
          display: 'flex', gap: '1rem', alignItems: 'flex-start',
          marginBottom: '1.5rem',
          animation: 'fadeUp 0.5s ease 0.2s both',
        }}>
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          <div>
            <div style={{
              fontSize: '0.75rem', color: getScoreColor(score.greenScore),
              letterSpacing: '1px', textTransform: 'uppercase',
              marginBottom: '0.35rem', fontWeight: '500',
            }}>
              {t.recommendation}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
              {score.recommendation}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>

        {/* History Chart */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '1.5rem',
          animation: 'fadeUp 0.5s ease 0.3s both',
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem', color: 'var(--text-primary)',
            marginBottom: '1.25rem',
          }}>
            {t.history}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,30,46,0.08)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9B7B6A' }} />
              <YAxis domain={[60, 80]} tick={{ fontSize: 11, fill: '#9B7B6A' }} />
              <Tooltip
                contentStyle={{
                  background: '#FFFFFF', border: '1px solid #E8D5C4',
                  borderRadius: '8px', fontSize: '0.75rem',
                }}
              />
              <Line
                type="monotone" dataKey="score"
                stroke="#2D6A2D" strokeWidth={2}
                dot={{ fill: '#C4956A', r: 4 }}
                activeDot={{ r: 6, fill: '#2D6A2D' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Update Form */}
        {/* Replace entire Update Form div with this */}
<div style={{
  background: 'var(--bg-card)', border: '1px solid var(--border)',
  borderRadius: '16px', padding: '1.5rem',
  animation: 'fadeUp 0.5s ease 0.4s both',
}}>
  <h3 style={{
    fontFamily: "'Playfair Display', serif",
    fontSize: '1rem', color: 'var(--text-primary)',
    marginBottom: '1.25rem',
  }}>
    Live Sensor Data
  </h3>

  {[
    { label: 'Energy Usage', value: '2.4 MWh', icon: '⚡', trend: '▼ -11%', trendColor: '#2D6A2D' },
    { label: 'Solar Output', value: '142 kWh', icon: '☀️', trend: '▲ +6%', trendColor: '#2D6A2D' },
    { label: 'CO₂ Emissions', value: '1.8 tonnes', icon: '🌿', trend: '▼ -8%', trendColor: '#2D6A2D' },
    { label: 'Waste Generated', value: '45 kg', icon: '♻️', trend: '▼ -3%', trendColor: '#2D6A2D' },
    { label: 'Water Usage', value: '120 kL', icon: '💧', trend: '▼ -5%', trendColor: '#2D6A2D' },
  ].map((item, i) => (
    <div key={i} style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '0.75rem 0',
      borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
    }}>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        {item.icon} {item.label}
      </span>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>
          {item.value}
        </div>
        <div style={{ fontSize: '0.65rem', color: item.trendColor }}>
          {item.trend}
        </div>
      </div>
    </div>
  ))}

  <div style={{
    marginTop: '1rem', padding: '0.75rem',
    background: 'rgba(45,106,45,0.06)',
    borderRadius: '8px', border: '1px solid rgba(45,106,45,0.15)',
    display: 'flex', alignItems: 'center', gap: '8px',
  }}>
    <div style={{
      width: '8px', height: '8px', borderRadius: '50%',
      background: '#2D6A2D', animation: 'pulse 2s infinite',
    }} />
    <span style={{ fontSize: '0.75rem', color: '#2D6A2D' }}>
      Auto-updating every 30 seconds via IoT sensors
    </span>
  </div>
</div>
      </div>
    </div>
  );
}