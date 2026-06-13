import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const NAV_LINKS = [
    { label: 'Home', href: '#home' },
    { label: 'Our Solution', href: '#solution' },
    { label: 'Productivity Predictor', href: '#predictor' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [active, setActive] = useState('#home')

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 30)
            const sections = ['home', 'solution', 'predictor']
            for (const s of sections) {
                const el = document.getElementById(s)
                if (el) {
                    const rect = el.getBoundingClientRect()
                    if (rect.top <= 80 && rect.bottom > 80) {
                        setActive(`#${s}`)
                    }
                }
            }
        }
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'glass border-b'
                : 'bg-transparent border-b border-transparent'
                }`}
            style={{ borderColor: scrolled ? 'var(--border)' : 'transparent' }}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <a href="#home" className="flex items-center gap-2 group">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #C87A3F, #A65F2B)' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
                        Garments<span style={{ color: 'var(--accent-light)' }}>IQ</span>
                    </span>
                </a>

                {/* Links */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setActive(link.href)}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative"
                            style={{
                                color: active === link.href ? 'var(--accent-light)' : 'var(--muted)',
                            }}
                        >
                            {active === link.href && (
                                <motion.span
                                    layoutId="nav-pill"
                                    className="absolute inset-0 rounded-lg"
                                    style={{ background: 'rgba(200,122,63,0.12)', border: '1px solid rgba(200,122,63,0.2)' }}
                                    transition={{ type: 'spring', duration: 0.4 }}
                                />
                            )}
                            <span className="relative z-10">{link.label}</span>
                        </a>
                    ))}
                </div>

                {/* CTA */}
                <a
                    href="#predictor"
                    className="btn-primary px-5 py-2 rounded-lg text-sm font-semibold"
                >
                    Try Predictor →
                </a>
            </div>
        </motion.nav>
    )
}
