import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code, Mail, ArrowRight, Check } from 'lucide-react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
        }
    };

    const footerLinks = {
        Products: [
            { name: 'Templates', path: '/templates' },
            { name: 'Documentation', path: '/docs' },
            { name: 'API Tools', path: '/saas' },
            { name: 'Mobile Apps', path: '/mobile-templates' },
        ],
        Resources: [
            { name: 'Getting Started', path: '/docs' },
            { name: 'Developer Hub', path: '/app-developers' },
            { name: 'Features', path: '/features' },
            { name: 'FAQ', path: '/faq' },
        ],
        Company: [
            { name: 'About Us', path: '/about' },
            { name: 'Contact', path: '/contact' },
            { name: 'Testimonials', path: '/testimonials' },
            { name: 'Careers', path: '/careers' },
        ],
    };

    return (
        <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center">
                                <Code className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold text-[var(--text-primary)]">
                                CodeStudio
                            </span>
                        </Link>
                        <p className="text-body text-sm mb-4">
                            Premium templates and developer tools for building modern applications.
                        </p>
                        <a
                            href="mailto:hello@codestudio.dev"
                            className="text-sm text-[var(--accent-primary)] font-medium hover:underline"
                        >
                            hello@codestudio.dev
                        </a>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 uppercase tracking-wider">
                                {category}
                            </h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-[var(--border-primary)] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-[var(--text-tertiary)]">
                        © {new Date().getFullYear()} CodeStudio. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                            Privacy
                        </Link>
                        <Link to="/terms" className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                            Terms
                        </Link>
                        <Link to="/cookies" className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;