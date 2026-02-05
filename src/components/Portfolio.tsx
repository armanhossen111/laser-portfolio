'use client'

import { useEffect, useState } from 'react'
import { supabase, type Project } from '@/lib/supabase'
import Image from 'next/image'

export default function Portfolio() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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
        } catch (err: any) {
            console.error('Error fetching projects:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="work" className="py-24 bg-dark-slate" aria-labelledby="portfolio-heading">
            <div className="container mx-auto px-6">
                <h2 id="portfolio-heading" className="text-3xl font-bold mb-12 tracking-tight">
                    SELECTED <span className="text-safety-orange">WORK</span>
                </h2>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="status" aria-label="Loading projects">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-[4/5] bg-neutral-800 border border-zinc-700 animate-pulse">
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 border-4 border-safety-orange border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center text-red-400 py-12" role="alert">
                        Failed to load projects. Please try again later.
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        No projects to display yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <article
                                key={project.id}
                                className="group relative"
                                aria-label={`Project: ${project.title}`}
                            >
                                {/* Image */}
                                <div className="aspect-[4/5] bg-neutral-800 border border-zinc-700 overflow-hidden relative">
                                    {project.image_url ? (
                                        <Image
                                            src={project.image_url}
                                            alt={`${project.title} - ${project.category}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading={index < 3 ? "eager" : "lazy"}
                                            quality={85}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50">
                                            <span className="text-6xl font-thin text-zinc-700" aria-hidden="true">0{index + 1}</span>
                                            <span className="text-xs uppercase tracking-widest mt-4">Project Image</span>
                                        </div>
                                    )}

                                    {/* Overlay Content */}
                                    <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent opacity-100 group-hover:opacity-100 transition-opacity">
                                        <span className="text-safety-orange text-xs font-bold tracking-widest uppercase mb-2">
                                            {project.category}
                                        </span>
                                        <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                                        <p className="text-sm text-gray-400">{project.description}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

