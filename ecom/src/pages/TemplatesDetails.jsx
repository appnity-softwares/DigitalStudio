import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Zap,
    Code,
    ExternalLink,
    ChevronRight,
    Star,
    Package,
    FileText
} from 'lucide-react';
import ProductHeader from '../components/ProductHeader';
import TemplateCarousel from '../components/TemplateCarousel';
import TemplateDetails from '../components/TemplateDetails';
import { templates } from '../data/templates';
import productService from '../services/productService';

// Ecosystem Links Component
const EcosystemSection = ({ product }) => {
    // Map product categories to related resources
    const relatedDocs = [
        {
            title: 'Architecture & Setup Guide',
            description: 'Learn best practices for setting up this template',
            slug: 'react-native-architecture',
            icon: BookOpen,
            isPro: false
        },
        {
            title: 'Payment Integration Handbook',
            description: 'Add Stripe or Razorpay to your project',
            slug: 'saas-payment-integration',
            icon: FileText,
            isPro: true
        }
    ];

    const relatedTools = [
        {
            name: 'ImageOptimizer API',
            description: 'Compress & optimize images automatically',
            slug: 'image-optimizer',
            icon: '🖼️',
            isFree: true
        },
        {
            name: 'CodeFormatter API',
            description: 'Format code in 20+ languages',
            slug: 'code-formatter',
            icon: '✨',
            isFree: true
        }
    ];

    return (
        <div className="bg-[#0055FF] py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-[#0055FF] text-sm mb-6">
                        <Zap className="w-4 h-4" />
                        Ecosystem Resources
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Power Up Your Project
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        This template connects seamlessly with our Premium Docs and Developer APIs
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Related Documentation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <BookOpen className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Premium Docs</h3>
                                <p className="text-gray-600 text-sm">Deep-dive documentation for this template</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {relatedDocs.map((doc, index) => (
                                <Link
                                    key={index}
                                    to={`/docs/${doc.slug}`}
                                    className="block p-4 bg-gray-100 rounded-xl hover:bg-gray-700/50 transition-colors group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-gray-700 rounded-lg">
                                            <doc.icon className="w-5 h-5 text-gray-300" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                                                    {doc.title}
                                                </h4>
                                                {doc.isPro && (
                                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                                                        Pro
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{doc.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link
                            to="/docs"
                            className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-semibold"
                        >
                            <BookOpen className="w-4 h-4" />
                            Explore All Docs
                        </Link>
                    </motion.div>

                    {/* Developer APIs / SaaS Tools */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <Code className="w-6 h-6 text-[#0055FF]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Developer APIs</h3>
                                <p className="text-gray-600 text-sm">Supercharge your project with our APIs</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {relatedTools.map((tool, index) => (
                                <Link
                                    key={index}
                                    to={`/saas`}
                                    className="block p-4 bg-gray-100 rounded-xl hover:bg-gray-700/50 transition-colors group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-gray-700 rounded-lg text-2xl">
                                            {tool.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-white group-hover:text-[#0055FF] transition-colors">
                                                    {tool.name}
                                                </h4>
                                                {tool.isFree && (
                                                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                                        Free Tier
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{tool.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#0055FF] group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link
                            to="/saas"
                            className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-semibold"
                        >
                            <Code className="w-4 h-4" />
                            Explore All APIs
                        </Link>
                    </motion.div>
                </div>

                {/* CTA Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 bg-[#0055FF] rounded-2xl p-8 border border-blue-500/20 text-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Star className="w-6 h-6 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold">Pro Subscription</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                        Unlock Everything with Pro
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                        Get unlimited access to all templates, premium docs, SaaS APIs, and priority support
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link
                            to="/app-developers"
                            className="px-6 py-3 bg-[#0055FF] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                        >
                            View Pro Plans
                        </Link>
                        <Link
                            to="/app-developers"
                            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Learn More
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const TemplatesDetailsPage = () => {
    const { id } = useParams();
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchProduct = async () => {
            try {
                // Try fetching from API first
                const data = await productService.getById(id);
                if (data) {
                    setTemplate(data);
                } else {
                    // Fallback to static data
                    const fallback = templates.find(t => t.id === Number(id) || t.id === id);
                    setTemplate(fallback);
                }
            } catch (err) {
                // Fallback to static data
                const fallback = templates.find(t => t.id === Number(id) || t.id === id);
                setTemplate(fallback);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!template) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7]">
                <Package className="w-16 h-16 text-gray-600 mb-4" />
                <h2 className="text-3xl font-bold mb-4">Product not found</h2>
                <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
                <Link to="/templates" className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors">
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div>
            <ProductHeader product={template} />
            <TemplateCarousel />
            <TemplateDetails
                description={template.longDescription || template.description}
                features={template.features}
                pages={template.pages}
            />
            {/* Ecosystem Section - connects to Docs, SaaS, APIs */}
            <EcosystemSection product={template} />
        </div>
    );
}

export default TemplatesDetailsPage;