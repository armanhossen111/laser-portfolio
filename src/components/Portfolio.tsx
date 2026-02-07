'use client'

import { useEffect, useState } from 'react'
import { supabase, type Project } from '@/lib/supabase'
import Image from 'next/image'

interface PortfolioProps {
    isHomePage?: boolean;
}

export default function Portfolio({ isHomePage = false }: PortfolioProps) {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            let query = supabase
                .from('projects')
                .select('*')
                .order('display_order', { ascending: true })

            if (isHomePage) {
                query = query.limit(6)
            }

            const { data, error } = await query

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
                <div className="flex justify-between items-end mb-12">
                    <h2 id="portfolio-heading" className="text-3xl font-bold tracking-tight">
                        {isHomePage ? 'SELECTED' : 'ALL'} <span className="text-safety-orange">WORK</span>
                    </h2>
                    {isHomePage && (
                        <a
                            href="/projects"
                            className="text-gray-400 hover:text-safety-orange transition-colors duration-300 text-sm font-bold uppercase tracking-widest flex items-center gap-2"
                        >
                            View All Projects
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </a>
                    )}
                </div>

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
                                <div className="aspect-[4/5] bg-neutral-900 border border-zinc-800 overflow-hidden relative group-hover:border-safety-orange/50 transition-colors duration-500 shadow-2xl">
                                    {project.image_url ? (
                                        <Image
                                            src={project.image_url}
                                            alt={`${project.title} - ${project.category}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out grayscale-[20%] group-hover:grayscale-0"
                                            loading={index < 3 ? "eager" : "lazy"}
                                            quality={90}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                                            <span className="text-7xl font-thin text-zinc-800" aria-hidden="true">0{index + 1}</span>
                                            <span className="text-[10px] uppercase tracking-[0.3em] mt-4 text-zinc-500">No Image Preview</span>
                                        </div>
                                    )}

                                    {/* Glassmorphic Overlay Content */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-all duration-500">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                            <span className="inline-block px-2 py-1 bg-safety-orange/10 backdrop-blur-sm border border-safety-orange/20 text-safety-orange text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
                                                {project.category}
                                            </span>
                                            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-safety-orange transition-colors duration-300">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-gray-400 line-clamp-2 font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                                {project.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Interactive corner accent */}
                                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-safety-orange/0 group-hover:border-r-safety-orange/20 transition-all duration-500"></div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

