import React, { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import LoginModal from "./components/auth/LoginModal";
import OfflineBanner from "./components/ui/OfflineBanner";

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
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const ProductEdit = lazy(() => import("./pages/Admin/ProductEdit"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Profile = lazy(() => import("./pages/Profile"));

// New Pages
const Checkout = lazy(() => import("./pages/Checkout"));
const Docs = lazy(() => import("./pages/Docs"));
const DocDetail = lazy(() => import("./pages/DocDetail"));
const Saas = lazy(() => import("./pages/Saas"));
const DeveloperHub = lazy(() => import("./pages/DeveloperHub"));
const OAuthCallback = lazy(() => import("./pages/OAuthCallback"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));

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
              <OfflineBanner />
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
                    {/* Login/Register redirect to home - modal is used instead */}
                    <Route path="/login" element={<Navigate to="/" replace />} />
                    <Route path="/register" element={<Navigate to="/" replace />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/profile" element={<Profile />} />

                    {/* New Routes */}
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/docs" element={<Docs />} />
                    <Route path="/docs/:id" element={<DocDetail />} />
                    <Route path="/saas" element={<Saas />} />
                    <Route path="/app-developers" element={<DeveloperHub />} />
                    <Route path="/oauth-callback" element={<OAuthCallback />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ForgotPassword />} />

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
