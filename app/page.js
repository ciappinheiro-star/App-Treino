'use client';
import { useState, useEffect } from 'react';

// Paleta Vibrante e Colorida sobre Fundo Roxo Degradê
const THEME = {
  bgGradient: 'linear-gradient(180deg, #2E1065 0%, #1E1B4B 100%)',
  cardBg: 'rgba(255, 255, 255, 0.95)',
  cardBorder: 'rgba(255, 255, 255, 0.2)',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  inputBg: '#F1F5F9'
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('meus-treinos');
  const [isEditing, setIsEditing] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutSession, setWorkoutSession] = useState(null);
  const [restTimer, setRestTimer] = useState(null);
  const [totalCompleted, setTotalCompleted] = useState(12); // Exemplo com histórico inicial

  // Filtro de exercício para o gráfico de evolução
  const [selectedExerciseFilter, setSelectedExerciseFilter] = useState('ex_1');

  const navItems = [
    { id: 'visao-geral', label: 'Início', icon: '🏠', gradient: 'linear-gradient(135deg, #10B981, #059669)', color: '#10B981' },
    { id: 'meus-treinos', label: 'Treinos', icon: '📋', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#8B5CF6' },
    { id: 'estatisticas', label: 'Dados', icon: '📈', gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#3B82F6' },
    { id: 'perfil', label: 'Perfil', icon: '👤', gradient: 'linear-gradient(135deg, #F97316, #EA580C)', color: '#F97316' },
    { id: 'configuracoes', label: 'Ajustes', icon: '⚙️', gradient: 'linear-gradient(135deg, #EC4899, #BE185D)', color: '#EC4899' }
  ];

  const [workouts, setWorkouts] = useState([
    {
      id: 'TREINO_A', title: 'Treino A', category: 'Inferiores & Core', color: '#00D2FF', icon: '⚡',
      exercises: [
        { id: 'ex_1', name: 'Elevação Pélvica', notes: 'Pausa de 2s no topo', restTime: 60, sets: [
          { id: 1, prev: '20kg x 12', weight: 20, reps: 12, completed: false },
          { id: 2, prev: '20kg x 12', weight: 20, reps: 12, completed: false }
        ]}
      ]
    },
    {
      id: 'TREINO_B', title: 'Treino B', category: 'Superiores Completo', color: '#A855F7', icon: '🎯',
      exercises: [
        { id: 'ex_2', name: 'Desenvolvimento c/ Halteres', notes: 'Cotovelos fechados', restTime: 60, sets: [
          { id: 1, prev: '6kg x 12', weight: 6, reps: 12, completed: false }
        ]}
      ]
    },
    {
      id: 'TREINO_C', title: 'Treino C', category: 'Cardio & Abdômen', color: '#10B981', icon: '🏃',
      exercises: [
        { id: 'ex_3', name: 'Prancha Frontal', notes: '3 séries de 45s', restTime: 45, sets: [
          { id: 1, prev: '45s', weight: 0, reps: 45, completed: false }
        ]}
      ]
    },
    {
      id: 'TREINO_D', title: 'Treino D', category: 'Core & Mobilidade', color: '#F59E0B', icon: '🤸',
      exercises: [
        { id: 'ex_4', name: 'Mobilidade Quadril', notes: 'Execução lenta', restTime: 30, sets: [
          { id: 1, prev: '12 reps', weight: 0, reps: 12, completed: false }
        ]}
      ]
    }
  ]);

  // Dados fictícios de evolução para o gráfico da aba Estatísticas
  const exerciseHistory = {
    'ex_1': [
      { week: 'Sem 1', weight: 14 },
      { week: 'Sem 2', weight: 16 },
      { week: 'Sem 3', weight: 18 },
      { week: 'Sem 4', weight: 20 }
    ],
    'ex_2': [
      { week: 'Sem 1', weight: 4 },
      { week: 'Sem 2', weight: 5 },
      { week: 'Sem 3', weight: 5 },
      { week: 'Sem 4', weight: 6 }
    ]
  };

  // Cronômetros
  useEffect(() => {
    let interval;
    if (workoutSession && !isEditing) {
      interval = setInterval(() => setWorkoutSession(p => ({ ...p, seconds: p.seconds + 1 })), 1000);
    }
    return () => clearInterval(interval);
  }, [workoutSession, isEditing]);

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

  // Funções de manipulação do treino
  const addNewWorkout = () => {
    const colors = ['#00D2FF', '#A855F7', '#10B981', '#F59E0B', '#EC4899'];
    const randomColor = colors[workouts.length % colors.length];
    const newWorkout = { id: `W_${Date.now()}`, title: 'Novo Treino', category: 'Foco do dia', color: randomColor, icon: '🏋️‍♂️', exercises: [] };
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
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: ${THEME.bgGradient}; min-height: 100vh; color: #FFF; }
        
        .app-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(16px);
          padding: 12px 16px 20px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          z-index: 100;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .square-nav-btn {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.06);
          color: #A1A1AA;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .square-nav-btn.active {
          color: #FFFFFF;
          border: none;
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
          transform: translateY(-2px);
        }

        .main-content {
          flex: 1;
          padding: 24px 16px 110px 16px;
          max-width: 480px;
          margin: 0 auto;
          width: 100%;
        }
      `}</style>

      <div className="app-container">
        <main className="main-content">
          
          {/* HEADER */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#3B82F6', fontWeight: '800', letterSpacing: '1.5px' }}>PRO TRACKER</span>
              <h1 style={{ fontSize: '1.7rem', color: '#FFF', fontWeight: '800', margin: '2px 0 0 0' }}>
                {activeTab === 'estatisticas' ? 'Desempenho' : 'Fichas de Treino'}
              </h1>
            </div>

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(12px)',
              padding: '8px 14px', 
              borderRadius: '18px', 
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>
                🔥
              </div>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', display: 'block', lineHeight: '1', color: '#FFF' }}>3 sem</span>
                <span style={{ fontSize: '0.6rem', color: '#93C5FD', fontWeight: '700' }}>OFENSIVA</span>
              </div>
            </div>
          </header>

          {/* ABA DE TREINOS */}
          {activeTab === 'meus-treinos' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <button 
                  onClick={() => { setIsEditing(!isEditing); setWorkoutSession(null); }}
                  style={{
                    width: '100%',
                    background: isEditing ? 'linear-gradient(135deg, #10B981, #059669)' : THEME.cardBg, 
                    color: isEditing ? '#FFF' : THEME.textPrimary, 
                    border: 'none', 
                    padding: '16px', 
                    borderRadius: '22px', 
                    fontWeight: '800', 
                    cursor: 'pointer', 
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                  }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    background: isEditing ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    fontSize: '1.2rem'
                  }}>
                    ⚙️
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: '800' }}>
                      {isEditing ? 'SALVAR ALTERAÇÕES' : 'PERSONALIZAR FICHAS'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: isEditing ? '#E2E8F0' : THEME.textSecondary, fontWeight: '500' }}>
                      {isEditing ? 'Concluir modificações' : 'Criar, editar e excluir treinos'}
                    </span>
                  </div>
                </button>
              </div>

              {restTimer > 0 && !isEditing && (
                <div style={{
                  position: 'fixed', bottom: '95px', left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', color: '#FFF', padding: '12px 26px',
                  borderRadius: '30px', boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)', zIndex: 1000, fontWeight: '800', fontSize: '0.85rem'
                }}>
                  ⏳ DESCANSO: {formatTime(restTimer)}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {workouts.map((w) => {
                  const isOpen = activeWorkout === w.id || isEditing;
                  const isRunning = workoutSession?.workoutId === w.id;

                  return (
                    <div key={w.id} style={{
                      position: 'relative', 
                      background: THEME.cardBg, 
                      borderRadius: '24px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                      color: THEME.textPrimary
                    }}>
                      <div style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        bottom: 0, 
                        width: '8px', 
                        background: isRunning ? '#10B981' : w.color
                      }} />

                      <div 
                        onClick={() => !isEditing && setActiveWorkout(isOpen ? null : w.id)}
                        style={{ padding: '20px 20px 20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                          <div style={{ 
                            width: '46px', height: '46px', borderRadius: '16px', 
                            background: `${w.color}20`, color: w.color, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 'bold' 
                          }}>
                            {w.icon}
                          </div>
                          <div>
                            {isEditing ? (
                              <>
                                <input value={w.title} onChange={(e) => updateWorkoutField(w.id, 'title', e.target.value)} style={{ background: 'transparent', border: '1px dashed #CBD5E1', fontWeight: '800', fontSize: '1rem', outline: 'none', width: '100%', color: THEME.textPrimary }} />
                                <input value={w.category} onChange={(e) => updateWorkoutField(w.id, 'category', e.target.value)} style={{ background: 'transparent', border: '1px dashed #CBD5E1', fontSize: '0.75rem', color: THEME.textSecondary, outline: 'none', width: '100%', display: 'block' }} />
                              </>
                            ) : (
                              <>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: THEME.textPrimary }}>{w.title}</h3>
                                <span style={{ fontSize: '0.8rem', color: THEME.textSecondary, fontWeight: '600' }}>{w.category}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {isEditing && (
                          <button onClick={() => deleteWorkout(w.id)} style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', width: '34px', height: '34px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                        )}
                      </div>

                      {isOpen && (
                        <div style={{ padding: '0 20px 20px 24px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                          {!isEditing && (
                            <button 
                              onClick={() => isRunning ? handleFinishWorkout() : setWorkoutSession({ workoutId: w.id, seconds: 0 })}
                              style={{
                                width: '100%', padding: '14px', borderRadius: '16px',
                                background: isRunning ? '#10B981' : w.color, color: '#FFF', border: 'none', fontWeight: '800', cursor: 'pointer', marginBottom: '16px', fontSize: '0.85rem',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                              }}
                            >
                              {isRunning ? `✓ CONCLUIR SESSÃO (${formatTime(workoutSession.seconds)})` : '▶ INICIAR SESSÃO'}
                            </button>
                          )}

                          {w.exercises.map((ex) => (
                            <div key={ex.id} style={{ background: THEME.inputBg, padding: '14px', borderRadius: '18px', marginBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                {isEditing ? (
                                  <input value={ex.name} onChange={(e) => updateExerciseField(w.id, ex.id, 'name', e.target.value)} style={{ background: 'transparent', border: '1px dashed #CBD5E1', fontWeight: 'bold', outline: 'none', color: THEME.textPrimary }} />
                                ) : (
                                  <h4 style={{ margin: 0, color: w.color, fontSize: '0.95rem', fontWeight: '800' }}>{ex.name}</h4>
                                )}
                                {isEditing && <button onClick={() => deleteExercise(w.id, ex.id)} style={{ background: 'transparent', color: '#EF4444', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Excluir</button>}
                              </div>

                              <input type="text" value={ex.notes} onChange={(e) => updateExerciseField(w.id, ex.id, 'notes', e.target.value)} placeholder="Anotações..." readOnly={!isEditing} style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '0.75rem', color: THEME.textSecondary, marginBottom: '8px', outline: 'none' }} />

                              <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 32px', gap: '6px', fontSize: '0.65rem', color: THEME.textSecondary, fontWeight: '700', textAlign: 'center', marginBottom: '6px' }}>
                                <span>SET</span><span>ANT.</span><span>KG</span><span>REPS</span><span>✓</span>
                              </div>

                              {ex.sets.map((set, idx) => (
                                <div key={set.id} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 32px', gap: '6px', alignItems: 'center', marginBottom: '6px', textAlign: 'center' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: set.completed ? '#10B981' : THEME.textPrimary }}>{set.id}</span>
                                  <span style={{ fontSize: '0.7rem', color: THEME.textSecondary }}>{set.prev}</span>
                                  <input type="number" value={set.weight} onChange={(e) => updateSetData(w.id, ex.id, idx, 'weight', e.target.value)} readOnly={!isEditing && set.completed} style={{ width: '100%', textAlign: 'center', padding: '6px 2px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontWeight: '700', fontSize: '0.8rem', color: THEME.textPrimary }} />
                                  <input type="number" value={set.reps} onChange={(e) => updateSetData(w.id, ex.id, idx, 'reps', e.target.value)} readOnly={!isEditing && set.completed} style={{ width: '100%', textAlign: 'center', padding: '6px 2px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontWeight: '700', fontSize: '0.8rem', color: THEME.textPrimary }} />
                                  
                                  <div onClick={() => toggleSetComplete(w.id, ex.id, idx, ex.restTime)} style={{
                                    width: '28px', height: '28px', borderRadius: '8px', margin: '0 auto',
                                    background: set.completed ? '#10B981' : '#FFFFFF', border: `1px solid ${set.completed ? '#10B981' : '#CBD5E1'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                  }}>
                                    {set.completed && <span style={{ color: '#FFF', fontWeight: 'bold', fontSize: '0.75rem' }}>✓</span>}
                                  </div>
                                </div>
                              ))}

                              <button onClick={() => addSet(w.id, ex.id)} style={{ width: '100%', marginTop: '6px', padding: '6px', background: 'transparent', border: '1px dashed #CBD5E1', color: THEME.textSecondary, borderRadius: '8px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: '600' }}>
                                + Adicionar Série
                              </button>
                            </div>
                          ))}

                          {isEditing && (
                            <button onClick={() => addNewExercise(w.id)} style={{ width: '100%', padding: '10px', background: '#ECFDF5', color: '#059669', border: '1px dashed #059669', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>
                              + ADICIONAR EXERCÍCIO
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {isEditing && (
                  <button onClick={addNewWorkout} style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.1)', color: '#FFF', border: '2px dashed rgba(255,255,255,0.4)', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
                    + CRIAR NOVO TREINO
                  </button>
                )}
              </div>
            </>
          )}

          {/* ABA DE ESTATÍSTICAS / DESEMPENHO */}
          {activeTab === 'estatisticas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* FREQUÊNCIA DA SEMANA (HABIT TRACKER) */}
              <div style={{ background: THEME.cardBg, padding: '20px', borderRadius: '24px', color: THEME.textPrimary, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Frequência da Semana</h3>
                  <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '700', background: '#ECFDF5', padding: '4px 10px', borderRadius: '10px' }}>3 de 4 Treinos</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {[
                    { day: 'S', done: true },
                    { day: 'T', done: true },
                    { day: 'Q', done: false },
                    { day: 'Q', done: true },
                    { day: 'S', done: false },
                    { day: 'S', done: false },
                    { day: 'D', done: false }
                  ].map((item, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <div style={{ 
                        width: '38px', height: '38px', borderRadius: '12px', 
                        background: item.done ? 'linear-gradient(135deg, #10B981, #059669)' : THEME.inputBg,
                        color: item.done ? '#FFF' : THEME.textSecondary,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '800', fontSize: '0.85rem'
                      }}>
                        {item.done ? '✓' : ''}
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: THEME.textSecondary }}>{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* EVOLUÇÃO DE CARGAS (GRÁFICO SIMULADO) */}
              <div style={{ background: THEME.cardBg, padding: '20px', borderRadius: '24px', color: THEME.textPrimary, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Evolução de Carga</h3>
                  <select 
                    value={selectedExerciseFilter} 
                    onChange={(e) => setSelectedExerciseFilter(e.target.value)}
                    style={{ background: THEME.inputBg, border: 'none', padding: '6px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '700', color: THEME.textPrimary, outline: 'none' }}
                  >
                    <option value="ex_1">Elevação Pélvica</option>
                    <option value="ex_2">Desenvolvimento</option>
                  </select>
                </div>

                {/* GRÁFICO EM BARRAS INTERATIVO */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', paddingTop: '20px', paddingBottom: '10px', borderBottom: `1px solid ${THEME.inputBg}` }}>
                  {(exerciseHistory[selectedExerciseFilter] || []).map((item, idx) => {
                    const maxWeight = 25;
                    const heightPercent = (item.weight / maxWeight) * 100;

                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#3B82F6' }}>{item.weight}kg</span>
                        <div style={{ 
                          width: '24px', 
                          height: `${heightPercent}%`, 
                          background: 'linear-gradient(180deg, #3B82F6, #1D4ED8)', 
                          borderRadius: '8px 8px 4px 4px',
                          transition: 'height 0.3s ease'
                        }} />
                        <span style={{ fontSize: '0.65rem', color: THEME.textSecondary, fontWeight: '600' }}>{item.week}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FOCO MUSCULAR MENSAL */}
              <div style={{ background: THEME.cardBg, padding: '20px', borderRadius: '24px', color: THEME.textPrimary, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '14px' }}>Divisão por Grupo Muscular</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Inferiores & Glúteos', percent: 45, color: '#00D2FF' },
                    { label: 'Superiores', percent: 35, color: '#A855F7' },
                    { label: 'Cardio & Core', percent: 20, color: '#10B981' }
                  ].map((group, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px' }}>
                        <span>{group.label}</span>
                        <span style={{ color: THEME.textSecondary }}>{group.percent}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: THEME.inputBg, borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${group.percent}%`, height: '100%', background: group.color, borderRadius: '4px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* DEMAIS ABAS */}
          {activeTab !== 'meus-treinos' && activeTab !== 'estatisticas' && (
            <div style={{ background: THEME.cardBg, padding: '40px 20px', borderRadius: '24px', textAlign: 'center', color: THEME.textSecondary }}>
              Página de <strong style={{ color: THEME.textPrimary }}>{activeTab.toUpperCase()}</strong> em desenvolvimento.
            </div>
          )}

        </main>

        {/* NAVEGAÇÃO FIXA INFERIOR */}
        <nav className="bottom-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                className={`square-nav-btn ${isActive ? 'active' : ''}`}
                style={{
                  background: isActive ? item.gradient : 'rgba(255, 255, 255, 0.06)'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: isActive ? '800' : '600',
                  color: isActive ? '#FFF' : '#A1A1AA' 
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

      </div>
    </>
  );
}
