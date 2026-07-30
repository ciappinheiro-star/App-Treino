'use client';
import { useState, useEffect } from 'react';

const THEME = {
  bgGradient: 'linear-gradient(180deg, #2E1065 0%, #1E1B4B 100%)',
  cardBg: 'rgba(255, 255, 255, 0.95)',
  cardBorder: 'rgba(255, 255, 255, 0.2)',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  inputBg: '#F1F5F9'
};

const INITIAL_WORKOUTS = [
  {
    id: 'TREINO_A', title: 'Treino A', category: 'Inferiores & Core', color: '#00D2FF', icon: '⚡',
    exercises: [
      { id: 'ex_1', name: 'Elevação Pélvica', notes: 'Pausa de 2s no topo', restTime: 60, sets: [
        { id: 1, prev: '-', weight: 20, reps: 12, completed: false },
        { id: 2, prev: '-', weight: 20, reps: 12, completed: false }
      ]}
    ]
  },
  {
    id: 'TREINO_B', title: 'Treino B', category: 'Superiores Completo', color: '#A855F7', icon: '🎯',
    exercises: [
      { id: 'ex_2', name: 'Desenvolvimento c/ Halteres', notes: 'Cotovelos fechados', restTime: 60, sets: [
        { id: 1, prev: '-', weight: 6, reps: 12, completed: false }
      ]}
    ]
  },
  {
    id: 'TREINO_C', title: 'Treino C', category: 'Cardio & Abdômen', color: '#10B981', icon: '🏃',
    exercises: [
      { id: 'ex_3', name: 'Prancha Frontal', notes: '3 séries de 45s', restTime: 45, sets: [
        { id: 1, prev: '-', weight: 0, reps: 45, completed: false }
      ]}
    ]
  },
  {
    id: 'TREINO_D', title: 'Treino D', category: 'Core & Mobilidade', color: '#F59E0B', icon: '🤸',
    exercises: [
      { id: 'ex_4', name: 'Mobilidade Quadril', notes: 'Execução lenta', restTime: 30, sets: [
        { id: 1, prev: '-', weight: 0, reps: 12, completed: false }
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

  // Estados com localStorage
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [selectedExerciseFilter, setSelectedExerciseFilter] = useState('ex_1');
  const [userProfile, setUserProfile] = useState({
    weight: 70.0, height: 1.75, bf: 18, arm: 30, waist: 75, hip: 95, thigh: 55
  });
  const [workouts, setWorkouts] = useState(INITIAL_WORKOUTS);
  const [completedDaysInMonth, setCompletedDaysInMonth] = useState([]);

  // Carregar dados salvos no celular ao iniciar
  useEffect(() => {
    try {
      const savedWorkouts = localStorage.getItem('pro_workouts');
      const savedTotal = localStorage.getItem('pro_total');
      const savedWater = localStorage.getItem('pro_water');
      const savedProfile = localStorage.getItem('pro_profile');
      const savedDays = localStorage.getItem('pro_days');

      if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
      if (savedTotal) setTotalCompleted(JSON.parse(savedTotal));
      if (savedWater) setWaterIntake(JSON.parse(savedWater));
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));
      if (savedDays) setCompletedDaysInMonth(JSON.parse(savedDays));
    } catch (e) {
      console.error("Erro ao carregar dados", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Salvar automaticamente no localStorage quando houver mudanças
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('pro_workouts', JSON.stringify(workouts));
    localStorage.setItem('pro_total', JSON.stringify(totalCompleted));
    localStorage.setItem('pro_water', JSON.stringify(waterIntake));
    localStorage.setItem('pro_profile', JSON.stringify(userProfile));
    localStorage.setItem('pro_days', JSON.stringify(completedDaysInMonth));
  }, [workouts, totalCompleted, waterIntake, userProfile, completedDaysInMonth, isLoaded]);

  const waterGoal = 3000;

  const navItems = [
    { id: 'inicio', label: 'Início', icon: '🏠', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
    { id: 'meus-treinos', label: 'Treinos', icon: '📋', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' },
    { id: 'estatisticas', label: 'Dados', icon: '📈', gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' },
    { id: 'perfil', label: 'Perfil', icon: '👤', gradient: 'linear-gradient(135deg, #F97316, #EA580C)' },
    { id: 'configuracoes', label: 'Ajustes', icon: '⚙️', gradient: 'linear-gradient(135deg, #EC4899, #BE185D)' }
  ];

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

  // Funções do Treino
  const handleFinishWorkout = () => {
    setWorkoutSession(null);
    setTotalCompleted(prev => prev + 1);
    const today = new Date().getDate();
    if (!completedDaysInMonth.includes(today)) {
      setCompletedDaysInMonth([...completedDaysInMonth, today]);
    }
  };

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
        return { ...ex, sets: [...ex.sets, { id: ex.sets.length + 1, prev: `${lastSet.weight}kg`, weight: lastSet.weight, reps: lastSet.reps, completed: false }] };
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

  // Funções de Backup
  const exportBackup = () => {
    const data = { workouts, totalCompleted, waterIntake, userProfile, completedDaysInMonth };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  const importBackup = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.workouts) setWorkouts(data.workouts);
        if (data.totalCompleted) setTotalCompleted(data.totalCompleted);
        if (data.waterIntake) setWaterIntake(data.waterIntake);
        if (data.userProfile) setUserProfile(data.userProfile);
        if (data.completedDaysInMonth) setCompletedDaysInMonth(data.completedDaysInMonth);
        alert('Backup restaurado com sucesso!');
      } catch (err) {
        alert('Erro ao importar arquivo de backup.');
      }
    };
  };

  const bmi = userProfile.height > 0 ? (userProfile.weight / (userProfile.height * userProfile.height)).toFixed(1) : '0';

  if (!isLoaded) return null;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: ${THEME.bgGradient}; min-height: 100vh; color: #FFF; }
        .app-container { display: flex; flex-direction: column; min-height: 100vh; }
        .bottom-nav {
          position: fixed; bottom: 0; left: 0; right: 0;
          background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(16px);
          padding: 12px 16px 20px 16px; display: flex; justify-content: space-between; align-items: center; gap: 8px; z-index: 100;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .square-nav-btn {
          width: 58px; height: 58px; border-radius: 18px; border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.06); color: #A1A1AA; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 2px; cursor: pointer; transition: all 0.25s ease;
        }
        .square-nav-btn.active { color: #FFFFFF; border: none; box-shadow: 0 8px 20px rgba(0,0,0,0.3); transform: translateY(-2px); }
        .main-content { flex: 1; padding: 24px 16px 110px 16px; max-width: 480px; margin: 0 auto; width: 100%; }
      `}</style>

      <div className="app-container">
        <main className="main-content">
          
          {/* HEADER */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#A855F7', fontWeight: '800', letterSpacing: '1.5px' }}>PRO TRACKER</span>
              <h1 style={{ fontSize: '1.7rem', color: '#FFF', fontWeight: '800', margin: '2px 0 0 0' }}>
                {activeTab === 'inicio' && 'Visão Geral'}
                {activeTab === 'meus-treinos' && 'Fichas de Treino'}
                {activeTab === 'estatisticas' && 'Desempenho'}
                {activeTab === 'perfil' && 'Perfil Físico'}
                {activeTab === 'configuracoes' && 'Ajustes'}
              </h1>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(12px)', padding: '8px 14px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>⚡</div>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', display: 'block', lineHeight: '1', color: '#FFF' }}>{totalCompleted}</span>
                <span style={{ fontSize: '0.6rem', color: '#A7F3D0', fontWeight: '700' }}>SESSÕES</span>
              </div>
            </div>
          </header>

          {/* 1. ABA INÍCIO */}
          {activeTab === 'inicio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', padding: '22px', borderRadius: '26px', boxShadow: '0 12px 30px rgba(109, 40, 217, 0.35)' }}>
                <span style={{ fontSize: '0.75rem', color: '#DDD6FE', fontWeight: '800', letterSpacing: '1px' }}>PRÓXIMO TREINO</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0 2px 0', color: '#FFF' }}>{workouts[0]?.title || 'Seu Treino'}</h2>
                <p style={{ fontSize: '0.85rem', color: '#EDE9FE', marginBottom: '18px' }}>{workouts[0]?.category || 'Foco do dia'}</p>
                <button onClick={() => { setActiveTab('meus-treinos'); setActiveWorkout(workouts[0]?.id); }} style={{ width: '100%', padding: '14px', background: '#FFFFFF', color: '#6D28D9', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer' }}>
                  ▶ INICIAR SESSÃO AGORA
                </button>
              </div>

              <div style={{ background: THEME.cardBg, padding: '20px', borderRadius: '24px', color: THEME.textPrimary, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.4rem' }}>💧</span>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: '800' }}>Hidratação do Dia</h3>
                      <span style={{ fontSize: '0.75rem', color: THEME.textSecondary, fontWeight: '600' }}>Meta: {(waterGoal / 1000).toFixed(1)}L</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: '#3B82F6' }}>{(waterIntake / 1000).toFixed(2)}L</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: THEME.inputBg, borderRadius: '6px', overflow: 'hidden', marginBottom: '14px' }}>
                  <div style={{ width: `${Math.min((waterIntake / waterGoal) * 100, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #3B82F6, #60A5FA)', borderRadius: '6px', transition: 'width 0.3s ease' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setWaterIntake(p => p + 250)} style={{ flex: 1, padding: '10px', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: '12px', fontWeight: '800', fontSize: '0.75rem', cursor: 'pointer' }}>+ 250 ml</button>
                  <button onClick={() => setWaterIntake(p => p + 500)} style={{ flex: 1, padding: '10px', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: '12px', fontWeight: '800', fontSize: '0.75rem', cursor: 'pointer' }}>+ 500 ml</button>
                </div>
              </div>
            </div>
          )}

          {/* 2. ABA TREINOS */}
          {activeTab === 'meus-treinos' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <button onClick={() => { setIsEditing(!isEditing); setWorkoutSession(null); }} style={{ width: '100%', background: isEditing ? 'linear-gradient(135deg, #10B981, #059669)' : THEME.cardBg, color: isEditing ? '#FFF' : THEME.textPrimary, border: 'none', padding: '16px', borderRadius: '22px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: isEditing ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #8B5CF6, #EC4899)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>⚙️</div>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: '800' }}>{isEditing ? 'SALVAR ALTERAÇÕES' : 'PERSONALIZAR FICHAS'}</span>
                    <span style={{ fontSize: '0.7rem', color: isEditing ? '#E2E8F0' : THEME.textSecondary, fontWeight: '500' }}>{isEditing ? 'Concluir modificações' : 'Criar, editar e excluir treinos'}</span>
                  </div>
                </button>
              </div>

              {restTimer > 0 && !isEditing && (
                <div style={{ position: 'fixed', bottom: '95px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', color: '#FFF', padding: '12px 26px', borderRadius: '30px', boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)', zIndex: 1000, fontWeight: '800', fontSize: '0.85rem' }}>
                  ⏳ DESCANSO: {formatTime(restTimer)}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {workouts.map((w) => {
                  const isOpen = activeWorkout === w.id || isEditing;
                  const isRunning = workoutSession?.workoutId === w.id;

                  return (
                    <div key={w.id} style={{ position: 'relative', background: THEME.cardBg, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', color: THEME.textPrimary }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '8px', background: isRunning ? '#10B981' : w.color }} />
                      <div onClick={() => !isEditing && setActiveWorkout(isOpen ? null : w.id)} style={{ padding: '20px 20px 20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '16px', background: `${w.color}20`, color: w.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 'bold' }}>{w.icon}</div>
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
                        {isEditing && <button onClick={() => deleteWorkout(w.id)} style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', width: '34px', height: '34px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>}
                      </div>

                      {isOpen && (
                        <div style={{ padding: '0 20px 20px 24px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                          {!isEditing && (
                            <button onClick={() => isRunning ? handleFinishWorkout() : setWorkoutSession({ workoutId: w.id, seconds: 0 })} style={{ width: '100%', padding: '14px', borderRadius: '16px', background: isRunning ? '#10B981' : w.color, color: '#FFF', border: 'none', fontWeight: '800', cursor: 'pointer', marginBottom: '16px', fontSize: '0.85rem' }}>
                              {isRunning ? `✓ CONCLUIR SESSÃO (${formatTime(workoutSession.seconds)})` : '▶ INICIAR SESSÃO'}
                            </button>
                          )}

                          {w.exercises.map((ex) => (
                            <div key={ex.id} style={{ background: THEME.inputBg, padding: '14px', borderRadius: '18px', marginBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                {isEditing ? <input value={ex.name} onChange={(e) => updateExerciseField(w.id, ex.id, 'name', e.target.value)} style={{ background: 'transparent', border: '1px dashed #CBD5E1', fontWeight: 'bold', outline: 'none', color: THEME.textPrimary }} /> : <h4 style={{ margin: 0, color: w.color, fontSize: '0.95rem', fontWeight: '800' }}>{ex.name}</h4>}
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
                                  <div onClick={() => toggleSetComplete(w.id, ex.id, idx, ex.restTime)} style={{ width: '28px', height: '28px', borderRadius: '8px', margin: '0 auto', background: set.completed ? '#10B981' : '#FFFFFF', border: `1px solid ${set.completed ? '#10B981' : '#CBD5E1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    {set.completed && <span style={{ color: '#FFF', fontWeight: 'bold', fontSize: '0.75rem' }}>✓</span>}
                                  </div>
                                </div>
                              ))}
                              <button onClick={() => addSet(w.id, ex.id)} style={{ width: '100%', marginTop: '6px', padding: '6px', background: 'transparent', border: '1px dashed #CBD5E1', color: THEME.textSecondary, borderRadius: '8px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: '600' }}>+ Adicionar Série</button>
                            </div>
                          ))}
                          {isEditing && <button onClick={() => addNewExercise(w.id)} style={{ width: '100%', padding: '10px', background: '#ECFDF5', color: '#059669', border: '1px dashed #059669', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>+ ADICIONAR EXERCÍCIO</button>}
                        </div>
                      )}
                    </div>
                  );
                })}
                {isEditing && <button onClick={addNewWorkout} style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.1)', color: '#FFF', border: '2px dashed rgba(255,255,255,0.4)', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>+ CRIAR NOVO TREINO</button>}
              </div>
            </>
          )}

          {/* 3. ABA DADOS */}
          {activeTab === 'estatisticas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: THEME.cardBg, padding: '20px', borderRadius: '24px', color: THEME.textPrimary, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Histórico do Mês</h3>
                  <span style={{ fontSize: '0.75rem', color: '#3B82F6', fontWeight: '800' }}>Julho 2026</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontSize: '0.7rem', fontWeight: '700', color: THEME.textSecondary, marginBottom: '8px' }}>
                  <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isDone = completedDaysInMonth.includes(day);
                    return (
                      <div key={day} style={{ height: '36px', borderRadius: '10px', background: isDone ? 'linear-gradient(135deg, #10B981, #059669)' : THEME.inputBg, color: isDone ? '#FFF' : THEME.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: isDone ? '800' : '600', fontSize: '0.8rem' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div style={{ background: THEME.cardBg, padding: '14px', borderRadius: '20px', color: THEME.textPrimary }}>
                  <span style={{ fontSize: '0.65rem', color: THEME.textSecondary, fontWeight: '700' }}>PESO (kg)</span>
                  <input type="number" value={userProfile.weight} onChange={(e) => setUserProfile({ ...userProfile, weight: parseFloat(e.target.value) || 0 })} style={{ fontSize: '1.2rem', fontWeight: '800', border: 'none', background: 'transparent', width: '100%', color: THEME.textPrimary, outline: 'none', marginTop: '4px' }} />
                </div>
                <div style={{ background: THEME.cardBg, padding: '14px', borderRadius: '20px', color: THEME.textPrimary }}>
                  <span style={{ fontSize: '0.65rem', color: THEME.textSecondary, fontWeight: '700' }}>% GORDURA</span>
                  <input type="number" value={userProfile.bf} onChange={(e) => setUserProfile({ ...userProfile, bf: parseFloat(e.target.value) || 0 })} style={{ fontSize: '1.2rem', fontWeight: '800', border: 'none', background: 'transparent', width: '100%', color: THEME.textPrimary, outline: 'none', marginTop: '4px' }} />
                </div>
                <div style={{ background: THEME.cardBg, padding: '14px', borderRadius: '20px', color: THEME.textPrimary }}>
                  <span style={{ fontSize: '0.65rem', color: THEME.textSecondary, fontWeight: '700' }}>IMC</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#F97316', marginTop: '4px' }}>{bmi}</div>
                </div>
              </div>

              <div style={{ background: THEME.cardBg, padding: '20px', borderRadius: '24px', color: THEME.textPrimary, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '14px' }}>Medidas Corporais (cm)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[ { label: 'Braço', field: 'arm' }, { label: 'Cintura', field: 'waist' }, { label: 'Quadril', field: 'hip' }, { label: 'Coxa', field: 'thigh' } ].map((m) => (
                    <div key={m.field} style={{ background: THEME.inputBg, padding: '12px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: THEME.textSecondary }}>{m.label}</span>
                      <input type="number" value={userProfile[m.field]} onChange={(e) => setUserProfile({ ...userProfile, [m.field]: parseFloat(e.target.value) || 0 })} style={{ width: '45px', textAlign: 'right', background: 'transparent', border: 'none', fontWeight: '800', fontSize: '0.9rem', color: THEME.textPrimary, outline: 'none' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. ABA AJUSTES (COM BACKUP) */}
          {activeTab === 'configuracoes' && (
            <div style={{ background: THEME.cardBg, padding: '24px', borderRadius: '24px', color: THEME.textPrimary, boxShadow: '0 10px 30px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Gerenciamento de Dados</h3>
              <p style={{ fontSize: '0.8rem', color: THEME.textSecondary }}>Seus dados ficam salvos localmente no seu celular. Use as opções abaixo para fazer backup de segurança.</p>
              
              <button onClick={exportBackup} style={{ width: '100%', padding: '14px', background: '#3B82F6', color: '#FFF', border: 'none', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}>
                📥 BAIXAR BACKUP DOS DADOS
              </button>

              <label style={{ width: '100%', padding: '14px', background: THEME.inputBg, color: THEME.textPrimary, border: '1px dashed #CBD5E1', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'center', display: 'block' }}>
                📤 RESTAURAR BACKUP (ARQUIVO .JSON)
                <input type="file" accept=".json" onChange={importBackup} style={{ display: 'none' }} />
              </label>
            </div>
          )}

        </main>

        {/* NAVEGAÇÃO FIXA */}
        <nav className="bottom-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`square-nav-btn ${isActive ? 'active' : ''}`} style={{ background: isActive ? item.gradient : 'rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: isActive ? '800' : '600', color: isActive ? '#FFF' : '#A1A1AA' }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </>
  );
}
