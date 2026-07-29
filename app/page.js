'use client';
import { useState } from 'react';

// Paleta baseada no design limpo e esportivo da referência
const THEME = {
  bg: '#F4F5F9',             // Fundo cinza bem claro e moderno
  cardBg: '#FFFFFF',         // Card branco limpo
  accent: '#FF4757',         // Coral/Vermelho vibrante (energia fitness)
  accentSecondary: '#6C5CE7',// Roxo sutil para badges/contrastes
  textPrimary: '#1E272E',    // Texto escuro de alto contraste
  textSecondary: '#808E9B',  // Texto secundário suave
  border: '#EAECEF'
};

export default function Home() {
  const [workouts] = useState([
    { id: 'A', title: 'Peito & Tríceps', category: 'Hipertrofia', duration: '45 min', color: '#FF4757', icon: '🔥' },
    { id: 'B', title: 'Costas & Bíceps', category: 'Hipertrofia', duration: '50 min', color: '#6C5CE7', icon: '⚡' },
    { id: 'C', title: 'Pernas Completo', category: 'Força', duration: '60 min', color: '#00D2D3', icon: '🏋️‍♀️' },
    { id: 'D', title: 'Ombros & Abdômen', category: 'Definição', duration: '40 min', color: '#FF9F43', icon: '🎯' },
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
        
        {/* Top Header estilo App Mobile */}
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
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.accentSecondary})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)'
          }}>
            4D
          </div>
        </header>

        {/* Card de Resumo de Progresso */}
        <div style={{
          background: 'linear-gradient(135deg, #2D3436 0%, #1E272E 100%)',
          borderRadius: '24px',
          padding: '20px',
          color: '#FFF',
          marginBottom: '28px',
          boxShadow: '0 12px 20px -5px rgba(30, 39, 46, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Plano Ativo</span>
            <h3 style={{ margin: '4px 0 12px 0', fontSize: '1.2rem' }}>Rotina de 4 Dias</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem' }}>
                4 Exercícios/Semana
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: THEME.accent }}>100%</span>
            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.7 }}>Foco Total</p>
          </div>
        </div>

        {/* Título da Seção */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>Meus Treinos</h2>
          <span style={{ fontSize: '0.85rem', color: THEME.accent, fontWeight: '600' }}>4 Treinos</span>
        </div>

        {/* Lista de Treinos Estilo Cards Modernos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {workouts.map((workout) => (
            <div key={workout.id} style={{
              backgroundColor: THEME.cardBg,
              borderRadius: '20px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              border: `1px solid ${THEME.border}`,
              transition: 'all 0.2s ease'
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Badge do Treino A, B, C, D */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  backgroundColor: `${workout.color}15`,
                  color: workout.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: '700'
                }}>
                  {workout.id}
                </div>

                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: THEME.textPrimary }}>
                    {workout.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: THEME.textSecondary, fontWeight: '500' }}>
                      ⏱️ {workout.duration}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: THEME.textSecondary }}>•</span>
                    <span style={{ fontSize: '0.75rem', color: THEME.textSecondary, fontWeight: '500' }}>
                      {workout.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão de Ação Estilo Pílula */}
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
