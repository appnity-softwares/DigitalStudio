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
                            <div className="sticky top-24 bg-gray-100/50 rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-600">
                                    <List className="w-4 h-4" />
                                    Table of Contents
                                </div>
                                <nav className="space-y-2">
                                    {doc.table_of_contents.map((item, index) => (
                                        <a
                                            key={index}
                                            href={`#${item.anchor}`}
                                            className={`block text-sm hover:text-[#0055FF] transition-colors ${item.level === 1
                                                ? "text-gray-300"
                                                : "text-gray-500 pl-4"
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
                                className="prose prose-invert prose-lg max-w-none"
                            >
                                <div className="bg-gray-100/30 rounded-2xl p-8 border border-gray-200">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-4 mt-6">{children}</h1>,
                                            h2: ({ children }) => <h2 className="text-2xl font-bold text-white mb-3 mt-6">{children}</h2>,
                                            h3: ({ children }) => <h3 className="text-xl font-bold text-white mb-2 mt-4">{children}</h3>,
                                            p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
                                            ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">{children}</ol>,
                                            li: ({ children }) => <li className="text-gray-300">{children}</li>,
                                            code: ({ inline, children }) => inline
                                                ? <code className="bg-gray-700 text-blue-300 px-1.5 py-0.5 rounded text-sm">{children}</code>
                                                : <code className="block bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-300">{children}</code>,
                                            pre: ({ children }) => <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                                            blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">{children}</blockquote>,
                                            a: ({ href, children }) => <a href={href} className="text-[#0055FF] hover:text-blue-300 underline">{children}</a>,
                                            strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                                            table: ({ children }) => <div className="overflow-x-auto mb-4"><table className="min-w-full border border-gray-200">{children}</table></div>,
                                            th: ({ children }) => <th className="bg-gray-100 border border-gray-200 px-4 py-2 text-left text-white">{children}</th>,
                                            td: ({ children }) => <td className="border border-gray-200 px-4 py-2 text-gray-300">{children}</td>,
                                        }}
                                    >
                                        {doc.content_md || doc.content || ""}
                                    </ReactMarkdown>
                                </div>

                                {/* Download PDF */}
                                {doc.pdf_url && (
                                    <div className="mt-8 p-6 bg-[#0055FF] rounded-xl border border-blue-500/20">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-1">
                                                    Download PDF Version
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    Take this guide offline
                                                </p>
                                            </div>
                                            <a
                                                href={doc.pdf_url}
                                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors"
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
                                <div className="bg-gray-100/30 rounded-2xl p-8 border border-gray-200 mb-8">
                                    <div
                                        className="prose prose-invert prose-lg max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: doc.content_md?.replace(/\n/g, "<br />") || "",
                                        }}
                                    />
                                </div>

                                {/* Blur Overlay with CTA */}
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[#0055FF] ">
                                    <div className="relative z-10 text-center py-16">
                                        <div className="inline-block p-4 bg-gray-100/80 rounded-full mb-6">
                                            <Lock className="w-10 h-10 text-[#0055FF]" />
                                        </div>
                                        <h2 className="text-3xl font-bold mb-4">
                                            Unlock Full Documentation
                                        </h2>
                                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                            Get instant access to this complete guide including code
                                            examples, best practices, and downloadable resources.
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <button
                                                onClick={handlePurchase}
                                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0055FF] rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                                Purchase for ${doc.price}
                                            </button>

                                            {doc.requires_subscription && (
                                                <Link
                                                    to="/pricing"
                                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors"
                                                >
                                                    Or Subscribe to Pro
                                                </Link>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-600">
                                            {[
                                                "Lifetime access",
                                                "Free updates",
                                                "Money-back guarantee",
                                            ].map((feature, i) => (
                                                <span key={i} className="flex items-center gap-1">
                                                    <Check className="w-4 h-4 text-green-400" />
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
                            <div className="mt-12">
                                <h3 className="text-2xl font-bold mb-6">Related Documentation</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {doc.related_docs.map((relDoc) => (
                                        <Link
                                            key={relDoc._id}
                                            to={`/docs/${relDoc._id}`}
                                            className="flex gap-4 p-4 bg-gray-100/50 rounded-xl border border-gray-200 hover:border-blue-500/50 transition-colors"
                                        >
                                            <img
                                                src={relDoc.thumbnail}
                                                alt={relDoc.title}
                                                className="w-20 h-16 object-cover rounded-lg"
                                            />
                                            <div>
                                                <h4 className="font-semibold hover:text-[#0055FF] transition-colors">
                                                    {relDoc.title}
                                                </h4>
                                                <p className="text-sm text-gray-600">{relDoc.slug}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Right Sidebar - Purchase Card */}
                    <aside className="hidden xl:block w-80 flex-shrink-0">
                        <div className="sticky top-24 bg-gray-100/50 rounded-2xl p-6 border border-gray-200">
                            <div className="text-center mb-6">
                                <div className="text-4xl font-bold mb-2">
                                    {doc.price === 0 ? (
                                        <span className="text-green-400">Free</span>
                                    ) : (
                                        <span>${doc.discount_price || doc.price}</span>
                                    )}
                                </div>
                                {doc.discount_price && doc.discount_price < doc.price && (
                                    <span className="text-gray-500 line-through">
                                        ${doc.price}
                                    </span>
                                )}
                            </div>

                            {!hasAccess && doc.price > 0 && (
                                <button
                                    onClick={handlePurchase}
                                    className="w-full py-4 bg-[#0055FF] rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all mb-4"
                                >
                                    Purchase Now
                                </button>
                            )}

                            <div className="flex gap-2 mb-6">
                                <button className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors flex items-center justify-center gap-2">
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>
                                <button className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors flex items-center justify-center gap-2">
                                    <Bookmark className="w-4 h-4" />
                                    Save
                                </button>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Reading time</span>
                                    <span>{doc.reading_time_minutes} minutes</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Difficulty</span>
                                    <span className="capitalize">{doc.difficulty}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Updated</span>
                                    <span>
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
