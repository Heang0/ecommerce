import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById } from '../services/api';
import { CheckCircle, Clock, ArrowLeft } from 'lucide-react';

const OrderTracking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const data = await fetchOrderById(id);
                setOrder(data);
            } catch (error) {
                console.error('Error loading order:', error);
            } finally {
                setLoading(false);
            }
        };
        loadOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005E7B]"></div>
            </div>
        );
    }

    if (!order || !order.order) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Order not found</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-4 py-2 bg-[#005E7B] text-white rounded-lg"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    // Safely access order data with fallbacks
    const orderData = order.order || order;
    const customerPhone = orderData.customer?.phone || 'N/A';
    const orderNumber = orderData.orderNumber || 'N/A';
    const orderTotal = orderData.total || 0;

    return (
        <div className="max-w-2xl mx-auto px-4 pt-2 pb-8">
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-[#005E7B] mb-6"
            >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
            </button>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                    <h1 className="text-2xl font-bold font-khmer mb-2">ការបញ្ជាទិញបានជោគជ័យ!</h1>
                    <p className="text-gray-600">Order placed successfully</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 mb-2">
                        Order Number: <span className="font-bold">{orderNumber}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                        Total: <span className="font-bold text-[#005E7B]">${orderTotal.toFixed(2)}</span>
                    </p>
                    <p className="text-sm text-gray-600">Payment Link:</p>
                    <a
                        href={`https://link.payway.com.kh/ABAPAYdj419233l?amount=${orderTotal}&orderId=${orderNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline break-all"
                    >
                        Click here to pay ${orderTotal.toFixed(2)}
                    </a>
                </div>

                <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 text-center">
                        We'll contact you at {customerPhone} for delivery confirmation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;