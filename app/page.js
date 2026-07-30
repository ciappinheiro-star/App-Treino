'use client';
import { useState, useEffect } from 'react';

// Paleta Elegante e Clean (Bege / Off-White + Roxos/Lilás)
const THEME = {
  bgSidebar: '#ECE7F6',
  bgMain: '#FAF6F0',
  cardBg: '#FFFDF9',
  cardBorder: '#D2C1B8',
  textPrimary: '#3A2E2B',
  textSecondary: '#8C7A70',
  accentPurple: '#7C3AED',
  accentMint: '#059669',
  accentBlue: '#2563EB',
  inputBg: '#F3EDE6'
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
      id: 'TREINO_A', title: 'Treino A', category: 'Inferiores & Core', color: THEME.accentPurple, icon: '💪',
      exercises: [
        { id: 'ex_1', name: 'Elevação Pélvica', notes: 'Pausa de 2s no topo', restTime: 60, sets: [
          { id: 1, prev: '20kg x 12', weight: 20, reps: 12, completed: false },
          { id: 2, prev: '20kg x 12', weight: 20, reps: 12, completed: false }
        ]}
      ]
    },
    {
      id: 'TREINO_B', title: 'Treino B', category: 'Superiores Completo', color: THEME.accentBlue, icon: '🎯',
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
      id: `W_${Date.now()}`, title: 'Novo Treino', category: 'Foco do dia', color: THEME.accentPurple, icon: '🏋️‍♂️', exercises: []
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: ${THEME.bgMain}; }
        
        .app-container { display: flex; min-height: 100vh; flex-direction: column; }

        .sidebar {
          background: ${THEME.bgSidebar}; padding: 16px; display: flex; gap: 8px;
          justify-content: space-around; position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
          border-top: 1px solid ${THEME.cardBorder};
        }

        .nav-btn {
          display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 12px;
          border-radius: 12px; border: none; background: transparent; color: ${THEME.textPrimary};
          font-size: 0.75rem; cursor: pointer;
        }

        .nav-btn.active { background: rgba(255, 255, 255, 0.8); font-weight: bold; }

        .main-content { flex: 1; padding: 20px 16px 90px 16px; }

        @media (min-width: 768px) {
          .app-container { flex-direction: row; }
          .sidebar { width: 240px; position: relative; flex-direction: column; justify-content: flex-start; padding: 32px 16px; border-top: none; }
          .nav-btn { flex-direction: row; font-size: 0.95rem; padding: 12px 16px; width: 100%; justify-content: flex-start; }
          .main-content { padding: 40px; }
        }
      `}</style>

      <div className="app-container">
        
        {/* NAVEGAÇÃO / BARRA LATERAL */}
        <aside className="sidebar">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        {/* CONTEÚDO */}
        <main className="main-content">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {/* HEADER */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', color: THEME.textPrimary, fontWeight: '800' }}>🏋️‍♀️ App Treino</h1>
                <p style={{ color: THEME.textSecondary, fontSize: '0.9rem' }}>Seu controle de treino ativo!</p>
              </div>

              {/* CONTADOR DE SESSÕES */}
              <div style={{ background: THEME.cardBg, padding: '8px 16px', borderRadius: '16px', border: `1px solid ${THEME.cardBorder}`, textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: THEME.accentPurple, display: 'block' }}>{totalCompleted}</span>
                <span style={{ fontSize: '0.65rem', color: THEME.textSecondary, fontWeight: '700' }}>SESSÕES</span>
              </div>
            </header>

            {/* CONTEÚDO DA ABA 'MEUS TREINOS' */}
            {activeTab === 'meus-treinos' && (
              <>
                {/* BOTÃO MODO EDIÇÃO */}
                <button 
                  onClick={() => { setIsEditing(!isEditing); setWorkoutSession(null); }}
                  style={{
                    width: '100%', background: isEditing ? THEME.accentMint : THEME.cardBg, 
                    color: isEditing ? '#FFF' : THEME.textPrimary, border: `1px solid ${isEditing ? THEME.accentMint : THEME.cardBorder}`, 
                    padding: '12px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', marginBottom: '20px'
                  }}
                >
                  {isEditing ? '✓ SALVAR ALTERAÇÕES' : '⚙️ PERSONALIZAR FICHAS DE TREINO'}
                </button>

                {/* TIMER FLUTUANTE DE DESCANSO */}
                {restTimer > 0 && !isEditing && (
                  <div style={{
                    position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
                    background: THEME.accentPurple, color: '#FFF', padding: '10px 22px',
                    borderRadius: '30px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', zIndex: 1000, fontWeight: '800'
                  }}>
                    ⏳ DESCANSO: {formatTime(restTimer)}
                  </div>
                )}

                {/* LISTA/GRID DE CARDS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {workouts.map((w) => {
                    const isOpen = activeWorkout === w.id || isEditing;
                    const isRunning = workoutSession?.workoutId === w.id;

                    return (
                      <div key={w.id} style={{
                        position: 'relative', background: THEME.cardBg, borderRadius: '18px',
                        border: `2px solid ${isOpen ? (isRunning ? THEME.accentMint : w.color) : THEME.cardBorder}`, overflow: 'hidden'
                      }}>
                        
                        {/* BARRINHA LATERAL DE STATUS */}
                        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px', background: isRunning ? THEME.accentMint : w.color }} />

                        {/* CABEÇALHO DO CARD */}
                        <div 
                          onClick={() => !isEditing && setActiveWorkout(isOpen ? null : w.id)}
                          style={{ padding: '16px 16px 16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${w.color}15`, color: w.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                              {w.icon}
                            </div>
                            <div>
                              {isEditing ? (
                                <>
                                  <input value={w.title} onChange={(e) => updateWorkoutField(w.id, 'title', e.target.value)} style={{ background: 'transparent', border: '1px dashed #CCC', fontWeight: 'bold' }} />
                                  <input value={w.category} onChange={(e) => updateWorkoutField(w.id, 'category', e.target.value)} style={{ background: 'transparent', border: '1px dashed #CCC', fontSize: '0.8rem', display: 'block' }} />
                                </>
                              ) : (
                                <>
                                  <h3 style={{ margin: 0, fontSize: '1rem', color: THEME.textPrimary }}>{w.title}</h3>
                                  <span style={{ fontSize: '0.8rem', color: THEME.textSecondary }}>{w.category}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {isEditing && (
                            <button onClick={() => deleteWorkout(w.id)} style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
                          )}
                        </div>

                        {/* CONTEÚDO DO TREINO */}
                        {isOpen && (
                          <div style={{ padding: '0 16px 16px 20px', borderTop: `1px solid ${THEME.cardBorder}`, paddingTop: '16px' }}>
                            {!isEditing && (
                              <button 
                                onClick={() => isRunning ? handleFinishWorkout() : setWorkoutSession({ workoutId: w.id, seconds: 0 })}
                                style={{
                                  width: '100%', padding: '12px', borderRadius: '12px',
                                  background: isRunning ? THEME.accentMint : w.color, color: '#FFF', border: 'none', fontWeight: '800', cursor: 'pointer', marginBottom: '16px'
                                }}
                              >
                                {isRunning ? `✓ CONCLUIR SESSÃO (${formatTime(workoutSession.seconds)})` : '▶ INICIAR SESSÃO'}
                              </button>
                            )}

                            {/* EXERCÍCIOS */}
                            {w.exercises.map((ex) => (
                              <div key={ex.id} style={{ background: THEME.inputBg, padding: '12px', borderRadius: '14px', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                  {isEditing ? (
                                    <input value={ex.name} onChange={(e) => updateExerciseField(w.id, ex.id, 'name', e.target.value)} style={{ background: 'transparent', border: '1px dashed #CCC', fontWeight: 'bold' }} />
                                  ) : (
                                    <h4 style={{ margin: 0, color: w.color, fontSize: '0.95rem' }}>{ex.name}</h4>
                                  )}
                                  {isEditing && <button onClick={() => deleteExercise(w.id, ex.id)} style={{ background: 'transparent', color: '#EF4444', border: 'none', cursor: 'pointer' }}>Excluir</button>}
                                </div>

                                <input type="text" value={ex.notes} onChange={(e) => updateExerciseField(w.id, ex.id, 'notes', e.target.value)} placeholder="Anotações..." readOnly={!isEditing} style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '0.8rem', color: THEME.textSecondary, marginBottom: '8px' }} />

                                {/* TABELA DE SÉRIES */}
                                <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 32px', gap: '6px', fontSize: '0.65rem', color: THEME.textSecondary, fontWeight: '700', textAlign: 'center', marginBottom: '6px' }}>
                                  <span>SET</span><span>ANT.</span><span>KG</span><span>REPS</span><span>✓</span>
                                </div>

                                {ex.sets.map((set, idx) => (
                                  <div key={set.id} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 32px', gap: '6px', alignItems: 'center', marginBottom: '6px', textAlign: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: set.completed ? THEME.accentMint : THEME.textPrimary }}>{set.id}</span>
                                    <span style={{ fontSize: '0.7rem', color: THEME.textSecondary }}>{set.prev}</span>
                                    <input type="number" value={set.weight} onChange={(e) => updateSetData(w.id, ex.id, idx, 'weight', e.target.value)} readOnly={!isEditing && set.completed} style={{ width: '100%', textAlign: 'center', padding: '4px', borderRadius: '6px', background: '#FFF', border: `1px solid ${THEME.cardBorder}` }} />
                                    <input type="number" value={set.reps} onChange={(e) => updateSetData(w.id, ex.id, idx, 'reps', e.target.value)} readOnly={!isEditing && set.completed} style={{ width: '100%', textAlign: 'center', padding: '4px', borderRadius: '6px', background: '#FFF', border: `1px solid ${THEME.cardBorder}` }} />
                                    
                                    <div onClick={() => toggleSetComplete(w.id, ex.id, idx, ex.restTime)} style={{
                                      width: '28px', height: '28px', borderRadius: '6px', margin: '0 auto',
                                      background: set.completed ? THEME.accentMint : '#FFF', border: `1px solid ${set.completed ? THEME.accentMint : THEME.cardBorder}`,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                    }}>
                                      {set.completed && <span style={{ color: '#FFF', fontWeight: 'bold' }}>✓</span>}
                                    </div>
                                  </div>
                                ))}

                                <button onClick={() => addSet(w.id, ex.id)} style={{ width: '100%', marginTop: '6px', padding: '6px', background: 'transparent', border: `1px dashed ${THEME.cardBorder}`, color: THEME.textSecondary, borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
                                  + Adicionar Série
                                </button>
                              </div>
                            ))}

                            {isEditing && (
                              <button onClick={() => addNewExercise(w.id)} style={{ width: '100%', padding: '8px', background: '#ECFDF5', color: THEME.accentMint, border: `1px dashed ${THEME.accentMint}`, borderRadius: '8px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>
                                + ADICIONAR EXERCÍCIO
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isEditing && (
                    <button onClick={addNewWorkout} style={{ width: '100%', padding: '14px', background: 'transparent', color: THEME.accentPurple, border: `2px dashed ${THEME.accentPurple}`, borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                      + CRIAR NOVO TREINO
                    </button>
                  )}
                </div>
              </>
            )}

            {/* DEMAIS ABAS */}
            {activeTab !== 'meus-treinos' && (
              <div style={{ background: THEME.cardBg, padding: '32px', borderRadius: '18px', border: `1px solid ${THEME.cardBorder}`, textAlign: 'center', color: THEME.textSecondary }}>
                Página de <strong>{activeTab.toUpperCase()}</strong> em desenvolvimento.
              </div>
            )}

          </div>
        </main>

      </div>
    </>
  );
}
