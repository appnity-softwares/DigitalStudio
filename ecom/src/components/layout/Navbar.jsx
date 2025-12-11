import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import CartContext from '../../context/CartContext';
import WishlistContext from '../../context/WishlistContext';
import LoginModal from '../auth/LoginModal';

const FloatingNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const { wishlistItems } = useContext(WishlistContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/templates?search=${searchQuery}`);
        }
    };

    return (
        <>
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
                <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">

                    <nav className="bg-black rounded-full p-2 pl-6 pr-2 flex items-center gap-6 shadow-2xl">
                        <Link to="/" className="flex items-center gap-2 mr-2">
                            <div className="relative flex items-center justify-center w-8 h-8 bg-[#0055FF] rounded-full overflow-hidden shrink-0">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" fill="none" />
                                    <rect x="2" y="11" width="20" height="2" fill="white" />
                                    <path d="M12 12V22" stroke="white" strokeWidth="2" />
                                </svg>
                            </div>
                            <span className="text-white font-bold text-xl tracking-tight select-none">
                                FlowGrid
                            </span>
                        </Link>

                        <ul className="hidden lg:flex items-center gap-2">
                            {[
                                { name: 'Templates', path: '/templates' },
                                { name: 'Features', path: '/features' },
                                { name: 'Testimonial', path: '/testimonials' },
                                { name: 'FAQ', path: '/faq' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `block text-white text-sm font-medium px-5 py-2.5 rounded-full border transition-all duration-200 ${isActive ? 'bg-white/10 border-white/40' : 'border-white/10 hover:border-white/40 hover:bg-white/5'
                                            }`
                                        }
                                    >
                                        {item.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                            {/* Wishlist & Cart Icons */}
                            <div className="flex items-center gap-2 mr-2">
                                <Link to="/wishlist" className="relative p-2 text-white/70 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    {wishlistItems.length > 0 && (
                                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                            {wishlistItems.length}
                                        </span>
                                    )}
                                </Link>
                                <Link to="/cart" className="relative p-2 text-white/70 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    {cartItems.length > 0 && (
                                        <span className="absolute top-0 right-0 w-4 h-4 bg-[#0055FF] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </Link>
                            </div>

                            {user ? (
                                <>
                                    <Link to="/profile" className="text-white text-sm font-bold hidden sm:block hover:text-blue-400 transition-colors">
                                        Hi, {user.name.split(' ')[0]}
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setIsLoginModalOpen(true)} className="text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
                                        Sign In
                                    </button>
                                    <Link to="/register" className="bg-[#0055FF] hover:bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors duration-200 whitespace-nowrap shadow-[0_0_15px_rgba(0,85,255,0.3)]">
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>

                    <div className="relative w-full md:w-[320px] shadow-xl rounded-full">
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-full bg-[#F3F4F6] text-gray-800 placeholder-gray-500 rounded-full px-6 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all border border-transparent focus:bg-white"
                        />
                        <button onClick={() => navigate(`/templates?search=${searchQuery}`)} className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default FloatingNavbar;