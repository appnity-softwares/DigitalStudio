import React, { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import LoginModal from "./components/auth/LoginModal";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ToastProvider } from "./context/ToastContext";
import AuthContext from "./context/AuthContext";

// Lazy Load Pages
const Home = lazy(() => import("./pages/Home"));
const Templates = lazy(() => import("./pages/Templates"));
const Features = lazy(() => import("./pages/Features"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TemplatesDetails = lazy(() => import("./pages/TemplatesDetails"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const ProductEdit = lazy(() => import("./pages/Admin/ProductEdit"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Profile = lazy(() => import("./pages/Profile"));

// Loading Spinner Component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0055FF] rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ToastProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />

              <main className="flex-grow">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/templates" element={<Templates />} />
                    <Route path="/templates/:id" element={<TemplatesDetails />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/profile" element={<Profile />} />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/product/:id/edit" element={<ProductEdit />} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>

              <Footer />
              <GlobalLoginPopup />
            </div>
          </ToastProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
};

// Internal Component for Global Popup Logic
const GlobalLoginPopup = () => {
  const { user, loading } = React.useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only show on homepage, not on product browsing pages
    const shouldShowPopup = location.pathname === '/' || location.pathname === '/home';
    const hasShown = sessionStorage.getItem('loginPopupShown');

    if (!loading && !user && !hasShown && shouldShowPopup) {
      const timer = setTimeout(() => {
        setShowModal(true);
        sessionStorage.setItem('loginPopupShown', 'true');
      }, 3000); // 3 second delay
      return () => clearTimeout(timer);
    }
  }, [user, loading, location]);

  return <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />;
};

export default App;
