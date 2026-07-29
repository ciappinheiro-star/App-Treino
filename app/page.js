'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>🏋️‍♂️ App Treino</h1>
      <p>Seu aplicativo de controle de treino está online!</p>
      <p style={{ color: '#10b981', fontWeight: 'bold' }}>Conexão com Vercel + Supabase ativa.</p>
    </main>
  )
}
