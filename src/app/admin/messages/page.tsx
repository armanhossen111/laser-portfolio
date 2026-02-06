'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Calendar, User, MessageSquare, Trash2 } from 'lucide-react'

interface Message {
    id: string
    name: string
    email: string
    subject: string
    message: string
    created_at: string
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setMessages(data || [])
        } catch (error) {
            console.error('Error fetching messages:', error)
        } finally {
            setLoading(false)
        }
    }

    const deleteMessage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return

        try {
            const { error } = await supabase
                .from('contact_messages')
                .delete()
                .eq('id', id)

            if (error) throw error
            setMessages(messages.filter(m => m.id !== id))
        } catch (error) {
            console.error('Error deleting message:', error)
            alert('Failed to delete message')
        }
    }

    if (loading) {
        return <div className="text-white">Loading messages...</div>
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white uppercase tracking-wider">
                    CLIENT <span className="text-safety-orange">MESSAGES</span>
                </h1>
            </div>

            <div className="grid gap-6">
                {messages.length === 0 ? (
                    <div className="bg-dark-slate border border-zinc-700 p-8 text-center text-gray-500">
                        No messages found.
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="bg-dark-slate border border-zinc-700 p-6 hover:border-safety-orange transition-colors">
                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        <User className="w-4 h-4 text-safety-orange" />
                                        {msg.name}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Mail className="w-4 h-4" />
                                        {msg.email}
                                    </div>
                                </div>
                                <div className="flex flex-col md:items-end gap-1">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(msg.created_at).toLocaleDateString()} {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="bg-zinc-800 text-safety-orange px-2 py-1 text-[10px] font-bold uppercase tracking-tighter inline-block">
                                        {msg.subject}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/30 border-l-2 border-safety-orange p-4 mb-4">
                                <div className="flex gap-3">
                                    <MessageSquare className="w-5 h-5 text-gray-500 shrink-0 mt-1" />
                                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                        {msg.message}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => deleteMessage(msg.id)}
                                className="flex items-center gap-2 text-red-500 hover:text-red-400 text-xs font-bold uppercase transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Message
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
