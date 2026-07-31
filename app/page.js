'use client';
import { useState, useEffect } from 'react';

// Paleta de Cores (Dark / Light)
const THEMES = {
  dark: {
    bgGradient: 'linear-gradient(180deg, #2E1065 0%, #1E1B4B 100%)',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    cardBorder: 'rgba(255, 255, 255, 0.2)',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    inputBg: '#F1F5F9',
    navBg: 'rgba(15, 23, 42, 0.85)',
    navText: '#A1A1AA',
    navActiveText: '#FFFFFF',
    pageTitle: '#FFFFFF',
    pageSubtitle: '#A855F7'
  },
  light: {
    bgGradient: 'linear-gradient(180deg, #FDF4FF 0%, #F3E8FF 100%)', // Rosinha/Roxo pastel fofo
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(216, 180, 254, 0.4)',
    textPrimary: '#4C1D95',
    textSecondary: '#9333EA',
    inputBg: '#FAF5FF',
    navBg: 'rgba(255, 255, 255, 0.85)',
    navText: '#D8B4FE',
    navActiveText: '#FFFFFF',
    pageTitle: '#4C1D95',
    pageSubtitle: '#D946EF'
  }
};

const SET_TYPES = {
  'N': { label: 'Normal', color: '#10B981', icon: '✓', short: 'N' },
  'W': { label: 'Aquec.', color: '#FBBF24', icon: '🔥', short: 'W' },
  'D': { label: 'Drop', color: '#F97316', icon: '🔽', short: 'D' },
  'F': { label: 'Falha', color: '#EF4444', icon: '💢', short: 'F' }
};

