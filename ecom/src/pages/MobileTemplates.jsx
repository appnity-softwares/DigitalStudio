import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Smartphone, Star, Heart, ShoppingCart, Search,
    Zap, Layers, Shield, Globe, SlidersHorizontal, X
} from 'lucide-react';
import WishlistContext from '../context/WishlistContext';
import CartContext from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const MobileTemplates = () => {
    const { addToWishlist, isInWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Filters
    const [filters, setFilters] = useState({
        platform: 'all',
        priceRange: 'all',
        sortBy: 'newest'
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await api.get('/products?category=mobile');
            setTemplates(res.data.products || []);
        } catch (err) {
            setTemplates([]);
        } finally {
            setLoading(false);
        }
    };

    // Apply filters and search
    const filteredTemplates = useMemo(() => {
        let result = [...templates];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(t =>
                t.title?.toLowerCase().includes(term) ||
                t.description?.toLowerCase().includes(term)
            );
        }

        // Platform filter
        if (filters.platform !== 'all') {
            result = result.filter(t => t.platform === filters.platform);
        }

        // Price filter
        if (filters.priceRange !== 'all') {
            switch (filters.priceRange) {
                case 'free':
                    result = result.filter(t => !t.price || t.price === 0);
                    break;
                case 'under50':
                    result = result.filter(t => t.price && t.price < 50);
                    break;
                case 'under100':
                    result = result.filter(t => t.price && t.price < 100);
                    break;
                case 'over100':
                    result = result.filter(t => t.price && t.price >= 100);
                    break;
            }
        }

        // Sort
        switch (filters.sortBy) {
            case 'price-low':
                result.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-high':
                result.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'rating':
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return result;
    }, [templates, searchTerm, filters]);

    const handleAddToCart = (template) => {
        addToCart(template);
        showToast('Added to cart!', 'success');
    };

    const handleWishlist = (template) => {
        addToWishlist(template);
        showToast('Added to wishlist!', 'success');
    };

    const platforms = [
        { id: 'all', label: 'All Platforms' },
        { id: 'react-native', label: 'React Native' },
        { id: 'flutter', label: 'Flutter' },
        { id: 'expo', label: 'Expo' }
    ];

    const priceRanges = [
        { id: 'all', label: 'All Prices' },
        { id: 'free', label: 'Free' },
        { id: 'under50', label: 'Under $50' },
        { id: 'under100', label: 'Under $100' },
        { id: 'over100', label: '$100+' }
    ];

    const sortOptions = [
        { id: 'newest', label: 'Newest' },
        { id: 'price-low', label: 'Price: Low to High' },
        { id: 'price-high', label: 'Price: High to Low' },
        { id: 'rating', label: 'Top Rated' }
    ];

    return (
        <div className="page-container pt-28">
            {/* Hero */}
            <section className="relative pb-16">
                <div className="absolute inset-0 grid-pattern opacity-50" />
                <div className="absolute top-10 right-1/4 w-96 h-96 bg-[var(--accent-primary)] opacity-[0.03] rounded-full blur-3xl" />

                <div className="container max-w-6xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
                            <Smartphone className="w-4 h-4 text-[var(--accent-primary)]" />
                            <span className="text-sm font-medium text-[var(--text-secondary)]">
                                Mobile App Templates
                            </span>
                        </div>

                        <h1 className="text-display text-[var(--text-primary)] mb-6">
                            Build mobile apps <span className="text-[var(--accent-primary)]">10x faster</span>
                        </h1>

                        <p className="text-body text-lg mb-8 max-w-2xl">
                            Production-ready React Native & Flutter templates. Skip months of development and launch your app today.
                        </p>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {[
                                { icon: Zap, text: 'Production Ready' },
                                { icon: Layers, text: 'Full Source Code' },
                                { icon: Shield, text: 'Free Updates' },
                                { icon: Globe, text: 'Cross Platform' }
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} className="pill">
                                    <Icon className="w-4 h-4 text-[var(--accent-primary)]" />
                                    {text}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Filters & Search */}
            <section className="py-6 border-y border-[var(--border-primary)] bg-[var(--bg-secondary)] sticky top-16 z-30">
                <div className="container max-w-6xl mx-auto px-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search templates..."
                                className="input pl-12 w-full"
                            />
                        </div>

                        {/* Platform Filters */}
                        <div className="hidden md:flex gap-2">
                            {platforms.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setFilters(f => ({ ...f, platform: p.id }))}
                                    className={`pill pill-hover ${filters.platform === p.id ? 'pill-active' : ''}`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        {/* Filter Button (Mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden btn-secondary flex items-center gap-2"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                        </button>

                        {/* Sort Dropdown */}
                        <select
                            value={filters.sortBy}
                            onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                            className="input w-auto"
                        >
                            {sortOptions.map(s => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Mobile Filter Panel */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="md:hidden mt-4 pt-4 border-t border-[var(--border-primary)]"
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Platform</label>
                                    <div className="flex flex-wrap gap-2">
                                        {platforms.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => setFilters(f => ({ ...f, platform: p.id }))}
                                                className={`pill pill-hover ${filters.platform === p.id ? 'pill-active' : ''}`}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Price</label>
                                    <div className="flex flex-wrap gap-2">
                                        {priceRanges.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => setFilters(f => ({ ...f, priceRange: p.id }))}
                                                className={`pill pill-hover ${filters.priceRange === p.id ? 'pill-active' : ''}`}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Templates Grid */}
            <section className="py-12">
                <div className="container max-w-6xl mx-auto px-6">
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="card animate-pulse">
                                    <div className="aspect-video bg-[var(--bg-tertiary)] rounded-xl mb-4" />
                                    <div className="h-5 bg-[var(--bg-tertiary)] rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : filteredTemplates.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            <p className="text-body mb-6">
                                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                            </p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTemplates.map((template, i) => (
                                    <TemplateCard
                                        key={template.id || i}
                                        template={template}
                                        index={i}
                                        onAddToCart={() => handleAddToCart(template)}
                                        onWishlist={() => handleWishlist(template)}
                                        isInWishlist={isInWishlist(template.id)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

// Template Card
const TemplateCard = ({ template, index, onAddToCart, onWishlist, isInWishlist }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="card card-hover group"
    >
        {/* Image */}
        <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
            <img
                src={template.image || 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600'}
                alt={template.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Platform Badge */}
            <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${template.platform === 'react-native' ? 'bg-blue-500' :
                    template.platform === 'flutter' ? 'bg-cyan-500' : 'bg-purple-500'
                }`}>
                {template.platform === 'react-native' ? 'React Native' :
                    template.platform === 'flutter' ? 'Flutter' : 'Expo'}
            </span>

            {/* Wishlist Button */}
            <button
                onClick={(e) => { e.preventDefault(); onWishlist(); }}
                className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isInWishlist
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-gray-600 hover:bg-white opacity-0 group-hover:opacity-100'
                    }`}
            >
                <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
        </div>

        {/* Content */}
        <div className="flex items-center gap-2 mb-2">
            <div className="flex">
                {[...Array(5)].map((_, j) => (
                    <Star
                        key={j}
                        className={`w-3.5 h-3.5 ${j < Math.floor(template.rating || 4)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
            <span className="text-xs text-[var(--text-tertiary)]">
                ({template.reviews || 0})
            </span>
        </div>

        <h3 className="text-title text-[var(--text-primary)] mb-2 line-clamp-1">
            {template.title}
        </h3>
        <p className="text-body text-sm mb-4 line-clamp-2">
            {template.description}
        </p>

        {/* Tech Stack */}
        {template.techStack && (
            <div className="flex flex-wrap gap-1.5 mb-4">
                {template.techStack.slice(0, 3).map((tech, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-tertiary)]">
                        {tech}
                    </span>
                ))}
            </div>
        )}

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-secondary)]">
            <div>
                <span className="text-xl font-bold text-[var(--text-primary)]">
                    ${template.price || 0}
                </span>
                {template.originalPrice && (
                    <span className="text-sm text-[var(--text-tertiary)] line-through ml-2">
                        ${template.originalPrice}
                    </span>
                )}
            </div>
            <button
                onClick={(e) => { e.preventDefault(); onAddToCart(); }}
                className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
            >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
            </button>
        </div>
    </motion.div>
);

// Empty State
const EmptyState = () => (
    <div className="text-center py-20">
        <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-8 h-8 text-[var(--text-tertiary)]" />
        </div>
        <h3 className="text-headline text-[var(--text-primary)] mb-2">
            No templates found
        </h3>
        <p className="text-body max-w-sm mx-auto">
            Try adjusting your filters or check back later for new templates.
        </p>
    </div>
);

export default MobileTemplates;
