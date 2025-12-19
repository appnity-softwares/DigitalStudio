import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, CheckCircle } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col justify-center px-6 py-24 overflow-hidden bg-[var(--bg-primary)]">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />

            {/* Decorative Blobs */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-[var(--accent-primary)] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-[var(--accent-primary)] opacity-[0.02] rounded-full blur-3xl pointer-events-none" />

            {/* Main Content */}
            <div className="max-w-[1280px] mx-auto w-full relative z-10">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] animate-slide-up">
                    <span className="w-2 h-2 bg-[var(--success)] rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-[var(--text-secondary)]">
                        Premium Templates & Developer Tools
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-display text-[var(--text-primary)] max-w-4xl mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    Build stunning websites with
                    <span className="text-[var(--accent-primary)]"> professional templates</span>
                </h1>

                {/* Subheadline */}
                <p className="text-body max-w-2xl text-lg mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    Production-ready templates, premium documentation, and powerful SaaS APIs.
                    Everything you need to ship faster and build better products.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <Link
                        to="/templates"
                        className="btn-primary inline-flex items-center gap-2 text-base"
                    >
                        <Zap className="w-4 h-4" />
                        Browse Templates
                    </Link>
                    <Link
                        to="/docs"
                        className="btn-secondary inline-flex items-center gap-2 text-base"
                    >
                        View Documentation
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-3 mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    {['React & Next.js', 'TypeScript Ready', 'Tailwind CSS', 'SaaS APIs'].map((feature) => (
                        <div key={feature} className="pill pill-hover">
                            <CheckCircle className="w-3.5 h-3.5 text-[var(--success)]" />
                            {feature}
                        </div>
                    ))}
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-12 pt-8 border-t border-[var(--border-primary)] animate-slide-up" style={{ animationDelay: '0.5s' }}>
                    <StatItem number="500+" label="Templates" />
                    <StatItem number="50K+" label="Downloads" />
                    <StatItem number="4.9" label="Avg Rating" />
                    <StatItem number="24/7" label="Support" />
                </div>
            </div>

            {/* Glass Card Preview (Right side on desktop) */}
            <div className="hidden xl:block absolute right-12 top-1/2 -translate-y-1/2">
                <div className="glass-card p-6 w-80 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center">
                            <Zap className="w-6 h-6 text-[var(--accent-primary)]" />
                        </div>
                        <div>
                            <p className="text-title text-[var(--text-primary)]">SaaS Starter</p>
                            <p className="text-caption">Production Ready</p>
                        </div>
                    </div>
                    <div className="h-40 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
                        <span className="text-[var(--text-tertiary)]">Preview</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-headline text-[var(--text-primary)]">$49</span>
                        <button className="btn-primary py-2 px-4 text-sm">View Details</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

const StatItem = ({ number, label }) => (
    <div className="flex flex-col">
        <span className="text-2xl font-bold text-[var(--text-primary)]">{number}</span>
        <span className="text-sm text-[var(--text-tertiary)]">{label}</span>
    </div>
);

export default HeroSection;