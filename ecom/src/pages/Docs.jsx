import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    BookOpen,
    Clock,
    Tag,
    Search,
    Filter,
    ChevronRight,
    Star,
    Lock,
    Eye,
} from "lucide-react";
import { getDocs } from "../services/docsService";

const Docs = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [docs, setDocs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get("category") || ""
    );
    const [selectedDifficulty, setSelectedDifficulty] = useState("");

    useEffect(() => {
        fetchDocs();
    }, [selectedCategory, selectedDifficulty]);

    const fetchDocs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getDocs();
            // Defensive: ensure response is an array
            const docsArray = Array.isArray(response) ? response : [];
            setDocs(docsArray);
            // Extract categories from docs
            const uniqueCategories = [...new Set(docsArray.map(d => d.category).filter(Boolean))];
            setCategories(uniqueCategories.map(name => ({ name, count: docsArray.filter(d => d.category === name).length })));
        } catch (err) {
            console.error("Error fetching docs:", err);
            setError(err.message);
            // Fallback to demo data
            setDocs(demoDocs);
            setCategories([
                { name: "React Native", count: 1 },
                { name: "Architecture", count: 1 },
                { name: "React", count: 1 },
                { name: "Next.js", count: 1 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDocs();
    };

    const difficulties = ["beginner", "intermediate", "advanced"];

    const difficultyColors = {
        beginner: "bg-green-500/20 text-green-400",
        intermediate: "bg-yellow-500/20 text-yellow-400",
        advanced: "bg-red-500/20 text-red-400",
    };

    return (
        <div className="min-h-screen bg-[#0055FF] text-white py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
                        <BookOpen className="w-4 h-4" />
                        Premium Documentation
                    </div>
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="bg-[#0055FF] ">
                            Premium Docs
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Deep-dive technical documentation, architecture guides, and
                        production-ready blueprints
                    </p>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-6 mb-8"
                >
                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-3 items-center justify-center">
                        <button
                            onClick={() => setSelectedCategory("")}
                            className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${selectedCategory === ""
                                ? "bg-black text-white shadow-md"
                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                }`}
                        >
                            All Categories
                        </button>
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm flex items-center gap-2 ${selectedCategory === cat.name
                                        ? "bg-black text-white shadow-md"
                                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {cat.name}
                                    <span className="text-xs opacity-60">({cat.count})</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Difficulty Filter */}
                    <div className="flex items-center gap-4 justify-center">
                        <span className="text-gray-600 text-sm font-medium">Difficulty:</span>
                        {difficulties.map((diff) => (
                            <button
                                key={diff}
                                onClick={() =>
                                    setSelectedDifficulty(selectedDifficulty === diff ? "" : diff)
                                }
                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${selectedDifficulty === diff
                                    ? difficultyColors[diff]
                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                    }`}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Docs Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-gray-800/50 rounded-2xl p-6 animate-pulse"
                            >
                                <div className="h-40 bg-gray-700 rounded-xl mb-4" />
                                <div className="h-6 bg-gray-700 rounded mb-2 w-3/4" />
                                <div className="h-4 bg-gray-700 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {docs.map((doc, index) => (
                            <motion.div
                                key={doc._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    to={`/docs/${doc._id || doc.slug}`}
                                    className="block group"
                                >
                                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                                        {/* Thumbnail */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={
                                                    doc.thumbnail ||
                                                    "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=800"
                                                }
                                                alt={doc.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-[#0055FF] />

                                            {/* Badges */}
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                {doc.requires_subscription && (
                                                    <span className="px-3 py-1 bg-purple-500/80 backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1">
                                                        <Lock className="w-3 h-3" />
                                                        Pro
                                                    </span>
                                                )}
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${difficultyColors[doc.difficulty || "intermediate"]
                                                        }`}
                                                >
                                                    {doc.difficulty || "intermediate"}
                                                </span>
                                            </div>

                                            {/* Price */}
                                            <div className="absolute bottom-4 right-4">
                                                <span
                                                    className={`px-3 py-1 rounded-lg text-sm font-bold ${doc.price === 0
                                                        ? "bg-green-500/80 text-white"
                                                        : "bg-white/90 text-gray-900"
                                                        }`}
                                                >
                                                    {doc.price === 0 ? "Free" : `$${doc.price}`}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                                    {doc.category}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                                                {doc.title}
                                            </h3>

                                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                                {doc.description}
                                            </p>

                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {doc.reading_time_minutes || 10} min
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-4 h-4" />
                                                        {doc.views || 0}
                                                    </span>
                                                </div>
                                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && docs.length === 0 && (
                    <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">No documentation found</h3>
                        <p className="text-gray-400">
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Demo data for preview
const demoDocs = [
    {
        _id: "1",
        title: "Production-Grade React Native Boilerplate",
        description:
            "Complete guide to setting up a scalable React Native project with TypeScript, state management, navigation, and CI/CD.",
        category: "React Native",
        price: 29,
        thumbnail:
            "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
        reading_time_minutes: 45,
        difficulty: "advanced",
        requires_subscription: true,
        views: 1234,
    },
    {
        _id: "2",
        title: "Monorepo Architecture with Turborepo",
        description:
            "Learn how to structure and manage a monorepo for frontend and backend projects using Turborepo.",
        category: "Architecture",
        price: 0,
        thumbnail:
            "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
        reading_time_minutes: 30,
        difficulty: "intermediate",
        requires_subscription: false,
        views: 892,
    },
    {
        _id: "3",
        title: "Payment Integration Deep Dive",
        description:
            "Comprehensive guide to integrating Stripe and Razorpay with webhooks, subscriptions, and error handling.",
        category: "Payment Integration",
        price: 39,
        thumbnail:
            "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800",
        reading_time_minutes: 60,
        difficulty: "advanced",
        requires_subscription: true,
        views: 756,
    },
    {
        _id: "4",
        title: "FastAPI Authentication Handbook",
        description:
            "Complete authentication system with JWT, OAuth2, refresh tokens, and role-based access control.",
        category: "FastAPI",
        price: 19,
        thumbnail:
            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800",
        reading_time_minutes: 35,
        difficulty: "intermediate",
        requires_subscription: false,
        views: 543,
    },
    {
        _id: "5",
        title: "React Performance Optimization Blueprint",
        description:
            "Advanced techniques for optimizing React applications including code splitting, memoization, and profiling.",
        category: "React",
        price: 24,
        thumbnail:
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
        reading_time_minutes: 40,
        difficulty: "advanced",
        requires_subscription: false,
        views: 678,
    },
    {
        _id: "6",
        title: "Getting Started with Next.js 14",
        description:
            "Beginner-friendly guide to building modern web applications with Next.js App Router.",
        category: "Next.js",
        price: 0,
        thumbnail:
            "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800",
        reading_time_minutes: 20,
        difficulty: "beginner",
        requires_subscription: false,
        views: 2341,
    },
];

export default Docs;
