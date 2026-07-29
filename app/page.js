'use client';
import { useState, useEffect } from 'react';

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

export default function Home() {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  
  // Estado do Treino Ativo (Cronômetro Geral)
  const [workoutSession, setWorkoutSession] = useState(null); // { workoutId, seconds }
  
  // Estado do Timer de Descanso
  const [restTimer, setRestTimer] = useState(null); // segundos restantes

  // Dados dos Treinos com Séries Detalhadas
  const [workouts, setWorkouts] = useState([
    {
      id: 'A',
      title: 'Glúteos & Posterior',
      category: 'Segunda',
      color: '#FF4757',
      restTime: 60, // descanso padrão em segundos
      exercises: [
        {
          id: 'ex1',
          name: 'Hip thrust com barra',
          notes: 'Pausa 2 seg no topo · queixo recolhido',
          sets: [
            { id: 1, prev: '23 kg × 12', weight: 23, reps: 12, completed: false },
            { id: 2, prev: '23 kg × 12', weight: 23, reps: 12, completed: false },
            { id: 3, prev: '23 kg × 10', weight: 23, reps: 10, completed: false },
            { id: 4, prev: '23 kg × 10', weight: 23, reps: 10, completed: false },
          ]
        },
        {
          id: 'ex2',
          name: 'Abdução de quadril na máquina',
          notes: 'Controlar a volta devagar · foco glúteo médio',
          sets: [
            { id: 1, prev: '20 kg × 15', weight: 20, reps: 15, completed: false },
            { id: 2, prev: '20 kg × 15', weight: 20, reps: 15, completed: false },
            { id: 3, prev: '20 kg × 15', weight: 20, reps: 15, completed: false },
          ]
        }
      ]
    },
    {
      id: 'B',
      title: 'Ombros & Peito',
      category: 'Terça',
      color: '#6C5CE7',
      restTime: 60,
      exercises: [
        {
          id: 'ex3',
          name: 'Desenvolvimento com halteres sentada',
          notes: 'Excêntrico 3 seg',
          sets: [
            { id: 1, prev: '6 kg × 12', weight: 6, reps: 12, completed: false },
            { id: 2, prev: '6 kg × 12', weight: 6, reps: 12, completed: false },
            { id: 3, prev: '6 kg × 10', weight: 6, reps: 10, completed: false },
          ]
        }
      ]
    }
  ]);

  // Cronômetro do Treino Ativo
  useEffect(() => {
    let interval = null;
    if (workoutSession) {
      interval = setInterval(() => {
        setWorkoutSession(prev => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [workoutSession]);

  // Cronômetro de Descanso
  useEffect(() => {
    let interval = null;
    if (restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1);
      }, 1000);
    } else if (restTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  // Formatar tempo MM:SS
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Iniciar / Finalizar Treino
  const startWorkout = (id) => {
    setWorkoutSession({ workoutId: id, seconds: 0 });
  };

  const finishWorkout = (id) => {
    setWorkoutSession(null);
    if (!completedWorkouts.includes(id)) {
      setCompletedWorkouts([...completedWorkouts, id]);
    }
  };

  // Marcar/Desmarcar Série e Disparar Descanso
  const toggleSetComplete = (workoutId, exId, setIndex) => {
    const updatedWorkouts = workouts.map(w => {
      if (w.id !== workoutId) return w;
      
      const newExercises = w.exercises.map(ex => {
        if (ex.id !== exId) return ex;
        
        const newSets = ex.sets.map((s, idx) => {
          if (idx !== setIndex) return s;
          const isNowCompleted = !s.completed;
          
          // Se marcou como concluído, aciona o timer de descanso
          if (isNowCompleted) {
            setRestTimer(w.restTime || 60);
          }
          
          return { ...s, completed: isNowCompleted };
        });
        
        return { ...ex, sets: newSets };
      });

      return { ...w, exercises: newExercises };
    });

    setWorkouts(updatedWorkouts);
  };

  // Atualizar Carga ou Repetição
  const updateSetData = (workoutId, exId, setIndex, field, value) => {
    setWorkouts(workouts.map(w => {
      if (w.id !== workoutId) return w;
      return {
        ...w,
        exercises: w.exercises.map(ex => {
          if (ex.id !== exId) return ex;
          return {
            ...ex,
            sets: ex.sets.map((s, idx) => idx === setIndex ? { ...s, [field]: value } : s)
          };
        })
      };
    }));
  };

  // Atualizar Observação
  const updateNotes = (workoutId, exId, value) => {
    setWorkouts(workouts.map(w => {
      if (w.id !== workoutId) return w;
      return {
        ...w,
        exercises: w.exercises.map(ex => ex.id === exId ? { ...ex, notes: value } : ex)
      };
    }));
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
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: THEME.textSecondary, fontWeight: '600' }}>SEU DADRO DE TREINO</span>
            <h1 style={{ margin: '2px 0 0 0', fontSize: '1.75rem', fontWeight: '800' }}>App Treino</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: THEME.accent }}>{completedWorkouts.length} / {workouts.length}</span>
            <p style={{ margin: 0, fontSize: '0.75rem', color: THEME.textSecondary }}>Treinos Feitos</p>
          </div>
        </header>

        {/* Timer Flutuante de Descanso */}
        {restTimer > 0 && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: THEME.accent,
            color: '#FFF',
            padding: '12px 20px',
            borderRadius: '30px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '700'
          }}>
            <span>⏱️ Descanso:</span>
            <span style={{ fontSize: '1.2rem' }}>{formatTime(restTimer)}</span>
          </div>
        )}

        {/* Lista de Treinos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {workouts.map((workout) => {
            const isOpen = activeWorkout === workout.id;
            const isRunning = workoutSession?.workoutId === workout.id;

            return (
              <div key={workout.id} style={{
                backgroundColor: THEME.cardBg,
                borderRadius: '20px',
                padding: '18px',
                border: `1px solid ${isOpen ? workout.color : THEME.border}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                {/* Cabeçalho do Card */}
                <div 
                  onClick={() => setActiveWorkout(isOpen ? null : workout.id)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      backgroundColor: `${workout.color}15`,
                      color: workout.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800'
                    }}>
                      {workout.id}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>{workout.title}</h3>
                      <span style={{ fontSize: '0.75rem', color: THEME.textSecondary }}>{workout.category}</span>
                    </div>
                  </div>
                  
                  {isRunning && (
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: THEME.accent }}>
                      ⏱️ {formatTime(workoutSession.seconds)}
                    </span>
                  )}
                </div>

                {/* Conteúdo Expansível do Treino */}
                {isOpen && (
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: `1px solid ${THEME.border}` }}>
                    
                    {/* Botões de Ação do Treino */}
                    <div style={{ marginBottom: '20px' }}>
                      {!isRunning ? (
                        <button 
                          onClick={() => startWorkout(workout.id)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '12px',
                            backgroundColor: THEME.accent,
                            color: '#FFF',
                            border: 'none',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          ▶ Iniciar Treino
                        </button>
                      ) : (
                        <button 
                          onClick={() => finishWorkout(workout.id)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '12px',
                            backgroundColor: THEME.success,
                            color: '#FFF',
                            border: 'none',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          ✓ Finalizar Treino ({formatTime(workoutSession.seconds)})
                        </button>
                      )}
                    </div>

                    {/* Blocos de Exercícios */}
                    {workout.exercises.map((ex) => (
                      <div key={ex.id} style={{ marginBottom: '24px' }}>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: '700' }}>{ex.name}</h4>
                        
                        {/* Campo de Observações */}
                        <input 
                          type="text" 
                          value={ex.notes}
                          onChange={(e) => updateNotes(workout.id, ex.id, e.target.value)}
                          placeholder="Adicionar observação..."
                          style={{
                            width: '100%',
                            border: 'none',
                            backgroundColor: '#F1F2F6',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            color: THEME.textSecondary,
                            marginBottom: '12px'
                          }}
                        />

                        {/* Tabela de Séries */}
                        <div style={{ width: '100%' }}>
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '40px 1fr 1fr 1fr 40px', 
                            fontSize: '0.7rem', 
                            color: THEME.textSecondary,
                            fontWeight: '700',
                            marginBottom: '8px',
                            textAlign: 'center'
                          }}>
                            <span>SÉRIE</span>
                            <span>ANTERIOR</span>
                            <span>KG</span>
                            <span>REPS</span>
                            <span>✓</span>
                          </div>

                          {ex.sets.map((set, idx) => (
                            <div key={set.id} style={{ 
                              display: 'grid', 
                              gridTemplateColumns: '40px 1fr 1fr 1fr 40px', 
                              gap: '6px',
                              alignItems: 'center',
                              marginBottom: '6px',
                              textAlign: 'center',
                              backgroundColor: set.completed ? '#E8FAEB' : 'transparent',
                              padding: '4px 0',
                              borderRadius: '8px'
                            }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{set.id}</span>
                              <span style={{ fontSize: '0.7rem', color: THEME.textSecondary }}>{set.prev}</span>
                              
                              {/* Input KG */}
                              <input 
                                type="number" 
                                value={set.weight}
                                onChange={(e) => updateSetData(workout.id, ex.id, idx, 'weight', e.target.value)}
                                style={{
                                  width: '100%',
                                  textAlign: 'center',
                                  padding: '6px',
                                  borderRadius: '6px',
                                  border: `1px solid ${THEME.border}`,
                                  fontSize: '0.85rem',
                                  fontWeight: '600'
                                }}
                              />

                              {/* Input REPS */}
                              <input 
                                type="number" 
                                value={set.reps}
                                onChange={(e) => updateSetData(workout.id, ex.id, idx, 'reps', e.target.value)}
                                style={{
                                  width: '100%',
                                  textAlign: 'center',
                                  padding: '6px',
                                  borderRadius: '6px',
                                  border: `1px solid ${THEME.border}`,
                                  fontSize: '0.85rem',
                                  fontWeight: '600'
                                }}
                              />

                              {/* Checkbox de Conclusão */}
                              <input 
                                type="checkbox"
                                checked={set.completed}
                                onChange={() => toggleSetComplete(workout.id, ex.id, idx)}
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  accentColor: THEME.success,
                                  cursor: 'pointer',
                                  margin: '0 auto'
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

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
