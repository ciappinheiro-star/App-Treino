'use client';
import { useState, useEffect } from 'react';

// Paleta Elegante (Slate / Glass) - Mais clara e sofisticada
const THEME = {
  bg: 'linear-gradient(145deg, #1E293B 0%, #475569 100%)', // Fundo grafite elegante
  cardBg: 'rgba(255, 255, 255, 0.08)', // Vidro fosco mais leve
  accent: '#38BDF8', // Azul celeste suave
  accentGradient: 'linear-gradient(135deg, #7DD3FC 0%, #38BDF8 100%)',
  success: '#10B981',
  danger: '#F43F5E',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1', // Texto secundário mais claro
  border: 'rgba(255, 255, 255, 0.15)',
  inputBg: 'rgba(0, 0, 0, 0.15)'
};

export default function Home() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutSession, setWorkoutSession] = useState(null);
  const [restTimer, setRestTimer] = useState(null);
  
  // NOVO: Contador histórico de treinos concluídos
  const [totalCompleted, setTotalCompleted] = useState(0);

  const [workouts, setWorkouts] = useState([
    {
      id: 'TREINO_INICIAL', title: 'Treino A', category: 'Segunda', color: '#F87171',
      exercises: [
        { id: 'ex_inicial', name: 'Exemplo de Exercício', notes: '', restTime: 60, sets: [
          { id: 1, prev: '-', weight: 0, reps: 0, completed: false }
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

  // FUNÇÕES DO MODO DE EDIÇÃO
  const addNewWorkout = () => {
    const newWorkout = {
      id: `W_${Date.now()}`,
      title: 'Novo Treino',
      category: 'Dia da Semana',
      color: '#38BDF8',
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

  // FUNÇÕES DE EXECUÇÃO
  const handleFinishWorkout = (wId) => {
    setWorkoutSession(null);
    setTotalCompleted(prev => prev + 1); // Soma +1 no contador geral
    
    // Opcional: Aqui também poderiamos limpar os "checks" do treino finalizado 
    // para ele estar pronto para o próximo dia.
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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&display=swap');
        body { margin: 0; padding: 0; background: #1E293B; }
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
            
            {/* NOVO CONTADOR GERAL */}
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ background: THEME.cardBg, padding: '8px 16px', borderRadius: '16px', backdropFilter: 'blur(10px)', border: `1px solid ${THEME.border}`, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.2rem' }}>🔥</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFF' }}>{totalCompleted}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: THEME.textSecondary, marginTop: '4px', fontWeight: '500' }}>TREINOS FEITOS</span>
            </div>
          </header>

          {/* BOTÃO EDITAR AGORA FICA ABAIXO DO HEADER */}
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={() => {
                setIsEditing(!isEditing);
                setWorkoutSession(null);
              }}
              style={{
                width: '100%', background: isEditing ? THEME.success : THEME.cardBg, color: '#FFF', border: `1px solid ${isEditing ? THEME.success : THEME.border}`, 
                padding: '12px', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', transition: '0.3s', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center'
              }}
            >
              {isEditing ? '✓ SALVAR ALTERAÇÕES' : '✏️ EDITAR FICHAS'}
            </button>
          </div>

          {restTimer > 0 && !isEditing && (
            <div style={{
              position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: THEME.accentGradient, color: '#000', padding: '12px 24px',
              borderRadius: '30px', boxShadow: '0 10px 25px rgba(56, 189, 248, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800'
            }}>
              <span>⏳ DESCANSO</span><span style={{ fontSize: '1.4rem' }}>{formatTime(restTimer)}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {workouts.map((w) => {
              const isOpen = activeWorkout === w.id || isEditing;
              const isRunning = workoutSession?.workoutId === w.id;

              return (
                <div key={w.id} style={{
                  background: THEME.cardBg, backdropFilter: 'blur(12px)', borderRadius: '24px', padding: '20px', 
                  border: `1px solid ${isOpen ? (isEditing ? THEME.success : w.color) : THEME.border}`, transition: 'all 0.3s ease',
                  boxShadow: isOpen && !isEditing ? `0 0 20px ${w.color}15` : 'none'
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
                              style={{ width: '90%', background: 'transparent', border: `1px dashed ${THEME.border}`, color: '#FFF', fontWeight: '700', fontSize: '1.2rem', marginBottom: '4px', outline: 'none', padding: '2px 4px' }} />
                            <input value={w.category} onChange={(e) => updateWorkoutField(w.id, 'category', e.target.value)} 
                              style={{ width: '90%', background: 'transparent', border: `1px dashed ${THEME.border}`, color: THEME.textSecondary, fontSize: '0.85rem', outline: 'none', padding: '2px 4px' }} />
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
                        <button onClick={() => isRunning ? handleFinishWorkout(w.id) : setWorkoutSession({ workoutId: w.id, seconds: 0 })}
                          style={{ width: '100%', padding: '16px', borderRadius: '16px', background: isRunning ? THEME.success : THEME.accentGradient, color: isRunning ? '#FFF' : '#000', border: 'none', fontWeight: '800', cursor: 'pointer', marginBottom: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                        >
                          {isRunning ? `✓ FINALIZAR TREINO (${formatTime(workoutSession.seconds)})` : '▶ INICIAR TREINO'}
                        </button>
                      )}

                      {/* BLOCOS DE EXERCÍCIO */}
                      {w.exercises.map((ex) => (
                        <div key={ex.id} style={{ background: THEME.inputBg, padding: '16px', borderRadius: '20px', marginBottom: '20px', border: `1px solid ${isEditing ? THEME.success : THEME.border}` }}>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            {isEditing ? (
                              <input value={ex.name} onChange={(e) => updateExerciseField(w.id, ex.id, 'name', e.target.value)}
                                style={{ flex: 1, background: 'transparent', border: `1px dashed ${THEME.border}`, color: w.color, fontWeight: '700', fontSize: '1.1rem', marginRight: '10px', padding: '4px' }} />
                            ) : (
                              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: w.color, flex: 1 }}>{ex.name}</h4>
                            )}
                            
                            {isEditing && (
                              <button onClick={() => deleteExercise(w.id, ex.id)} style={{ background: 'transparent', color: THEME.danger, border: 'none', fontWeight: 'bold', cursor: 'pointer', padding: '4px' }}>Excluir</button>
                            )}
                          </div>
                          
                          <input type="text" value={ex.notes} onChange={(e) => updateExerciseField(w.id, ex.id, 'notes', e.target.value)} placeholder="Anotações..."
                            readOnly={!isEditing} style={{ width: '100%', background: isEditing ? 'rgba(0,0,0,0.3)' : 'transparent', border: isEditing ? `1px dashed ${THEME.border}` : 'none', padding: isEditing ? '10px' : '0 0 16px 0', borderRadius: '10px', fontSize: '0.85rem', color: THEME.textSecondary, marginBottom: '8px', outline: 'none' }}
                          />

                          <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 1fr 1fr 35px', gap: '6px', fontSize: '0.7rem', color: THEME.textSecondary, fontWeight: '700', textAlign: 'center', marginBottom: '10px' }}>
                            <span>S.</span><span>ANT.</span><span>KG</span><span>REPS</span><span>✓</span>
                          </div>

                          {ex.sets.map((set, idx) => (
                            <div key={set.id} style={{ display: 'grid', gridTemplateColumns: '30px 1fr 1fr 1fr 35px', gap: '6px', alignItems: 'center', marginBottom: '8px', textAlign: 'center', background: set.completed ? `${THEME.success}15` : 'transparent', padding: '6px 0', borderRadius: '12px' }}>
                              <span style={{ fontWeight: '800', color: set.completed ? THEME.success : THEME.textPrimary }}>{set.id}</span>
                              <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{set.prev}</span>
                              <input type="number" value={set.weight} onChange={(e) => updateSetData(w.id, ex.id, idx, 'weight', e.target.value)} readOnly={!isEditing && set.completed} style={{ width: '100%', textAlign: 'center', padding: '8px 4px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF' }} />
                              <input type="number" value={set.reps} onChange={(e) => updateSetData(w.id, ex.id, idx, 'reps', e.target.value)} readOnly={!isEditing && set.completed} style={{ width: '100%', textAlign: 'center', padding: '8px 4px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF' }} />
                              <div onClick={() => toggleSetComplete(w.id, ex.id, idx, ex.restTime)} style={{ width: '28px', height: '28px', margin: '0 auto', borderRadius: '8px', background: set.completed ? THEME.success : 'rgba(255,255,255,0.05)', cursor: isEditing ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${set.completed ? THEME.success : 'rgba(255,255,255,0.1)'}` }}>
                                {set.completed && <span style={{ color: '#000', fontWeight: 'bold' }}>✓</span>}
                              </div>
                            </div>
                          ))}

                          <button onClick={() => addSet(w.id, ex.id)} style={{ width: '100%', marginTop: '12px', padding: '10px', background: 'transparent', border: `1px dashed ${THEME.border}`, color: THEME.textSecondary, borderRadius: '12px', cursor: 'pointer', transition: '0.2s' }}>
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
