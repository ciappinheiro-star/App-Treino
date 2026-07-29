'use client';
import { useState, useEffect } from 'react';

// Paleta Premium Dark & Colorida
const THEME = {
  bg: 'linear-gradient(145deg, #0F172A 0%, #2E1065 100%)',
  cardBg: 'rgba(30, 41, 59, 0.7)',
  accent: '#00F2FE',
  accentGradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
  success: '#10B981',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  border: 'rgba(255, 255, 255, 0.1)',
  inputBg: 'rgba(15, 23, 42, 0.6)'
};

// Função auxiliar para gerar as séries
const makeSets = (qtd, peso, reps, prevStr) => {
  return Array.from({ length: qtd }, (_, i) => ({
    id: i + 1, prev: prevStr, weight: peso, reps: reps, completed: false
  }));
};

export default function Home() {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [workoutSession, setWorkoutSession] = useState(null);
  const [restTimer, setRestTimer] = useState(null);

  // DADOS COMPLETOS DOS TREINOS (Baseado na sua Ficha)
  const [workouts, setWorkouts] = useState([
    {
      id: 'A', title: 'Glúteos & Posterior', category: 'Segunda', color: '#F43F5E',
      exercises: [
        { id: 'ex1', name: 'Hip thrust com barra', notes: 'Pausa 2s no topo · queixo recolhido', restTime: 90, sets: makeSets(4, 23, 12, '23kg x 12') },
        { id: 'ex2', name: 'Abdução de quadril', notes: 'Controlar volta · glúteo médio', restTime: 60, sets: makeSets(3, 20, 20, '20kg x 15') },
        { id: 'ex3', name: 'Kickback polia baixa', notes: 'Zero carga lombar', restTime: 60, sets: makeSets(3, 5, 15, '5kg x 15') },
        { id: 'ex4', name: 'Cadeira flexora (DROP)', notes: 'Drop 30% na última', restTime: 60, sets: makeSets(3, 20, 12, '20kg x 12') },
        { id: 'ex5', name: 'Prancha lateral', notes: 'Para escoliose (Segundos)', restTime: 45, sets: makeSets(3, 0, 30, 'Corpo x 30s') }
      ]
    },
    {
      id: 'B', title: 'Ombros & Peito', category: 'Terça', color: '#8B5CF6',
      exercises: [
        { id: 'ex6', name: 'Desenvolvimento c/ halteres', notes: 'Excêntrico 3s', restTime: 60, sets: makeSets(4, 6, 12, '6kg x 12') },
        { id: 'ex7', name: 'BI-SET: Elev. Lateral + Frontal', notes: 'Mesmo banco', restTime: 60, sets: makeSets(3, 4, 15, '4kg x 15') },
        { id: 'ex8', name: 'BI-SET: Supino reto + Fly', notes: 'Deitada no banco', restTime: 60, sets: makeSets(3, 6, 12, '6kg x 10') },
        { id: 'ex9', name: 'Face pull na corda', notes: 'Postura escapular', restTime: 45, sets: makeSets(3, 8, 15, '8kg x 15') },
        { id: 'ex10', name: 'Dead bug (chão)', notes: 'Lombar no chão', restTime: 45, sets: makeSets(3, 0, 10, 'Corpo x 10') }
      ]
    },
    {
      id: 'C', title: 'Quadríceps & Glúteo', category: 'Quarta', color: '#06B6D4',
      exercises: [
        { id: 'ex11', name: 'Leg press 45°', notes: 'Pés médios · lombar no banco', restTime: 90, sets: makeSets(4, 50, 15, '50kg x 15') },
        { id: 'ex12', name: 'Agachamento goblet', notes: 'Halter no peito', restTime: 90, sets: makeSets(3, 10, 12, '10kg x 12') },
        { id: 'ex13', name: 'Afundo reverso c/ halteres', notes: 'Tronco inclinado', restTime: 60, sets: makeSets(3, 4, 10, '4kg x 10') },
        { id: 'ex14', name: 'Cadeira extensora (DROP)', notes: 'Drop 30% na última', restTime: 60, sets: makeSets(3, 18, 12, '18kg x 12') },
        { id: 'ex15', name: 'Bird dog (chão)', notes: 'Pausa 2s no topo', restTime: 45, sets: makeSets(3, 0, 10, 'Corpo x 10') }
      ]
    },
    {
      id: 'D', title: 'Costas', category: 'Quinta', color: '#F59E0B',
      exercises: [
        { id: 'ex16', name: 'Remada unilateral', notes: 'Apoio no banco', restTime: 60, sets: makeSets(4, 8, 12, '8kg x 12') },
        { id: 'ex17', name: 'BI-SET: Puxada + Remada polia', notes: 'Mesmo equipamento', restTime: 60, sets: makeSets(3, 18, 12, '18kg x 12') },
        { id: 'ex18', name: 'Face pull na corda', notes: 'Manutenção postural', restTime: 45, sets: makeSets(3, 8, 15, '8kg x 15') },
        { id: 'ex19', name: 'Rosca direta polia baixa', notes: 'Cotovelos fixos', restTime: 60, sets: makeSets(3, 10, 12, '10kg x 12') }
      ]
    },
    {
      id: 'E', title: 'Braços', category: 'Sexta', color: '#10B981',
      exercises: [
        { id: 'ex20', name: 'BI-SET: Rosca direta (Drop) + Martelo', notes: 'Sentada no banco', restTime: 60, sets: makeSets(3, 5, 12, '5kg x 12') },
        { id: 'ex21', name: 'Rosca concentrada', notes: 'Cotovelo na coxa', restTime: 45, sets: makeSets(3, 4, 12, '4kg x 12') },
        { id: 'ex22', name: 'BI-SET: Tríceps testa + Coice', notes: 'Banco halteres', restTime: 60, sets: makeSets(3, 4, 12, '4kg x 12') },
        { id: 'ex23', name: 'Tríceps pulley corda (DROP)', notes: 'Drop 30%', restTime: 45, sets: makeSets(3, 10, 12, '10kg x 12') },
        { id: 'ex24', name: 'Prancha isométrica', notes: 'Core (Segundos)', restTime: 45, sets: makeSets(3, 0, 45, 'Corpo x 45s') }
      ]
    }
  ]);

  // CRONÔMETROS
  useEffect(() => {
    let interval;
    if (workoutSession) {
      interval = setInterval(() => setWorkoutSession(p => ({ ...p, seconds: p.seconds + 1 })), 1000);
    }
    return () => clearInterval(interval);
  }, [workoutSession]);

  useEffect(() => {
    let interval;
    if (restTimer > 0) {
      interval = setInterval(() => setRestTimer(p => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // AÇÕES
  const toggleSetComplete = (wId, exId, setIndex, restTime) => {
    setWorkouts(workouts.map(w => {
      if (w.id !== wId) return w;
      return {
        ...w,
        exercises: w.exercises.map(ex => {
          if (ex.id !== exId) return ex;
          return {
            ...ex,
            sets: ex.sets.map((s, i) => {
              if (i !== setIndex) return s;
              if (!s.completed) setRestTimer(restTime);
              return { ...s, completed: !s.completed };
            })
          };
        })
      };
    }));
  };

  const addSet = (wId, exId) => {
    setWorkouts(workouts.map(w => {
      if (w.id !== wId) return w;
      return {
        ...w,
        exercises: w.exercises.map(ex => {
          if (ex.id !== exId) return ex;
          const lastSet = ex.sets[ex.sets.length - 1] || { weight: 0, reps: 0, prev: '-' };
          const newSet = {
            id: ex.sets.length + 1,
            prev: lastSet.prev,
            weight: lastSet.weight,
            reps: lastSet.reps,
            completed: false
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        })
      };
    }));
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

      <main style={{ 
        minHeight: '100vh', background: THEME.bg, fontFamily: '"Outfit", sans-serif',
        padding: '24px 16px', color: THEME.textPrimary
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: THEME.accent, fontWeight: '700', letterSpacing: '1px' }}>PRO TRACKER</span>
              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>App Treino</h1>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFF' }}>{completedWorkouts.length}/5</span>
            </div>
          </header>

          {restTimer > 0 && (
            <div style={{
              position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
              background: THEME.accentGradient, color: '#000', padding: '12px 24px',
              borderRadius: '30px', boxShadow: '0 10px 25px rgba(0, 242, 254, 0.4)',
              zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800'
            }}>
              <span>⏳ DESCANSO</span>
              <span style={{ fontSize: '1.4rem' }}>{formatTime(restTimer)}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {workouts.map((w) => {
              const isOpen = activeWorkout === w.id;
              const isRunning = workoutSession?.workoutId === w.id;

              return (
                <div key={w.id} style={{
                  background: THEME.cardBg, backdropFilter: 'blur(12px)', borderRadius: '24px',
                  padding: '20px', border: `1px solid ${isOpen ? w.color : THEME.border}`,
                  boxShadow: isOpen ? `0 0 20px ${w.color}20` : '0 10px 30px rgba(0,0,0,0.2)', transition: 'all 0.3s ease'
                }}>
                  
                  <div onClick={() => setActiveWorkout(isOpen ? null : w.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: w.color, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: '800', boxShadow: `0 4px 12px ${w.color}50` }}>
                        {w.id}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>{w.title}</h3>
                        <span style={{ fontSize: '0.85rem', color: THEME.textSecondary }}>{w.category}</span>
                      </div>
                    </div>
                    {isRunning && (
                      <span style={{ background: '#10B98120', color: THEME.success, padding: '6px 12px', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem' }}>
                        ⏱ {formatTime(workoutSession.seconds)}
                      </span>
                    )}
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: `1px solid ${THEME.border}` }}>
                      
                      <button onClick={() => isRunning ? (setWorkoutSession(null), setCompletedWorkouts([...new Set([...completedWorkouts, w.id])])) : setWorkoutSession({ workoutId: w.id, seconds: 0 })}
                        style={{ width: '100%', padding: '16px', borderRadius: '16px', background: isRunning ? THEME.success : THEME.accentGradient, color: isRunning ? '#FFF' : '#000', border: 'none', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', marginBottom: '24px', boxShadow: isRunning ? '0 8px 20px rgba(16, 185, 129, 0.3)' : '0 8px 20px rgba(0, 242, 254, 0.3)' }}
                      >
                        {isRunning ? `✓ FINALIZAR TREINO (${formatTime(workoutSession.seconds)})` : '▶ INICIAR TREINO'}
                      </button>

                      {w.exercises.map((ex) => (
                        <div key={ex.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '20px', marginBottom: '20px', border: `1px solid ${THEME.border}` }}>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: w.color, flex: 1, paddingRight: '10px' }}>{ex.name}</h4>
                            
                            <div style={{ display: 'flex', alignItems: 'center', background: THEME.inputBg, padding: '4px 8px', borderRadius: '8px' }}>
                              <span style={{ fontSize: '0.7rem', color: THEME.textSecondary, marginRight: '6px' }}>⏱</span>
                              <select 
                                value={ex.restTime} 
                                onChange={(e) => updateExerciseField(w.id, ex.id, 'restTime', Number(e.target.value))}
                                style={{ background: 'transparent', color: '#FFF', border: 'none', fontSize: '0.8rem', fontWeight: '700', outline: 'none' }}
                              >
                                <option value="30">30s</option><option value="45">45s</option><option value="60">60s</option><option value="90">90s</option><option value="120">120s</option>
                              </select>
                            </div>
                          </div>
                          
                          <input type="text" value={ex.notes} onChange={(e) => updateExerciseField(w.id, ex.id, 'notes', e.target.value)} placeholder="Anotações do exercício..."
                            style={{ width: '100%', background: THEME.inputBg, border: 'none', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', color: THEME.textSecondary, marginBottom: '16px' }}
                          />

                          <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 1fr 1fr 35px', gap: '6px', fontSize: '0.7rem', color: THEME.textSecondary, fontWeight: '700', textAlign: 'center', marginBottom: '10px' }}>
                            <span>S.</span><span>ANT.</span><span>KG</span><span>REPS</span><span>✓</span>
                          </div>

                          {ex.sets.map((set, idx) => (
                            <div key={set.id} style={{ display: 'grid', gridTemplateColumns: '30px 1fr 1fr 1fr 35px', gap: '6px', alignItems: 'center', marginBottom: '8px', textAlign: 'center', background: set.completed ? `${THEME.success}15` : 'transparent', padding: '6px 0', borderRadius: '12px', border: set.completed ? `1px solid ${THEME.success}40` : '1px solid transparent', transition: 'all 0.2s' }}>
                              
                              <span style={{ fontWeight: '800', color: set.completed ? THEME.success : '#FFF' }}>{set.id}</span>
                              <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{set.prev}</span>
                              
                              <input type="number" value={set.weight} onChange={(e) => updateSetData(w.id, ex.id, idx, 'weight', e.target.value)}
                                style={{ width: '100%', textAlign: 'center', padding: '8px 4px', borderRadius: '8px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, color: '#FFF', fontWeight: '700' }} />
                              
                              <input type="number" value={set.reps} onChange={(e) => updateSetData(w.id, ex.id, idx, 'reps', e.target.value)}
                                style={{ width: '100%', textAlign: 'center', padding: '8px 4px', borderRadius: '8px', background: THEME.inputBg, border: `1px solid ${THEME.border}`, color: '#FFF', fontWeight: '700' }} />
                              
                              <div onClick={() => toggleSetComplete(w.id, ex.id, idx, ex.restTime)} style={{ width: '28px', height: '28px', margin: '0 auto', borderRadius: '8px', background: set.completed ? THEME.success : THEME.inputBg, border: `2px solid ${set.completed ? THEME.success : THEME.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                                {set.completed && <span style={{ color: '#000', fontWeight: '800' }}>✓</span>}
                              </div>
                            </div>
                          ))}

                          <button onClick={() => addSet(w.id, ex.id)}
                            style={{ width: '100%', marginTop: '12px', padding: '10px', background: 'transparent', border: `1px dashed ${THEME.border}`, color: THEME.textSecondary, borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}
                          >
                            + Adicionar Série
                          </button>
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
    </>
  );
}
