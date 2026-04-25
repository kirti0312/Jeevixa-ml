import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ onLogin, theme }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', role: 'admin' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { value: 'admin', label: 'Admin', icon: '👑', desc: 'Full Access' },
    { value: 'doctor', label: 'Doctor', icon: '🩺', desc: 'Clinical Access' },
    { value: 'nurse', label: 'Nurse', icon: '💉', desc: 'Ward Access' },
  ];

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      onLogin(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role) => {
    const creds = {
      admin: { email: 'admin@jeevixa.com', password: 'admin123' },
      doctor: { email: 'doctor@jeevixa.com', password: 'doctor123' },
      nurse: { email: 'nurse@jeevixa.com', password: 'nurse123' },
    };
    setFormData({ ...formData, ...creds[role], role });
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      fontFamily: "'DM Sans', sans-serif",
      background: '#FAF7F2',
    }}>

      {/* Left Side */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem', background: '#FFFFFF',
        borderRight: '1px solid #E8D5C4',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Background circles */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,149,106,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-50px', left: '-50px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(107,30,46,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.5rem', fontWeight: '700',
            color: '#6B1E2E', letterSpacing: '3px',
            marginBottom: '0.5rem',
          }}>
            ✦ JEEVIXA
          </div>
          <div style={{ fontSize: '0.75rem', color: '#C4956A', letterSpacing: '2px' }}>
            SMART HOSPITAL OS
          </div>
        </div>

        {/* Features */}
        {[
          { icon: '🤖', title: 'AI-Powered', desc: 'Gemini AI analyzes live hospital data' },
          { icon: '🌿', title: 'Sustainable', desc: 'Track and reduce carbon emissions' },
          { icon: '🛡️', title: 'Secure', desc: 'Role-based access control' },
        ].map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '1rem', borderRadius: '12px',
            background: 'rgba(107,30,46,0.03)',
            border: '1px solid rgba(107,30,46,0.06)',
            marginBottom: '0.75rem', width: '100%', maxWidth: '360px',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(107,30,46,0.08)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.25rem',
              flexShrink: 0,
            }}>
              {f.icon}
            </div>
            <div>
              <div style={{ fontWeight: '500', fontSize: '0.875rem', color: '#2C1810' }}>{f.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#9B7B6A' }}>{f.desc}</div>
            </div>
          </div>
        ))}

        {/* Trust badge */}
        <div style={{
          marginTop: '2rem', padding: '0.75rem 1.5rem',
          borderRadius: '20px', background: 'rgba(107,30,46,0.05)',
          border: '1px solid rgba(107,30,46,0.1)',
          fontSize: '0.75rem', color: '#6B4C3B',
          textAlign: 'center',
        }}>
          🇮🇳 Built for Indian Healthcare · Powered by Gemini AI
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '3rem',
      }}>
        <div style={{
          width: '100%', maxWidth: '420px',
          background: '#FFFFFF', borderRadius: '20px',
          border: '1px solid #E8D5C4', padding: '2.5rem',
          boxShadow: '0 8px 40px rgba(107,30,46,0.1)',
        }}>

          {/* Form Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.75rem', color: '#2C1810',
              marginBottom: '0.5rem',
            }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#9B7B6A' }}>
              Sign in to access Jeevixa OS
            </p>
          </div>

          {/* Role Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              fontSize: '0.75rem', color: '#9B7B6A',
              letterSpacing: '1px', textTransform: 'uppercase',
              display: 'block', marginBottom: '0.5rem',
            }}>
              Login As
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {roles.map(role => (
                <div
                  key={role.value}
                  onClick={() => { setFormData({ ...formData, role: role.value }); quickLogin(role.value); }}
                  style={{
                    padding: '0.75rem 0.5rem', borderRadius: '10px',
                    border: `1px solid ${formData.role === role.value ? '#6B1E2E' : '#E8D5C4'}`,
                    background: formData.role === role.value ? 'rgba(107,30,46,0.06)' : '#FAF7F2',
                    cursor: 'pointer', textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: '1.25rem', marginBottom: '2px' }}>{role.icon}</div>
                  <div style={{
                    fontSize: '0.75rem', fontWeight: '500',
                    color: formData.role === role.value ? '#6B1E2E' : '#6B4C3B',
                  }}>
                    {role.label}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#9B7B6A' }}>{role.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              fontSize: '0.75rem', color: '#9B7B6A',
              letterSpacing: '1px', textTransform: 'uppercase',
              display: 'block', marginBottom: '0.5rem',
            }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              style={{
                width: '100%', padding: '0.75rem 1rem',
                border: '1px solid #E8D5C4', borderRadius: '10px',
                background: '#FAF7F2', color: '#2C1810',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.875rem', outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={e => { e.target.style.borderColor = '#C4956A'; e.target.style.boxShadow = '0 0 0 3px rgba(196,149,106,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#E8D5C4'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              fontSize: '0.75rem', color: '#9B7B6A',
              letterSpacing: '1px', textTransform: 'uppercase',
              display: 'block', marginBottom: '0.5rem',
            }}>
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              onKeyPress={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', padding: '0.75rem 1rem',
                border: '1px solid #E8D5C4', borderRadius: '10px',
                background: '#FAF7F2', color: '#2C1810',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.875rem', outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={e => { e.target.style.borderColor = '#C4956A'; e.target.style.boxShadow = '0 0 0 3px rgba(196,149,106,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#E8D5C4'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '0.75rem', borderRadius: '8px',
              background: 'rgba(107,30,46,0.08)',
              border: '1px solid rgba(107,30,46,0.2)',
              color: '#6B1E2E', fontSize: '0.875rem',
              marginBottom: '1rem', textAlign: 'center',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '0.875rem',
              background: loading ? '#9B7B6A' : '#6B1E2E',
              color: '#FAF7F2', border: 'none',
              borderRadius: '10px', fontSize: '1rem',
              fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(107,30,46,0.3)',
            }}
            onMouseEnter={e => { if (!loading) e.target.style.background = '#4A0F1E'; }}
            onMouseLeave={e => { if (!loading) e.target.style.background = '#6B1E2E'; }}
          >
            {loading ? 'Signing in...' : 'Sign In to Jeevixa →'}
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '1rem', margin: '1.5rem 0',
          }}>
            <div style={{ flex: 1, height: '1px', background: '#E8D5C4' }} />
            <span style={{ fontSize: '0.75rem', color: '#9B7B6A' }}>Quick Login</span>
            <div style={{ flex: 1, height: '1px', background: '#E8D5C4' }} />
          </div>

          {/* Quick Login */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
            {roles.map(role => (
              <button
                key={role.value}
                onClick={() => quickLogin(role.value)}
                style={{
                  padding: '0.5rem', borderRadius: '8px',
                  border: '1px solid #E8D5C4',
                  background: 'transparent', cursor: 'pointer',
                  fontSize: '0.75rem', color: '#6B4C3B',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.target.style.borderColor = '#C4956A'; e.target.style.color = '#C4956A'; }}
                onMouseLeave={e => { e.target.style.borderColor = '#E8D5C4'; e.target.style.color = '#6B4C3B'; }}
              >
                {role.icon} {role.label}
              </button>
            ))}
          </div>

          {/* Back */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <span
              onClick={() => navigate('/')}
              style={{
                fontSize: '0.8rem', color: '#9B7B6A',
                cursor: 'pointer', transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => e.target.style.color = '#6B1E2E'}
              onMouseLeave={e => e.target.style.color = '#9B7B6A'}
            >
              ← Back to Home
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}