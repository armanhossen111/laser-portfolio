'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Upload, X } from 'lucide-react'

export default function NewProjectPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        display_order: 0
    })

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
        setLoading(true)

        try {
            let image_url = null

            // Upload image if provided
            if (imageFile) {
                setUploading(true)
                image_url = await uploadImage(imageFile)
                setUploading(false)
            }

            // Insert project
            const { error } = await supabase
                .from('projects')
                .insert([{
                    ...formData,
                    image_url
                }])

            if (error) throw error

            router.push('/admin/projects')
        } catch (error: any) {
            console.error('Error creating project:', error)
            alert(error.message || 'Failed to create project')
        } finally {
            setLoading(false)
            setUploading(false)
        }
    }

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-white mb-8">
                ADD NEW <span className="text-safety-orange">PROJECT</span>
            </h1>

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
                                }}
                                className="absolute top-2 right-2 p-2 bg-red-900 text-white hover:bg-red-800 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-700 hover:border-safety-orange transition-colors cursor-pointer bg-zinc-900">
                            <Upload className="w-12 h-12 text-zinc-700 mb-2" />
                            <span className="text-gray-500 text-sm">Click to upload image</span>
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
                        disabled={loading}
                        className="flex-1 py-4 bg-safety-orange text-white font-bold tracking-widest hover:bg-orange-600 transition-colors uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Uploading Image...' : loading ? 'Creating...' : 'Create Project'}
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
