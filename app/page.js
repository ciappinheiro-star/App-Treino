'use client';
import { useState, useEffect } from 'react';

// Paleta baseada 100% nas imagens enviadas
const THEME = {
  bgSidebar: '#EBE6F5',   // Lilás suave da imagem 1
  bgMain: '#F2F5F9',      // Azul/Cinza clarinho e limpo da imagem 2
  cardBg: '#FFFFFF',      // Cards brancos limpos
  cardBorder: '#E1E7EF',  // Borda sutil dos cards
  textPrimary: '#1E293B',  // Texto escuro
  textSecondary: '#64748B',
  accentBlue: '#2563EB',   // Detalhe lateral Treino A
  accentPurple: '#7C3AED', // Detalhe lateral Treino B
  accentMint: '#059669',   // Para status concluído
  inputBg: '#F8FAFC'
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('meus-treinos');
  const [isEditing, setIsEditing] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutSession, setWorkoutSession] = useState(null);
  const [restTimer, setRestTimer] = useState(null);
  const [totalCompleted, setTotalCompleted] = useState(0);

  const navItems = [
    { id: 'visao-geral', label: 'Visão Geral', icon: '🏠' },
    { id: 'meus-treinos', label: 'Meus Treinos', icon: '📋' },
    { id: 'estatisticas', label: 'Estatísticas', icon: '📈' },
    { id: 'perfil', label: 'Perfil', icon: '👤' },
    { id: 'configuracoes', label: 'Configurações', icon: '⚙️' }
  ];

  const [workouts, setWorkouts] = useState([
    {
      id: 'TREINO_A', title: 'Treino A', category: 'Inferiores & Core', color: THEME.accentBlue, icon: '⚡',
      exercises: [
        { id: 'ex_1', name: 'Elevação Pélvica', notes: 'Pausa de 2s no topo', restTime: 60, sets: [
          { id: 1, prev: '20kg x 12', weight: 20, reps: 12, completed: false },
          { id: 2, prev: '20kg x 12', weight: 20, reps: 12, completed: false }
        ]}
      ]
    },
    {
      id: 'TREINO_B', title: 'Treino B', category: 'Superiores Completo', color: THEME.accentPurple, icon: '🎯',
      exercises: [
        { id: 'ex_2', name: 'Desenvolvimento c/ Halteres', notes: 'Cotovelos fechados', restTime: 60, sets: [
          { id: 1, prev: '6kg x 12', weight: 6, reps: 12, completed: false }
        ]}
      ]
    }
  ]);

  // CRONÔMETRO DE SESSÃO
  useEffect(() => {
    let interval;
    if (workoutSession && !isEditing) {
      interval = setInterval(() => setWorkoutSession(p => ({ ...p, seconds: p.seconds + 1 })), 1000);
    }
    return () => clearInterval(interval);
  }, [workoutSession, isEditing]);

  // TIMER DE DESCANSO
  useEffect(() => {
    let interval;
    if (restTimer > 0 && !isEditing) {
      interval = setInterval(() => setRestTimer(p => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer, isEditing]);

  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // LÓGICA DE EDIÇÃO
  const addNewWorkout = () => {
    const newWorkout = {
      id: `W_${Date.now()}`, title: 'Novo Treino', category: 'Foco do dia', color: THEME.accentBlue, icon: '🏋️‍♂️', exercises: []
    };
    setWorkouts([...workouts, newWorkout]);
    setActiveWorkout(newWorkout.id);
  };

  const deleteWorkout = (wId) => setWorkouts(workouts.filter(w => w.id !== wId));

  const addNewExercise = (wId) => {
    setWorkouts(workouts.map(w => w.id !== wId ? w : {
      ...w, exercises: [...w.exercises, { id: `E_${Date.now()}`, name: 'Novo Exercício', notes: '', restTime: 60, sets: [{ id: 1, prev: '-', weight: 0, reps: 0, completed: false }] }]
    }));
  };

  const deleteExercise = (wId, exId) => {
    setWorkouts(workouts.map(w => w.id !== wId ? w : { ...w, exercises: w.exercises.filter(ex => ex.id !== exId) }));
  };

  const updateWorkoutField = (wId, field, value) => {
    setWorkouts(workouts.map(w => w.id === wId ? { ...w, [field]: value } : w));
  };

  // EXECUÇÃO DE TREINOS
  const handleFinishWorkout = () => {
    setWorkoutSession(null);
    setTotalCompleted(prev => prev + 1);
  };

  const toggleSetComplete = (wId, exId, setIndex, restTime) => {
    if (isEditing) return;
    setWorkouts(workouts.map(w => w.id === wId ? {
      ...w, exercises: w.exercises.map(ex => ex.id === exId ? {
        ...ex, sets: ex.sets.map((s, i) => {
          if (i !== setIndex) return s;
          if (!s.completed) setRestTimer(restTime);
          return { ...s, completed: !s.completed };
        })
      } : ex)
    } : w));
  };

  const addSet = (wId, exId) => {
    setWorkouts(workouts.map(w => w.id === wId ? {
      ...w, exercises: w.exercises.map(ex => {
        if (ex.id !== exId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1] || { weight: 0, reps: 0, prev: '-' };
        return { ...ex, sets: [...ex.sets, { id: ex.sets.length + 1, prev: lastSet.prev, weight: lastSet.weight, reps: lastSet.reps, completed: false }] };
      })
    } : w));
  };

  const updateSetData = (wId, exId, setIndex, field, value) => {
    setWorkouts(workouts.map(w => w.id === wId ? {
      ...w, exercises: w.exercises.map(ex => ex.id === exId ? {
        ...ex, sets: ex.sets.map((s, i) => i === setIndex ? { ...s, [field]: value } : s)
      } : ex)
    } : w));
  };

  const updateExerciseField = (wId, exId, field, value) => {
    setWorkouts(workouts.map(w => w.id === wId ? {
      ...w, exercises: w.exercises.map(ex => ex.id === exId ? { ...ex, [field]: value } : ex)
    } : w));
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: ${THEME.bgMain}; color: ${THEME.textPrimary}; }
        
        .app-container { display: flex; min-height: 100vh; flex-direction: column; }

        /* SIDEBAR (ESTILO IMAGEM 1) */
        .sidebar {
          background: ${THEME.bgSidebar}; 
          padding: 16px; 
          display: flex; 
          gap: 6px;
          justify-content: space-around; 
          position: fixed; 
          bottom: 0; 
          left: 0; 
          right: 0; 
          z-index: 100;
          box-shadow: 0 -4px 12px rgba(0,0,0,0.03);
        }

        .nav-btn {
          display: flex; 
          align-items: center; 
          gap: 12px; 
          padding: 14px 20px;
          border-radius: 18px; 
          border: none; 
          background: transparent; 
          color: ${THEME.textPrimary};
          font-size: 0.95rem; 
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        /* CARD BRANCO ARREDONDADO QUANDO ATIVO (IMAGEM 1) */
        .nav-btn.active { 
          background: #FFFFFF; 
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
          font-weight: 800;
        }

        .main-content { flex: 1; padding: 24px 16px 90px 16px; }

        @media (min-width: 768px) {
          .app-container { flex-direction: row; }
          .sidebar { 
            width: 260px; 
            position: relative; 
            flex-direction: column; 
            justify-content: flex-start; 
            padding: 40px 18px; 
            box-shadow: none;
          }
          .nav-btn { width: 100%; }
          .main-content { padding: 48px; }
        }
      `}</style>

      <div className="app-container">
        
        {/* BARRA LATERAL / MENU (IMAGEM 1) */}
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

        {/* ÁREA PRINCIPAL (IMAGEM 2) */}
        <main className="main-content">
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            
            {/* HEADER DA IMAGEM 2 */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: THEME.accentBlue, fontWeight: '800', letterSpacing: '1px' }}>PRO TRACKER</span>
                <h1 style={{ fontSize: '1.8rem', color: THEME.textPrimary, fontWeight: '800', margin: '2px 0 0 0' }}>Fichas de Treino</h1>
              </div>

              {/* CARD DE SESSÕES CONCLUÍDAS */}
              <div style={{ 
                background: THEME.cardBg, 
                padding: '10px 18px', 
                borderRadius: '20px', 
                border: `1px solid ${THEME.cardBorder}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#EFF6FF', color: THEME.accentBlue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold' }}>
                  ⚡
                </div>
                <div>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', display: 'block', lineHeight: '1' }}>{totalCompleted}</span>
                  <span style={{ fontSize: '0.65rem', color: THEME.textSecondary, fontWeight: '700' }}>SESSÕES</span>
                </div>
              </div>
            </header>

            {/* CONTEÚDO DA ABA 'MEUS TREINOS' */}
            {activeTab === 'meus-treinos' && (
              <>
                {/* BOTÃO PERSONALIZAR FICHAS (IMAGEM 2) */}
                <button 
                  onClick={() => { setIsEditing(!isEditing); setWorkoutSession(null); }}
                  style={{
                    width: '100%', 
                    background: THEME.cardBg, 
                    color: isEditing ? THEME.accentMint : THEME.textPrimary, 
                    border: `1px solid ${isEditing ? THEME.accentMint : THEME.cardBorder}`, 
                    padding: '14px', 
                    borderRadius: '20px', 
                    fontWeight: '800', 
                    fontSize: '0.85rem',
                    letterSpacing: '0.5px',
                    cursor: 'pointer', 
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '8px'
                  }}
                >
                  <span>⚙️</span>
                  <span>{isEditing ? 'SALVAR ALTERAÇÕES' : 'PERSONALIZAR FICHAS'}</span>
                </button>

                {/* TIMER FLUTUANTE DE DESCANSO */}
                {restTimer > 0 && !isEditing && (
                  <div style={{
                    position: 'fixed', bottom: '85px', left: '50%', transform: 'translateX(-50%)',
                    background: THEME.accentBlue, color: '#FFF', padding: '10px 24px',
                    borderRadius: '30px', boxShadow: '0 8px 20px rgba(37,99,235,0.3)', zIndex: 1000, fontWeight: '800'
                  }}>
                    ⏳ DESCANSO: {formatTime(restTimer)}
                  </div>
                )}

                {/* LISTA DE CARDS DE TREINO */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {workouts.map((w) => {
                    const isOpen = activeWorkout === w.id || isEditing;
                    const isRunning = workoutSession?.workoutId === w.id;

                    return (
                      <div key={w.id} style={{
                        position: 'relative', 
                        background: THEME.cardBg, 
                        borderRadius: '24px',
                        border: `1px solid ${THEME.cardBorder}`, 
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                      }}>
                        
                        {/* BARRINHA LATERAL DE STATUS (IMAGEM 2) */}
                        <div style={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: 0, 
                          bottom: 0, 
                          width: '6px', 
                          background: isRunning ? THEME.accentMint : w.color,
                          borderRadius: '6px 0 0 6px'
                        }} />

                        {/* CABEÇALHO DO CARD DE TREINO */}
                        <div 
                          onClick={() => !isEditing && setActiveWorkout(isOpen ? null : w.id)}
                          style={{ padding: '20px 20px 20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                            <div style={{ 
                              width: '46px', height: '46px', borderRadius: '16px', 
                              background: `${w.color}15`, color: w.color, 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' 
                            }}>
                              {w.icon}
                            </div>
                            <div>
                              {isEditing ? (
                                <>
                                  <input value={w.title} onChange={(e) => updateWorkoutField(w.id, 'title', e.target.value)} style={{ background: 'transparent', border: '1px dashed #CBD5E1', fontWeight: 'bold', fontSize: '1rem', outline: 'none' }} />
                                  <input value={w.category} onChange={(e) => updateWorkoutField(w.id, 'category', e.target.value)} style={{ background: 'transparent', border: '1px dashed #CBD5E1', fontSize: '0.8rem', color: THEME.textSecondary, outline: 'none', display: 'block' }} />
                                </>
                              ) : (
                                <>
                                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: THEME.textPrimary }}>{w.title}</h3>
                                  <span style={{ fontSize: '0.8rem', color: THEME.textSecondary, fontWeight: '500' }}>{w.category}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {isEditing && (
                            <button onClick={() => deleteWorkout(w.id)} style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', width: '32px', height: '32px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                          )}
                        </div>

                        {/* EXERCÍCIOS E DETALHES DO TREINO */}
                        {isOpen && (
                          <div style={{ padding: '0 20px 20px 24px', borderTop: `1px solid ${THEME.cardBorder}`, paddingTop: '18px' }}>
                            {!isEditing && (
                              <button 
                                onClick={() => isRunning ? handleFinishWorkout() : setWorkoutSession({ workoutId: w.id, seconds: 0 })}
                                style={{
                                  width: '100%', padding: '12px', borderRadius: '14px',
                                  background: isRunning ? THEME.accentMint : w.color, color: '#FFF', border: 'none', fontWeight: '800', cursor: 'pointer', marginBottom: '16px'
                                }}
                              >
                                {isRunning ? `✓ CONCLUIR SESSÃO (${formatTime(workoutSession.seconds)})` : '▶ INICIAR SESSÃO'}
                              </button>
                            )}

                            {w.exercises.map((ex) => (
                              <div key={ex.id} style={{ background: THEME.inputBg, padding: '14px', borderRadius: '16px', marginBottom: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                  {isEditing ? (
                                    <input value={ex.name} onChange={(e) => updateExerciseField(w.id, ex.id, 'name', e.target.value)} style={{ background: 'transparent', border: '1px dashed #CBD5E1', fontWeight: 'bold', outline: 'none' }} />
                                  ) : (
                                    <h4 style={{ margin: 0, color: w.color, fontSize: '0.95rem', fontWeight: '700' }}>{ex.name}</h4>
                                  )}
                                  {isEditing && <button onClick={() => deleteExercise(w.id, ex.id)} style={{ background: 'transparent', color: '#EF4444', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Excluir</button>}
                                </div>

                                <input type="text" value={ex.notes} onChange={(e) => updateExerciseField(w.id, ex.id, 'notes', e.target.value)} placeholder="Anotações..." readOnly={!isEditing} style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '0.8rem', color: THEME.textSecondary, marginBottom: '10px', outline: 'none' }} />

                                {/* TABELA DE SÉRIES */}
                                <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 32px', gap: '6px', fontSize: '0.65rem', color: THEME.textSecondary, fontWeight: '700', textAlign: 'center', marginBottom: '6px' }}>
                                  <span>SET</span><span>ANT.</span><span>KG</span><span>REPS</span><span>✓</span>
                                </div>

                                {ex.sets.map((set, idx) => (
                                  <div key={set.id} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 32px', gap: '6px', alignItems: 'center', marginBottom: '6px', textAlign: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: set.completed ? THEME.accentMint : THEME.textPrimary }}>{set.id}</span>
                                    <span style={{ fontSize: '0.7rem', color: THEME.textSecondary }}>{set.prev}</span>
                                    <input type="number" value={set.weight} onChange={(e) => updateSetData(w.id, ex.id, idx, 'weight', e.target.value)} readOnly={!isEditing && set.completed} style={{ width: '100%', textAlign: 'center', padding: '6px 2px', borderRadius: '8px', background: '#FFFFFF', border: `1px solid ${THEME.cardBorder}`, fontWeight: '700' }} />
                                    <input type="number" value={set.reps} onChange={(e) => updateSetData(w.id, ex.id, idx, 'reps', e.target.value)} readOnly={!isEditing && set.completed} style={{ width: '100%', textAlign: 'center', padding: '6px 2px', borderRadius: '8px', background: '#FFFFFF', border: `1px solid ${THEME.cardBorder}`, fontWeight: '700' }} />
                                    
                                    <div onClick={() => toggleSetComplete(w.id, ex.id, idx, ex.restTime)} style={{
                                      width: '28px', height: '28px', borderRadius: '8px', margin: '0 auto',
                                      background: set.completed ? THEME.accentMint : '#FFFFFF', border: `1px solid ${set.completed ? THEME.accentMint : THEME.cardBorder}`,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                    }}>
                                      {set.completed && <span style={{ color: '#FFF', fontWeight: 'bold', fontSize: '0.75rem' }}>✓</span>}
                                    </div>
                                  </div>
                                ))}

                                <button onClick={() => addSet(w.id, ex.id)} style={{ width: '100%', marginTop: '6px', padding: '8px', background: 'transparent', border: `1px dashed ${THEME.cardBorder}`, color: THEME.textSecondary, borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>
                                  + Adicionar Série
                                </button>
                              </div>
                            ))}

                            {isEditing && (
                              <button onClick={() => addNewExercise(w.id)} style={{ width: '100%', padding: '10px', background: '#ECFDF5', color: THEME.accentMint, border: `1px dashed ${THEME.accentMint}`, borderRadius: '12px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}>
                                + ADICIONAR EXERCÍCIO
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isEditing && (
                    <button onClick={addNewWorkout} style={{ width: '100%', padding: '16px', background: 'transparent', color: THEME.accentBlue, border: `2px dashed ${THEME.accentBlue}`, borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
                      + CRIAR NOVO TREINO
                    </button>
                  )}
                </div>
              </>
            )}

            {/* DEMAIS ABAS */}
            {activeTab !== 'meus-treinos' && (
              <div style={{ background: THEME.cardBg, padding: '40px', borderRadius: '24px', border: `1px solid ${THEME.cardBorder}`, textAlign: 'center', color: THEME.textSecondary }}>
                Página de <strong>{activeTab.toUpperCase()}</strong> em desenvolvimento.
              </div>
            )}

          </div>
        </main>

      </div>
    </>
  );
}
