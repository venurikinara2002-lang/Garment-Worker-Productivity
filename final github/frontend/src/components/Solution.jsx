import React from 'react'
import { motion } from 'framer-motion'

const CARDS = [
    {
        title: 'Department Models',
        desc: 'Dual ML models specifically trained for Sewing and Finishing operations to account for unique operational differences and baseline targets.',
        icon: (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
        ),
        color: '#E09860'
    },
    {
        title: 'Quality Constraints',
        desc: 'Robust data validation to prevent anomalous predictions. Live UI feedback with color-coded warnings for values out of expected ranges.',
        icon: (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
        ),
        color: '#D4A373'
    },
    {
        title: 'Visual Insights',
        desc: 'Compare projected outcomes between departments under identical conditions and dynamically analyze which features impact the result most.',
        icon: (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
        ),
        color: '#48A9A6'
    }
]

export default function Solution() {
    return (
        <section id="solution" className="py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="section-title mb-4">Our Solution</h2>
                    <p className="text-[var(--muted)] text-lg">
                        A comprehensive approach to estimating production throughput using regression algorithms tailored for the garments industry.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {CARDS.map((card, idx) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.15 }}
                            className="glass p-8 rounded-2xl flex flex-col hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group"
                        >
                            <div
                                className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150"
                                style={{ backgroundColor: card.color }}
                            />

                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 relative z-10 shadow-lg"
                                style={{ background: `linear-gradient(135deg, ${card.color}40, transparent)`, border: `1px solid ${card.color}50`, color: card.color }}
                            >
                                {card.icon}
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-white relative z-10">{card.title}</h3>
                            <p className="text-[var(--muted)] leading-relaxed text-sm relative z-10">
                                {card.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
