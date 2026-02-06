'use client'

import { useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import { Download } from "lucide-react"
import { supabase } from '@/lib/supabase'

export default function AboutContact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            const { error: submitError } = await supabase
                .from('contact_messages')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    created_at: new Date().toISOString()
                }])

            if (submitError) throw submitError

            setSuccess(true)
            setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' })

            // Hide success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000)
        } catch (err: any) {
            console.error('Form submission error:', err)
            setError(err.message || 'Failed to send message. Please try emailing directly.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="contact" className="py-24 bg-zinc-900 border-t border-zinc-800" aria-labelledby="contact-heading">
            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* About Column */}
                <div>
                    <h2 id="contact-heading" className="text-3xl font-bold mb-8 tracking-tight">
                        THE <span className="text-safety-orange">CRAFTSMAN</span>
                    </h2>
                    <div className="flex gap-6 mb-8">
                        <div className="w-24 h-24 bg-zinc-800 shrink-0 border border-zinc-700 relative overflow-hidden">
                            {/* User Instructions: Place your bio image in public/bio.jpg */}
                            <Image
                                src="/bio.jpg"
                                alt="MD Arman Profile"
                                fill
                                className="object-cover object-top"

                            />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">MD Arman</h3>
                            <p className="text-safety-orange text-sm font-medium tracking-wide">
                                LASER OPERATOR & PATTERN ENGINEER
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                                Mobile: 01777884821 | Email: mdarmanhosseny2003@gmail.com
                            </p>
                        </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed mb-6">
                        With over 5 years of experience in high-precision manufacturing, I specialize in bridging the gap between digital design and physical production. My background in footwear pattern engineering ensures every laser cut is functional, scalable, and production-ready.
                    </p>
                    <p className="text-gray-400 leading-relaxed border-l-2 border-safety-orange pl-4 italic mb-8">
                        "Precision isn't just a requirement; it's the foundation of quality."
                    </p>

                    <a
                        href="/cv.pdf"
                        download
                        className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-600 text-gray-300 hover:border-safety-orange hover:text-safety-orange focus:outline-none focus:ring-2 focus:ring-safety-orange focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors duration-300 tracking-wider text-sm font-bold uppercase"
                        aria-label="Download CV as PDF"
                    >
                        <Download className="w-4 h-4" />
                        Download CV
                    </a>
                </div>

                {/* Contact Form Column */}
                <div className="bg-dark-slate p-8 border border-zinc-700">
                    <h3 className="text-2xl font-bold mb-6 text-white">GET IN TOUCH</h3>

                    {success && (
                        <div className="mb-6 bg-green-900/20 border border-green-900 text-green-400 p-4 rounded" role="alert">
                            ✓ Message sent successfully! I'll get back to you soon.
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 bg-red-900/20 border border-red-900 text-red-400 p-4 rounded" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="name" className="text-xs uppercase text-gray-500 font-bold tracking-wider">Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-safety-orange focus:outline-none transition-colors"
                                    required
                                    disabled={loading}
                                    aria-required="true"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="email" className="text-xs uppercase text-gray-500 font-bold tracking-wider">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-safety-orange focus:outline-none transition-colors"
                                    required
                                    disabled={loading}
                                    aria-required="true"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="subject" className="text-xs uppercase text-gray-500 font-bold tracking-wider">Subject</label>
                            <select
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-safety-orange focus:outline-none transition-colors"
                                disabled={loading}
                            >
                                <option>General Inquiry</option>
                                <option>Laser Cutting Service</option>
                                <option>Pattern Grading Project</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="message" className="text-xs uppercase text-gray-500 font-bold tracking-wider">Message *</label>
                            <textarea
                                id="message"
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-safety-orange focus:outline-none transition-colors"
                                required
                                disabled={loading}
                                aria-required="true"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-safety-orange text-white font-bold tracking-widest hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-safety-orange focus:ring-offset-2 focus:ring-offset-dark-slate transition-colors uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>

            </div>
        </section>
    )
}
