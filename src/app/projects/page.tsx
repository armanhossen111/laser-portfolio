'use client'

import { useState, useEffect } from 'react'
import { supabase, type Project } from '@/lib/supabase'
import Portfolio from '@/components/Portfolio'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function ProjectsPage() {
    const [categories, setCategories] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('category')

            if (error) throw error

            const uniqueCategories = ['All', ...Array.from(new Set(data.map((p: any) => p.category)))]
            setCategories(uniqueCategories)
        } catch (err) {
            console.error('Error fetching categories:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-dark-slate text-white pt-24">
            <div className="container mx-auto px-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-safety-orange transition-colors mb-12 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
                    Back to Home
                </Link>

                <div className="mb-16">
                    <h1 className="text-5xl font-bold mb-4 tracking-tighter uppercase">
                        Our <span className="text-safety-orange">Expertise</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        Explore our full collection of precision-crafted projects, categorized by industry and application.
                    </p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 border ${selectedCategory === category
                                    ? 'bg-safety-orange border-safety-orange text-white'
                                    : 'border-zinc-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="min-h-[600px]">
                    <PortfolioGrid category={selectedCategory} />
                </div>
            </div>
            <Footer />
        </main>
    )
}

function PortfolioGrid({ category }: { category: string }) {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFilteredProjects = async () => {
            setLoading(true)
            try {
                let query = supabase
                    .from('projects')
                    .select('*')
                    .order('display_order', { ascending: true })

                if (category !== 'All') {
                    query = query.eq('category', category)
                }

                const { data, error } = await query
                if (error) throw error
                setProjects(data || [])
            } catch (err) {
                console.error('Error filtering projects:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchFilteredProjects()
    }, [category])

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-[4/5] bg-neutral-900/50 border border-zinc-900"></div>
                ))}
            </div>
        )
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-24 border border-dashed border-zinc-800">
                <p className="text-gray-500 text-lg uppercase tracking-widest font-light">No projects found in this category.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">
            {projects.map((project, index) => (
                <article
                    key={project.id}
                    className="group relative"
                    aria-label={`Project: ${project.title}`}
                >
                    <div className="aspect-[4/5] bg-neutral-900 border border-zinc-800 overflow-hidden relative group-hover:border-safety-orange/50 transition-colors duration-500 shadow-2xl">
                        {project.image_url ? (
                            <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out grayscale-[20%] group-hover:grayscale-0"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                                <span className="text-7xl font-thin text-zinc-800">0{index + 1}</span>
                            </div>
                        )}

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
                    </div>
                </article>
            ))}
        </div>
    )
}
