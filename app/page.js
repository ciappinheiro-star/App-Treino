'use client';
import { useState, useEffect } from 'react';

// Paleta Premium Dark
const THEME = {
  bg: 'linear-gradient(145deg, #0F172A 0%, #2E1065 100%)',
  cardBg: 'rgba(30, 41, 59, 0.7)',
  accent: '#00F2FE',
  accentGradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
  success: '#10B981',
  danger: '#EF4444',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  border: 'rgba(255, 255, 255, 0.1)',
  inputBg: 'rgba(15, 23, 42, 0.6)'
};

export default function Home() {
  // --- NOVOS ESTADOS PARA O MODO EDIÇÃO ---
  const [isEditing, setIsEditing] = useState(false);

  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [workoutSession, setWorkoutSession] = useState(null);
  const [restTimer, setRestTimer] = useState(null);

  // Começando com uma ficha mais vazia para testar o modo de criação
  const [workouts, setWorkouts] = useState([
    {
      id: 'TREINO_INICIAL', title: 'Treino A', category: 'Segunda', color: '#F43F5E',
      exercises: [
        { id: 'ex_inicial', name: 'Exemplo de Exercício', notes: '', restTime: 60, sets: [
          { id: 1, prev: '-', weight: 0, reps: 0, completed: false }
        ]}
      ]
    }
  ]);

  // CRONÔMETROS (Mantidos como estavam)
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

  // --- FUNÇÕES DO MODO DE EDIÇÃO (NOVIDADE) ---
  const addNewWorkout = () => {
    const newWorkout = {
      id: `W_${Date.now()}`,
      title: 'Novo Treino',
      category: 'Dia da Semana',
      color: '#06B6D4',
      exercises: []
    };
    setWorkouts([...workouts, newWorkout]);
    setActiveWorkout(newWorkout.id); // Já abre o card novo
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

  // --- FUNÇÕES DE EXECUÇÃO (Mantidas) ---
  const toggleSetComplete = (wId, exId, setIndex, restTime) => {
    if (isEditing) return; // Desativa cliques de conclusão enquanto edita
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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&display=swap');
        body { margin: 0; padding: 0; background: #0F172A; }
        * { box-sizing: border-box; }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>

      <main style={{ minHeight: '100vh', background: THEME.bg, fontFamily: '"Outfit", sans-serif', padding: '24px 16px', color: THEME.textPrimary }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: THEME.accent, fontWeight: '700', letterSpacing: '1px' }}>PRO TRACKER</span>
              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>App Treino</h1>
            </div>
            
            {/* BOTÃO MODO EDIÇÃO */}
            <button 
              onClick={() => {
                setIsEditing(!isEditing);
                setWorkoutSession(null); // Pausa treinos ativos ao editar
              }}
              style={{
                background: isEditing ? THEME.success : 'rgba(255,255,255,0.1)', color: '#FFF',
                border: 'none', padding: '10px 16px', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', transition: '0.3s'
              }}
            >
              {isEditing ? '✓ SALVAR' : '✏️ EDITAR'}
            </button>
          </header>

          {restTimer > 0 && !isEditing && (
            <div style={{
              position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: THEME.accentGradient, color: '#000', padding: '12px 24px',
              borderRadius: '30px', boxShadow: '0 10px 25px rgba(0, 242, 254, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800'
            }}>
              <span>⏳ DESCANSO</span><span style={{ fontSize: '1.4rem' }}>{formatTime(restTimer)}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {workouts.map((w) => {
              const isOpen = activeWorkout === w.id || isEditing; // No modo edição, deixa tudo aberto
              const isRunning = workoutSession?.workoutId === w.id;

              return (
                <div key={w.id} style={{
                  background: THEME.cardBg, backdropFilter: 'blur(12px)', borderRadius: '24px', padding: '20px', 
                  border: `1px solid ${isOpen ? (isEditing ? THEME.success : w.color) : THEME.border}`, transition: 'all 0.3s ease'
                }}>
                  
                  {/* CABEÇALHO DO TREINO */}
                  <div onClick={() => !isEditing && setActiveWorkout(isOpen ? null : w.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: isEditing ? 'default' : 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: w.color, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                        {isEditing ? '⚙️' : w.title.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        {isEditing ? (
                          <>
                            <input value={w.title} onChange={(e) => updateWorkoutField(w.id, 'title', e.target.value)} 
                              style={{ width: '90%', background: 'transparent', border: `1px dashed ${THEME.border}`, color: '#FFF', fontWeight: '700', fontSize: '1.2rem', marginBottom: '4px', outline: 'none' }} />
                            <input value={w.category} onChange={(e) => updateWorkoutField(w.id, 'category', e.target.value)} 
                              style={{ width: '90%', background: 'transparent', border: `1px dashed ${THEME.border}`, color: THEME.textSecondary, fontSize: '0.85rem', outline: 'none' }} />
                          </>
                        ) : (
                          <>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>{w.title}</h3>
                            <span style={{ fontSize: '0.85rem', color: THEME.textSecondary }}>{w.category}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <button onClick={() => deleteWorkout(w.id)} style={{ background: THEME.danger, color: '#FFF', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                    )}
                  </div>

                  {/* CONTEÚDO DO TREINO */}
                  {isOpen && (
                    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: `1px solid ${THEME.border}` }}>
                      
                      {!isEditing && (
                        <button onClick={() => isRunning ? (setWorkoutSession(null), setCompletedWorkouts([...new Set([...completedWorkouts, w.id])])) : setWorkoutSession({ workoutId: w.id, seconds: 0 })}
                          style={{ width: '100%', padding: '16px', borderRadius: '16px', background: isRunning ? THEME.success : THEME.accentGradient, color: isRunning ? '#FFF' : '#000', border: 'none', fontWeight: '800', cursor: 'pointer', marginBottom: '24px' }}
                        >
                          {isRunning ? `✓ FINALIZAR TREINO (${formatTime(workoutSession.seconds)})` : '▶ INICIAR TREINO'}
                        </button>
                      )}

                      {/* BLOCOS DE EXERCÍCIO */}
                      {w.exercises.map((ex) => (
                        <div key={ex.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '20px', marginBottom: '20px', border: `1px solid ${isEditing ? THEME.success : THEME.border}` }}>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            {isEditing ? (
                              <input value={ex.name} onChange={(e) => updateExerciseField(w.id, ex.id, 'name', e.target.value)}
                                style={{ flex: 1, background: 'transparent', border: `1px dashed ${THEME.border}`, color: w.color, fontWeight: '700', fontSize: '1.1rem', marginRight: '10px' }} />
                            ) : (
                              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: w.color, flex: 1 }}>{ex.name}</h4>
                            )}
                            
                            {isEditing && (
                              <button onClick={() => deleteExercise(w.id, ex.id)} style={{ background: 'transparent', color: THEME.danger, border: 'none', fontWeight: 'bold', cursor: 'pointer', padding: '4px' }}>Excluir</button>
                            )}
                          </div>
                          
                          <input type="text" value={ex.notes} onChange={(e) => updateExerciseField(w.id, ex.id, 'notes', e.target.value)} placeholder="Anotações..."
                            readOnly={!isEditing} style={{ width: '100%', background: THEME.inputBg, border: isEditing ? `1px dashed ${THEME.border}` : 'none', padding: '10px', borderRadius: '10px', fontSize: '0.85rem', color: THEME.textSecondary, marginBottom: '16px' }}
                          />

                          <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 1fr 1fr 35px', gap: '6px', fontSize: '0.7rem', color: THEME.textSecondary, fontWeight: '700', textAlign: 'center', marginBottom: '10px' }}>
                            <span>S.</span><span>ANT.</span><span>KG</span><span>REPS</span><span>✓</span>
                          </div>

                          {ex.sets.map((set, idx) => (
                            <div key={set.id} style={{ display: 'grid', gridTemplateColumns: '30px 1fr 1fr 1fr 35px', gap: '6px', alignItems: 'center', marginBottom: '8px', textAlign: 'center', background: set.completed ? `${THEME.success}15` : 'transparent', padding: '6px 0', borderRadius: '12px' }}>
                              <span style={{ fontWeight: '800' }}>{set.id}</span>
                              <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{set.prev}</span>
                              <input type="number" value={set.weight} onChange={(e) => updateSetData(w.id, ex.id, idx, 'weight', e.target.value)} readOnly={!isEditing && set.completed} style={{ width: '100%', textAlign: 'center', padding: '8px 4px', borderRadius: '8px', background: THEME.inputBg, border: 'none', color: '#FFF' }} />
                              <input type="number" value={set.reps} onChange={(e) => updateSetData(w.id, ex.id, idx, 'reps', e.target.value)} readOnly={!isEditing && set.completed} style={{ width: '100%', textAlign: 'center', padding: '8px 4px', borderRadius: '8px', background: THEME.inputBg, border: 'none', color: '#FFF' }} />
                              <div onClick={() => toggleSetComplete(w.id, ex.id, idx, ex.restTime)} style={{ width: '28px', height: '28px', margin: '0 auto', borderRadius: '8px', background: set.completed ? THEME.success : THEME.inputBg, cursor: isEditing ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {set.completed && <span style={{ color: '#000', fontWeight: 'bold' }}>✓</span>}
                              </div>
                            </div>
                          ))}

                          <button onClick={() => addSet(w.id, ex.id)} style={{ width: '100%', marginTop: '12px', padding: '10px', background: 'transparent', border: `1px dashed ${THEME.border}`, color: THEME.textSecondary, borderRadius: '12px', cursor: 'pointer' }}>
                            + Adicionar Série
                          </button>
                        </div>
                      ))}

                      {/* BOTÃO ADICIONAR EXERCÍCIO (Aparece só no modo edição) */}
                      {isEditing && (
                        <button onClick={() => addNewExercise(w.id)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: `${THEME.success}20`, color: THEME.success, border: `1px dashed ${THEME.success}`, fontWeight: '800', cursor: 'pointer' }}>
                          + ADICIONAR EXERCÍCIO
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* BOTÃO CRIAR NOVO TREINO (Aparece só no modo edição) */}
            {isEditing && (
              <button onClick={addNewWorkout} style={{ width: '100%', padding: '20px', borderRadius: '24px', background: 'transparent', color: THEME.accent, border: `2px dashed ${THEME.accent}`, fontWeight: '800', fontSize: '1.2rem', cursor: 'pointer', transition: '0.3s' }}>
                + CRIAR NOVO TREINO
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
