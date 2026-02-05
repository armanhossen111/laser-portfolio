'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'

export default function AdminLogin() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signIn(email, password)
            router.push('/admin/dashboard')
        } catch (err: any) {
            setError(err.message || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        ADMIN <span className="text-safety-orange">ACCESS</span>
                    </h1>
                    <p className="text-gray-500 text-sm">MD Arman Laser Craft Portfolio</p>
                </div>

                {/* Login Form */}
                <div className="bg-dark-slate border border-zinc-700 p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-900/20 border border-red-900 text-red-400 p-3 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label htmlFor="email" className="text-xs uppercase text-gray-500 font-bold tracking-wider">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-safety-orange focus:outline-none transition-colors"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="text-xs uppercase text-gray-500 font-bold tracking-wider">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-safety-orange focus:outline-none transition-colors"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-safety-orange text-white font-bold tracking-widest hover:bg-orange-600 transition-colors uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/" className="text-gray-500 text-sm hover:text-safety-orange transition-colors">
                            ← Back to Portfolio
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
