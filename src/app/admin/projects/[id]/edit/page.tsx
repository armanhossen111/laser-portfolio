'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase, type Project } from '@/lib/supabase'
import { Upload, X, Trash2 } from 'lucide-react'

export default function EditProjectPage() {
    const router = useRouter()
    const params = useParams()
    const projectId = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        display_order: 0,
        image_url: ''
    })

    useEffect(() => {
        fetchProject()
    }, [projectId])

    const fetchProject = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single()

            if (error) throw error

            setFormData({
                title: data.title,
                category: data.category,
                description: data.description || '',
                display_order: data.display_order,
                image_url: data.image_url || ''
            })

            if (data.image_url) {
                setImagePreview(data.image_url)
            }
        } catch (error) {
            console.error('Error fetching project:', error)
            alert('Failed to load project')
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('project-images')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
            .from('project-images')
            .getPublicUrl(filePath)

        return data.publicUrl
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            let image_url = formData.image_url

            // Upload new image if provided
            if (imageFile) {
                setUploading(true)
                image_url = await uploadImage(imageFile)
                setUploading(false)
            }

            // Update project
            const { error } = await supabase
                .from('projects')
                .update({
                    title: formData.title,
                    category: formData.category,
                    description: formData.description,
                    display_order: formData.display_order,
                    image_url,
                    updated_at: new Date().toISOString()
                })
                .eq('id', projectId)

            if (error) throw error

            router.push('/admin/projects')
        } catch (error: any) {
            console.error('Error updating project:', error)
            alert(error.message || 'Failed to update project')
        } finally {
            setSaving(false)
            setUploading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return
        }

        setDeleting(true)
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId)

            if (error) throw error

            router.push('/admin/projects')
        } catch (error: any) {
            console.error('Error deleting project:', error)
            alert(error.message || 'Failed to delete project')
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return <div className="text-white">Loading project...</div>
    }

    return (
        <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">
                    EDIT <span className="text-safety-orange">PROJECT</span>
                </h1>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-2 px-4 py-2 border border-red-900 text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-50 text-sm font-bold uppercase"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Project
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-dark-slate border border-zinc-700 p-8">
                {/* Image Upload */}
                <div className="mb-6">
                    <label className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-2 block">
                        Project Image
                    </label>

                    {imagePreview ? (
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-64 object-cover border border-zinc-700"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null)
                                    setImageFile(null)
                                    setFormData({ ...formData, image_url: '' })
                                }}
                                className="absolute top-2 right-2 p-2 bg-red-900 text-white hover:bg-red-800 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-700 hover:border-safety-orange transition-colors cursor-pointer bg-zinc-900">
                            <Upload className="w-12 h-12 text-zinc-700 mb-2" />
                            <span className="text-gray-500 text-sm">Click to upload new image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                {/* Title */}
                <div className="mb-6">
                    <label htmlFor="title" className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-2 block">
                        Project Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-safety-orange focus:outline-none transition-colors"
                        required
                    />
                </div>

                {/* Category */}
                <div className="mb-6">
                    <label htmlFor="category" className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-2 block">
                        Category *
                    </label>
                    <input
                        type="text"
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., Laser Cutting, Pattern Design"
                        className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-safety-orange focus:outline-none transition-colors"
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label htmlFor="description" className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-2 block">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-safety-orange focus:outline-none transition-colors"
                    />
                </div>

                {/* Display Order */}
                <div className="mb-8">
                    <label htmlFor="order" className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-2 block">
                        Display Order
                    </label>
                    <input
                        type="number"
                        id="order"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                        className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-safety-orange focus:outline-none transition-colors"
                    />
                    <p className="text-xs text-gray-600 mt-1">Lower numbers appear first</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 py-4 bg-safety-orange text-white font-bold tracking-widest hover:bg-orange-600 transition-colors uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Uploading Image...' : saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/admin/projects')}
                        className="px-6 py-4 border border-zinc-600 text-gray-300 hover:border-safety-orange hover:text-safety-orange transition-colors uppercase text-sm font-bold tracking-wider"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
