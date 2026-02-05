'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Plus, FolderOpen } from 'lucide-react'

export default function AdminDashboard() {
    const [projectCount, setProjectCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const { count, error } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true })

            if (error) throw error
            setProjectCount(count || 0)
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">
                WELCOME <span className="text-safety-orange">BACK</span>
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-dark-slate border border-zinc-700 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm uppercase tracking-wider">Total Projects</span>
                        <FolderOpen className="w-5 h-5 text-safety-orange" />
                    </div>
                    <div className="text-4xl font-bold text-white">
                        {loading ? '...' : projectCount}
                    </div>
                </div>

                <div className="bg-dark-slate border border-zinc-700 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm uppercase tracking-wider">Status</span>
                    </div>
                    <div className="text-lg font-bold text-green-500">
                        Online
                    </div>
                </div>

                <div className="bg-dark-slate border border-zinc-700 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm uppercase tracking-wider">Last Updated</span>
                    </div>
                    <div className="text-lg font-bold text-white">
                        Today
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-dark-slate border border-zinc-700 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <Link
                        href="/admin/projects/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-safety-orange text-white font-bold tracking-wider hover:bg-orange-600 transition-colors text-sm uppercase"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Project
                    </Link>
                    <Link
                        href="/admin/projects"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-600 text-gray-300 hover:border-safety-orange hover:text-safety-orange transition-colors text-sm uppercase font-bold tracking-wider"
                    >
                        <FolderOpen className="w-5 h-5" />
                        Manage Projects
                    </Link>
                </div>
            </div>
        </div>
    )
}
