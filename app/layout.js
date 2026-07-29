export const metadata = {
  title: 'App Treino',
  description: 'Aplicação Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
