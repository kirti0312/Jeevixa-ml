import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const translations = {
  en: {
    title: 'Jeevixa AI',
    subtitle: 'Powered by Gemini',
    placeholder: 'Ask anything about the hospital...',
    send: 'Send',
    thinking: 'AI is thinking...',
    suggestions: [
      'Which ward has highest infection risk?',
      'How can we improve green score?',
      'Which medicines are expiring soon?',
      'How many beds are available?',
    ],
  },
  hi: {
    title: 'जीविक्सा AI',
    subtitle: 'Gemini द्वारा संचालित',
    placeholder: 'अस्पताल के बारे में कुछ भी पूछें...',
    send: 'भेजें',
    thinking: 'AI सोच रहा है...',
    suggestions: [
      'किस वार्ड में सबसे अधिक संक्रमण जोखिम है?',
      'ग्रीन स्कोर कैसे सुधारें?',
      'कौन सी दवाएं जल्द एक्सपायर होंगी?',
      'कितने बेड उपलब्ध हैं?',
    ],
  }
};

export default function AIChatbot({ user, language }) {
  const t = translations[language] || translations.en;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello ${user?.name || 'Doctor'}! 👋 I'm Jeevixa AI, powered by Gemini. I have access to live hospital data. Ask me anything!`,
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (text) => {
    const question = text || input.trim();
    if (!question) return;

    const userMsg = { role: 'user', text: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chatbot', { question });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Sorry, I encountered an error. Please make sure the backend is running and Gemini API key is configured.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px',
          width: '380px', height: '520px',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '20px', display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(107,30,46,0.2)',
          zIndex: 1000, animation: 'fadeUp 0.3s ease both',
          overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: '#6B1E2E',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.1rem',
              }}>
                🤖
              </div>
              <div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '0.875rem', fontWeight: '600',
                  color: '#FAF7F2',
                }}>
                  {t.title}
                </div>
                <div style={{
                  fontSize: '0.65rem', color: 'rgba(250,247,242,0.7)',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <span style={{
                    width: '5px', height: '5px', borderRadius: '50%',
                    background: '#7EC87E', display: 'inline-block',
                    animation: 'pulse 2s infinite',
                  }} />
                  {t.subtitle}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none',
                color: '#FAF7F2', width: '28px', height: '28px',
                borderRadius: '50%', cursor: 'pointer',
                fontSize: '1rem', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1rem',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                animation: 'fadeUp 0.3s ease both',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(107,30,46,0.1)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '0.875rem',
                    flexShrink: 0, marginRight: '0.5rem', marginTop: '2px',
                  }}>
                    🤖
                  </div>
                )}
                <div style={{
                  maxWidth: '75%', padding: '0.75rem 1rem',
                  borderRadius: msg.role === 'user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                  background: msg.role === 'user'
                    ? '#6B1E2E' : 'var(--bg-secondary)',
                  color: msg.role === 'user'
                    ? '#FAF7F2' : 'var(--text-primary)',
                  fontSize: '0.8rem', lineHeight: '1.5',
                  border: msg.role === 'assistant'
                    ? '1px solid var(--border)' : 'none',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: '0.5rem',
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'rgba(107,30,46,0.1)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '0.875rem',
                }}>
                  🤖
                </div>
                <div style={{
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '16px 16px 16px 4px',
                  border: '1px solid var(--border)',
                  display: 'flex', gap: '4px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: '#C4956A',
                      animation: `pulse 1s ease ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div style={{
              padding: '0 1rem 0.75rem',
              display: 'flex', gap: '0.5rem',
              flexWrap: 'wrap',
            }}>
              {t.suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(107,30,46,0.2)',
                    background: 'rgba(107,30,46,0.05)',
                    color: '#6B1E2E', fontSize: '0.7rem',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = 'rgba(107,30,46,0.1)';
                    e.target.style.borderColor = '#6B1E2E';
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = 'rgba(107,30,46,0.05)';
                    e.target.style.borderColor = 'rgba(107,30,46,0.2)';
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid var(--border)',
            display: 'flex', gap: '0.5rem', alignItems: 'center',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !loading && sendMessage()}
              placeholder={t.placeholder}
              style={{
                flex: 1, padding: '0.625rem 0.875rem',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.8rem', outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={e => e.target.style.borderColor = '#C4956A'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: loading || !input.trim() ? '#9B7B6A' : '#6B1E2E',
                border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '0.875rem',
                transition: 'all 0.2s ease', flexShrink: 0,
                color: '#FAF7F2',
              }}
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '56px', height: '56px', borderRadius: '50%',
          background: '#6B1E2E', border: 'none',
          cursor: 'pointer', fontSize: '1.5rem',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(107,30,46,0.4)',
          transition: 'all 0.3s ease', zIndex: 1000,
          color: '#FAF7F2',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(107,30,46,0.5)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(107,30,46,0.4)';
        }}
      >
        {isOpen ? '×' : '🤖'}
      </button>
    </>
  );
}