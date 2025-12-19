import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, ShoppingBag, CreditCard, FileText, Key, Download,
    LogOut, Settings, Crown, ChevronRight, ExternalLink,
    Calendar, Clock, RefreshCw, Copy, Check, Eye, EyeOff
} from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useMyOrders, useInvoices, useMyApiKeys, useCurrentSubscription } from '../hooks/useQueries';
import api from '../services/api';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('orders');
    const [copiedKey, setCopiedKey] = useState(null);
    const [visibleKeys, setVisibleKeys] = useState({});

    // React Query hooks
    const { data: orders = [], isLoading: ordersLoading } = useMyOrders();
    const { data: invoices = [], isLoading: invoicesLoading } = useInvoices();
    const { data: apiKeys = [], isLoading: keysLoading, refetch: refetchKeys } = useMyApiKeys();
    const { data: subscription, isLoading: subLoading } = useCurrentSubscription();

    // Determine loading state based on active tab
    const loading = activeTab === 'orders' ? ordersLoading :
        activeTab === 'invoices' ? invoicesLoading :
            activeTab === 'api-keys' ? keysLoading :
                activeTab === 'subscription' ? subLoading : false;

    const downloadInvoice = async (orderId) => {
        try {
            const res = await api.get(`/invoices/${orderId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            showToast('Invoice downloaded!', 'success');
        } catch (err) {
            showToast('Failed to download invoice', 'error');
        }
    };

    const downloadProduct = async (orderId, itemId) => {
        try {
            const res = await api.get(`/downloads/${orderId}/${itemId}`);
            if (res.data.downloadUrl) {
                window.open(res.data.downloadUrl, '_blank');
                showToast('Download started!', 'success');
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Download failed', 'error');
        }
    };

    const copyToClipboard = (key, id) => {
        navigator.clipboard.writeText(key);
        setCopiedKey(id);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const toggleKeyVisibility = (id) => {
        setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const revokeApiKey = async (keyId) => {
        if (!confirm('Are you sure you want to revoke this API key?')) return;
        try {
            await api.delete(`/saas/keys/${keyId}`);
            refetchKeys();
            showToast('API key revoked', 'success');
        } catch (err) {
            showToast('Failed to revoke key', 'error');
        }
    };

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    const tabs = [
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'subscription', label: 'Subscription', icon: Crown },
        { id: 'invoices', label: 'Invoices', icon: FileText },
        { id: 'api-keys', label: 'API Keys', icon: Key },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-3xl p-8 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                            {user.avatar ? (
                                <img src={user.avatar} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                user.name?.[0]?.toUpperCase()
                            )}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-gray-500">{user.email}</p>
                            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    {user.role}
                                </span>
                                {subscription?.status === 'ACTIVE' && (
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
                                        <Crown className="w-3 h-3" />
                                        {subscription.planName}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {user.role === 'ADMIN' && (
                                <Link
                                    to="/admin"
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    Admin Panel
                                </Link>
                            )}
                            <button
                                onClick={() => { logout(); navigate('/'); }}
                                className="px-6 py-3 border border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-[#0055FF] text-white shadow-lg shadow-blue-500/25'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {loading ? (
                            <div className="bg-white rounded-3xl p-12 shadow-sm flex justify-center">
                                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <>
                                {/* Orders Tab */}
                                {activeTab === 'orders' && (
                                    <div className="space-y-4">
                                        {orders.length === 0 ? (
                                            <div className="bg-white rounded-3xl p-12 shadow-sm text-center">
                                                <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 mb-4">No orders yet</p>
                                                <Link to="/templates" className="text-[#0055FF] font-semibold hover:underline">
                                                    Browse Products
                                                </Link>
                                            </div>
                                        ) : (
                                            orders.map(order => (
                                                <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
                                                    <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                                                        <div>
                                                            <p className="font-mono text-sm text-gray-500">Order #{order.id?.substring(0, 8)}</p>
                                                            <p className="text-sm text-gray-400">
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.isPaid
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                {order.isPaid ? 'Paid' : 'Pending'}
                                                            </span>
                                                            <span className="text-xl font-bold">${order.totalPrice}</span>
                                                        </div>
                                                    </div>

                                                    <div className="border-t pt-4 space-y-3">
                                                        {order.items?.map((item, idx) => (
                                                            <div key={idx} className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    {item.image && (
                                                                        <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />
                                                                    )}
                                                                    <div>
                                                                        <p className="font-medium">{item.title}</p>
                                                                        <p className="text-sm text-gray-500">{item.licenseType} license</p>
                                                                    </div>
                                                                </div>
                                                                {order.isPaid && (
                                                                    <button
                                                                        onClick={() => downloadProduct(order.id, item.id)}
                                                                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
                                                                    >
                                                                        <Download className="w-4 h-4" />
                                                                        Download
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* Subscription Tab */}
                                {activeTab === 'subscription' && (
                                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                                        {subscription?.status === 'ACTIVE' ? (
                                            <div>
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                                        <Crown className="w-8 h-8 text-white" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-bold">{subscription.planName} Plan</h2>
                                                        <p className="text-gray-500">Active subscription</p>
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                                    <div className="p-4 bg-gray-50 rounded-xl">
                                                        <p className="text-sm text-gray-500 mb-1">Started</p>
                                                        <p className="font-semibold">
                                                            {new Date(subscription.startDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gray-50 rounded-xl">
                                                        <p className="text-sm text-gray-500 mb-1">Renews</p>
                                                        <p className="font-semibold">
                                                            {new Date(subscription.endDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="p-4 bg-gray-50 rounded-xl">
                                                        <p className="text-sm text-gray-500 mb-1">Status</p>
                                                        <p className="font-semibold text-green-600">Active</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                                                        Manage Subscription
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Crown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                <h2 className="text-2xl font-bold mb-2">No Active Subscription</h2>
                                                <p className="text-gray-500 mb-6">
                                                    Upgrade to Pro for unlimited access to all templates and tools.
                                                </p>
                                                <Link to="/pricing" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all inline-block">
                                                    Upgrade to Pro
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Invoices Tab */}
                                {activeTab === 'invoices' && (
                                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                                        {invoices.length === 0 ? (
                                            <div className="p-12 text-center">
                                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600">No invoices available</p>
                                            </div>
                                        ) : (
                                            <table className="w-full">
                                                <thead className="bg-gray-50 border-b">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Invoice</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {invoices.map(invoice => (
                                                        <tr key={invoice.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 font-mono text-sm">{invoice.invoiceNumber}</td>
                                                            <td className="px-6 py-4 text-gray-500">
                                                                {new Date(invoice.createdAt).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4 font-semibold">${invoice.amount}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                <button
                                                                    onClick={() => downloadInvoice(invoice.orderId)}
                                                                    className="text-blue-600 hover:underline font-medium flex items-center gap-1 ml-auto"
                                                                >
                                                                    <Download className="w-4 h-4" />
                                                                    Download
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                )}

                                {/* API Keys Tab */}
                                {activeTab === 'api-keys' && (
                                    <div className="space-y-4">
                                        {apiKeys.length === 0 ? (
                                            <div className="bg-white rounded-3xl p-12 shadow-sm text-center">
                                                <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 mb-4">No API keys yet</p>
                                                <Link to="/saas" className="text-[#0055FF] font-semibold hover:underline">
                                                    Explore SaaS Tools
                                                </Link>
                                            </div>
                                        ) : (
                                            apiKeys.map(key => (
                                                <div key={key.id} className="bg-white rounded-2xl p-6 shadow-sm">
                                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                                        <div>
                                                            <h3 className="font-bold text-lg">{key.name || key.tool?.name}</h3>
                                                            <p className="text-sm text-gray-500">{key.tool?.category}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${key.isActive
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {key.isActive ? 'Active' : 'Revoked'}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 mb-4">
                                                        <code className="flex-1 bg-gray-100 px-4 py-3 rounded-lg font-mono text-sm">
                                                            {visibleKeys[key.id] ? key.key : '••••••••••••••••••••••••'}
                                                        </code>
                                                        <button
                                                            onClick={() => toggleKeyVisibility(key.id)}
                                                            className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                                                        >
                                                            {visibleKeys[key.id] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                        <button
                                                            onClick={() => copyToClipboard(key.key, key.id)}
                                                            className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                                                        >
                                                            {copiedKey === key.id ? (
                                                                <Check className="w-5 h-5 text-green-500" />
                                                            ) : (
                                                                <Copy className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                        <span>Usage: {key.usageCount} / {key.usageLimit || '∞'}</span>
                                                        <span>Tier: {key.tier}</span>
                                                        {key.lastUsedAt && (
                                                            <span>Last used: {new Date(key.lastUsedAt).toLocaleDateString()}</span>
                                                        )}
                                                    </div>

                                                    {key.isActive && (
                                                        <button
                                                            onClick={() => revokeApiKey(key.id)}
                                                            className="mt-4 text-red-600 text-sm font-medium hover:underline"
                                                        >
                                                            Revoke API Key
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Profile;
