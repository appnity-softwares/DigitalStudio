import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Smartphone,
    Code,
    Zap,
    BookOpen,
    ArrowRight,
    Check,
    Layers,
    BarChart2,
    Bell,
    Shield,
    Rocket,
    Github,
    Star,
} from "lucide-react";

const DeveloperHub = () => {
    const features = [
        {
            icon: Smartphone,
            title: "Mobile Templates",
            description: "Production-ready React Native & Flutter templates with authentication, navigation, and more.",
            link: "/templates?category=Mobile%20App",
            color: "from-blue-500 to-cyan-500",
        },
        {
            icon: Zap,
            title: "SaaS APIs",
            description: "Ready-to-integrate APIs for OTP, analytics, push notifications, and more.",
            link: "/saas",
            color: "from-purple-500 to-pink-500",
        },
        {
            icon: BookOpen,
            title: "Premium Docs",
            description: "Deep-dive technical documentation and architecture guides.",
            link: "/docs",
            color: "from-orange-500 to-red-500",
        },
        {
            icon: Layers,
            title: "Backend Starters",
            description: "Node.js, FastAPI, and NestJS boilerplates with auth and database setup.",
            link: "/templates?category=Full-Stack%20Project",
            color: "from-green-500 to-emerald-500",
        },
    ];

    const mobileTemplates = [
        {
            title: "React Native Starter Pro",
            description: "TypeScript, Redux, Navigation, Auth ready",
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400",
            price: "$99",
            rating: 4.9,
            reviews: 47,
        },
        {
            title: "Flutter E-Commerce App",
            description: "Complete shopping app with payment integration",
            image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=400",
            price: "$149",
            rating: 4.8,
            reviews: 32,
        },
        {
            title: "Social Media App Kit",
            description: "Posts, stories, messaging, notifications",
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400",
            price: "$129",
            rating: 4.7,
            reviews: 28,
        },
    ];

    const tools = [
        {
            icon: Bell,
            title: "Push Notification API",
            description: "Send push notifications to iOS & Android",
            status: "Available",
        },
        {
            icon: BarChart2,
            title: "Analytics SDK",
            description: "Track user behavior and events",
            status: "Available",
        },
        {
            icon: Shield,
            title: "Auth API",
            description: "JWT, OAuth, 2FA authentication",
            status: "Available",
        },
        {
            icon: Rocket,
            title: "CI/CD Templates",
            description: "GitHub Actions for mobile apps",
            status: "Coming Soon",
        },
    ];

    const resources = [
        {
            title: "React Native Performance Guide",
            category: "Documentation",
            reading_time: "25 min",
        },
        {
            title: "Flutter State Management Deep Dive",
            category: "Documentation",
            reading_time: "30 min",
        },
        {
            title: "Mobile App Architecture Patterns",
            category: "Guide",
            reading_time: "40 min",
        },
        {
            title: "Publishing to App Store & Play Store",
            category: "Tutorial",
            reading_time: "20 min",
        },
    ];

    return (
        <div className="min-h-screen bg-[#F5F5F7]">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-5" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px]" />

                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-[#0055FF] text-sm mb-6">
                            <Smartphone className="w-4 h-4" />
                            For App Developers
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="bg-[#0055FF] ">
                                Developer Hub
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                            Everything you need to build, ship, and scale mobile and web applications.
                            Templates, APIs, documentation, and tools.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/templates"
                                className="px-8 py-4 bg-[#0055FF] rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2"
                            >
                                Browse Templates
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/saas"
                                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors flex items-center gap-2"
                            >
                                <Zap className="w-5 h-5" />
                                Explore APIs
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        to={feature.link}
                                        className="block h-full p-6 bg-white shadow-sm rounded-2xl border border-gray-200 hover:border-gray-600 transition-all hover:shadow-lg group"
                                    >
                                        <div className="inline-block p-3 rounded-xl bg-[#0055FF] mb-4">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-[#0055FF] transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">{feature.description}</p>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Mobile Templates Section */}
            <section className="py-20 bg-gray-100/30">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Mobile App Templates</h2>
                            <p className="text-gray-600">
                                Production-ready React Native & Flutter templates
                            </p>
                        </div>
                        <Link
                            to="/templates?category=Mobile%20App"
                            className="hidden md:flex items-center gap-2 text-[#0055FF] hover:text-blue-300 transition-colors"
                        >
                            View All
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {mobileTemplates.map((template, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="bg-gray-100/50 rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-500/50 transition-all">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={template.image}
                                            alt={template.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1 bg-white/90 text-gray-900 rounded-lg text-sm font-bold">
                                                {template.price}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">{template.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {template.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span>{template.rating}</span>
                                            <span>•</span>
                                            <span>{template.reviews} reviews</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Developer Tools */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Developer Tools & APIs</h2>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            Integrate powerful APIs into your applications with just a few lines of code
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tools.map((tool, index) => {
                            const Icon = tool.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 bg-gray-100/50 rounded-2xl border border-gray-200"
                                >
                                    <Icon className="w-10 h-10 text-purple-400 mb-4" />
                                    <h3 className="text-lg font-bold mb-2">{tool.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${tool.status === "Available"
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-yellow-500/20 text-yellow-400"
                                            }`}
                                    >
                                        {tool.status}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="text-center mt-10">
                        <Link
                            to="/saas"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-colors"
                        >
                            View All APIs
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Resources */}
            <section className="py-20 bg-gray-100/30">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Learning Resources</h2>
                            <p className="text-gray-600">
                                Guides and documentation to level up your skills
                            </p>
                        </div>
                        <Link
                            to="/docs"
                            className="hidden md:flex items-center gap-2 text-[#0055FF] hover:text-blue-300 transition-colors"
                        >
                            Browse All Docs
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {resources.map((resource, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to="/docs"
                                    className="flex items-center justify-between p-6 bg-gray-100/50 rounded-xl border border-gray-200 hover:border-blue-500/50 transition-all"
                                >
                                    <div>
                                        <span className="text-xs text-[#0055FF] mb-1 block">
                                            {resource.category}
                                        </span>
                                        <h3 className="font-semibold">{resource.title}</h3>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {resource.reading_time}
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#0055FF] rounded-3xl p-12 border border-gray-200"
                    >
                        <Github className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Start Building Today</h2>
                        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                            Get instant access to templates, APIs, and documentation.
                            Join thousands of developers building amazing apps.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/register"
                                className="px-8 py-4 bg-[#0055FF] rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                            >
                                Create Free Account
                            </Link>
                            <Link
                                to="/templates"
                                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors"
                            >
                                Browse Templates
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default DeveloperHub;
