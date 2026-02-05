'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, type Project } from '@/lib/supabase'
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react'

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('display_order', { ascending: true })

            if (error) throw error
            setProjects(data || [])
        } catch (error) {
            console.error('Error fetching projects:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return

        setDeleting(id)
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id)

            if (error) throw error
            setProjects(projects.filter(p => p.id !== id))
        } catch (error) {
            console.error('Error deleting project:', error)
            alert('Failed to delete project')
        } finally {
            setDeleting(null)
        }
    }

    if (loading) {
        return (
            <div className="text-white">Loading projects...</div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">
                    MANAGE <span className="text-safety-orange">PROJECTS</span>
                </h1>
                <Link
                    href="/admin/projects/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-safety-orange text-white font-bold tracking-wider hover:bg-orange-600 transition-colors text-sm uppercase"
                >
                    <Plus className="w-5 h-5" />
                    Add Project
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="bg-dark-slate border border-zinc-700 p-12 text-center">
                    <ImageIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No projects yet</p>
                    <Link
                        href="/admin/projects/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-safety-orange text-white font-bold tracking-wider hover:bg-orange-600 transition-colors text-sm uppercase"
                    >
                        <Plus className="w-5 h-5" />
                        Add Your First Project
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-dark-slate border border-zinc-700 overflow-hidden group">
                            {/* Project Image */}
                            <div className="aspect-[4/3] bg-zinc-800 relative">
                                {project.image_url ? (
                                    <img
                                        src={project.image_url}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="w-12 h-12 text-zinc-700" />
                                    </div>
                                )}
                            </div>

                            {/* Project Info */}
                            <div className="p-4">
                                <div className="mb-3">
                                    <span className="text-safety-orange text-xs font-bold uppercase tracking-wider">
                                        {project.category}
                                    </span>
                                    <h3 className="text-lg font-bold text-white mt-1">{project.title}</h3>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/projects/${project.id}/edit`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-zinc-600 text-gray-300 hover:border-safety-orange hover:text-safety-orange transition-colors text-sm font-bold uppercase"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        disabled={deleting === project.id}
                                        className="px-4 py-2 border border-red-900 text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
