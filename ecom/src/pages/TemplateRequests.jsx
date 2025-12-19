import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    Lightbulb, ThumbsUp, Plus, Filter, Search, Clock, CheckCircle,
    XCircle, Loader, ChevronDown, ArrowUp
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const TemplateRequests = () => {
    const { user } = useContext(AuthContext);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('votes');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        techStack: ''
    });

    // Fetch requests
    const { data, isLoading, error } = useQuery({
        queryKey: ['templateRequests', filter, sort],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filter !== 'all') params.append('status', filter);
            params.append('sort', sort);
            const res = await api.get(`/template-requests?${params}`);
            return res.data;
        }
    });

    // Create request mutation
    const createMutation = useMutation({
        mutationFn: (data) => api.post('/template-requests', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['templateRequests']);
            showToast('Request submitted!', 'success');
            setShowForm(false);
            setFormData({ title: '', description: '', category: '', techStack: '' });
        },
        onError: (err) => showToast(err.response?.data?.message || 'Failed to submit', 'error')
    });

    // Vote mutation
    const voteMutation = useMutation({
        mutationFn: (id) => api.post(`/template-requests/${id}/vote`),
        onSuccess: () => queryClient.invalidateQueries(['templateRequests']),
        onError: (err) => showToast(err.response?.data?.message || 'Failed to vote', 'error')
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            showToast('Please login to submit a request', 'info');
            return;
        }
        createMutation.mutate({
            ...formData,
            techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean)
        });
    };

    const handleVote = (id) => {
        if (!user) {
            showToast('Please login to vote', 'info');
            return;
        }
        voteMutation.mutate(id);
    };

    const statusColors = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        APPROVED: 'bg-blue-100 text-blue-700',
        IN_PROGRESS: 'bg-purple-100 text-purple-700',
        COMPLETED: 'bg-green-100 text-green-700',
        REJECTED: 'bg-red-100 text-red-700'
    };

    const statusIcons = {
        PENDING: Clock,
        APPROVED: CheckCircle,
        IN_PROGRESS: Loader,
        COMPLETED: CheckCircle,
        REJECTED: XCircle
    };

    return (
        <div className="page-container pt-28 pb-20">
            <div className="container max-w-4xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[var(--accent-subtle)]">
                        <Lightbulb className="w-4 h-4 text-[var(--accent-primary)]" />
                        <span className="text-sm font-medium text-[var(--accent-primary)]">
                            Community Ideas
                        </span>
                    </div>
                    <h1 className="text-display text-[var(--text-primary)] mb-4">
                        Template Requests
                    </h1>
                    <p className="text-body text-lg max-w-2xl mx-auto">
                        Request templates you'd love to see. Vote on ideas from other users.
                        We build the most popular ones!
                    </p>
                </motion.div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex gap-2">
                        {['all', 'pending', 'approved', 'in_progress', 'completed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                        ? 'bg-[var(--accent-primary)] text-white'
                                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Request
                    </button>
                </div>

                {/* Submit Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleSubmit}
                            className="card mb-8 overflow-hidden"
                        >
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
                                Submit a Request
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., AI SaaS Dashboard Template"
                                        className="input w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe the template you'd like to see..."
                                        rows={4}
                                        className="input w-full"
                                        required
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="input w-full"
                                        >
                                            <option value="">Select category</option>
                                            <option value="SaaS">SaaS</option>
                                            <option value="E-commerce">E-commerce</option>
                                            <option value="Dashboard">Dashboard</option>
                                            <option value="Landing Page">Landing Page</option>
                                            <option value="Portfolio">Portfolio</option>
                                            <option value="Mobile App">Mobile App</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                            Tech Stack (comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.techStack}
                                            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                            placeholder="React, Node.js, MongoDB"
                                            className="input w-full"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
                                        {createMutation.isPending ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* Requests List */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <Loader className="w-8 h-8 animate-spin mx-auto text-[var(--accent-primary)]" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-[var(--text-secondary)]">
                        Failed to load requests
                    </div>
                ) : data?.requests?.length === 0 ? (
                    <div className="text-center py-12">
                        <Lightbulb className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
                        <p className="text-[var(--text-secondary)]">No requests yet. Be the first!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data?.requests?.map((request, index) => {
                            const StatusIcon = statusIcons[request.status] || Clock;
                            const hasVoted = request.voters?.includes(user?.id);

                            return (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="card flex gap-4"
                                >
                                    {/* Vote Button */}
                                    <button
                                        onClick={() => handleVote(request.id)}
                                        disabled={voteMutation.isPending}
                                        className={`flex flex-col items-center justify-center w-16 min-h-20 rounded-xl transition-colors ${hasVoted
                                                ? 'bg-[var(--accent-primary)] text-white'
                                                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'
                                            }`}
                                    >
                                        <ArrowUp className="w-5 h-5" />
                                        <span className="font-bold">{request.votes}</span>
                                    </button>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="font-bold text-[var(--text-primary)]">
                                                {request.title}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[request.status]}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {request.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                                            {request.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                                            {request.category && (
                                                <span className="px-2 py-1 bg-[var(--bg-tertiary)] rounded">
                                                    {request.category}
                                                </span>
                                            )}
                                            {request.techStack?.length > 0 && (
                                                <span>{request.techStack.join(', ')}</span>
                                            )}
                                            <span>by {request.user?.name}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplateRequests;
