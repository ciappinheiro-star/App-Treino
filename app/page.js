'use client';
import { useState } from 'react';

// Paleta moderna e esportiva
const THEME = {
  bg: '#F4F5F9',
  cardBg: '#FFFFFF',
  accent: '#FF4757',
  textPrimary: '#1E272E',
  textSecondary: '#808E9B',
  border: '#EAECEF'
};

// Ícone principal de haltere para o header
const DumbbellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6.5 6.5 11 11" /><path d="m21 21-1-1" /><path d="m3 3 1 1" /><path d="m18 22 4-4" /><path d="m2 6 4-4" /><path d="m3 10 7-7" /><path d="m14 21 7-7" />
  </svg>
);

export default function Home() {
  const [workouts] = useState([
    { id: 'A', title: 'Peito & Tríceps', category: 'Hipertrofia', duration: '45 min', color: '#FF4757' },
    { id: 'B', title: 'Costas & Bíceps', category: 'Hipertrofia', duration: '50 min', color: '#6C5CE7' },
    { id: 'C', title: 'Pernas Completo', category: 'Força', duration: '60 min', color: '#00D2D3' },
    { id: 'D', title: 'Ombros & Abdômen', category: 'Definição', duration: '40 min', color: '#FF9F43' },
  ]);

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: THEME.bg, 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '24px 16px',
      color: THEME.textPrimary
    }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        
        {/* Header Superior */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '28px' 
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: THEME.textSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Seu Treino Diário
            </span>
            <h1 style={{ margin: '4px 0 0 0', fontSize: '1.75rem', fontWeight: '800', color: THEME.textPrimary }}>
              App Treino
            </h1>
          </div>
          
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${THEME.accent}, #FF6B81)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            boxShadow: '0 8px 16px rgba(255, 71, 87, 0.35)'
          }}>
            <DumbbellIcon />
          </div>
        </header>

        {/* Card de Resumo no Topo */}
        <div style={{
          background: 'linear-gradient(135deg, #2D3436 0%, #1E272E 100%)',
          borderRadius: '24px',
          padding: '22px',
          color: '#FFF',
          marginBottom: '28px',
          boxShadow: '0 12px 20px -5px rgba(30, 39, 46, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700' }}>Plano Ativo</span>
            <h3 style={{ margin: '4px 0 10px 0', fontSize: '1.25rem', fontWeight: '700' }}>Rotina de 4 Dias</h3>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
              4 Treinos / Semana
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: THEME.accent }}>0 / 4</span>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', opacity: 0.7, fontWeight: '600' }}>Concluídos</p>
          </div>
        </div>

        {/* Título da Seção */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>Meus Treinos</h2>
          <span style={{ fontSize: '0.85rem', color: THEME.accent, fontWeight: '700' }}>4 Treinos</span>
        </div>

        {/* Lista de Treinos com Letras A, B, C, D */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {workouts.map((workout) => (
            <div key={workout.id} style={{
              backgroundColor: THEME.cardBg,
              borderRadius: '22px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              border: `1px solid ${THEME.border}`
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Badge A, B, C, D */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  backgroundColor: `${workout.color}15`,
                  color: workout.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: '800'
                }}>
                  {workout.id}
                </div>

                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: THEME.textPrimary }}>
                    {workout.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: THEME.textSecondary, fontWeight: '600' }}>
                      ⏱️ {workout.duration}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: THEME.textSecondary }}>•</span>
                    <span style={{ fontSize: '0.75rem', color: THEME.textSecondary, fontWeight: '600' }}>
                      {workout.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão de Ação */}
              <button style={{
                backgroundColor: THEME.accent,
                color: '#FFF',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: `0 4px 12px ${THEME.accent}40`
              }}>
                Iniciar
              </button>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
