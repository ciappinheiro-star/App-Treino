'use client';
import { useState, useEffect } from 'react';

// Paleta de Cores
const THEMES = {
  dark: {
    bgGradient: 'linear-gradient(180deg, #2E1065 0%, #1E1B4B 100%)',
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(255, 255, 255, 0.2)',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    inputBg: '#F8FAFC',
    navBg: 'rgba(15, 23, 42, 0.85)',
    navText: '#A1A1AA',
    navActiveText: '#FFFFFF',
    pageTitle: '#FFFFFF',
    pageSubtitle: '#A855F7'
  },
  light: {
    bgGradient: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)',
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(0, 0, 0, 0.08)',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    inputBg: '#F1F5F9',
    navBg: 'rgba(255, 255, 255, 0.95)',
    navText: '#94A3B8',
    navActiveText: '#FFFFFF',
    pageTitle: '#0F172A',
    pageSubtitle: '#059669'
  }
};

const INITIAL_WORKOUTS = [
  {
    id: 'TREINO_A', title: 'Treino A', category: 'Inferiores & Core', color: '#00D2FF', icon: '⚡',
    exercises: [
      { id: 'ex_1', name: 'Elevação Pélvica', notes: 'Pausa de 2s no topo', restType: 'compound', sets: [
        { id: 1, type: 'N', prev: '-', weight: 20, reps: 12, completed: false },
        { id: 2, type: 'N', prev: '-', weight: 20, reps: 12, completed: false }
      ]}
    ]
  }
];

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Helper para pegar a data local
const getLocalDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isEditing, setIsEditing] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  
  // Estado do Treino Ativo (Cronômetro Único e Global)
  const [workoutSession, setWorkoutSession] = useState(null); // { workoutId, seconds }
  const [restTimer, setRestTimer] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Estados de Dados
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [workouts, setWorkouts] = useState(INITIAL_WORKOUTS);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  
  // Perfil e Configurações Globais
  const [userProfile, setUserProfile] = useState({
    weight: 70.0, height: 1.75, bf: 18, 
    arm: 30, waist: 75, hip: 95, thigh: 55, calf: 35, chest: 90, shoulder: 105,
    waterGoal: 3000, theme: 'dark', restNormal: 60, restCompound: 120
  });

  // Carregamento Inicial
  useEffect(() => {
    try {
      const todayStr = getLocalDate();
      const savedDate = localStorage.getItem('pro_last_date');
      const savedWorkouts = localStorage.getItem('pro_workouts_v8');
      const savedTotal = localStorage.getItem('pro_total_v8');
      const savedProfile = localStorage.getItem('pro_profile_v8');
      const savedHistory = localStorage.getItem('pro_history_v8');
      
      if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
      if (savedTotal) setTotalCompleted(JSON.parse(savedTotal));
      if (savedProfile) setUserProfile({ ...userProfile, ...JSON.parse(savedProfile) });
      if (savedHistory) setWorkoutHistory(JSON.parse(savedHistory));

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
    localStorage.setItem('pro_workouts_v8', JSON.stringify(workouts));
    localStorage.setItem('pro_total_v8', JSON.stringify(totalCompleted));
    localStorage.setItem('pro_water', JSON.stringify(waterIntake));
    localStorage.setItem('pro_profile_v8', JSON.stringify(userProfile));
    localStorage.setItem('pro_history_v8', JSON.stringify(workoutHistory));
  }, [workouts, totalCompleted, waterIntake, userProfile, workoutHistory, isLoaded]);

  const t = THEMES[userProfile.theme || 'dark'];

  const navItems = [
    { id: 'inicio', label: 'Início', icon: '🏠', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
    { id: 'meus-treinos', label: 'Treinos', icon: '📋', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' },
    { id: 'estatisticas', label: 'Dados', icon: '📈', gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' },
    { id: 'perfil', label: 'Perfil', icon: '👤', gradient: 'linear-gradient(135deg, #F97316, #EA580C)' },
    { id: 'configuracoes', label: 'Ajustes', icon: '⚙️', gradient: 'linear-gradient(135deg, #EC4899, #BE185D)' }
  ];

  // 1. Cronômetro GLOBAL da Sessão (Contagem contínua do treino inteiro)
  useEffect(() => {
    let interval = null;
    if (workoutSession) {
      interval = setInterval(() => {
        setWorkoutSession(prev => prev ? { ...prev, seconds: prev.seconds + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutSession]);

  // 2. Cronômetro de Descanso entre Séries
  useEffect(() => {
    let interval = null;
    if (restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => (prev && prev > 0 ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  const formatTime = (totalSec) => `${Math.floor(totalSec / 60).toString().padStart(2, '0')}:${(totalSec % 60).toString().padStart(2, '0')}`;
  
  const formatDurationText = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  // FINALIZAR TREINO (Grava o tempo total no histórico)
  const handleFinishWorkout = (wId) => {
    if (!workoutSession) return;
    const todayStr = getLocalDate();
    setWorkoutHistory(prev => [...prev, { date: todayStr, duration: workoutSession.seconds }]);
    setWorkoutSession(null);
    setRestTimer(null);
    setTotalCompleted(prev => prev + 1);

    // Reseta checks para a próxima sessão
    setWorkouts(workouts.map(w => w.id === wId ? {
      ...w,
      exercises: w.exercises.map(ex => ({
        ...ex,
        sets: ex.sets.map(s => ({ ...s, completed: false }))
      }))
    } : w));
  };

  // Funções de Treino
  const addNewWorkout = () => setWorkouts([...workouts, { id: `W_${Date.now()}`, title: 'Novo Treino', category: 'Foco do dia', color: '#00D2FF', icon: '⚡', exercises: [] }]);
  const deleteWorkout = (wId) => setWorkouts(workouts.filter(w => w.id !== wId));
  const addNewExercise = (wId) => setWorkouts(workouts.map(w => w.id !== wId ? w : { ...w, exercises: [...w.exercises, { id: `E_${Date.now()}`, name: 'Novo Exercício', notes: '', restType: 'normal', sets: [{ id: 1, type: 'N', prev: '-', weight: 0, reps: 0, completed: false }] }] }));
  const deleteExercise = (wId, exId) => setWorkouts(workouts.map(w => w.id !== wId ? w : { ...w, exercises: w.exercises.filter(ex => ex.id !== exId) }));
  
  const quickSwapExercise = (wId, exId) => {
    const newName = window.prompt("Nome do exercício substituto:");
    if (newName && newName.trim() !== "") {
      setWorkouts(workouts.map(w => w.id === wId ? { ...w, exercises: w.exercises.map(ex => ex.id === exId ? { ...ex, name: newName } : ex) } : w));
    }
  };

  const updateWorkoutField = (wId, field, value) => setWorkouts(workouts.map(w => w.id === wId ? { ...w, [field]: value } : w));

  const toggleSetComplete = (wId, exId, setIndex, restType) => {
    if (isEditing) return;
    const restTime = restType === 'compound' ? userProfile.restCompound : userProfile.restNormal;
    setWorkouts(workouts.map(w => w.id === wId ? { ...w, exercises: w.exercises.map(ex => ex.id === exId ? { ...ex, sets: ex.sets.map((s, i) => {
      if (i !== setIndex) return s;
      if (!s.completed) setRestTimer(restTime);
      return { ...s, completed: !s.completed };
    }) } : ex) } : w));
  };

  const addSet = (wId, exId) => setWorkouts(workouts.map(w => w.id !== wId ? w : { ...w, exercises: w.exercises.map(ex => {
    if (ex.id !== exId) return ex;
    const lastSet = ex.sets[ex.sets.length - 1] || { weight: 0, reps: 0, prev: '-', type: 'N' };
    return { ...ex, sets: [...ex.sets, { id: ex.sets.length + 1, type: 'N', prev: `${lastSet.weight}kg`, weight: lastSet.weight, reps: lastSet.reps, completed: false }] };
  }) }));
  
  const updateSetData = (wId, exId, setIndex, field, value) => {
    const numVal = parseFloat(value) || 0;
    setWorkouts(workouts.map(w => w.id === wId ? { ...w, exercises: w.exercises.map(ex => ex.id === exId ? { ...ex, sets: ex.sets.map((s, i) => i === setIndex ? { ...s, [field]: numVal } : s) } : ex) } : w));
  };

  const updateExerciseField = (wId, exId, field, value) => setWorkouts(workouts.map(w => w.id === wId ? { ...w, exercises: w.exercises.map(ex => ex.id === exId ? { ...ex, [field]: value } : ex) } : w));

  const toggleTheme = () => setUserProfile({ ...userProfile, theme: userProfile.theme === 'light' ? 'dark' : 'light' });

  // Cálculo Dinâmico de Estatísticas e Calendário
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIdx = today.getMonth();
  const currentMonthName = MONTH_NAMES[currentMonthIdx];
  const currentMonthStr = `${currentYear}-${String(currentMonthIdx + 1).padStart(2, '0')}`;
  
  const thisMonthHistory = workoutHistory.filter(h => h.date.startsWith(currentMonthStr));
  const totalSecondsMonth = thisMonthHistory.reduce((acc, curr) => acc + curr.duration, 0);
  const currentDayOfMonth = today.getDate();
  const avgSecondsDaily = currentDayOfMonth > 0 ? totalSecondsMonth / currentDayOfMonth : 0;
  
  const dayOfWeek = today.getDay(); 
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  startOfWeek.setHours(0,0,0,0);
  
  const thisWeekHistory = thisMonthHistory.filter(h => {
    const [y, m, d] = h.date.split('-');
    const workoutDate = new Date(y, m - 1, d);
    return workoutDate >= startOfWeek;
  });
  const totalSecondsWeek = thisWeekHistory.reduce((acc, curr) => acc + curr.duration, 0);

  const daysCompletedThisMonth = thisMonthHistory.map(h => parseInt(h.date.split('-')[2]));

  const firstDayOfWeekInMonth = new Date(currentYear, currentMonthIdx, 1).getDay(); 
  const daysInCurrentMonth = new Date(currentYear, currentMonthIdx + 1, 0).getDate(); 

  if (!isLoaded) return null;

  const currentActiveWorkoutObj = workouts.find(w => w.id === workoutSession?.workoutId);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: ${t.bgGradient}; min-height: 100vh; color: #FFF; background-attachment: fixed; transition: background 0.3s ease; }
        button { transition: transform 0.1s ease, filter 0.2s ease; }
        button:active { transform: scale(0.96); }
        .tabular-num { font-variant-numeric: tabular-nums; }
      `}} />

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* BARRA FIXA SUPERIOR: MOSTRA O CRONÔMETRO GLOBAL DO TREINO */}
        {workoutSession && (
          <div style={{ position: 'sticky', top: 0, zIndex: 999, background: '#10B981', color: '#FFF', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
            <div>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.9, display: 'block' }}>
                TEMPO TOTAL DE TREINO ({currentActiveWorkoutObj?.title || 'Sessão'})
              </span>
              <span className="tabular-num" style={{ fontSize: '1.3rem', fontWeight: '900' }}>
                ⏱️ {formatTime(workoutSession.seconds)}
              </span>
            </div>
            <button onClick={() => handleFinishWorkout(workoutSession.workoutId)} style={{ background: '#FFF', color: '#059669', border: 'none', padding: '10px 16px', borderRadius: '14px', fontWeight: '900', fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              ✓ FINALIZAR
            </button>
          </div>
        )}

        <main style={{ flex: 1, padding: '24px 16px 110px 16px', maxWidth: '480px', margin: '0 auto', width: '100%' }}>
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: t.pageSubtitle, fontWeight: '900', letterSpacing: '1.5px', textTransform: 'uppercase' }}>PRO TRACKER</span>
              <h1 style={{ fontSize: '1.7rem', color: t.pageTitle, fontWeight: '800', margin: '2px 0 0 0' }}>
                {activeTab === 'inicio' && 'Início'}
                {activeTab === 'meus-treinos' && 'Treinos'}
                {activeTab === 'estatisticas' && 'Dados'}
                {activeTab === 'perfil' && 'Perfil'}
                {activeTab === 'configuracoes' && 'Ajustes'}
              </h1>
            </div>
            <div style={{ background: t.cardBg, padding: '8px 14px', borderRadius: '16px', border: `1px solid ${t.cardBorder}`, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '1.2rem' }}>🏋️</div>
              <div>
                <span className="tabular-num" style={{ fontSize: '1.1rem', fontWeight: '900', display: 'block', lineHeight: '1', color: t.textPrimary }}>{totalCompleted}</span>
                <span style={{ fontSize: '0.55rem', color: t.textSecondary, fontWeight: '800', letterSpacing: '0.5px' }}>TREINOS</span>
              </div>
            </div>
          </header>

          {/* 1. ABA INÍCIO */}
          {activeTab === 'inicio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ background: 'linear-gradient(135deg, #8B5CF6, #D946EF)', padding: '24px', borderRadius: '24px', boxShadow: '0 8px 25px rgba(217, 70, 239, 0.3)' }}>
                <span style={{ fontSize: '0.75rem', color: '#FDF4FF', fontWeight: '800', letterSpacing: '1px' }}>PRÓXIMO TREINO</span>
                <h2 style={{ fontSize: '1.7rem', fontWeight: '900', margin: '4px 0 2px 0', color: '#FFF' }}>{workouts[0]?.title || 'Seu Treino'}</h2>
                <p style={{ fontSize: '0.85rem', color: '#F3E8FF', marginBottom: '20px' }}>{workouts[0]?.category || 'Foco do dia'}</p>
                <button onClick={() => { setActiveTab('meus-treinos'); setActiveWorkout(workouts[0]?.id); }} style={{ width: '100%', padding: '16px', background: '#FFFFFF', color: '#D946EF', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  IR PARA OS TREINOS
                </button>
              </div>

              {/* Semana Atual */}
              <div style={{ background: t.cardBg, padding: '24px', borderRadius: '28px', color: t.textPrimary, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: `1px solid ${t.cardBorder}` }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '18px' }}>Semana Atual</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dayLabel, index) => {
                    const checkDate = new Date();
                    checkDate.setDate(today.getDate() - (today.getDay() - index));
                    const isToday = index === today.getDay();
                    const isCompleted = daysCompletedThisMonth.includes(checkDate.getDate());
                    
                    return (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: isToday ? '#3B82F6' : t.textSecondary }}>{dayLabel}</span>
                        <div style={{
                          width: '42px', height: '42px', borderRadius: isToday ? '14px' : '50%',
                          background: isToday ? '#3B82F6' : (isCompleted ? '#F0FDF4' : 'rgba(241, 245, 249, 0.6)'),
                          color: isToday ? '#FFF' : '#10B981',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '900', fontSize: '1rem',
                          boxShadow: isToday ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                        }}>
                          {isCompleted || isToday ? '✓' : '-'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: t.cardBg, padding: '20px', borderRadius: '24px', color: t.textPrimary, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: `1px solid ${t.cardBorder}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>💧</span>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '900' }}>Hidratação</h3>
                      <span style={{ fontSize: '0.75rem', color: t.textSecondary, fontWeight: '700' }}>Meta: {(userProfile.waterGoal / 1000).toFixed(1)}L</span>
                    </div>
                  </div>
                  <span className="tabular-num" style={{ fontSize: '1.1rem', fontWeight: '900', color: '#3B82F6' }}>{(waterIntake / 1000).toFixed(2)}L</span>
                </div>
                <div style={{ width: '100%', height: '12px', background: t.inputBg, borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ width: `${Math.min((waterIntake / userProfile.waterGoal) * 100, 100)}%`, height: '100%', background: '#3B82F6', borderRadius: '6px', transition: 'width 0.4s ease' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setWaterIntake(p => p + 250)} style={{ flex: 1, padding: '12px', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: '12px', fontWeight: '900', fontSize: '0.8rem', cursor: 'pointer' }}>+ 250 ml</button>
                  <button onClick={() => setWaterIntake(p => p + 500)} style={{ flex: 1, padding: '12px', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: '12px', fontWeight: '900', fontSize: '0.8rem', cursor: 'pointer' }}>+ 500 ml</button>
                </div>
              </div>
            </div>
          )}

          {/* 2. ABA TREINOS */}
          {activeTab === 'meus-treinos' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <button onClick={() => { setIsEditing(!isEditing); }} style={{ width: '100%', background: isEditing ? '#10B981' : t.cardBg, color: isEditing ? '#FFF' : t.textPrimary, border: `1px solid ${isEditing ? 'transparent' : t.cardBorder}`, padding: '16px', borderRadius: '20px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isEditing ? 'rgba(255,255,255,0.2)' : t.inputBg, color: isEditing ? '#FFF' : t.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>⚙️</div>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '0.95rem', display: 'block', fontWeight: '900' }}>{isEditing ? 'SALVAR ALTERAÇÕES' : 'EDITAR FICHAS'}</span>
                    <span style={{ fontSize: '0.75rem', color: isEditing ? '#E2E8F0' : t.textSecondary, fontWeight: '700' }}>{isEditing ? 'Concluir modificações' : 'Criar, organizar e excluir'}</span>
                  </div>
                </button>
              </div>

              {/* CRONÔMETRO DE DESCANSO ENTRE SÉRIES */}
              {restTimer > 0 && !isEditing && (
                <div style={{ position: 'fixed', bottom: '95px', left: '50%', transform: 'translateX(-50%)', background: '#3B82F6', color: '#FFF', padding: '14px 28px', borderRadius: '24px', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)', zIndex: 1000, fontWeight: '900', fontSize: '0.9rem', border: '2px solid rgba(255,255,255,0.2)' }}>
                  ⏳ DESCANSO ENTRE SÉRIES: <span className="tabular-num">{formatTime(restTimer)}</span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {workouts.map((w) => {
                  const isOpen = activeWorkout === w.id || isEditing;
                  const isRunning = workoutSession?.workoutId === w.id;

                  return (
                    <div key={w.id} style={{ position: 'relative', background: t.cardBg, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: `1px solid ${t.cardBorder}`, color: t.textPrimary }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '10px', background: isRunning ? '#10B981' : w.color }} />
                      <div onClick={() => !isEditing && setActiveWorkout(isOpen ? null : w.id)} style={{ padding: '22px 20px 22px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 'bold' }}>{w.icon}</div>
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
                            <button onClick={() => isRunning ? handleFinishWorkout(w.id) : setWorkoutSession({ workoutId: w.id, seconds: 0 })} style={{ width: '100%', padding: '16px', borderRadius: '20px', background: isRunning ? '#10B981' : w.color, color: '#FFF', border: 'none', fontWeight: '900', cursor: 'pointer', marginBottom: '20px', fontSize: '0.9rem', boxShadow: '0 6px 16px rgba(0,0,0,0.15)' }}>
                              {isRunning ? `✓ FINALIZAR SESSÃO (${formatTime(workoutSession.seconds)})` : '▶ COMEÇAR SESSÃO DE TREINO'}
                            </button>
                          )}

                          {w.exercises.map((ex) => (
                            <div key={ex.id} style={{ background: t.inputBg, padding: '16px', borderRadius: '22px', marginBottom: '14px', border: `1px solid ${t.cardBorder}` }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                {isEditing ? (
                                  <input value={ex.name} onChange={(e) => updateExerciseField(w.id, ex.id, 'name', e.target.value)} style={{ background: 'transparent', border: `1px dashed ${t.textSecondary}`, fontWeight: '900', outline: 'none', color: t.textPrimary, width: '100%' }} />
                                ) : (
                                  <h4 style={{ margin: 0, color: t.textPrimary, fontSize: '1rem', fontWeight: '900' }}>{ex.name}</h4>
                                )}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {!isEditing && isRunning && (
                                    <button onClick={() => quickSwapExercise(w.id, ex.id)} style={{ background: 'transparent', color: '#3B82F6', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Trocar</button>
                                  )}
                                  {isEditing && <button onClick={() => deleteExercise(w.id, ex.id)} style={{ background: 'transparent', color: '#EF4444', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Excluir</button>}
                                </div>
                              </div>
                              <input type="text" value={ex.notes} onChange={(e) => updateExerciseField(w.id, ex.id, 'notes', e.target.value)} placeholder="Observações..." readOnly={!isEditing} style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '0.8rem', color: t.textSecondary, marginBottom: '12px', outline: 'none', fontWeight: '600' }} />
                              
                              <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 38px', gap: '6px', fontSize: '0.7rem', color: t.textSecondary, fontWeight: '800', textAlign: 'center', marginBottom: '8px' }}>
                                <span>SET</span><span>ANT.</span><span>KG</span><span>REPS</span><span>✓</span>
                              </div>
                              
                              {ex.sets.map((set, idx) => (
                                <div key={set.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr 38px', gap: '6px', alignItems: 'center', marginBottom: '8px', textAlign: 'center' }}>
                                  <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#10B981' }}>{idx + 1}</span>
                                  <span style={{ fontSize: '0.75rem', color: t.textSecondary, fontWeight: '600' }}>{set.prev || '-'}</span>
                                  <input type="number" value={set.weight} onChange={(e) => updateSetData(w.id, ex.id, idx, 'weight', e.target.value)} style={{ width: '100%', textAlign: 'center', padding: '10px 2px', borderRadius: '12px', background: t.cardBg, border: `1px solid ${t.cardBorder}`, fontWeight: '800', fontSize: '0.9rem', color: t.textPrimary, outline: 'none' }} className="tabular-num" />
                                  <input type="number" value={set.reps} onChange={(e) => updateSetData(w.id, ex.id, idx, 'reps', e.target.value)} style={{ width: '100%', textAlign: 'center', padding: '10px 2px', borderRadius: '12px', background: t.cardBg, border: `1px solid ${t.cardBorder}`, fontWeight: '800', fontSize: '0.9rem', color: t.textPrimary, outline: 'none' }} className="tabular-num" />
                                  
                                  <div onClick={() => toggleSetComplete(w.id, ex.id, idx, ex.restType)} style={{
                                    width: '38px', height: '38px', borderRadius: '12px', margin: '0 auto',
                                    background: set.completed ? '#10B981' : t.cardBg,
                                    border: `2px solid ${set.completed ? '#10B981' : t.textSecondary}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#FFF', fontWeight: 'bold', fontSize: '0.9rem',
                                    boxShadow: set.completed ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none',
                                    transition: 'all 0.2s ease'
                                  }}>
                                    {set.completed && '✓'}
                                  </div>
                                </div>
                              ))}
                              <button onClick={() => addSet(w.id, ex.id)} style={{ width: '100%', marginTop: '10px', padding: '10px', background: 'transparent', border: `1px dashed ${t.textSecondary}`, color: t.textSecondary, borderRadius: '12px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '800' }}>+ Adicionar Série</button>
                            </div>
                          ))}
                          {isEditing && <button onClick={() => addNewExercise(w.id)} style={{ width: '100%', padding: '14px', background: '#ECFDF5', color: '#059669', border: '1px dashed #059669', borderRadius: '16px', fontWeight: '900', fontSize: '0.85rem', cursor: 'pointer' }}>+ ADICIONAR EXERCÍCIO</button>}
                        </div>
                      )}
                    </div>
                  );
                })}
                {isEditing && <button onClick={addNewWorkout} style={{ width: '100%', padding: '18px', background: 'transparent', color: t.textPrimary, border: `2px dashed ${t.textSecondary}`, borderRadius: '26px', fontWeight: '900', cursor: 'pointer', fontSize: '0.95rem' }}>+ CRIAR TREINO</button>}
              </div>
            </>
          )}

          {/* 3. ABA DADOS */}
          {activeTab === 'estatisticas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: t.cardBg, padding: '16px', borderRadius: '20px', border: `1px solid ${t.cardBorder}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <span style={{ fontSize: '0.75rem', color: t.textSecondary, fontWeight: '800', display: 'block', marginBottom: '4px' }}>TEMPO ESTA SEMANA</span>
                  <span className="tabular-num" style={{ fontSize: '1.4rem', fontWeight: '900', color: '#3B82F6' }}>{formatDurationText(totalSecondsWeek)}</span>
                </div>
                <div style={{ background: t.cardBg, padding: '16px', borderRadius: '20px', border: `1px solid ${t.cardBorder}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <span style={{ fontSize: '0.75rem', color: t.textSecondary, fontWeight: '800', display: 'block', marginBottom: '4px' }}>MÉDIA DIÁRIA (MÊS)</span>
                  <span className="tabular-num" style={{ fontSize: '1.4rem', fontWeight: '900', color: '#10B981' }}>{formatDurationText(avgSecondsDaily)}</span>
                </div>
                <div style={{ gridColumn: 'span 2', background: t.cardBg, padding: '16px', borderRadius: '20px', border: `1px solid ${t.cardBorder}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                   <span style={{ fontSize: '0.75rem', color: t.textSecondary, fontWeight: '800', display: 'block', marginBottom: '4px' }}>TEMPO TOTAL TREINADO NO MÊS</span>
                   <span className="tabular-num" style={{ fontSize: '1.4rem', fontWeight: '900', color: t.textPrimary }}>{formatDurationText(totalSecondsMonth)}</span>
                </div>
              </div>

              {/* Calendário Dinâmico Exato */}
              <div style={{ background: t.cardBg, padding: '24px', borderRadius: '28px', color: t.textPrimary, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: `1px solid ${t.cardBorder}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '900' }}>Calendário de Sucesso 🏆</h3>
                  <span style={{ fontSize: '0.9rem', color: '#D946EF', fontWeight: '900' }}>{currentMonthName}</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '800', color: t.textSecondary, marginBottom: '14px' }}>
                  <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                  {/* Espaços vazios iniciais */}
                  {Array.from({ length: firstDayOfWeekInMonth }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ height: '42px' }} />
                  ))}

                  {/* Dias do Mês */}
                  {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((day) => {
                    const isDone = daysCompletedThisMonth.includes(day);
                    const isToday = day === today.getDate();

                    return (
                      <div key={day} style={{
                        height: '42px', borderRadius: '50%',
                        background: isDone 
                          ? 'linear-gradient(135deg, #10B981, #059669)' 
                          : (isToday ? '#E0F2FE' : 'rgba(241, 245, 249, 0.5)'),
                        color: isDone ? '#FFF' : (isToday ? '#0284C7' : t.textPrimary),
                        border: isToday && !isDone ? '2px solid #3B82F6' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '800', fontSize: '0.95rem',
                        boxShadow: isDone ? '0 6px 14px rgba(16, 185, 129, 0.4)' : 'none',
                        transition: 'all 0.2s ease'
                      }}>
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
                {[ { label: 'PESO (kg)', field: 'weight' }, { label: '% GORDURA', field: 'bf' }, { label: 'IMC', val: (userProfile.weight / (userProfile.height * userProfile.height)).toFixed(1), color: '#3B82F6' } ].map((item, i) => (
                  <div key={i} style={{ background: t.cardBg, padding: '16px', borderRadius: '20px', color: t.textPrimary, border: `1px solid ${t.cardBorder}`, textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: t.textSecondary, fontWeight: '800', display: 'block', marginBottom: '6px' }}>{item.label}</span>
                    {item.field ? (
                      <input type="number" value={userProfile[item.field]} onChange={(e) => setUserProfile({ ...userProfile, [item.field]: parseFloat(e.target.value) || 0 })} style={{ fontSize: '1.3rem', fontWeight: '900', border: 'none', background: 'transparent', width: '100%', color: t.textPrimary, outline: 'none', textAlign: 'center' }} className="tabular-num" />
                    ) : (
                      <div className="tabular-num" style={{ fontSize: '1.3rem', fontWeight: '900', color: item.color }}>{item.val}</div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ background: t.cardBg, padding: '24px', borderRadius: '24px', color: t.textPrimary, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: `1px solid ${t.cardBorder}` }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '16px' }}>Medidas Corporais (cm)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {[ { label: 'Braço', field: 'arm' }, { label: 'Peito', field: 'chest' }, { label: 'Ombros', field: 'shoulder' }, { label: 'Cintura', field: 'waist' }, { label: 'Quadril', field: 'hip' }, { label: 'Coxa', field: 'thigh' }, { label: 'Panturrilha', field: 'calf' } ].map((m) => (
                    <div key={m.field} style={{ background: t.inputBg, padding: '14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '800', color: t.textSecondary }}>{m.label}</span>
                      <input type="number" value={userProfile[m.field]} onChange={(e) => setUserProfile({ ...userProfile, [m.field]: parseFloat(e.target.value) || 0 })} style={{ width: '50px', textAlign: 'right', background: 'transparent', border: 'none', fontWeight: '900', fontSize: '1rem', color: t.textPrimary, outline: 'none' }} className="tabular-num" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. ABA AJUSTES */}
          {activeTab === 'configuracoes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: t.cardBg, padding: '24px', borderRadius: '24px', color: t.textPrimary, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: `1px solid ${t.cardBorder}` }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '16px' }}>Aparência</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: t.inputBg, padding: '16px', borderRadius: '16px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: t.textPrimary }}>Tema do App</span>
                  <button onClick={toggleTheme} style={{ padding: '10px 20px', borderRadius: '12px', background: userProfile.theme === 'light' ? '#2E1065' : '#8B5CF6', color: '#FFF', fontWeight: '900', border: 'none', cursor: 'pointer' }}>
                    {userProfile.theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
                  </button>
                </div>
              </div>

              <div style={{ background: t.cardBg, padding: '24px', borderRadius: '24px', color: t.textPrimary, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: `1px solid ${t.cardBorder}` }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '16px' }}>Preferências</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: t.inputBg, padding: '16px', borderRadius: '16px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: t.textSecondary }}>Meta de Água (ml)</span>
                  <input type="number" value={userProfile.waterGoal} onChange={(e) => setUserProfile({ ...userProfile, waterGoal: parseInt(e.target.value) || 0 })} style={{ width: '70px', textAlign: 'right', background: 'transparent', border: 'none', fontWeight: '900', fontSize: '1.1rem', color: '#3B82F6', outline: 'none' }} className="tabular-num" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: t.inputBg, padding: '16px', borderRadius: '16px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color t.textSecondary }}>Descanso Normal (s)</span>
                  <input type="number" value={userProfile.restNormal} onChange={(e) => setUserProfile({ ...userProfile, restNormal: parseInt(e.target.value) || 0 })} style={{ width: '70px', textAlign: 'right', background: 'transparent', border: 'none', fontWeight: '900', fontSize: '1.1rem', color: t.textPrimary, outline: 'none' }} className="tabular-num" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: t.inputBg, padding: '16px', borderRadius: '16px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: t.textSecondary }}>Descanso Compostos (s)</span>
                  <input type="number" value={userProfile.restCompound} onChange={(e) => setUserProfile({ ...userProfile, restCompound: parseInt(e.target.value) || 0 })} style={{ width: '70px', textAlign: 'right', background: 'transparent', border: 'none', fontWeight: '900', fontSize: '1.1rem', color: t.textPrimary, outline: 'none' }} className="tabular-num" />
                </div>
              </div>
            </div>
          )}

        </main>

        {/* NAVEGAÇÃO */}
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
                  width: '58px', height: '58px', borderRadius: '18px',
                  border: isActive ? 'none' : 'transparent',
                  background: isActive ? item.gradient : 'transparent',
                  color: isActive ? t.navActiveText : t.navText,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  cursor: 'pointer', boxShadow: isActive ? '0 8px 20px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.6rem', fontWeight: '900' }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </>
  );
}
