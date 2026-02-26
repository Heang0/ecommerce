import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById } from '../services/api';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
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
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };
        loadOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
            <div className="bg-white rounded-lg shadow-md p-8">
                <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2 font-khmer">ការបញ្ជាទិញបានជោគជ័យ!</h1>
                <p className="text-gray-600 mb-6 font-sans">Order placed successfully!</p>

                {order && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                        <p className="text-sm font-sans mb-2">
                            Order Number: <span className="font-bold">{order.orderNumber}</span>
                        </p>
                        <p className="text-sm text-gray-600 font-sans">
                            We'll contact you at {order.customer.phone} for delivery.
                        </p>
                    </div>
                )}

                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default OrderSuccess;