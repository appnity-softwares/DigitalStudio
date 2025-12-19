import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    BookOpen,
    Clock,
    Eye,
    Download,
    ShoppingCart,
    Lock,
    Check,
    ChevronLeft,
    Share2,
    Bookmark,
    List,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDocById } from "../services/docsService";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const DocDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const { showToast } = useToast();

    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [showToc, setShowToc] = useState(true);

    useEffect(() => {
        fetchDoc();
    }, [id]);

    const fetchDoc = async () => {
        setLoading(true);
        try {
            const response = await getDocById(id);
            setDoc(response.doc);
            setHasAccess(response.has_access);
        } catch (error) {
            console.error("Error fetching doc:", error);
            // Demo data
            setDoc(demoDoc);
            setHasAccess(false);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = () => {
        if (!user) {
            showToast("Please login to purchase", "error");
            navigate("/login");
            return;
        }

        addToCart({
            _id: doc._id,
            title: doc.title,
            price: `$${doc.price}`,
            image: doc.thumbnail,
            category: "Premium Doc",
            type: "doc",
        });

        showToast("Added to cart!", "success");
        navigate("/checkout");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!doc) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Document not found</h2>
                    <Link to="/docs" className="text-[#0055FF] hover:underline">
                        Back to Docs
                    </Link>
                </div>
            </div>
        );
    }

    const difficultyColors = {
        beginner: "bg-green-500/20 text-green-400",
        intermediate: "bg-yellow-500/20 text-yellow-400",
        advanced: "bg-red-500/20 text-red-400",
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7]">
            {/* Header */}
            <div className="bg-gray-100/50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate("/docs")}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="px-3 py-1 bg-blue-500/20 text-[#0055FF] rounded-lg text-sm">
                            {doc.category}
                        </span>
                        <span
                            className={`px-3 py-1 rounded-lg text-sm capitalize ${difficultyColors[doc.difficulty || "intermediate"]
                                }`}
                        >
                            {doc.difficulty}
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold mb-4">{doc.title}</h1>

                    <p className="text-xl text-gray-600 mb-6 max-w-3xl">
                        {doc.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <img
                                src={doc.author?.avatar || "https://via.placeholder.com/32"}
                                alt="Author"
                                className="w-8 h-8 rounded-full"
                            />
                            <span>{doc.author?.name || "CodeStudio"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {doc.reading_time_minutes} min read
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {doc.views} views
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* TOC Sidebar */}
                    {doc.table_of_contents?.length > 0 && showToc && (
                        <motion.aside
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="hidden lg:block w-64 flex-shrink-0"
                        >
                            <div className="sticky top-24 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-900 uppercase tracking-wide">
                                    <List className="w-4 h-4" />
                                    Table of Contents
                                </div>
                                <nav className="space-y-3">
                                    {doc.table_of_contents.map((item, index) => (
                                        <a
                                            key={index}
                                            href={`#${item.anchor}`}
                                            className={`block text-sm transition-colors ${item.level === 1
                                                ? "text-gray-900 font-medium hover:text-[#0055FF]"
                                                : "text-gray-500 pl-4 hover:text-gray-900"
                                                }`}
                                        >
                                            {item.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </motion.aside>
                    )}

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {hasAccess ? (
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="prose prose-zinc prose-lg max-w-none"
                            >
                                <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-200 shadow-sm">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({ children }) => <h1 className="text-4xl font-black text-gray-900 mb-6 mt-8 tracking-tight">{children}</h1>,
                                            h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{children}</h2>,
                                            h3: ({ children }) => <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">{children}</h3>,
                                            p: ({ children }) => <p className="text-gray-600 mb-6 leading-relaxed bg-transparent">{children}</p>,
                                            ul: ({ children }) => <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal list-inside text-gray-600 mb-6 space-y-2">{children}</ol>,
                                            li: ({ children }) => <li className="text-gray-600">{children}</li>,
                                            code: ({ inline, children }) => inline
                                                ? <code className="bg-gray-100 text-[#0055FF] px-1.5 py-0.5 rounded text-sm font-semibold">{children}</code>
                                                : <code className="block bg-gray-900 p-6 rounded-2xl overflow-x-auto text-sm text-gray-300 font-mono my-6 shadow-lg">{children}</code>,
                                            pre: ({ children }) => <pre className="bg-transparent p-0 mb-6">{children}</pre>,
                                            blockquote: ({ children }) => <blockquote className="border-l-4 border-[#0055FF] pl-6 italic text-gray-700 my-8 bg-blue-50/50 py-4 pr-4 rounded-r-xl">{children}</blockquote>,
                                            a: ({ href, children }) => <a href={href} className="text-[#0055FF] hover:text-blue-700 underline font-medium">{children}</a>,
                                            strong: ({ children }) => <strong className="text-gray-900 font-bold">{children}</strong>,
                                            table: ({ children }) => <div className="overflow-x-auto mb-8 rounded-xl border border-gray-200"><table className="min-w-full">{children}</table></div>,
                                            th: ({ children }) => <th className="bg-gray-50 border-b border-gray-200 px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{children}</th>,
                                            td: ({ children }) => <td className="border-b border-gray-100 px-6 py-4 text-gray-600 text-sm">{children}</td>,
                                        }}
                                    >
                                        {doc.content_md || doc.content || ""}
                                    </ReactMarkdown>
                                </div>

                                {/* Download PDF */}
                                {doc.pdf_url && (
                                    <div className="mt-8 p-8 bg-black rounded-[2rem] shadow-xl text-white overflow-hidden relative group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 rounded-full blur-[100px] opacity-50 group-hover:opacity-70 transition-opacity"></div>
                                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                            <div>
                                                <h3 className="text-xl font-bold mb-2 text-white">
                                                    Download PDF Version
                                                </h3>
                                                <p className="text-gray-400 text-sm">
                                                    Get the complete offline guide with all resources.
                                                </p>
                                            </div>
                                            <a
                                                href={doc.pdf_url}
                                                className="flex items-center gap-2 px-8 py-4 bg-white text-black hover:bg-gray-100 rounded-full font-bold transition-all transform hover:scale-105"
                                            >
                                                <Download className="w-5 h-5" />
                                                Download PDF
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </motion.article>
                        ) : (
                            /* Paywall / Preview */
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {/* Preview Content */}
                                <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-200 mb-8 shadow-sm">
                                    <div
                                        className="prose prose-zinc prose-lg max-w-none opacity-50 select-none pointer-events-none blur-[2px]"
                                        dangerouslySetInnerHTML={{
                                            __html: (doc.content_md?.slice(0, 1000) || "") + "...",
                                        }}
                                    />
                                </div>

                                {/* Blur Overlay with CTA */}
                                <div className="relative -mt-64 z-10">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5F7] via-[#F5F5F7]/95 to-transparent h-32 -top-32"></div>
                                    <div className="text-center py-16 bg-[#F5F5F7]">
                                        <div className="inline-block p-4 bg-white shadow-lg rounded-full mb-6 animate-bounce">
                                            <Lock className="w-8 h-8 text-[#0055FF]" />
                                        </div>
                                        <h2 className="text-3xl font-black mb-4 text-gray-900">
                                            Unlock Full Documentation
                                        </h2>
                                        <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                                            Get instant access to this complete guide including code
                                            examples, best practices, and downloadable resources.
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <button
                                                onClick={handlePurchase}
                                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0055FF] text-white rounded-full font-bold hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                                Purchase for ${doc.price}
                                            </button>

                                            {doc.requires_subscription && (
                                                <Link
                                                    to="/pricing"
                                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black border border-gray-200 hover:bg-gray-50 rounded-full font-bold transition-colors"
                                                >
                                                    Or Subscribe to Pro
                                                </Link>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-center gap-8 mt-10 text-sm text-gray-500 font-medium">
                                            {[
                                                "Lifetime access",
                                                "Free updates",
                                                "Money-back guarantee",
                                            ].map((feature, i) => (
                                                <span key={i} className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-green-600" />
                                                    </div>
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Related Docs */}
                        {doc.related_docs?.length > 0 && (
                            <div className="mt-20">
                                <h3 className="text-2xl font-bold mb-8 text-gray-900">Related Documentation</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {doc.related_docs.map((relDoc) => (
                                        <Link
                                            key={relDoc._id}
                                            to={`/docs/${relDoc._id}`}
                                            className="flex gap-6 p-6 bg-white rounded-[2rem] border border-gray-200 hover:border-[#0055FF]/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
                                        >
                                            <img
                                                src={relDoc.thumbnail}
                                                alt={relDoc.title}
                                                className="w-24 h-24 object-cover rounded-2xl shadow-sm group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div>
                                                <h4 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-[#0055FF] transition-colors leading-tight">
                                                    {relDoc.title}
                                                </h4>
                                                <p className="text-sm text-gray-500">{relDoc.slug}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Right Sidebar - Purchase Card */}
                    <aside className="hidden xl:block w-80 flex-shrink-0">
                        <div className="sticky top-24 bg-white rounded-[2rem] p-8 border border-gray-200 shadow-lg shadow-gray-200/50">
                            <div className="text-center mb-8">
                                <div className="text-4xl font-black mb-2 text-gray-900">
                                    {doc.price === 0 ? (
                                        <span className="text-[#00C853]">Free</span>
                                    ) : (
                                        <span>${doc.discount_price || doc.price}</span>
                                    )}
                                </div>
                                {doc.discount_price && doc.discount_price < doc.price && (
                                    <span className="text-gray-400 line-through font-medium">
                                        ${doc.price}
                                    </span>
                                )}
                            </div>

                            {!hasAccess && doc.price > 0 && (
                                <button
                                    onClick={handlePurchase}
                                    className="w-full py-4 bg-[#0055FF] text-white rounded-full font-bold hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all mb-4 transform hover:-translate-y-1"
                                >
                                    Purchase Now
                                </button>
                            )}

                            <div className="flex gap-3 mb-8">
                                <button className="flex-1 py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-semibold text-gray-700">
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>
                                <button className="flex-1 py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-semibold text-gray-700">
                                    <Bookmark className="w-4 h-4" />
                                    Save
                                </button>
                            </div>

                            <div className="space-y-4 text-sm border-t border-gray-100 pt-6">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Reading time</span>
                                    <span className="text-gray-900">{doc.reading_time_minutes} minutes</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Difficulty</span>
                                    <span className="capitalize text-gray-900">{doc.difficulty}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Updated</span>
                                    <span className="text-gray-900">
                                        {new Date(doc.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

// Demo data
const demoDoc = {
    _id: "1",
    title: "Production-Grade React Native Boilerplate",
    description:
        "Complete guide to setting up a scalable React Native project with TypeScript, state management, navigation, and CI/CD.",
    content_md: `# Getting Started

This is a preview of the documentation. The full content includes:

## What You'll Learn

- Project structure best practices
- TypeScript configuration
- Navigation setup with React Navigation
- State management with Redux Toolkit
- API integration with React Query
- Testing strategies
- CI/CD pipeline configuration

## Prerequisites

Before starting, make sure you have:

1. Node.js 18+
2. React Native CLI
3. Xcode (for iOS)
4. Android Studio (for Android)

*This is a preview. Purchase to see the full content.*`,
    category: "React Native",
    price: 29,
    thumbnail:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    reading_time_minutes: 45,
    difficulty: "advanced",
    requires_subscription: true,
    views: 1234,
    author: {
        name: "CodeStudio Team",
        avatar: "https://via.placeholder.com/32",
    },
    table_of_contents: [
        { title: "Getting Started", anchor: "getting-started", level: 1 },
        { title: "What You'll Learn", anchor: "what-youll-learn", level: 2 },
        { title: "Prerequisites", anchor: "prerequisites", level: 2 },
        { title: "Project Setup", anchor: "project-setup", level: 1 },
        { title: "Configuration", anchor: "configuration", level: 1 },
    ],
    related_docs: [],
    createdAt: new Date().toISOString(),
};

export default DocDetail;
