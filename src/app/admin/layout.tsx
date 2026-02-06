'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getSession, signOut } from '@/lib/auth'
import { LayoutDashboard, FolderOpen, LogOut, Mail } from 'lucide-react'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const session = await getSession()
            if (!session && pathname !== '/admin/login') {
                router.push('/admin/login')
            }
        } catch (error) {
            router.push('/admin/login')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await signOut()
            router.push('/admin/login')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    // Don't protect the login page
    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="bg-dark-slate border-b border-zinc-800 px-6 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white tracking-wider">
                        ADMIN <span className="text-safety-orange">PANEL</span>
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-400 hover:text-safety-orange transition-colors text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-dark-slate border-r border-zinc-800 min-h-[calc(100vh-73px)]">
                    <nav className="p-4 space-y-2">
                        <Link
                            href="/admin/dashboard"
                            className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${pathname === '/admin/dashboard'
                                ? 'bg-safety-orange text-white'
                                : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
                                }`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/projects"
                            className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${pathname.startsWith('/admin/projects')
                                ? 'bg-safety-orange text-white'
                                : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
                                }`}
                        >
                            <FolderOpen className="w-5 h-5" />
                            Projects
                        </Link>
                        <Link
                            href="/admin/messages"
                            className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${pathname === '/admin/messages'
                                ? 'bg-safety-orange text-white'
                                : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
                                }`}
                        >
                            <Mail className="w-5 h-5" />
                            Messages
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
