'use client';
import { useState } from 'react';

export default function Home() {
  const [workouts, setWorkouts] = useState([
    { id: 1, title: 'Treino A - Peito e Tríceps', category: 'Hipertrofia' },
    { id: 2, title: 'Treino B - Costas e Bíceps', category: 'Hipertrofia' },
    { id: 3, title: 'Treino C - Pernas Completo', category: 'Força' },
    { id: 4, title: 'Treino D - Ombros e Abdômen', category: 'Definição' },
  ]);

  return (
    <main style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <span style={{ fontSize: '2rem' }}>🏋️‍♂️</span>
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#111' }}>App Treino</h1>
      </header>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <h2 style={{ fontSize: '1.2rem', marginTop: 0, color: '#334155' }}>Meus Treinos (4 Fases)</h2>
        
        <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0 0' }}>
          {workouts.map((workout) => (
            <li key={workout.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '14px 18px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <div>
                <strong style={{ display: 'block', color: '#0f172a' }}>{workout.title}</strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{workout.category}</span>
              </div>
              <button style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                Iniciar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
