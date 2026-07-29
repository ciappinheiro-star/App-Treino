'use client';
import { useState } from 'react';

const THEME = {
  bg: '#F4F5F9',
  cardBg: '#FFFFFF',
  accent: '#FF4757',
  textPrimary: '#1E272E',
  textSecondary: '#808E9B',
  border: '#EAECEF',
  success: '#2ED573',
  warningBg: '#FFF8E6',
  warningText: '#7A4F00'
};

const DumbbellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6.5 6.5 11 11" /><path d="m21 21-1-1" /><path d="m3 3 1 1" /><path d="m18 22 4-4" /><path d="m2 6 4-4" /><path d="m3 10 7-7" /><path d="m14 21 7-7" />
  </svg>
);

export default function Home() {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);

  const [workouts] = useState([
    {
      id: 'A',
      title: 'Glúteos & Posterior',
      category: 'Segunda',
      duration: '45 min',
      color: '#FF4757',
      warmup: [
        'Gato-vaca no chão (10 reps lentas)',
        'Rotação torácica deitada de lado (8 cada lado)',
        'Mobilidade de quadril (5 cada lado)',
        'Ponte glútea sem carga (15 reps)',
        'Abdução deitada com elástico (15 reps)'
      ],
      exercises: [
        { name: 'Hip thrust com barra', sets: '4 séries', reps: '10–12 reps', note: 'Pausa 2 seg no topo · queixo recolhido', weight: '23 kg' },
        { name: 'Abdução de quadril na máquina', sets: '3 séries', reps: '15–20 reps', note: 'Controlar a volta devagar · foco glúteo médio', weight: '20–25 kg' },
        { name: 'Kickback na polia baixa', sets: '3 séries', reps: '15 reps/lado', note: 'Excêntrico 2 seg · zero carga na lombar', weight: '5–8 kg' },
        { name: 'Cadeira flexora (DROP SET)', sets: '3 séries', reps: '12 reps + drop 30% + 8 reps', note: 'Sem pausa no drop', weight: '20 kg' },
        { name: 'Prancha lateral', sets: '3 séries', reps: '20–35 seg/lado', note: 'Específica para escoliose em S', weight: 'Corporal' },
      ],
      cooldown: 'Alongamento de psoas (40s) + Figura 4 (40s) + Postura da criança'
    },
    {
      id: 'B',
      title: 'Ombros & Peito',
      category: 'Terça',
      duration: '45 min',
      color: '#6C5CE7',
      warmup: [
        'Rotação torácica deitada de lado (8 cada lado)',
        'Gato-vaca (10 reps)',
        'Ativação escapular (10 reps)',
        'Círculos de ombro com haltere leve (10 cada direção)',
        'Desenvolvimento leve (1 série · 12 reps)'
      ],
      exercises: [
        { name: 'Desenvolvimento com halteres sentada', sets: '4 séries', reps: '10–12 reps', note: 'Excêntrico 3 seg', weight: '6 kg cada' },
        { name: 'BI-SET: Elevação lateral + Frontal', sets: '3 séries', reps: '12–15 reps', note: 'Sentada no banco', weight: '4 kg cada' },
        { name: 'BI-SET: Supino reto + Fly no banco', sets: '3 séries', reps: '10–12 reps', note: 'Deitada no banco', weight: '6 kg / 4 kg' },
        { name: 'Face pull na corda (polia alta)', sets: '3 séries', reps: '15 reps', note: 'Postura + estabilidade escapular', weight: '8–10 kg' },
        { name: 'Dead bug (chão)', sets: '3 séries', reps: '10 reps/lado', note: 'Lombar no chão · movimento lento', weight: 'Corporal' },
      ],
      cooldown: 'Abertura de peito com rolo (1 min) + Alongamento de tríceps + Gato-vaca'
    },
    {
      id: 'C',
      title: 'Quadríceps & Glúteo',
      category: 'Quarta',
      duration: '45 min',
      color: '#00D2D3',
      warmup: [
        'Gato-vaca (10 reps)',
        'Mobilidade de quadril (5 cada lado)',
        'Agachamento livre sem carga (10 reps lentas)',
        'Leg press leve (1 série · 15 reps)'
      ],
      exercises: [
        { name: 'Leg press 45° (pés médios)', sets: '4 séries', reps: '12–15 reps', note: 'Excêntrico 3 seg · lombar presa no banco', weight: '50–60 kg' },
        { name: 'Agachamento goblet com halter', sets: '3 séries', reps: '10–12 reps', note: 'Sem carga axial na coluna', weight: '10–12 kg' },
        { name: 'Afundo reverso com halteres', sets: '3 séries', reps: '10 reps/perna', note: 'Tronco levemente inclinado', weight: '4–6 kg cada' },
        { name: 'Cadeira extensora (DROP SET)', sets: '3 séries', reps: '12 reps + drop 30% + 10 reps', note: 'Progressão dupla', weight: '18–20 kg' },
        { name: 'Bird dog (chão)', sets: '3 séries', reps: '10 reps/lado', note: 'Pausa 2 seg no topo · estabilização escoliose', weight: 'Corporal' },
      ],
      cooldown: 'Figura 4 deitada + Alongamento quadríceps em pé + Postura da criança'
    },
    {
      id: 'D',
      title: 'Costas & Bíceps',
      category: 'Quinta',
      duration: '40 min',
      color: '#FF9F43',
      warmup: [
        'Rotação torácica deitada de lado (8 cada lado)',
        'Ativação escapular (12 reps)',
        'Puxada leve (1 série · 12 reps)',
        'Remada polia leve (1 série · 12 reps)'
      ],
      exercises: [
        { name: 'Remada unilateral com halter', sets: '4 séries', reps: '10–12 reps', note: 'Apoio no banco · coluna neutra', weight: '8 kg' },
        { name: 'BI-SET: Puxada frontal + Remada polia', sets: '3 séries', reps: '10–12 reps', note: 'Mesmo equipamento', weight: '18 kg / 20 kg' },
        { name: 'Face pull na corda (polia alta)', sets: '3 séries', reps: '15 reps', note: 'Manutenção postural e escoliose', weight: '8–10 kg' },
        { name: 'Rosca direta na polia (cabo baixo)', sets: '3 séries', reps: '10–12 reps', note: 'Tensão constante · cotovelos fixos', weight: '10–12 kg' },
      ],
      cooldown: 'Rotação torácica + Abertura de peito + Alongamento de dorsais'
    },
    {
      id: 'E',
      title: 'Braços (Bíceps & Tríceps)',
      category: 'Sexta',
      duration: '40 min',
      color: '#10AC84',
      warmup: [
        'Rotação de punho e cotovelo (10 cada direção)',
        'Círculos de ombro com haltere leve (10 cada direção)',
        'Rosca leve (1 série · 12 reps)',
        'Tríceps pulley leve (1 série · 12 reps)'
      ],
      exercises: [
        { name: 'BI-SET: Rosca direta (DROP) + Martelo', sets: '3 séries', reps: '10–12 reps', note: 'Sentada no banco', weight: '5 kg cada' },
        { name: 'Rosca concentrada com halter', sets: '3 séries', reps: '10–12 reps', note: 'Cotovelo apoiado na coxa', weight: '4–5 kg' },
        { name: 'BI-SET: Tríceps testa + Tríceps coice', sets: '3 séries', reps: '12 reps', note: 'Deitada/sentada no banco', weight: '4–5 kg cada' },
        { name: 'Tríceps pulley corda (DROP SET)', sets: '3 séries', reps: '12 reps + drop 30% + 8 reps', note: 'Polia', weight: '10–12 kg' },
        { name: 'Prancha isométrica', sets: '3 séries', reps: '35–45 seg', note: 'Estabilização lombar de encerramento', weight: 'Corporal' },
      ],
      cooldown: 'Alongamento de tríceps + Alongamento de bíceps na parede + Respiração diafragmática'
    }
  ]);

  const toggleWorkout = (id) => {
    setActiveWorkout(activeWorkout === id ? null : id);
  };

  const toggleComplete = (id, e) => {
    e.stopPropagation();
    if (completedWorkouts.includes(id)) {
      setCompletedWorkouts(completedWorkouts.filter(item => item !== id));
    } else {
      setCompletedWorkouts([...completedWorkouts, id]);
    }
  };

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
            <h3 style={{ margin: '4px 0 10px 0', fontSize: '1.25rem', fontWeight: '700' }}>Rotina de 5 Dias</h3>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
              5 Treinos / Semana
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: THEME.accent }}>
              {completedWorkouts.length} / 5
            </span>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', opacity: 0.7, fontWeight: '600' }}>Concluídos</p>
          </div>
        </div>

        {/* Título da Seção */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>Meus Treinos</h2>
          <span style={{ fontSize: '0.85rem', color: THEME.accent, fontWeight: '700' }}>5 Treinos</span>
        </div>

        {/* Lista de Treinos Expansíveis (A, B, C, D, E) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {workouts.map((workout) => {
            const isOpen = activeWorkout === workout.id;
            const isCompleted = completedWorkouts.includes(workout.id);

            return (
              <div 
                key={workout.id} 
                onClick={() => toggleWorkout(workout.id)}
                style={{
                  backgroundColor: THEME.cardBg,
                  borderRadius: '22px',
                  padding: '16px 20px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  border: `1px solid ${isOpen ? workout.color : THEME.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Badge A, B, C, D, E */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '16px',
                      backgroundColor: isCompleted ? THEME.success : `${workout.color}15`,
                      color: isCompleted ? '#FFF' : workout.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      transition: 'all 0.2s ease'
                    }}>
                      {isCompleted ? '✓' : workout.id}
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

                  {/* Botão de Concluir */}
                  <button 
                    onClick={(e) => toggleComplete(workout.id, e)}
                    style={{
                      backgroundColor: isCompleted ? THEME.success : THEME.accent,
                      color: '#FFF',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '30px',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      boxShadow: `0 4px 12px ${isCompleted ? THEME.success + '40' : THEME.accent + '40'}`
                    }}
                  >
                    {isCompleted ? 'Concluído' : 'Abrir'}
                  </button>
                </div>

                {/* Lista interna de Exercícios + Aquecimento */}
                {isOpen && (
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: `1px solid ${THEME.border}` }}>
                    
                    {/* Bloco de Aquecimento */}
                    <div style={{ 
                      backgroundColor: THEME.warningBg, 
                      padding: '12px 14px', 
                      borderRadius: '14px', 
                      marginBottom: '16px',
                      border: '1px solid #F5D98A'
                    }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: THEME.warningText, display: 'block', marginBottom: '6px' }}>
                        🔥 Aquecimento (5 min - Obrigatório)
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.75rem', color: '#5C3A00' }}>
                        {workout.warmup.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Exercícios */}
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: THEME.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Exercícios do Dia:
                    </h5>
                    
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {workout.exercises.map((ex, idx) => (
                        <li key={idx} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: '#F8F9FA',
                          padding: '12px 14px',
                          borderRadius: '14px'
                        }}>
                          <div style={{ flex: 1, paddingRight: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: '700', fontSize: '0.9rem', color: THEME.textPrimary }}>
                                {ex.name}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: THEME.textSecondary, display: 'block', marginTop: '2px' }}>
                              {ex.reps} • {ex.note}
                            </span>
                          </div>
                          
                          <div style={{ textAlign: 'right' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              backgroundColor: `${workout.color}15`,
                              color: workout.color,
                              padding: '4px 10px',
                              borderRadius: '8px',
                              display: 'inline-block',
                              marginBottom: '4px'
                            }}>
                              {ex.sets}
                            </span>
                            <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: '600', color: THEME.textSecondary }}>
                              {ex.weight}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Desaquecimento */}
                    <div style={{ marginTop: '16px', fontSize: '0.75rem', color: THEME.textSecondary, fontStyle: 'italic' }}>
                      ❄️ <strong>Desaquecimento:</strong> {workout.cooldown}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
