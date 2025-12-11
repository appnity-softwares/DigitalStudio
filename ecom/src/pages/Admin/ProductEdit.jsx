import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productService from '../../services/productService';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            const data = await productService.getById(id);
            setTitle(data.title);
            setPrice(data.price);
            setImage(data.image);
            setCategory(data.category);
            setDescription(data.description);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await productService.update(id, {
                title, price, image, category, description
            });
            navigate('/admin/dashboard');
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#F5F5F7] px-6 py-20 font-sans">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-sm">
                <Link to="/admin/dashboard" className="text-gray-500 text-sm mb-6 inline-block hover:text-black">← Back to Dashboard</Link>
                <h1 className="text-3xl font-black text-black mb-8">Edit Product</h1>

                <form onSubmit={submitHandler} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                        <input className="w-full border p-3 rounded-xl bg-gray-50" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Price</label>
                        <input className="w-full border p-3 rounded-xl bg-gray-50" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                        <input className="w-full border p-3 rounded-xl bg-gray-50" value={image} onChange={(e) => setImage(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                        <input className="w-full border p-3 rounded-xl bg-gray-50" value={category} onChange={(e) => setCategory(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea className="w-full border p-3 rounded-xl bg-gray-50 h-32" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <button type="submit" className="bg-[#0055FF] text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-colors">
                        Update Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductEdit;
