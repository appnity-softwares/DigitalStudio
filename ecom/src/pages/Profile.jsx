import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import orderService from '../services/orderService';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchOrders();
        }
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F5F5F7] px-6 py-20 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-black mb-2">My Profile</h1>
                        <p className="text-gray-500">Manage your account and view orders.</p>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="bg-white border text-red-500 px-6 py-3 rounded-full font-bold hover:bg-red-50 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* User Info Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm h-fit">
                        <div className="w-20 h-20 bg-gray-200 rounded-full mb-6 mx-auto flex items-center justify-center text-2xl font-bold text-gray-600 uppercase">
                            {user.name[0]}
                        </div>
                        <h2 className="text-xl font-bold text-center mb-1">{user.name}</h2>
                        <p className="text-gray-500 text-center text-sm mb-6">{user.email}</p>
                        <div className="bg-blue-50 text-blue-600 text-xs font-bold py-2 px-4 rounded-lg text-center uppercase tracking-wide">
                            {user.role} Account
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold mb-6">Order History</h2>
                        {orders.length === 0 ? (
                            <div className="bg-white p-10 rounded-3xl shadow-sm text-center">
                                <p className="text-gray-600 mb-4">No orders yet.</p>
                                <button onClick={() => navigate('/templates')} className="text-[#0055FF] font-bold">Browse Templates</button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {orders.map((order) => (
                                    <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-mono text-xs text-gray-600">Order #{order._id.substring(0, 8)}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {order.isPaid ? 'Paid' : 'Pending'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-2 mb-4">
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-black font-medium">{item.title}</span>
                                                    <span className="text-gray-500">{item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t pt-4 flex justify-between items-center">
                                            <span className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span className="font-bold text-lg">${order.totalPrice}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
