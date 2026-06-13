import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const INITIAL_FORM = {
    quarter: 'Quarter1',
    department: 'Sewing',
    day: 'Monday',
    targeted_productivity: 0.8,
    smv: 11.2,
    over_time: 0,
    incentive: 0,
    idle_time: 0,
    wip: 1000,
    idle_men: 0,
    no_of_style_change: 0,
    no_of_workers: 50,
}

const DEPARTMENTS = ['Sewing', 'Finishing']
const QUARTERS = ['Quarter1', 'Quarter2', 'Quarter3', 'Quarter4']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday (Holiday)', 'Saturday', 'Sunday']

export default function Predictor() {
    const [form, setForm] = useState(INITIAL_FORM)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')

    const getValidation = (key, value) => {
        const dept = form.department.toLowerCase()
        switch (key) {
            case 'targeted_productivity':
                if (value < 0) return { state: 'err', msg: 'Must be positive' }
                if (value > 1) return { state: 'err', msg: 'Max: 1' }
                return { state: 'ok' }
            case 'over_time':
                if (value < 0) return { state: 'err', msg: 'Must be positive' }
                const maxOT = dept === 'sewing' ? 25920 : 15000
                if (value > maxOT) return { state: 'err', msg: `Max: ${maxOT.toLocaleString()}` }
                return { state: 'ok' }
            case 'smv':
                if (value < 0) return { state: 'err', msg: 'Must be positive' }
                const maxSMV = dept === 'sewing' ? 51 : 5
                if (value > maxSMV) return { state: 'err', msg: `Max: ${maxSMV}` }
                return { state: 'ok' }
            case 'wip':
                if (value < 0) return { state: 'err', msg: 'Must be positive' }
                const maxWIP = dept === 'sewing' ? 23122 : 1194
                if (value > maxWIP) return { state: 'err', msg: `Max: ${maxWIP.toLocaleString()}` }
                return { state: 'ok' }
            case 'idle_time':
                if (value < 0) return { state: 'err', msg: 'Must be positive' }
                if (dept === 'finishing' && value !== 0) return { state: 'err', msg: 'Must be 0' }
                if (dept === 'sewing' && value > 150) return { state: 'err', msg: 'Max: 150' }
                return { state: 'ok' }
            case 'no_of_workers':
                if (value < 0) return { state: 'err', msg: 'Must be positive' }
                const maxWorkers = dept === 'sewing' ? 60 : 28
                if (value < 1 || value > maxWorkers) return { state: 'err', msg: `Range: 1-${maxWorkers}` }
                return { state: 'ok' }
            case 'idle_men':
                if (value < 0) return { state: 'err', msg: 'Must be positive' }
                if (dept === 'finishing' && value !== 0) return { state: 'err', msg: 'Must be 0' }
                if (dept === 'sewing' && value > 40) return { state: 'err', msg: 'Max: 40' }
                return { state: 'ok' }
            case 'no_of_style_change':
                if (value < 0) return { state: 'err', msg: 'Must be positive' }
                if (dept === 'finishing' && value !== 0) return { state: 'err', msg: 'Must be 0' }
                if (dept === 'sewing' && value > 2) return { state: 'err', msg: 'Max: 2' }
                return { state: 'ok' }
            case 'incentive':
                if (value < 0) return { state: 'err', msg: 'Must be positive' }
                const maxInc = dept === 'sewing' ? 138 : 3600
                if (value > maxInc) return { state: 'err', msg: `Max: ${maxInc}` }
                return { state: 'ok' }
            default:
                return { state: 'ok' }
        }
    }

    const validations = Object.keys(form).reduce((acc, k) => {
        acc[k] = getValidation(k, form[k])
        return acc
    }, {})

    const hasErrors = Object.values(validations).some(v => v.state === 'err')

    const handleChange = (e) => {
        const { name, value, type } = e.target
        let val = value
        if (type === 'number') {
            val = val === '' ? '' : Number(val)
        }

        setForm(prev => {
            const next = { ...prev, [name]: val }

            // If department changes to Finishing, reset specific fields
            if (name === 'department' && val === 'Finishing') {
                next.idle_time = 0
                next.idle_men = 0
                next.no_of_style_change = 0
            }
            // If any of these fields are changed while in Finishing, force them back to 0
            if (next.department === 'Finishing') {
                if (name === 'idle_time' || name === 'idle_men' || name === 'no_of_style_change') {
                    next[name] = 0
                }
            }

            return next
        })
        setErrorMsg('')
    }

    const handlePredict = async (e) => {
        e.preventDefault()
        if (hasErrors) return

        setLoading(true)
        setErrorMsg('')
        try {
            const res = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            if (!res.ok) throw new Error('Failed to fetch prediction')
            const data = await res.json()
            setResult(data)
        } catch (err) {
            setErrorMsg(err.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    // Derived charts data
    const deptData = result ? [
        { name: 'Sewing', value: result.extras.dept_comparison['Sewing'] },
        { name: 'Finishing', value: result.extras.dept_comparison['Finishing'] }
    ] : []

    const featData = result?.extras.feature_importances || []

    const renderInput = (name, label, type = "number", step = "any") => {
        const v = validations[name]
        const stateClass = v.state === 'err' ? 'input-err' : v.state === 'warn' ? 'input-warn' : 'input-ok'
        const isFinishing = form.department === 'Finishing'
        const isFixed = isFinishing && (name === 'idle_men' || name === 'idle_time' || name === 'no_of_style_change')

        return (
            <div className={`flex flex-col gap-1 w-full relative ${isFixed ? 'opacity-60' : ''}`}>
                <label className="label flex justify-between items-center">
                    {label}
                    {isFixed && <span className="text-[8px] text-[var(--accent-light)] font-bold uppercase tracking-tighter">Fixed for Finishing</span>}
                </label>
                <input
                    name={name}
                    type={type}
                    step={step}
                    value={form[name]}
                    onChange={handleChange}
                    disabled={isFixed}
                    className={`input-base ${stateClass} ${isFixed ? 'cursor-not-allowed bg-[rgba(255,255,255,0.03)]' : ''}`}
                />
                {v.msg && (
                    <span className={`text-[10px] mt-1 font-medium px-1 rounded absolute -bottom-4 right-0 ${v.state === 'err' ? 'text-[var(--err)]' : 'text-[var(--warn)]'}`}>
                        {v.msg}
                    </span>
                )}
            </div>
        )
    }

    return (
        <section id="predictor" className="py-24 relative z-10 min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="section-title mb-4">Productivity Predictor</h2>
                    <p className="text-[var(--muted)]">Input operational parameters to estimate actual productivity instantly.</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">

                    {/* Left Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-7 glass border border-[var(--border)] rounded-[2rem] p-8 shadow-2xl"
                    >
                        <form onSubmit={handlePredict} className="flex flex-col gap-8">

                            {/* Category: Global */}
                            <div>
                                <h4 className="text-[var(--accent-light)] font-semibold mb-4 text-sm tracking-widest uppercase flex items-center gap-2">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
                                    General
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-6 border-b border-[var(--border)]">
                                    <div className="flex flex-col gap-1 w-full">
                                        <label className="label">Quarter</label>
                                        <select name="quarter" value={form.quarter} onChange={handleChange} className="input-base">
                                            {QUARTERS.map(q => <option key={q} value={q} className="bg-[#1A2228]">{q}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1 w-full">
                                        <label className="label">Department</label>
                                        <select name="department" value={form.department} onChange={handleChange} className="input-base">
                                            {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#1A2228]">{d}</option>)}
                                        </select>
                                    </div>
                                    {renderInput('targeted_productivity', 'Target (0-1)')}
                                </div>
                            </div>

                            {/* Category: Production */}
                            <div>
                                <h4 className="text-[var(--accent-light)] font-semibold mb-4 text-sm tracking-widest uppercase flex items-center gap-2">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                                    Production details
                                </h4>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-6 border-b border-[var(--border)]">
                                    {renderInput('smv', 'SMV')}
                                    {renderInput('wip', 'WIP')}
                                    {renderInput('no_of_style_change', 'Style Changes', 'number')}
                                    {renderInput('over_time', 'Overtime')}
                                </div>
                            </div>

                            {/* Category: Workforce & Time */}
                            <div>
                                <h4 className="text-[var(--accent-light)] font-semibold mb-4 text-sm tracking-widest uppercase flex items-center gap-2">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                    Workforce & Date
                                </h4>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                    {renderInput('no_of_workers', 'Workers', 'number', '1')}
                                    {renderInput('idle_men', 'Idle Men', 'number', '1')}
                                    {renderInput('idle_time', 'Idle Time')}
                                    {renderInput('incentive', 'Incentive', 'number', '1')}
                                </div>
                                <div className="grid grid-cols-1 gap-4 mt-6">
                                    <div className="flex flex-col gap-1 w-full">
                                        <label className="label">Day</label>
                                        <select name="day" value={form.day} onChange={handleChange} className="input-base">
                                            {DAYS.map(d => <option key={d} value={d} className="bg-[#1A2228]">{d}</option>)}
                                        </select>
                                    </div>
                                    {form.day.includes('Friday') && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="px-4 py-2 rounded-lg bg-[rgba(212,163,115,0.1)] border border-[var(--warn)] text-[var(--warn)] text-[10px] font-medium flex items-center gap-2"
                                        >
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                            Friday is a designated weekly holiday in this region.
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="px-4 py-3 rounded-lg bg-[rgba(227,93,93,0.1)] border border-[var(--err)] text-[var(--err)] text-sm flex items-center gap-2">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                    {errorMsg}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={hasErrors || loading}
                                className="btn-primary w-full py-4 rounded-xl font-bold text-lg mt-4 flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                ) : (
                                    <>
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                                        Evaluate Operation
                                    </>
                                )}
                            </button>

                        </form>
                    </motion.div>

                    {/* Right Result */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-5 flex flex-col gap-6"
                    >
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass rounded-[2rem] p-8 border border-[var(--border)] shadow-2xl relative overflow-hidden"
                                >
                                    {/* Result Header */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-[var(--text)] font-semibold text-lg flex items-center gap-2">
                                                Prediction Result
                                            </h3>
                                            <p className="text-[var(--muted)] text-sm mt-1 flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-[var(--accent-light)] inline-block"></span>
                                                {form.department} Model
                                            </p>
                                        </div>
                                        {/* Status Badge */}
                                        {result.status && (
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border
                        ${result.status === 'High' ? 'bg-[rgba(72,169,166,0.15)] text-[var(--ok)] border-[var(--ok)]' :
                                                    result.status === 'Moderate' ? 'bg-[rgba(212,163,115,0.15)] text-[var(--warn)] border-[var(--warn)]' :
                                                        'bg-[rgba(217,83,79,0.15)] text-[var(--err)] border-[var(--err)]'
                                                }
                      `}>
                                                {result.status}
                                            </span>
                                        )}
                                    </div>

                                    {/* Main Value */}
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60 drop-shadow-lg">
                                            {result.prediction.toFixed(4)}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium text-[var(--muted)] border-b border-[var(--border)] pb-6 mb-6">
                                        Predicted vs Target: {result.extras.targeted_productivity.toFixed(2)}
                                    </div>

                                    {/* Charts Container */}
                                    <div className="flex flex-col gap-8">

                                        {/* Chart A: Target vs Prediction Gauge pseudo */}
                                        <div>
                                            <h5 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3 flex items-center gap-2"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg> Performance Gap</h5>
                                            <div className="h-6 w-full rounded-full bg-[rgba(255,255,255,0.05)] border border-[var(--border)] relative overflow-hidden">
                                                {/* Target Marker */}
                                                <div
                                                    className="absolute top-0 bottom-0 w-[2px] bg-[var(--text)] z-20"
                                                    style={{ left: `${result.extras.targeted_productivity * 100}%` }}
                                                ></div>
                                                {/* Prediction Fill */}
                                                <motion.div
                                                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] z-10"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(result.prediction * 100, 100)}%` }}
                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                ></motion.div>
                                            </div>
                                            <div className="flex justify-between text-[10px] mt-1 text-[var(--muted)] px-1">
                                                <span>0.0</span>
                                                <span>0.5</span>
                                                <span>1.0</span>
                                            </div>
                                        </div>

                                        {/* Chart B: Dept Comparison */}
                                        <div>
                                            <h5 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3 flex items-center gap-2"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg> Dept Comparison</h5>
                                            <div className="h-40 w-full ml-[-20px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={deptData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                                        <XAxis type="number" domain={[0, 1]} tick={{ fill: 'var(--muted)', fontSize: 10 }} />
                                                        <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text)', fontSize: 11 }} width={60} />
                                                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                                            {deptData.map((d, index) => (
                                                                <Cell key={`cell-${index}`} fill={d.name === form.department ? 'var(--accent-light)' : 'rgba(255,255,255,0.15)'} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Chart C: Feature Impact */}
                                        <div>
                                            <h5 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3 flex items-center gap-2"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg> Key Impact Drivers</h5>
                                            {featData.length > 0 ? (
                                                <div className="h-48 w-full ml-[-20px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={featData.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
                                                            <XAxis type="number" tick={false} axisLine={false} />
                                                            <YAxis dataKey="feature" type="category" tick={{ fill: 'var(--text)', fontSize: 10 }} width={80} axisLine={false} tickLine={false} />
                                                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                                                            <Bar dataKey="importance" fill="var(--accent)" radius={[0, 4, 4, 0]} barSize={12} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            ) : (
                                                <div className="h-24 border border-dashed border-[var(--border)] rounded-xl flex items-center justify-center text-sm text-[var(--muted)]">
                                                    Impact data unavailable
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="glass rounded-[2rem] p-12 border border-[var(--border)] shadow-2xl h-full flex flex-col items-center justify-center text-center text-[var(--muted)]"
                                >
                                    <div className="w-20 h-20 rounded-full border border-dashed border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-6 opacity-50">
                                        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12A10 10 0 1 0 12 2v10z" /><path d="M12 2A10 10 0 0 1 22 12h-10z" /></svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-[var(--text)] mb-2">Awaiting Parameters</h3>
                                    <p className="max-w-xs text-sm">Fill out the operational parameters on the left and evaluate to generate ML insights.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
