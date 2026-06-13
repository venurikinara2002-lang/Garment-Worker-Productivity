import React from 'react'
import { motion } from 'framer-motion'

export default function Hero() {
    return (
        <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C87A3F] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E09860] rounded-full mix-blend-screen filter blur-[128px] opacity-10"></div>

            <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-start"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.03)] mb-6">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-light)] animate-pulse"></span>
                        <span className="text-xs font-medium tracking-wide text-[var(--muted)]">Garments IQ v1.0</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-[1.15]">
                        <span className="text-[var(--text)] block">
                            Transforming Production
                        </span>
                        <span
                            className="text-2xl md:text-4xl font-medium block mt-2"
                            style={{
                                background: 'linear-gradient(135deg, #E09860 0%, #C87A3F 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            with Machine Intelligence.
                        </span>
                    </h1>

                    <p className="text-lg text-[var(--muted)] mb-10 max-w-xl leading-relaxed">
                        Harness the power of tailored machine learning models to analyze, predict,
                        and optimize garment worker productivity across Sewing and Finishing departments.
                    </p>

                    <div className="flex gap-4">
                        <a href="#predictor" className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2">
                            Start Prediction
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </a>
                        <a href="#solution" className="px-8 py-4 rounded-xl font-medium text-[var(--text)] bg-[rgba(255,255,255,0.05)] border border-[var(--border)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                            Learn More
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="relative hidden lg:block"
                >
                    {/* Decorative Image Container */}
                    <div className="relative w-full aspect-square max-w-lg mx-auto rounded-3xl glass p-2 overflow-hidden border border-[var(--border)] shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1118] via-transparent to-[rgba(200,122,63,0.2)] z-10 pointer-events-none rounded-3xl"></div>
                        <img
                            src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
                            alt="Garment sewing machine"
                            className="w-full h-full object-cover rounded-[1.25rem] opacity-80"
                        />

                        {/* Floating Glass Badges */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute top-10 -left-6 glass px-4 py-3 rounded-2xl flex items-center gap-3 z-20 shadow-xl"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#A65F2B] flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F0F4F8" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                            </div>
                            <div>
                                <div className="text-xs text-[var(--muted)]">Sewing Accuracy</div>
                                <div className="font-bold text-lg text-[var(--text)]">94.2%</div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-12 -right-6 glass px-4 py-3 rounded-2xl flex items-center gap-3 z-20 shadow-xl"
                        >
                            <div className="w-10 h-10 rounded-full bg-[rgba(229,180,84,0.15)] flex items-center justify-center border border-[rgba(229,180,84,0.3)]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <div>
                                <div className="text-xs text-[var(--muted)]">Live monitoring</div>
                                <div className="font-bold text-lg text-white">Active</div>
                            </div>
                        </motion.div>

                    </div>
                </motion.div>

            </div>
        </section>
    )
}
