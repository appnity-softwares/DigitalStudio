import React, { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
import { ThemeProvider } from "./context/ThemeContext";
import { RecentlyViewedProvider } from "./context/RecentlyViewedContext";
import AuthContext from "./context/AuthContext";

// Create Query Client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (previously cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

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
const ImageUploadAPI = lazy(() => import("./pages/ImageUploadAPI"));
const MobileTemplates = lazy(() => import("./pages/MobileTemplates"));
const BlogEditor = lazy(() => import("./pages/Admin/BlogEditor"));
const APIPlayground = lazy(() => import("./pages/APIPlayground"));
const Pricing = lazy(() => import("./pages/Pricing"));
const AdminPanel = lazy(() => import("./pages/Admin/AdminPanel"));
const TemplateRequests = lazy(() => import("./pages/TemplateRequests"));

// Loading Spinner Component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh] dark:bg-gray-900">
    <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-[#0055FF] rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <ToastProvider>
                <RecentlyViewedProvider>
                  <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
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
                          <Route path="/tools/image-upload" element={<ImageUploadAPI />} />
                          <Route path="/mobile-templates" element={<MobileTemplates />} />
                          <Route path="/api-playground" element={<APIPlayground />} />
                          <Route path="/pricing" element={<Pricing />} />
                          <Route path="/template-requests" element={<TemplateRequests />} />

                          {/* Admin Routes */}
                          <Route path="/admin" element={<AdminPanel />} />
                          <Route path="/admin/dashboard" element={<AdminDashboard />} />
                          <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
                          <Route path="/admin/blog/new" element={<BlogEditor />} />
                          <Route path="/admin/blog/:id/edit" element={<BlogEditor />} />

                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </main>

                    <Footer />
                    <GlobalLoginPopup />
                  </div>
                </RecentlyViewedProvider>
              </ToastProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
      {/* React Query Devtools - only in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
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
