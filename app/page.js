'use client';
import { useState } from 'react';

const THEME = {
  bgSidebar: '#ECE7F6',
  bgMain: '#FAF6F0',
  cardBg: '#FFFDF9',
  cardBorder: '#D2C1B8',
  textPrimary: '#3A2E2B',
  accentPurple: '#8B5CF6'
};

export default function ResponsiveApp() {
  const [activeTab, setActiveTab] = useState('meus-treinos');

  const navItems = [
    { id: 'visao-geral', label: 'Visão Geral', icon: '🏠' },
    { id: 'perfil', label: 'Perfil', icon: '👤' },
    { id: 'meus-treinos', label: 'Meus Treinos', icon: '📋' },
    { id: 'estatisticas', label: 'Estatísticas', icon: '📈' },
    { id: 'configuracoes', label: 'Configurações', icon: '⚙️' }
  ];

  const workouts = [
    { id: 'A', title: 'A - Pernas & Glúteos', status: 'Pendente', icon: '💪' },
    { id: 'B', title: 'B - Costas & Braços', status: 'Concluído Ontem', icon: '🧘' },
    { id: 'C', title: 'C - Cardio & Abdômen', status: 'Concluído Ontem', icon: '🏃' },
    { id: 'D', title: 'D - Core & Mobilidade', status: 'Concluído Ontem', icon: '🤸' }
  ];

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: ${THEME.bgMain}; }
        
        .app-container {
          display: flex;
          min-height: 100vh;
          flex-direction: column;
        }

        /* SIDEBAR / NAVEGAÇÃO */
        .sidebar {
          background: ${THEME.bgSidebar};
          padding: 16px;
          display: flex;
          gap: 8px;
          justify-content: space-around;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          border-top: 1px solid ${THEME.cardBorder};
        }

        .nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: ${THEME.textPrimary};
          font-size: 0.75rem;
          cursor: pointer;
        }

        .nav-btn.active {
          background: rgba(255, 255, 255, 0.8);
          font-weight: bold;
        }

        /* CONTEÚDO PRINCIPAL */
        .main-content {
          flex: 1;
          padding: 20px 16px 80px 16px; /* Espaço na parte inferior para a Bottom Bar no mobile */
        }

        /* GRID DOS CARDS */
        .workout-grid {
          display: grid;
          grid-template-columns: 1fr; /* 1 coluna no celular */
          gap: 12px;
        }

        /* ADAPTAÇÕES PARA TELA GRANDE (DESKTOP / TABLET) */
        @media (min-width: 768px) {
          .app-container {
            flex-direction: row;
          }

          .sidebar {
            width: 240px;
            position: relative;
            flex-direction: column;
            justify-content: flex-start;
            padding: 32px 16px;
            border-top: none;
          }

          .nav-btn {
            flex-direction: row;
            font-size: 0.95rem;
            padding: 12px 16px;
            width: 100%;
            justify-content: flex-start;
          }

          .main-content {
            padding: 40px;
          }

          .workout-grid {
            grid-template-columns: 1fr 1fr; /* 2 colunas no computador */
            gap: 20px;
          }
        }
      `}</style>

      <div className="app-container">
        
        {/* NAVEGAÇÃO RESPONSIVA */}
        <aside className="sidebar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        {/* ÁREA DE CONTEÚDO */}
        <main className="main-content">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.8rem', color: THEME.textPrimary }}>🏋️‍♀️ App Treino</h1>
            <p style={{ color: '#6B5E57', fontSize: '0.9rem', margin: '4px 0 12px 0' }}>Seu controle de treino ativo!</p>
            
            <div style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '20px',
              background: '#FFFFFF',
              border: `1px solid ${THEME.cardBorder}`,
              color: '#059669',
              fontWeight: '600',
              fontSize: '0.8rem'
            }}>
              ✓ Conexão Vercel + Supabase
            </div>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '14px', color: THEME.textPrimary }}>Meus Treinos</h2>
            
            {/* GRID QUE MUDA DE ACORDO COM O TAMANHO DA TELA */}
            <div className="workout-grid">
              {workouts.map((w) => (
                <div key={w.id} style={{
                  background: THEME.cardBg,
                  border: `2px solid ${THEME.cardBorder}`,
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: '#ECE7F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem'
                  }}>
                    {w.icon}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', color: THEME.textPrimary }}>{w.title}</h3>
                    <span style={{ fontSize: '0.8rem', color: '#8C7A70' }}>{w.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

      </div>
    </>
  );
}
