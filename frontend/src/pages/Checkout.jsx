import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { ArrowLeft, Truck, Phone, MapPin, Mail, FileText, CreditCard, Shield, Lock } from 'lucide-react';
import abaLogo from '../assets/ABA BANK.svg';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        email: '',
        note: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        setLoading(true);

        const orderData = {
            customer: formData,
            items: cart.map(item => ({
                productId: item._id,
                nameKm: item.nameKm,
                nameEn: item.nameEn,
                price: item.salePrice || item.price,
                quantity: item.quantity,
                image: item.image
            })),
            subtotal: getCartTotal(),
            total: getCartTotal(),
            paymentMethod: 'Bakong KHQR',
            paymentStatus: 'pending'
        };

        try {
            const response = await createOrder(orderData);
            console.log('Order created:', response);

            if (response.payment) {
                // Navigate to payment page with QR code
                navigate(`/payment/${response.order.id}`, {
                    state: {
                        payment: response.payment,
                        order: response.order
                    }
                });

                // Clear cart
                clearCart();
            }

        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12 text-center">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Truck size={32} className="text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2 font-khmer">កន្ត្រកទទេ</h2>
                    <p className="text-gray-500 mb-6 font-sans">Your cart is empty</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-[#005E7B] text-white rounded-lg hover:bg-[#004b63] transition-colors font-sans"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-0 sm:px-4 py-6">
            {/* Back Button - Modern Icon Only */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-10 h-10 mb-4 ml-2 sm:ml-0 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 text-gray-700 hover:text-[#005E7B] border border-gray-100"
                aria-label="Go back"
            >
                <ArrowLeft size={20} />
            </button>

            {/* Main content - also edge-to-edge on mobile */}
            <div className="w-full px-4 sm:px-0">
                {/* Left Column - Checkout Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h1 className="text-2xl font-bold mb-6 font-khmer">បញ្ជាទិញ</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Contact Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-lg font-semibold mb-4 font-sans flex items-center gap-2">
                                    <Truck size={20} className="text-[#005E7B]" />
                                    Contact Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-sans mb-1">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005E7B] focus:border-transparent outline-none text-sm transition-all"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-sans mb-1">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005E7B] focus:border-transparent outline-none text-sm transition-all"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-lg font-semibold mb-4 font-sans flex items-center gap-2">
                                    <MapPin size={20} className="text-[#005E7B]" />
                                    Delivery Address
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-sans mb-1">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            rows="2"
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005E7B] focus:border-transparent outline-none text-sm transition-all"
                                            placeholder="Enter your full address"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-sans mb-1">Email (Optional)</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005E7B] focus:border-transparent outline-none text-sm transition-all"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-sans mb-1">Note (Optional)</label>
                                            <input
                                                type="text"
                                                name="note"
                                                value={formData.note}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005E7B] focus:border-transparent outline-none text-sm transition-all"
                                                placeholder="Any special instructions?"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method - Simple Display */}
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <img src={abaLogo} alt="ABA Bank" className="h-8 w-auto" />
                                <div>
                                    <p className="font-semibold font-sans">ABA KHQR</p>
                                    <p className="text-xs text-gray-500 font-sans">Payment link will open after order</p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#005E7B] text-white py-4 rounded-xl hover:bg-[#004b63] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-sans text-base font-medium flex items-center justify-center gap-2 mt-8"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock size={18} />
                                        <span>Pay with Bakong • ${getCartTotal().toFixed(2)}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20">
                        <h2 className="text-lg font-semibold mb-4 font-sans">Order Summary</h2>

                        {/* Items List */}
                        <div className="space-y-4 mb-4 max-h-80 overflow-y-auto pr-2">
                            {cart.map((item) => (
                                <div key={item._id} className="flex gap-3">
                                    <img
                                        src={item.image?.replace('/upload/', '/upload/f_auto,q_auto,w_80/') || 'https://via.placeholder.com/80'}
                                        alt={item.nameEn}
                                        className="w-16 h-16 object-cover rounded-lg bg-gray-50"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-khmer text-sm mb-0.5 line-clamp-1">{item.nameKm}</h4>
                                        <p className="font-sans text-xs text-gray-500 mb-1 line-clamp-1">{item.nameEn}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-sans text-xs text-gray-600">Qty: {item.quantity}</span>
                                            <span className="font-sans text-sm font-medium">
                                                ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Price Breakdown */}
                        <div className="border-t border-gray-200 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-sans text-gray-600">Subtotal</span>
                                <span className="font-sans font-medium">${getCartTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-sans text-gray-600">Shipping</span>
                                <span className="font-sans text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                                <span className="font-sans">Total</span>
                                <span className="font-sans text-[#005E7B]">${getCartTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;