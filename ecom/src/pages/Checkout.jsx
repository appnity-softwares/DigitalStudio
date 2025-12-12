import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ShoppingCart,
    CreditCard,
    Shield,
    Check,
    ChevronRight,
    Tag,
    X,
    AlertCircle,
} from "lucide-react";
import CartContext from "../context/CartContext";
import AuthContext from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

// Razorpay key from env or default
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

// Load Razorpay script
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const Checkout = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [selectedLicenses, setSelectedLicenses] = useState({});
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    // License pricing multipliers
    const licenseMultipliers = {
        personal: 1,
        commercial: 1.5,
        extended: 2.5,
    };

    const licenseDescriptions = {
        personal: "For personal projects only",
        commercial: "For commercial projects, up to 1 end product",
        extended: "Unlimited commercial projects + resale rights",
    };

    // Calculate total with licenses
    const getSubtotal = () => {
        let total = 0;
        cartItems.forEach((item) => {
            const price = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
            const license = selectedLicenses[item._id || item.id] || "personal";
            total += price * licenseMultipliers[license];
        });
        return total;
    };

    const calculateTotal = () => {
        const subtotal = getSubtotal();
        return Math.max(0, subtotal - discount).toFixed(2);
    };

    const handleLicenseChange = (itemId, license) => {
        setSelectedLicenses((prev) => ({
            ...prev,
            [itemId]: license,
        }));
    };

    const applyPromoCode = () => {
        const promoCodes = {
            SAVE10: 10,
            LAUNCH20: 20,
            CODESTUDIO: 25,
        };

        const code = promoCode.toUpperCase();
        if (promoCodes[code]) {
            const percent = promoCodes[code];
            const discountAmount = (getSubtotal() * percent) / 100;
            setDiscount(discountAmount);
            setDiscountPercent(percent);
            showToast(`${percent}% discount applied!`, "success");
        } else {
            showToast("Invalid promo code", "error");
        }
    };

    const handleCheckout = async () => {
        if (!user) {
            showToast("Please login to continue", "error");
            return;
        }

        if (cartItems.length === 0) {
            showToast("Your cart is empty", "error");
            return;
        }

        setIsProcessing(true);

        try {
            // Load Razorpay script
            const loaded = await loadRazorpayScript();
            if (!loaded) {
                showToast("Failed to load payment gateway", "error");
                setIsProcessing(false);
                return;
            }

            const totalAmount = parseFloat(calculateTotal());

            // Convert USD to INR (approximate rate for Razorpay which requires INR)
            const amountInINR = Math.round(totalAmount * 83);

            // Create order on backend
            const orderResponse = await api.post("/payment/create-order", {
                amount: amountInINR,
                currency: "INR",
                receipt: `order_${Date.now()}`,
                notes: {
                    user_id: user.id || user._id,
                    items_count: cartItems.length,
                }
            });

            if (!orderResponse.data?.order?.id) {
                throw new Error("Failed to create order");
            }

            const { order, key_id } = orderResponse.data;

            // Prepare order data for verification
            const orderData = {
                items: cartItems.map((item) => ({
                    title: item.title,
                    qty: 1,
                    image: item.image,
                    price: parseFloat(String(item.price).replace(/[^0-9.]/g, "")) *
                        licenseMultipliers[selectedLicenses[item._id || item.id] || "personal"],
                    product: item._id || item.id,
                    item_type: "product",
                    license_type: selectedLicenses[item._id || item.id] || "personal",
                })),
                totalPrice: totalAmount,
                discount: discount,
                couponCode: discountPercent > 0 ? promoCode.toUpperCase() : null,
            };

            // Open Razorpay checkout
            const options = {
                key: key_id || RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "CodeStudio",
                description: `Purchase of ${cartItems.length} item(s)`,
                order_id: order.id,
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#3B82F6",
                },
                handler: async function (response) {
                    try {
                        // Verify payment on backend
                        const verifyResponse = await api.post("/payment/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_data: orderData,
                        });

                        if (verifyResponse.data?.success) {
                            showToast("Payment successful! Order placed.", "success");
                            clearCart();
                            navigate("/profile");
                        } else {
                            showToast("Payment verification failed", "error");
                        }
                    } catch (error) {
                        console.error("Verification error:", error);
                        showToast("Payment verification failed", "error");
                    }
                    setIsProcessing(false);
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                        showToast("Payment cancelled", "info");
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on("payment.failed", function (response) {
                console.error("Payment failed:", response.error);
                showToast(`Payment failed: ${response.error.description}`, "error");
                setIsProcessing(false);
            });
            razorpay.open();

        } catch (error) {
            console.error("Checkout error:", error);
            const message = error.response?.data?.message || error.message || "Checkout failed";
            showToast(message, "error");
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white shadow-sm rounded-3xl p-12 border border-gray-200"
                    >
                        <ShoppingCart className="w-20 h-20 text-gray-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8">
                            Discover amazing templates and tools for your next project
                        </p>
                        <button
                            onClick={() => navigate("/templates")}
                            className="px-8 py-4 bg-[#0055FF] rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                        >
                            Browse Products
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">
                        <span className="bg-[#0055FF] ">
                            Checkout
                        </span>
                    </h1>
                    <p className="text-gray-600">Complete your purchase securely with Razorpay</p>
                </motion.div>

                {!RAZORPAY_KEY_ID && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
                        <p className="text-yellow-400 text-sm">
                            Razorpay key not configured. Add VITE_RAZORPAY_KEY_ID to your .env file.
                        </p>
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item, index) => (
                            <motion.div
                                key={item._id || item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200"
                            >
                                <div className="flex gap-6">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-32 h-24 object-cover rounded-xl"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {item.category}
                                        </p>

                                        {/* License Selection */}
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(licenseMultipliers).map(
                                                ([license, multiplier]) => {
                                                    const basePrice =
                                                        parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
                                                    const licensePrice = (basePrice * multiplier).toFixed(2);
                                                    const isSelected =
                                                        (selectedLicenses[item._id || item.id] || "personal") ===
                                                        license;

                                                    return (
                                                        <button
                                                            key={license}
                                                            onClick={() =>
                                                                handleLicenseChange(item._id || item.id, license)
                                                            }
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSelected
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                                }`}
                                                        >
                                                            <span className="capitalize">{license}</span>
                                                            <span className="ml-2 text-xs opacity-75">
                                                                ${licensePrice}
                                                            </span>
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {
                                                licenseDescriptions[
                                                selectedLicenses[item._id || item.id] || "personal"
                                                ]
                                            }
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200 sticky top-24"
                        >
                            <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                            {/* Promo Code */}
                            <div className="mb-6">
                                <label className="text-sm text-gray-600 mb-2 block">
                                    Promo Code
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 text-white"
                                    />
                                    <button
                                        onClick={applyPromoCode}
                                        className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                                    >
                                        <Tag className="w-5 h-5" />
                                    </button>
                                </div>
                                {discountPercent > 0 && (
                                    <p className="text-green-400 text-sm mt-2">
                                        {discountPercent}% discount applied
                                    </p>
                                )}
                            </div>

                            {/* Summary Lines */}
                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>${getSubtotal().toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Discount</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="flex justify-between text-2xl font-bold mb-8">
                                <span>Total</span>
                                <span className="bg-[#0055FF] ">
                                    ${calculateTotal()}
                                </span>
                            </div>

                            {/* Security Badge */}
                            <div className="flex items-center gap-3 mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                <Shield className="w-6 h-6 text-green-400" />
                                <div>
                                    <p className="text-sm font-medium text-green-400">
                                        Secure Checkout
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Powered by Razorpay
                                    </p>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all ${isProcessing
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-[#0055FF] hover:shadow-lg hover:shadow-blue-500/25"
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Pay ${calculateTotal()}
                                        <ChevronRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            {/* Features */}
                            <div className="mt-6 space-y-2">
                                {[
                                    "Instant download after purchase",
                                    "Lifetime updates included",
                                    "30-day money-back guarantee",
                                    "License key included",
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-green-400" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
