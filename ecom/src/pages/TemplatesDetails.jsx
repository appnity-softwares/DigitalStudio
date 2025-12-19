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
        <div className="bg-[#F5F5F7] py-20 border-t border-gray-200/50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-[#0055FF] text-sm mb-6 font-semibold">
                        <Zap className="w-4 h-4" />
                        Ecosystem Resources
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight mb-4">
                        Power Up Your Project
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">
                        This template connects seamlessly with our Premium Docs and Developer APIs
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Related Documentation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white shadow-sm rounded-[2rem] p-8 border border-gray-100 flex flex-col h-full"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-purple-50 rounded-2xl">
                                <BookOpen className="w-8 h-8 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-black">Premium Docs</h3>
                                <p className="text-gray-500 font-medium">Deep-dive documentation</p>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            {relatedDocs.map((doc, index) => (
                                <Link
                                    key={index}
                                    to={`/docs/${doc.slug}`}
                                    className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group border border-gray-100 hover:border-purple-200"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                                            <doc.icon className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-black group-hover:text-purple-600 transition-colors">
                                                    {doc.title}
                                                </h4>
                                                {doc.isPro && (
                                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                                        Pro
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium mt-1">{doc.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link
                            to="/docs"
                            className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-black hover:bg-gray-800 text-white rounded-xl transition-all font-bold shadow-lg shadow-black/10"
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
                        className="bg-white shadow-sm rounded-[2rem] p-8 border border-gray-100 flex flex-col h-full"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-blue-50 rounded-2xl">
                                <Code className="w-8 h-8 text-[#0055FF]" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-black">Developer APIs</h3>
                                <p className="text-gray-500 font-medium">Supercharge your project</p>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            {relatedTools.map((tool, index) => (
                                <Link
                                    key={index}
                                    to={`/saas`}
                                    className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group border border-gray-100 hover:border-blue-200"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-xl">
                                            {tool.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-black group-hover:text-[#0055FF] transition-colors">
                                                    {tool.name}
                                                </h4>
                                                {tool.isFree && (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                                        Free
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium mt-1">{tool.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0055FF] group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link
                            to="/saas"
                            className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-[#0055FF] hover:bg-blue-600 text-white rounded-xl transition-all font-bold shadow-lg shadow-blue-500/20"
                        >
                            <Code className="w-4 h-4" />
                            Explore All APIs
                        </Link>
                    </motion.div>
                </div>

                {/* CTA Banner - Premium White Card Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 bg-white rounded-[2.5rem] p-12 border border-blue-100 shadow-xl shadow-blue-500/5 relative overflow-hidden text-center"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-yellow-100">
                            <Star className="w-4 h-4 fill-current" />
                            Pro Subscription
                        </div>

                        <h3 className="text-3xl md:text-4xl font-black text-black mb-4 tracking-tight">
                            Unlock Everything with Pro
                        </h3>
                        <p className="text-gray-500 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
                            Get unlimited access to all templates, premium docs, SaaS APIs, and priority support.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link
                                to="/app-developers"
                                className="px-8 py-4 bg-[#0055FF] text-white rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all hover:-translate-y-1"
                            >
                                View Pro Plans
                            </Link>
                            <Link
                                to="/app-developers"
                                className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-all"
                            >
                                Learn More
                            </Link>
                        </div>
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