const INITIAL_WORKOUTS = [
  {
    id: 'TREINO_A', title: 'Treino A', category: 'Inferiores 🍑', color: '#00D2FF', icon: '⚡',
    exercises: [
      { id: 'ex_1', name: 'Elevação Pélvica', notes: 'Pausa de 2s no topo', restType: 'compound', sets: [
        { id: 1, type: 'W', prev: '-', weight: 10, reps: 15, completed: false },
        { id: 2, type: 'N', prev: '-', weight: 20, reps: 12, completed: false }
      ]}
    ]
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isEditing, setIsEditing] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutSession, setWorkoutSession] = useState(null);
  const [restTimer, setRestTimer] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Estados de Dados
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [workouts, setWorkouts] = useState(INITIAL_WORKOUTS);
  const [completedDaysInMonth, setCompletedDaysInMonth] = useState([]);
  
  // Perfil e Configurações Globais
  const [userProfile, setUserProfile] = useState({
    weight: 70.0, height: 1.75, bf: 18, 
    arm: 30, waist: 75, hip: 95, thigh: 55, calf: 35, chest: 90, shoulder: 105,
    waterGoal: 3000, theme: 'dark', restNormal: 60, restCompound: 120
  });

  // Carregamento Inicial
  useEffect(() => {
    try {
      const todayStr = new Date().toLocaleDateString();
      const savedDate = localStorage.getItem('pro_last_date');
      const savedWorkouts = localStorage.getItem('pro_workouts_v2');
      const savedTotal = localStorage.getItem('pro_total');
      const savedProfile = localStorage.getItem('pro_profile_v2');
      const savedDays = localStorage.getItem('pro_days');
      
      if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
      if (savedTotal) setTotalCompleted(JSON.parse(savedTotal));
      if (savedProfile) setUserProfile({ ...userProfile, ...JSON.parse(savedProfile) });
      if (savedDays) setCompletedDaysInMonth(JSON.parse(savedDays));

      if (savedDate !== todayStr) {
        setWaterIntake(0);
        localStorage.setItem('pro_last_date', todayStr);
      } else {
        const savedWater = localStorage.getItem('pro_water');
        if (savedWater) setWaterIntake(JSON.parse(savedWater));
      }
    } catch (e) { console.error(e); } finally { setIsLoaded(true); }
  }, []);

  // Salvamento
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('pro_workouts_v2', JSON.stringify(workouts));
    localStorage.setItem('pro_total', JSON.stringify(totalCompleted));
    localStorage.setItem('pro_water', JSON.stringify(waterIntake));
    localStorage.setItem('pro_profile_v2', JSON.stringify(userProfile));
    localStorage.setItem('pro_days', JSON.stringify(completedDaysInMonth));
  }, [workouts, totalCompleted, waterIntake, userProfile, completedDaysInMonth, isLoaded]);

  const t = THEMES[userProfile.theme || 'dark'];

  const navItems = [
    { id: 'inicio', label: 'Início', icon: '✨', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
    { id: 'meus-treinos', label: 'Treinos', icon: '💪', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' },
    { id: 'estatisticas', label: 'Dados', icon: '📈', gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' },
    { id: 'perfil', label: 'Perfil', icon: '🌸', gradient: 'linear-gradient(135deg, #F97316, #EA580C)' },
    { id: 'configuracoes', label: 'Ajustes', icon: '🎀', gradient: 'linear-gradient(135deg, #EC4899, #BE185D)' }
  ];

  // Cronômetros
  useEffect(() => {
    let interval;
    if (workoutSession && !isEditing) interval = setInterval(() => setWorkoutSession(p => ({ ...p, seconds: p.seconds + 1 })), 1000);
    return () => clearInterval(interval);
  }, [workoutSession, isEditing]);

  useEffect(() => {
    let interval;
    if (restTimer > 0 && !isEditing) interval = setInterval(() => setRestTimer(p => p - 1), 1000);
    return () => clearInterval(interval);
  }, [restTimer, isEditing]);

  const formatTime = (totalSec) => `${Math.floor(totalSec / 60).toString().padStart(2, '0')}:${(totalSec % 60).toString().padStart(2, '0')}`;

  const handleFinishWorkout = () => {
    setWorkoutSession(null);
    setTotalCompleted(prev => prev + 1);
    const today = new Date().getDate();
    if (!completedDaysInMonth.includes(today)) setCompletedDaysInMonth([...completedDaysInMonth, today]);
  };

  // Funções de Treino
  const addNewWorkout = () => setWorkouts([...workouts, { id: `W_${Date.now()}`, title: 'Novo Treino', category: 'Foco do dia', color: '#D946EF', icon: '💖', exercises: [] }]);
  const deleteWorkout = (wId) => setWorkouts(workouts.filter(w => w.id !== wId));
  const addNewExercise = (wId) => setWorkouts(workouts.map(w => w.id !== wId ? w : { ...w, exercises: [...w.exercises, { id: `E_${Date.now()}`, name: 'Novo Exercício', notes: '', restType: 'normal', sets: [{ id: 1, type: 'N', prev: '-', weight: 0, reps: 0, completed: false }] }] }));
  const deleteExercise = (wId, exId) => setWorkouts(workouts.map(w => w.id !== wId ? w : { ...w, exercises: w.exercises.filter(ex => ex.id !== exId) }));
  
  // Substituição Rápida de Exercício (Prompt nativo simples)
  const quickSwapExercise = (wId, exId) => {
    const newName = window.prompt("Qual o nome do novo exercício?");
    if (newName && newName.trim() !== "") {
      setWorkouts(workouts.map(w => w.id === wId ? { ...w, exercises: w.exercises.map(ex => ex.id === exId ? { ...ex, name: newName } : ex) } : w));
    }
  };

  const updateWorkoutField = (wId, field, value) => setWorkouts(workouts.map(w => w.id === wId ? { ...w, [field]: value } : w));
  
  const cycleSetType = (wId, exId, setIndex) => {
    const sequence = ['N', 'W', 'D', 'F'];
    setWorkouts(workouts.map(w => w.id === wId ? { ...w, exercises: w.exercises.map(ex => ex.id === exId ? { ...ex, sets: ex.sets.map((s, i) => {
      if (i !== setIndex) return s;
      const nextType = sequence[(sequence.indexOf(s.type || 'N') + 1) % sequence.length];
      return { ...s, type: nextType };
    }) } : ex) } : w));
  };

  const toggleSetComplete = (wId, exId, setIndex, restType) => {
    if (isEditing) return;
    const restTime = restType === 'compound' ? userProfile.restCompound : userProfile.restNormal;
    setWorkouts(workouts.map(w => w.id === wId ? { ...w, exercises: w.exercises.map(ex => ex.id === exId ? { ...ex, sets: ex.sets.map((s, i) => {
      if (i !== setIndex) return s;
      if (!s.completed) setRestTimer(restTime);
      return { ...s, completed: !s.completed };
    }) } : ex) } : w));
  };

  const addSet = (wId, exId) => setWorkouts(workouts.map(w => w.id === wId ? { ...w, exercises: w.exercises.map(ex => {
    if (ex.id !== exId) return ex;
    const lastSet = ex.sets[ex.sets.length - 1] || { weight: 0, reps: 0, prev: '-', type: 'N' };
    return { ...ex, sets: [...ex.sets, { id: ex.sets.length + 1, type: 'N', prev: `${lastSet.weight}kg`, weight: lastSet.weight, reps: lastSet.reps, completed: false }] };
  }) } : w));
  
  const updateSetData = (wId, exId, setIndex, field, value) => setWorkouts(workouts.map(w => w.id === wId ? { ...w, exercises: w.exercises.map(ex => ex.id === exId ? { ...ex, sets: ex.sets.map((s, i) => i === setIndex ? { ...s, [field]: value } : s) } : ex) } : w));
  const updateExerciseField = (wId, exId, field, value) => setWorkouts(workouts.map(w => w.id === wId ? { ...w, exercises: w.exercises.map(ex => ex.id === exId ? { ...ex, [field]: value } : ex) } : w));

  const toggleTheme = () => setUserProfile({ ...userProfile, theme: userProfile.theme === 'light' ? 'dark' : 'light' });

  if (!isLoaded) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: ${t.bgGradient}; min-height: 100vh; color: #FFF; background-attachment: fixed; transition: background 0.5s ease; }
      `}} />

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <main style={{ flex: 1, padding: '24px 16px 110px 16px', maxWidth: '480px', margin: '0 auto', width: '100%' }}>
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: t.pageSubtitle, fontWeight: '900', letterSpacing: '1.5px' }}>PRO TRACKER 🎀</span>
              <h1 style={{ fontSize: '1.7rem', color: t.pageTitle, fontWeight: '800', margin: '2px 0 0 0' }}>
                {activeTab === 'inicio' && 'Oi, Linda! ✨'}
                {activeTab === 'meus-treinos' && 'Fichas de Treino'}
                {activeTab === 'estatisticas' && 'Meu Sucesso'}
                {activeTab === 'perfil' && 'Perfil Físico'}
                {activeTab === 'configuracoes' && 'Ajustes'}
              </h1>
            </div>
            <div style={{ background: t.cardBg, padding: '8px 14px', borderRadius: '20px', border: `1px solid ${t.cardBorder}`, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>🔥</div>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: '900', display: 'block', lineHeight: '1', color: t.textPrimary }}>{totalCompleted}</span>
                <span style={{ fontSize: '0.55rem', color: t.textSecondary, fontWeight: '800' }}>SESSÕES</span>
              </div>
            </div>
          </header>

          {/* 1. ABA INÍCIO */}
          {activeTab === 'inicio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ background: 'linear-gradient(135deg, #8B5CF6, #D946EF)', padding: '24px', borderRadius: '30px', boxShadow: '0 12px 30px rgba(217, 70, 239, 0.3)' }}>
                <span style={{ fontSize: '0.75rem', color: '#FDF4FF', fontWeight: '800', letterSpacing: '1px' }}>PRÓXIMO TREINO 🌸</span>
                <h2 style={{ fontSize: '1.7rem', fontWeight: '900', margin: '4px 0 2px 0', color: '#FFF' }}>{workouts[0]?.title || 'Seu Treino'}</h2>
                <p style={{ fontSize: '0.85rem', color: '#F3E8FF', marginBottom: '20px' }}>{workouts[0]?.category || 'Foco do dia'}</p>
                <button onClick={() => { setActiveTab('meus-treinos'); setActiveWorkout(workouts[0]?.id); }} style={{ width: '100%', padding: '16px', background: '#FFFFFF', color: '#D946EF', border: 'none', borderRadius: '20px', fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  ▶ BORA TREINAR!
                </button>
              </div>

              <div style={{ background: t.cardBg, padding: '20px', borderRadius: '30px', color: t.textPrimary, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: `1px solid ${t.cardBorder}` }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '14px' }}>Semana Atual ✨</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dayLabel, index) => {
                    const isToday = index === new Date().getDay();
                    return (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: '800', color: isToday ? '#D946EF' : t.textSecondary }}>{dayLabel}</span>
                        <div style={{ width: '34px', height: '34px', borderRadius: '12px', background: isToday ? '#D946EF' : t.inputBg, color: isToday ? '#FFF' : t.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.9rem', opacity: index > new Date().getDay() ? 0.4 : 1 }}>
                          {index <= new Date().getDay() ? '💖' : '-'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: t.cardBg, padding: '20px', borderRadius: '30px', color: t.textPrimary, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: `1px solid ${t.cardBorder}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>💧</span>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '900' }}>Bebeu Água?</h3>
                      <span style={{ fontSize: '0.75rem', color: t.textSecondary, fontWeight: '700' }}>Meta: {(userProfile.waterGoal / 1000).toFixed(1)}L</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#3B82F6' }}>{(waterIntake / 1000).toFixed(2)}L</span>
                </div>
                <div style={{ width: '100%', height: '12px', background: t.inputBg, borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ width: `${Math.min((waterIntake / userProfile.waterGoal) * 100, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #3B82F6, #60A5FA)', borderRadius: '8px', transition: 'width 0.4s ease' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setWaterIntake(p => p + 250)} style={{ flex: 1, padding: '12px', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: '16px', fontWeight: '900', fontSize: '0.8rem', cursor: 'pointer' }}>+ 250 ml</button>
                  <button onClick={() => setWaterIntake(p => p + 500)} style={{ flex: 1, padding: '12px', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: '16px', fontWeight: '900', fontSize: '0.8rem', cursor: 'pointer' }}>+ 500 ml</button>
                </div>
              </div>
            </div>
          )}

          {/* 2. ABA TREINOS */}
          {activeTab === 'meus-treinos' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <button onClick={() => { setIsEditing(!isEditing); setWorkoutSession(null); }} style={{ width: '100%', background: isEditing ? 'linear-gradient(135deg, #10B981, #059669)' : t.cardBg, color: isEditing ? '#FFF' : t.textPrimary, border: `1px solid ${isEditing ? 'transparent' : t.cardBorder}`, padding: '18px', borderRadius: '26px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '16px', background: isEditing ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #8B5CF6, #D946EF)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>⚙️</div>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '0.95rem', display: 'block', fontWeight: '900' }}>{isEditing ? 'SALVAR ALTERAÇÕES ✨' : 'PERSONALIZAR FICHAS 🎀'}</span>
                    <span style={{ fontSize: '0.75rem', color: isEditing ? '#E2E8F0' : t.textSecondary, fontWeight: '700' }}>{isEditing ? 'Concluir modificações' : 'Criar, editar e excluir treinos'}</span>
                  </div>
                </button>
              </div>

              {restTimer > 0 && !isEditing && (
                <div style={{ position: 'fixed', bottom: '95px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #D946EF, #8B5CF6)', color: '#FFF', padding: '14px 28px', borderRadius: '30px', boxShadow: '0 10px 25px rgba(217, 70, 239, 0.4)', zIndex: 1000, fontWeight: '900', fontSize: '0.9rem', border: '2px solid rgba(255,255,255,0.2)' }}>
                  ⏳ DESCANSO: {formatTime(restTimer)}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {workouts.map((w) => {
                  const isOpen = activeWorkout === w.id || isEditing;
                  const isRunning = workoutSession?.workoutId === w.id;

                  return (
                    <div key={w.id} style={{ position: 'relative', background: t.cardBg, borderRadius: '30px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: `1px solid ${t.cardBorder}`, color: t.textPrimary }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '10px', background: isRunning ? '#10B981' : w.color }} />
                      <div onClick={() => !isEditing && setActiveWorkout(isOpen ? null : w.id)} style={{ padding: '22px 20px 22px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '18px', background: `${w.color}20`, color: w.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 'bold' }}>{w.icon}</div>
                          <div>
                            {isEditing ? (
                              <>
                                <input value={w.title} onChange={(e) => updateWorkoutField(w.id, 'title', e.target.value)} style={{ background: 'transparent', border: `1px dashed ${t.textSecondary}`, fontWeight: '900', fontSize: '1.1rem', outline: 'none', width: '100%', color: t.textPrimary }} />
                                <input value={w.category} onChange={(e) => updateWorkoutField(w.id, 'category', e.target.value)} style={{ background: 'transparent', border: `1px dashed ${t.textSecondary}`, fontSize: '0.8rem', color: t.textSecondary, outline: 'none', width: '100%', display: 'block', marginTop: '4px' }} />
                              </>
                            ) : (
                              <>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: t.textPrimary }}>{w.title}</h3>
                                <span style={{ fontSize: '0.85rem', color: t.textSecondary, fontWeight: '700' }}>{w.category}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {isEditing && <button onClick={() => deleteWorkout(w.id)} style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', width: '38px', height: '38px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>}
                      </div>

                      {isOpen && (
                        <div style={{ padding: '0 20px 20px 28px', borderTop: `1px solid ${t.inputBg}`, paddingTop: '18px' }}>
                          {!isEditing && (
                            <button onClick={() => isRunning ? handleFinishWorkout() : setWorkoutSession({ workoutId: w.id, seconds: 0 })} style={{ width: '100%', padding: '16px', borderRadius: '20px', background: isRunning ? '#10B981' : w.color, color: '#FFF', border: 'none', fontWeight: '900', cursor: 'pointer', marginBottom: '20px', fontSize: '0.9rem', boxShadow: '0 6px 16px rgba(0,0,0,0.15)' }}>
                              {isRunning ? `✓ FINALIZAR SESSÃO (${formatTime(workoutSession.seconds)})` : '▶ COMEÇAR SESSÃO ✨'}
                            </button>
                          )}

                          {w.exercises.map((ex) => (
                            <div key={ex.id} style={{ background: t.inputBg, padding: '16px', borderRadius: '22px', marginBottom: '14px', border: `1px solid ${t.cardBorder}` }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                {isEditing ? (
                                  <input value={ex.name} onChange={(e) => updateExerciseField(w.id, ex.id, 'name', e.target.value)} style={{ background: 'transparent', border: `1px dashed ${t.textSecondary}`, fontWeight: '900', outline: 'none', color: t.textPrimary, width: '100%' }} />
                                ) : (
                                  <h4 style={{ margin: 0, color: t.textPrimary, fontSize: '1rem', fontWeight: '900' }}>{ex.name}</h4>
                                )}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {!isEditing && isRunning && (
                                    <button onClick={() => quickSwapExercise(w.id, ex.id)} style={{ background: 'transparent', color: '#3B82F6', border: 'none', cursor: 'pointer', fontSize: '1rem' }} title="Substituir Exercício">🔄</button>
                                  )}
                                  {isEditing && <button onClick={() => deleteExercise(w.id, ex.id)} style={{ background: 'transparent', color: '#EF4444', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Excluir</button>}
                                </div>
                              </div>
                              <input type="text" value={ex.notes} onChange={(e) => updateExerciseField(w.id, ex.id, 'notes', e.target.value)} placeholder="Anotações fofas aqui... 📝" readOnly={!isEditing} style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '0.8rem', color: t.textSecondary, marginBottom: '12px', outline: 'none', fontWeight: '600' }} />
                              
                              <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 36px', gap: '6px', fontSize: '0.7rem', color: t.textSecondary, fontWeight: '800', textAlign: 'center', marginBottom: '8px' }}>
                                <span>TIPO</span><span>ANT.</span><span>KG</span><span>REPS</span><span>✓</span>
                              </div>
                              
                              {ex.sets.map((set, idx) => {
                                const tag = SET_TYPES[set.type || 'N'];
                                const btnColor = set.completed ? tag.color : t.cardBg;
                                
                                return (
                                <div key={set.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 36px', gap: '6px', alignItems: 'center', marginBottom: '8px', textAlign: 'center' }}>
                                  
                                  {/* Botão de Tipo da Série */}
                                  <button onClick={() => isEditing && cycleSetType(w.id, ex.id, idx)} style={{ width: '100%', padding: '6px 0', background: isEditing ? `${tag.color}20` : 'transparent', border: `1px solid ${isEditing ? tag.color : 'transparent'}`, borderRadius: '8px', color: tag.color, fontWeight: '900', fontSize: '0.75rem', cursor: isEditing ? 'pointer' : 'default' }}>
                                    {tag.short}
                                  </button>

                                  <span style={{ fontSize: '0.75rem', color: t.textSecondary, fontWeight: '600' }}>{set.prev}</span>
                                  
                                  <input type="number" value={set.weight} onChange={(e) => updateSetData(w.id, ex.id, idx, 'weight', e.target.value)} readOnly={!isEditing && set.completed} style={{ width: '100%', textAlign: 'center', padding: '8px 2px', borderRadius: '10px', background: t.cardBg, border: `1px solid ${t.cardBorder}`, fontWeight: '800', fontSize: '0.9rem', color: t.textPrimary, outline: 'none' }} />
                                  <input type="number" value={set.reps} onChange={(e) => updateSetData(w.id, ex.id, idx, 'reps', e.target.value)} readOnly={!isEditing && set.completed} style={{ width: '100%', textAlign: 'center', padding: '8px 2px', borderRadius: '10px', background: t.cardBg, border: `1px solid ${t.cardBorder}`, fontWeight: '800', fontSize: '0.9rem', color: t.textPrimary, outline: 'none' }} />
                                  
                                  {/* Botão de Check que muda de cor conforme a TAG */}
                                  <div onClick={() => toggleSetComplete(w.id, ex.id, idx, ex.restType)} style={{ width: '32px', height: '32px', borderRadius: '10px', margin: '0 auto', background: btnColor, border: `2px solid ${set.completed ? tag.color : t.textSecondary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    {set.completed && <span style={{ color: '#FFF', fontWeight: 'bold', fontSize: '0.8rem' }}>{tag.icon}</span>}
                                  </div>
                                </div>
                              )})}
                              <button onClick={() => addSet(w.id, ex.id)} style={{ width: '100%', marginTop: '10px', padding: '10px', background: 'transparent', border: `2px dashed ${t.cardBorder}`, color: t.textSecondary, borderRadius: '12px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '800' }}>+ Adicionar Série 🌸</button>
                            </div>
                          ))}
                          {isEditing && <button onClick={() => addNewExercise(w.id)} style={{ width: '100%', padding: '14px', background: '#ECFDF5', color: '#059669', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)' }}>+ NOVO EXERCÍCIO</button>}
                        </div>
                      )}
                    </div>
                  );
                })}
                {isEditing && <button onClick={addNewWorkout} style={{ width: '100%', padding: '18px', background: 'transparent', color: t.textPrimary, border: `2px dashed ${t.textSecondary}`, borderRadius: '26px', fontWeight: '900', cursor: 'pointer', fontSize: '0.95rem' }}>+ CRIAR TREINO 🎀</button>}
              </div>
            </>
          )}

          {/* 3. ABA DADOS */}
          {activeTab === 'estatisticas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: t.cardBg, padding: '24px', borderRadius: '30px', color: t.textPrimary, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: `1px solid ${t.cardBorder}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '900' }}>Calendário de Sucesso 🏆</h3>
                  <span style={{ fontSize: '0.8rem', color: '#D946EF', fontWeight: '900' }}>Mês Atual</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '800', color: t.textSecondary, marginBottom: '12px' }}>
                  <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isDone = completedDaysInMonth.includes(day);
                    return (
                      <div key={day} style={{ height: '40px', borderRadius: '14px', background: isDone ? 'linear-gradient(135deg, #10B981, #059669)' : t.inputBg, color: isDone ? '#FFF' : t.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.9rem', boxShadow: isDone ? '0 4px 10px rgba(16, 185, 129, 0.3)' : 'none' }}>
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 4. ABA PERFIL */}
          {activeTab === 'perfil' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {[ { label: 'PESO (kg)', field: 'weight' }, { label: '% GORDURA', field: 'bf' }, { label: 'IMC', val: (userProfile.weight / (userProfile.height * userProfile.height)).toFixed(1), color: '#F97316' } ].map((item, i) => (
                  <div key={i} style={{ background: t.cardBg, padding: '16px', borderRadius: '24px', color: t.textPrimary, border: `1px solid ${t.cardBorder}`, textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: t.textSecondary, fontWeight: '800', display: 'block', marginBottom: '6px' }}>{item.label}</span>
                    {item.field ? (
                      <input type="number" value={userProfile[item.field]} onChange={(e) => setUserProfile({ ...userProfile, [item.field]: parseFloat(e.target.value) || 0 })} style={{ fontSize: '1.3rem', fontWeight: '900', border: 'none', background: 'transparent', width: '100%', color: t.textPrimary, outline: 'none', textAlign: 'center' }} />
                    ) : (
                      <div style={{ fontSize: '1.3rem', fontWeight: '900', color: item.color }}>{item.val}</div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ background: t.cardBg, padding: '24px', borderRadius: '30px', color: t.textPrimary, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: `1px solid ${t.cardBorder}` }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '16px' }}>Medidas Fofas (cm) 📏</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {[ { label: 'Braço', field: 'arm' }, { label: 'Peito', field: 'chest' }, { label: 'Ombros', field: 'shoulder' }, { label: 'Cintura', field: 'waist' }, { label: 'Quadril', field: 'hip' }, { label: 'Coxa', field: 'thigh' }, { label: 'Panturrilha', field: 'calf' } ].map((m) => (
                    <div key={m.field} style={{ background: t.inputBg, padding: '14px', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${t.cardBorder}` }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '800', color: t.textSecondary }}>{m.label}</span>
                      <input type="number" value={userProfile[m.field]} onChange={(e) => setUserProfile({ ...userProfile, [m.field]: parseFloat(e.target.value) || 0 })} style={{ width: '50px', textAlign: 'right', background: 'transparent', border: 'none', fontWeight: '900', fontSize: '1rem', color: t.textPrimary, outline: 'none' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. ABA AJUSTES */}
          {activeTab === 'configuracoes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ background: t.cardBg, padding: '24px', borderRadius: '30px', color: t.textPrimary, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: `1px solid ${t.cardBorder}` }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '16px' }}>Aparência 💅</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: t.inputBg, padding: '16px', borderRadius: '20px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: t.textPrimary }}>Tema do App</span>
                  <button onClick={toggleTheme} style={{ padding: '8px 16px', borderRadius: '12px', background: userProfile.theme === 'light' ? '#D946EF' : '#2E1065', color: '#FFF', fontWeight: '900', border: 'none', cursor: 'pointer' }}>
                    {userProfile.theme === 'light' ? 'Modo Claro 🌸' : 'Modo Escuro 🌙'}
                  </button>
                </div>
              </div>

              <div style={{ background: t.cardBg, padding: '24px', borderRadius: '30px', color: t.textPrimary, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: `1px solid ${t.cardBorder}` }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '16px' }}>Configurações Globais ⚙️</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: t.inputBg, padding: '14px 16px', borderRadius: '20px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: t.textSecondary }}>💧 Água Diária (ml)</span>
                  <input type="number" value={userProfile.waterGoal} onChange={(e) => setUserProfile({ ...userProfile, waterGoal: parseInt(e.target.value) || 0 })} style={{ width: '70px', textAlign: 'right', background: 'transparent', border: 'none', fontWeight: '900', fontSize: '1.1rem', color: '#3B82F6', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: t.inputBg, padding: '14px 16px', borderRadius: '20px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: t.textSecondary }}>⏱ Descanso Normal (s)</span>
                  <input type="number" value={userProfile.restNormal} onChange={(e) => setUserProfile({ ...userProfile, restNormal: parseInt(e.target.value) || 0 })} style={{ width: '70px', textAlign: 'right', background: 'transparent', border: 'none', fontWeight: '900', fontSize: '1.1rem', color: t.textPrimary, outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: t.inputBg, padding: '14px 16px', borderRadius: '20px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: t.textSecondary }}>🔥 Descanso Compostos (s)</span>
                  <input type="number" value={userProfile.restCompound} onChange={(e) => setUserProfile({ ...userProfile, restCompound: parseInt(e.target.value) || 0 })} style={{ width: '70px', textAlign: 'right', background: 'transparent', border: 'none', fontWeight: '900', fontSize: '1.1rem', color: t.textPrimary, outline: 'none' }} />
                </div>
              </div>
            </div>
          )}

        </main>

        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, background: t.navBg,
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          padding: '12px 16px 20px 16px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: '8px', zIndex: 100, borderTop: `1px solid ${t.cardBorder}`
        }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} 
                style={{
                  width: '58px', height: '58px', borderRadius: '20px',
                  border: isActive ? 'none' : 'transparent',
                  background: isActive ? item.gradient : 'transparent',
                  color: isActive ? t.navActiveText : t.navText,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? '0 8px 20px rgba(0,0,0,0.15)' : 'none',
                  transform: isActive ? 'translateY(-4px)' : 'none'
                }}
              >
                <span style={{ fontSize: '1.3rem', filter: isActive ? 'none' : 'grayscale(100%) opacity(60%)' }}>{item.icon}</span>
                <span style={{ fontSize: '0.6rem', fontWeight: '900' }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </>
  );
}
