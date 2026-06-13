import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Solution from './components/Solution'
import Predictor from './components/Predictor'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Solution />
        <Predictor />
      </main>

      <footer className="py-8 text-center text-sm text-[var(--muted)] border-t border-[var(--border)] mt-12 glass">
        <p>© 2026 Garments IQ • Predictive Productivity Analytics</p>
      </footer>
    </>
  )
}

export default App
