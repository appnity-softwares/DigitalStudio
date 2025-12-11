import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import productService from '../../services/productService';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        } else {
            fetchProducts();
        }
    }, [user, navigate]);

    const fetchProducts = async () => {
        try {
            const data = await productService.getAll();
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await productService.delete(id);
                fetchProducts();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const createHandler = async () => {
        try {
            const data = await productService.create({});
            navigate(`/admin/product/${data._id}/edit`);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] px-6 py-20 font-sans">
            <div className="max-w-[1200px] mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-black text-black">Admin Dashboard</h1>
                    <button
                        onClick={createHandler}
                        className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors"
                    >
                        + Create Product
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-sm font-bold text-gray-500 uppercase">ID</th>
                                <th className="p-4 text-sm font-bold text-gray-500 uppercase">NAME</th>
                                <th className="p-4 text-sm font-bold text-gray-500 uppercase">PRICE</th>
                                <th className="p-4 text-sm font-bold text-gray-500 uppercase">CATEGORY</th>
                                <th className="p-4 text-sm font-bold text-gray-500 uppercase">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-mono text-xs text-gray-400">{product._id.substring(0, 10)}...</td>
                                    <td className="p-4 font-bold text-black">{product.title}</td>
                                    <td className="p-4 text-black">{product.price}</td>
                                    <td className="p-4 text-gray-500 text-sm bg-gray-100 rounded-full inline-block mt-2 px-3 py-1 mx-4 w-auto">{product.category}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/admin/product/${product._id}/edit`}
                                                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                                            >
                                                EDIT
                                            </Link>
                                            <button
                                                onClick={() => deleteHandler(product._id)}
                                                className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                                            >
                                                DELETE
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
