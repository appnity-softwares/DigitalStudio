import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, X, Package, FileText, Menu, User, ShoppingCart, Heart, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../../context/AuthContext';
import CartContext from '../../context/CartContext';
import WishlistContext from '../../context/WishlistContext';
import LoginModal from '../auth/LoginModal';
import ThemeToggle from '../ui/ThemeToggle';
import api from '../../services/api';

const Navbar = () => {
    const { user, logout, loading: authLoading } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const { wishlistItems } = useContext(WishlistContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const searchRef = useRef(null);
    const debounceRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSearch(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (value.length >= 2) {
            setLoading(true);
            debounceRef.current = setTimeout(async () => {
                try {
                    const res = await api.get(`/search/suggestions?q=${encodeURIComponent(value)}`);
                    setSuggestions(res.data.suggestions || []);
                } catch (err) {
                    console.log('Search error');
                } finally {
                    setLoading(false);
                }
            }, 300);
        } else {
            setSuggestions([]);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/templates?search=${searchQuery}`);
            setShowSearch(false);
            setSuggestions([]);
        }
    };

    const navLinks = [
        { name: 'Templates', path: '/templates' },
        { name: 'Docs', path: '/docs' },
        { name: 'API Tools', path: '/saas' },
        { name: 'Mobile Apps', path: '/mobile-templates' },
        { name: 'Pricing', path: '/pricing' },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-navbar rounded-2xl px-6 py-3 flex items-center justify-between">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center">
                                <Code className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold text-[var(--text-primary)]">
                                CodeStudio
                            </span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div ref={searchRef} className="relative hidden md:block">
                                <button
                                    onClick={() => setShowSearch(!showSearch)}
                                    className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    <Search className="w-5 h-5" />
                                </button>

                                <AnimatePresence>
                                    {showSearch && (
                                        <motion.div
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 280 }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="absolute right-0 top-0"
                                        >
                                            <div className="glass-card py-1 px-3 flex items-center gap-2">
                                                <Search className="w-4 h-4 text-[var(--text-tertiary)]" />
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={handleSearchChange}
                                                    onKeyDown={handleSearch}
                                                    placeholder="Search templates..."
                                                    className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                                                    autoFocus
                                                />
                                                <button onClick={() => setShowSearch(false)}>
                                                    <X className="w-4 h-4 text-[var(--text-tertiary)]" />
                                                </button>
                                            </div>

                                            {suggestions.length > 0 && (
                                                <div className="absolute top-12 left-0 right-0 glass-card p-2 space-y-1">
                                                    {suggestions.map((s, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => {
                                                                navigate(s.url || `/templates?search=${s.text}`);
                                                                setShowSearch(false);
                                                            }}
                                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-left text-sm"
                                                        >
                                                            {s.type === 'product' ? <Package className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                            <span className="text-[var(--text-primary)]">{s.text}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Theme Toggle */}
                            <ThemeToggle />

                            {/* Wishlist */}
                            <Link
                                to="/wishlist"
                                className="relative p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <Heart className="w-5 h-5" />
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--error)] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <Link
                                to="/cart"
                                className="relative p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent-primary)] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>

                            {/* User Menu */}
                            {user ? (
                                <div className="relative group">
                                    <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center">
                                            {user.avatar ? (
                                                <img src={user.avatar} className="w-full h-full rounded-lg object-cover" />
                                            ) : (
                                                <span className="text-sm font-bold text-[var(--accent-primary)]">
                                                    {user.name?.[0]?.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    </button>

                                    <div className="absolute right-0 top-full mt-2 w-48 glass-card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-sm">
                                            <User className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        {user.role === 'ADMIN' && (
                                            <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-sm">
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => { logout(); navigate('/'); }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-sm text-[var(--error)]"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : authLoading ? (
                                <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] animate-pulse" />
                            ) : (
                                <button
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="btn-primary py-2 px-4 text-sm"
                                >
                                    Sign In
                                </button>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 left-4 right-4 z-40 glass-card p-4 lg:hidden"
                    >
                        <div className="space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-lg hover:bg-[var(--bg-tertiary)] font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </>
    );
};

export default Navbar;