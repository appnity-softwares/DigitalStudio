import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Zap,
    Code,
    BarChart,
    Image,
    FileCode,
    Globe,
    ChevronRight,
    Check,
    Star,
    Users,
    Clock,
    Key,
} from "lucide-react";
import { getTools } from "../services/saasService";
import AuthContext from "../context/AuthContext";
import Pagination from "../components/ui/Pagination";

const Saas = () => {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchTools();
    }, [selectedCategory]);

    const fetchTools = async () => {
        setLoading(true);
        try {
            const response = await getTools(selectedCategory || null);
            // Defensive: getTools already returns array
            setTools(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error("Error fetching tools:", error);
            setTools(demoTools);
        } finally {
            setLoading(false);
        }
    };

    // Filter and paginate
    const filteredTools = selectedCategory
        ? tools.filter(t => t.category === selectedCategory)
        : tools;
    const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
    const paginatedTools = filteredTools.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset page on category change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    const categories = [
        { name: "Code Utilities", icon: Code },
        { name: "API Services", icon: Globe },
        { name: "AI Tools", icon: Zap },
        { name: "Analytics", icon: BarChart },
        { name: "Generation", icon: FileCode },
    ];

    const categoryIcons = {
        "Code Utilities": Code,
        "API Services": Globe,
        "AI Tools": Zap,
        Analytics: BarChart,
        Generation: FileCode,
        Conversion: Image,
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7]">
            {/* Header */}
            <div className="w-full bg-[#F5F5F7] py-16 px-6 pt-28">
                <div className="max-w-[1400px] mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black tracking-tight leading-[0.9] mb-6">
                        Developer{' '}
                        <span className="bg-[#0055FF] ">
                            APIs & Tools
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Powerful APIs and SaaS tools to accelerate your developments.
                        Generate API keys and integrate in minutes.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto px-6 pb-12">
                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap gap-3 mb-8 justify-center"
                >
                    <button
                        onClick={() => setSelectedCategory("")}
                        className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${selectedCategory === ""
                            ? "bg-black text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                    >
                        <Zap className="w-5 h-5" />
                        All Tools
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
                                <Icon className="w-5 h-5" />
                                {cat.name}
                            </button>
                        );
                    })}
                </motion.div>

                {/* Tools Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-gray-800/50 rounded-2xl p-6 animate-pulse"
                            >
                                <div className="w-16 h-16 bg-gray-700 rounded-2xl mb-4" />
                                <div className="h-6 bg-gray-700 rounded mb-2 w-3/4" />
                                <div className="h-4 bg-gray-700 rounded w-full mb-4" />
                                <div className="h-10 bg-gray-700 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedTools.map((tool, index) => {
                                const Icon = categoryIcons[tool.category] || Zap;
                                return (
                                    <motion.div
                                        key={tool._id || tool.id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            to={`/saas/${tool._id || tool.id || tool.slug}`}
                                            className="block group"
                                        >
                                            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#0055FF] transition-all hover:shadow-lg h-full">
                                                {/* Icon & Status */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="p-4 bg-[#0055FF] rounded-2xl">
                                                        <Icon className="w-8 h-8 text-[#0055FF]" />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {tool.is_beta && (
                                                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                                                                Beta
                                                            </span>
                                                        )}
                                                        <span
                                                            className={`w-2 h-2 rounded-full ${tool.is_active !== false ? "bg-green-400" : "bg-gray-500"
                                                                }`}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <h3 className="text-xl font-bold mb-2 text-black group-hover:text-[#0055FF] transition-colors">
                                                    {tool.name}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {tool.description}
                                                </p>

                                                {/* Stats */}
                                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        {tool.activeUsers || tool.active_users || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {tool.avg_response_time_ms || 100}ms
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-yellow-400" />
                                                        {tool.uptime_percentage || 99.9}%
                                                    </span>
                                                </div>

                                                {/* Pricing */}
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                                    <div>
                                                        <span className="text-2xl font-bold text-green-400">
                                                            {tool.monthlyPrice > 0 ? `$${tool.monthlyPrice}` : 'Free'}
                                                        </span>
                                                        <span className="text-gray-500 text-sm ml-1">
                                                            /{tool.requestsPerMonth || tool.pricing?.free_tier?.requests_per_month || 100}{" "}
                                                            req/mo
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-purple-400 group-hover:translate-x-1 transition-transform">
                                                        View Details
                                                        <ChevronRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        <div className="mt-12">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                totalItems={filteredTools.length}
                                itemsPerPage={itemsPerPage}
                            />
                        </div>
                    </div>
                )}

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-20 text-center"
                >
                    <div className="bg-[#0055FF] rounded-3xl p-12 border border-purple-500/20">
                        <Key className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Start Building?
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Generate your API key and integrate our tools into your projects
                            within minutes. Free tier available for all tools.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to={user ? "/profile" : "/register"}
                                className="px-8 py-4 bg-[#0055FF] rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                            >
                                {user ? "Manage API Keys" : "Get Started Free"}
                            </Link>
                            <Link
                                to="/docs"
                                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors"
                            >
                                View Documentation
                            </Link>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap justify-center gap-8 mt-10 text-sm text-gray-400">
                            {[
                                "No credit card required",
                                "Free tier forever",
                                "99.9% uptime SLA",
                                "24/7 support",
                            ].map((feature, i) => (
                                <span key={i} className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-400" />
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Demo data
const demoTools = [
    {
        _id: "1",
        name: "Code Snippet Manager API",
        slug: "code-snippet-manager",
        description:
            "Store, organize, and retrieve code snippets with syntax highlighting and tags support.",
        category: "Code Utilities",
        is_active: true,
        is_beta: false,
        active_users: 1234,
        avg_response_time_ms: 45,
        uptime_percentage: 99.9,
        pricing: {
            free_tier: { requests_per_month: 1000 },
            pro_tier: { requests_per_month: 50000, price_monthly: 9.99 },
        },
    },
    {
        _id: "2",
        name: "UI Code Generator",
        slug: "ui-code-generator",
        description:
            "AI-powered tool to generate React, Vue, or HTML components from natural language descriptions.",
        category: "AI Tools",
        is_active: true,
        is_beta: true,
        active_users: 567,
        avg_response_time_ms: 2000,
        uptime_percentage: 99.5,
        pricing: {
            free_tier: { requests_per_month: 50 },
            pro_tier: { requests_per_month: 1000, price_monthly: 19.99 },
        },
    },
    {
        _id: "3",
        name: "OTP & SMS API",
        slug: "otp-sms-api",
        description:
            "Send OTPs and SMS messages worldwide with delivery tracking and verification endpoints.",
        category: "API Services",
        is_active: true,
        is_beta: false,
        active_users: 2341,
        avg_response_time_ms: 120,
        uptime_percentage: 99.99,
        pricing: {
            free_tier: { requests_per_month: 100 },
            pro_tier: { requests_per_month: 10000, price_monthly: 14.99 },
        },
    },
    {
        _id: "4",
        name: "App Analytics SDK",
        slug: "app-analytics",
        description:
            "Lightweight analytics for mobile and web apps. Track events, sessions, and user behavior.",
        category: "Analytics",
        is_active: true,
        is_beta: false,
        active_users: 892,
        avg_response_time_ms: 30,
        uptime_percentage: 99.9,
        pricing: {
            free_tier: { requests_per_month: 10000 },
            pro_tier: { requests_per_month: 1000000, price_monthly: 29.99 },
        },
    },
    {
        _id: "5",
        name: "Boilerplate Generator",
        slug: "boilerplate-generator",
        description:
            "One-click project scaffolding for React, Next.js, Node.js, and more. Customizable templates.",
        category: "Generation",
        is_active: true,
        is_beta: true,
        active_users: 456,
        avg_response_time_ms: 3000,
        uptime_percentage: 99.0,
        pricing: {
            free_tier: { requests_per_month: 20 },
            pro_tier: { requests_per_month: 200, price_monthly: 9.99 },
        },
    },
    {
        _id: "6",
        name: "Component Converter",
        slug: "component-converter",
        description:
            "Convert components between React, Vue, Svelte, and Angular. Preserve styling and logic.",
        category: "Conversion",
        is_active: true,
        is_beta: false,
        active_users: 678,
        avg_response_time_ms: 800,
        uptime_percentage: 99.7,
        pricing: {
            free_tier: { requests_per_month: 50 },
            pro_tier: { requests_per_month: 500, price_monthly: 12.99 },
        },
    },
];

export default Saas;
