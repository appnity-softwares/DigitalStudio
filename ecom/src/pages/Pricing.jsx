import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    Check, Zap, Crown, Star, ArrowRight,
    Shield, Headphones, Download, Infinity
} from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const Pricing = () => {
    const { user } = useContext(AuthContext);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [loading, setLoading] = useState(null);

    const plans = [
        {
            id: 'free',
            name: 'Free',
            icon: Zap,
            description: 'Perfect for trying out our platform',
            monthlyPrice: 0,
            yearlyPrice: 0,
            features: [
                'Access to free templates',
                'Free blog articles',
                'Community support',
                'API access (100 req/day)',
                'Basic documentation'
            ],
            cta: 'Get Started',
            popular: false
        },
        {
            id: 'pro',
            name: 'Pro',
            icon: Crown,
            description: 'For serious developers and small teams',
            monthlyPrice: 499,
            yearlyPrice: 4999,
            features: [
                'All free features',
                'Access to all premium templates',
                'All blog articles (Pro content)',
                'Priority email support',
                'API access (10,000 req/day)',
                'Source code downloads',
                'Private Discord access'
            ],
            cta: 'Subscribe Now',
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            icon: Shield,
            description: 'For agencies and large teams',
            monthlyPrice: 1999,
            yearlyPrice: 19999,
            features: [
                'All Pro features',
                'Unlimited API requests',
                'White-label templates',
                'Custom integrations',
                'Dedicated account manager',
                'SLA guarantee',
                'Team management',
                'Invoice billing'
            ],
            cta: 'Contact Sales',
            popular: false
        }
    ];

    const handleSubscribe = async (planId) => {
        if (!user) {
            showToast('Please login to subscribe', 'info');
            return;
        }

        if (planId === 'free') {
            navigate('/profile');
            return;
        }

        if (planId === 'enterprise') {
            navigate('/contact');
            return;
        }

        setLoading(planId);
        try {
            const res = await api.post('/subscriptions/create', {
                planId,
                billingCycle
            });

            if (res.data.paymentUrl) {
                window.location.href = res.data.paymentUrl;
            } else {
                showToast('Subscription activated!', 'success');
                navigate('/profile');
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to subscribe', 'error');
        } finally {
            setLoading(null);
        }
    };

    const getPrice = (plan) => {
        return billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    };

    return (
        <div className="page-container pt-28 pb-20">
            <div className="container max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[var(--accent-subtle)]">
                        <Crown className="w-4 h-4 text-[var(--accent-primary)]" />
                        <span className="text-sm font-medium text-[var(--accent-primary)]">
                            Simple Pricing
                        </span>
                    </div>
                    <h1 className="text-display text-[var(--text-primary)] mb-4">
                        Choose your plan
                    </h1>
                    <p className="text-body text-lg max-w-2xl mx-auto mb-8">
                        Get access to premium templates, developer blog, and powerful APIs.
                        Cancel anytime.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-4 p-1 bg-[var(--bg-secondary)] rounded-xl">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${billingCycle === 'monthly'
                                ? 'bg-[var(--accent-primary)] text-white'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${billingCycle === 'yearly'
                                ? 'bg-[var(--accent-primary)] text-white'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Yearly
                            <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                                Save 17%
                            </span>
                        </button>
                    </div>
                </motion.div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative card ${plan.popular ? 'border-2 border-[var(--accent-primary)]' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 bg-[var(--accent-primary)] text-white text-xs font-bold rounded-full flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="p-8">
                                {/* Plan Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-tertiary)]'
                                        }`}>
                                        <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-[var(--accent-primary)]'
                                            }`} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[var(--text-primary)]">
                                            {plan.name}
                                        </h3>
                                    </div>
                                </div>

                                <p className="text-body text-sm mb-6">{plan.description}</p>

                                {/* Price */}
                                <div className="mb-6">
                                    <span className="text-4xl font-black text-[var(--text-primary)]">
                                        ₹{getPrice(plan).toLocaleString('en-IN')}
                                    </span>
                                    {plan.monthlyPrice > 0 && (
                                        <span className="text-[var(--text-tertiary)]">
                                            /{billingCycle === 'yearly' ? 'year' : 'month'}
                                        </span>
                                    )}
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={() => handleSubscribe(plan.id)}
                                    disabled={loading === plan.id}
                                    className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${plan.popular
                                        ? 'btn-primary'
                                        : 'btn-secondary'
                                        }`}
                                >
                                    {loading === plan.id ? (
                                        'Processing...'
                                    ) : (
                                        <>
                                            {plan.cta}
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                {/* Features */}
                                <ul className="mt-8 space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-[var(--text-secondary)]">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Teaser */}
                <div className="mt-20 text-center">
                    <p className="text-[var(--text-secondary)] mb-4">
                        Have questions? Check out our FAQ or contact support.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/faq" className="btn-ghost">
                            View FAQ
                        </Link>
                        <Link to="/contact" className="btn-ghost">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
