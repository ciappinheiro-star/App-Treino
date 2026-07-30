'use client';
import { useState, useEffect } from 'react';

// Paleta Unissex, Moderna e Elegante (Dark Slate + Cyber Accents)
const THEME = {
  bg: 'linear-gradient(180deg, #0F172A 0%, #020617 100%)',
  cardBg: 'rgba(30, 41, 59, 0.6)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  accentTeal: '#00F2FE',   // Azul/Ciano vibrante unissex
  accentBlue: '#3B82F6',   // Azul clássico
  accentPurple: '#8B5CF6', // Roxo elétrico
  accentGreen: '#10B981',  // Verde esmeralda para conclusão
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  inputBg: 'rgba(15, 23, 42, 0.6)'
};

export default function Home() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutSession, setWorkoutSession] = useState(null);
  const [restTimer, setRestTimer] = useState(null);
  const [totalCompleted, setTotalCompleted] = useState(0);

  const [workouts, setWorkouts] = useState([
    {
      id: 'TREINO_A', title: 'Treino A', category: 'Inferiores & Core', color: THEME.accentTeal, icon: '⚡',
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
        { id: 'ex_2', name: 'Desenvolvimento c/ Halteres', notes: 'Cotovelos levemente fechados', restTime: 60, sets: [
          { id: 1, prev: '6kg x 12', weight: 6, reps: 12, completed: false }
        ]}
      ]
    }
  ]);

  // CRONÔMETROS
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

  // FUNÇÕES DE EDIÇÃO
  const addNewWorkout = () => {
    const newWorkout = {
      id: `W_${Date.now()}`,
      title: 'Novo Treino',
      category: 'Foco do dia',
      color: THEME.accentBlue,
      icon: '🏋️‍♂️',
      exercises: []
    };
    setWorkouts([...workouts, newWorkout]);
    setActiveWorkout(newWorkout.id);
  };

  const deleteWorkout = (wId) => {
    setWorkouts(workouts.filter(w => w.id !== wId));
  };

  const addNewExercise = (wId) => {
    setWorkouts(workouts.map(w => {
      if (w.id !== wId) return w;
      return {
        ...w,
        exercises: [...w.exercises, {
          id: `E_${Date.now()}`,
          name: 'Novo Exercício',
          notes: '',
          restTime: 60,
          sets: [{ id: 1, prev: '-', weight: 0, reps: 0, completed: false }]
        }]
      };
    }));
  };

  const deleteExercise = (wId, exId) => {
    setWorkouts(workouts.map(w => {
      if (w.id !== wId) return w;
      return { ...w, exercises: w.exercises.filter(ex => ex.id !== exId) };
    }));
  };

  const updateWorkoutField = (wId, field, value) => {
    setWorkouts(workouts.map(w => w.id === wId ? { ...w, [field]: value } : w));
  };

  // EXECUÇÃO DE TREINO
  const handleFinishWorkout = (wId) => {
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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        body { margin: 0; padding: 0; background: #020617; }
        * { box-sizing: border-box; }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>

      <main style={{ minHeight: '100vh', background: THEME.bg, fontFamily: '"Outfit", sans-serif', padding: '24px 16px', color: THEME.textPrimary }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          
          {/* HEADER */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: THEME.accentTeal, fontWeight: '800', letterSpacing: '1.5px' }}>PRO TRACKER</span>
              </div>
              <h1 style={{ margin: '2px 0 0 0', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Fichas de Treino</h1>
            </div>
            
            {/* CARD DE PROGRESSO */}
            <div style={{
              background: THEME.cardBg, padding: '8px 14px', borderRadius: '18px',
              backdropFilter: 'blur(12px)', border: `1px solid ${THEME.cardBorder}`, display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: `linear-gradient(135deg, ${THEME.accentTeal}, ${THEME.accentPurple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#000', fontWeight: '800' }}>
                ⚡
              </div>
              <div>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFF', display: 'block', lineHeight: '1' }}>{totalCompleted}</span>
                <span style={{ fontSize: '0.65rem', color: THEME.textSecondary, fontWeight: '700' }}>SESSÕES</span>
              </div>
            </div>
          </header>

          {/* BOTÃO EDITAR */}
          <button 
            onClick={() => { setIsEditing(!isEditing); setWorkoutSession(null); }}
            style={{
              width: '100%', background: isEditing ? THEME.accentGreen : 'rgba(255,255,255,0.06)', 
              color: isEditing ? '#000' : THEME.textPrimary, border: `1px solid ${isEditing ? THEME.accentGreen : THEME.cardBorder}`, 
              padding: '12px', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', transition: '0.3s',
              display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', marginBottom: '24px', fontSize: '0.85rem', letterSpacing: '0.5px'
            }}
          >
            {isEditing ? '✓ SALVAR ALTERAÇÕES' : '⚙️ PERSONALIZAR FICHAS'}
          </button>

          {/* TIMER FLUTUANTE */}
          {restTimer > 0 && !isEditing && (
            <div style={{
              position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
              background: `linear-gradient(135deg, ${THEME.accentTeal}, ${THEME.accentBlue})`, color: '#000', padding: '10px 22px',
              borderRadius: '30px', boxShadow: '0 10px 25px rgba(0, 242, 254, 0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800'
            }}>
              <span>⏳ DESCANSO</span>
              <span style={{ fontSize: '1.2rem' }}>{formatTime(restTimer)}</span>
            </div>
          )}

          {/* LISTA DE CARDS DE TREINO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {workouts.map((w) => {
              const isOpen = activeWorkout === w.id || isEditing;
              const isRunning = workoutSession?.workoutId === w.id;

              return (
                <div key={w.id} style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: THEME.cardBg,
                  backdropFilter: 'blur(16px)',
                  borderRadius: '20px',
                  border: `1px solid ${isOpen ? `${w.color}50` : THEME.cardBorder}`,
                  transition: 'all 0.3s ease',
                  boxShadow: isOpen && !isEditing ? `0 10px 25px ${w.color}15` : 'none'
                }}>
                  
                  {/* ABA LATERAL COLORIDA DE STATUS */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, bottom: 0, width: '5px',
                    background: isRunning ? THEME.accentGreen : w.color
                  }} />

                  {/* CABEÇALHO DO CARD */}
                  <div 
                    onClick={() => !isEditing && setActiveWorkout(isOpen ? null : w.id)} 
                    style={{ padding: '18px 18px 18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: isEditing ? 'default' : 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${w.color}20`, color: w.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: `1px solid ${w.color}40`, fontWeight: '800' }}>
                        {w.icon || '🏋️‍♂️'}
                      </div>
                      <div style={{ flex: 1 }}>
                        {isEditing ? (
                          <>
                            <input value={w.title} onChange={(e) => updateWorkoutField(w.id, 'title', e.target.value)} 
                              style={{ width: '90%', background: 'transparent', border: `1px dashed ${THEME.cardBorder}`, color: '#FFF', fontWeight: '700', fontSize: '1.1rem', marginBottom: '2px', outline: 'none' }} />
                            <input value={w.category} onChange={(e) => updateWorkoutField(w.id, 'category', e.target.value)} 
                              style={{ width: '90%', background: 'transparent', border: `1px dashed ${THEME.cardBorder}`, color: THEME.textSecondary, fontSize: '0.8rem', outline: 'none' }} />
                          </>
                        ) : (
                          <>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>{w.title}</h3>
                            <span style={{ fontSize: '0.8rem', color: THEME.textSecondary, fontWeight: '500' }}>{w.category}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <button onClick={() => deleteWorkout(w.id)} style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#F43F5E', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                    )}
                  </div>

                  {/* CONTEÚDO DO TREINO */}
                  {isOpen && (
                    <div style={{ padding: '0 18px 18px 22px', borderTop: `1px solid ${THEME.cardBorder}`, paddingTop: '16px' }}>
                      
                      {!isEditing && (
                        <button 
                          onClick={() => isRunning ? handleFinishWorkout(w.id) : setWorkoutSession({ workoutId: w.id, seconds: 0 })}
                          style={{
                            width: '100%', padding: '14px', borderRadius: '14px',
                            background: isRunning ? THEME.accentGreen : `linear-gradient(135deg, ${w.color}, ${THEME.accentBlue})`,
                            color: isRunning ? '#FFF' : '#000', border: 'none', fontWeight: '800', cursor: 'pointer', marginBottom: '20px', fontSize: '0.9rem',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {isRunning ? `✓ CONCLUIR SESSÃO (${formatTime(workoutSession.seconds)})` : '▶ INICIAR SESSÃO'}
                        </button>
                      )}

                      {/* EXERCÍCIOS */}
                      {w.exercises.map((ex) => (
                        <div key={ex.id} style={{ background: THEME.inputBg, padding: '14px', borderRadius: '16px', marginBottom: '16px', border: `1px solid ${isEditing ? THEME.accentGreen : THEME.cardBorder}` }}>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            {isEditing ? (
                              <input value={ex.name} onChange={(e) => updateExerciseField(w.id, ex.id, 'name', e.target.value)}
                                style={{ flex: 1, background: 'transparent', border: `1px dashed ${THEME.cardBorder}`, color: w.color, fontWeight: '700', fontSize: '1rem', marginRight: '8px' }} />
                            ) : (
                              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: w.color, flex: 1 }}>{ex.name}</h4>
                            )}
                            
                            {isEditing && (
                              <button onClick={() => deleteExercise(w.id, ex.id)} style={{ background: 'transparent', color: '#F43F5E', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>Excluir</button>
                            )}
                          </div>

                          <input type="text" value={ex.notes} onChange={(e) => updateExerciseField(w.id, ex.id, 'notes', e.target.value)} placeholder="Anotações..."
                            readOnly={!isEditing} style={{ width: '100%', background: 'transparent', border: 'none', padding: '0 0 10px 0', fontSize: '0.8rem', color: THEME.textSecondary, outline: 'none' }}
                          />

                          {/* TABELA DE SÉRIES */}
                          <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 32px', gap: '6px', fontSize: '0.65rem', color: THEME.textSecondary, fontWeight: '700', textAlign: 'center', marginBottom: '8px' }}>
                            <span>SET</span><span>ANT.</span><span>KG</span><span>REPS</span><span>✓</span>
                          </div>

                          {ex.sets.map((set, idx) => (
                            <div key={set.id} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 32px', gap: '6px', alignItems: 'center', marginBottom: '6px', textAlign: 'center' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: set.completed ? THEME.accentGreen : THEME.textPrimary }}>{set.id}</span>
                              <span style={{ fontSize: '0.7rem', color: THEME.textSecondary }}>{set.prev}</span>
                              <input type="number" value={set.weight} onChange={(e) => updateSetData(w.id, ex.id, idx, 'weight', e.target.value)} readOnly={!isEditing && set.completed} style={{ width: '100%', textAlign: 'center', padding: '6px 2px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#FFF', fontSize: '0.85rem', fontWeight: '700' }} />
                              <input type="number" value={set.reps} onChange={(e) => updateSetData(w.id, ex.id, idx, 'reps', e.target.value)} readOnly={!isEditing && set.completed} style={{ width: '100%', textAlign: 'center', padding: '6px 2px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#FFF', fontSize: '0.85rem', fontWeight: '700' }} />
                              
                              <div onClick={() => toggleSetComplete(w.id, ex.id, idx, ex.restTime)} style={{
                                width: '28px', height: '28px', margin: '0 auto', borderRadius: '8px',
                                background: set.completed ? THEME.accentGreen : 'rgba(255,255,255,0.08)',
                                border: `1px solid ${set.completed ? THEME.accentGreen : THEME.cardBorder}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isEditing ? 'default' : 'pointer', transition: '0.2s'
                              }}>
                                {set.completed && <span style={{ color: '#000', fontWeight: '800', fontSize: '0.75rem' }}>✓</span>}
                              </div>
                            </div>
                          ))}

                          <button onClick={() => addSet(w.id, ex.id)} style={{ width: '100%', marginTop: '8px', padding: '8px', background: 'transparent', border: `1px dashed ${THEME.cardBorder}`, color: THEME.textSecondary, borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>
                            + Adicionar Série
                          </button>
                        </div>
                      ))}

                      {isEditing && (
                        <button onClick={() => addNewExercise(w.id)} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: `${THEME.accentGreen}15`, color: THEME.accentGreen, border: `1px dashed ${THEME.accentGreen}`, fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                          + ADICIONAR EXERCÍCIO
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {isEditing && (
              <button onClick={addNewWorkout} style={{ width: '100%', padding: '16px', borderRadius: '18px', background: 'transparent', color: THEME.accentTeal, border: `2px dashed ${THEME.accentTeal}`, fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}>
                + CRIAR NOVO TREINO
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
