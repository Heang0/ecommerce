import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';

const PaymentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

    const API_URL = import.meta.env.DEV
        ? 'http://localhost:5000/api'
        : `${window.location.origin}/api`;

    // Fetch order details
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`${API_URL}/orders/${id}`);
                const data = await response.json();
                if (data.success) {
                    setPayment(data.order);
                }
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    // Check payment status every 2 seconds
    useEffect(() => {
        const checkPayment = async () => {
            try {
                const response = await fetch(`${API_URL}/orders/${id}/check-payment`);
                const data = await response.json();

                if (data.paid) {
                    setPaymentStatus('paid');
                    setTimeout(() => navigate(`/order-success/${id}`), 2000);
                }
            } catch (error) {
                console.error('Error checking payment:', error);
            }
        };

        const interval = setInterval(checkPayment, 2000);
        return () => clearInterval(interval);
    }, [id, navigate]);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005E7B]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-1 text-gray-400 hover:text-[#005E7B] mb-6 text-sm"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                </button>

                <div className="text-center">
                    {paymentStatus === 'paid' ? (
                        <>
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={40} className="text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-green-600">Payment Successful!</h2>
                            <p className="text-gray-600">Redirecting to order confirmation...</p>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock size={40} className="text-[#005E7B]" />
                            </div>

                            <h1 className="text-2xl font-bold mb-2 font-khmer">បង់ប្រាក់តាម Bakong</h1>
                            <p className="text-gray-500 mb-6 font-sans">Scan QR code with Bakong app</p>

                            {/* Order Info */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                                <p className="text-sm text-gray-600 mb-1">
                                    Order: <span className="font-semibold">{payment?.orderNumber}</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Amount: <span className="font-semibold text-[#005E7B]">${payment?.total}</span>
                                </p>
                            </div>

                            {/* QR Code - WITH BAKONG LOGO */}
                            {payment?.qrImage && (
                                <div className="mb-6">
                                    <img
                                        src={payment.qrImage}
                                        alt="Bakong KHQR"
                                        className="w-64 h-64 mx-auto border-2 border-gray-200 rounded-lg p-2"
                                    />
                                </div>
                            )}

                            {/* Timer */}
                            <div className="mb-6">
                                <p className="text-sm text-gray-500">
                                    QR code expires in: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-center gap-2 text-gray-500">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#005E7B]"></div>
                                <span className="text-sm">Waiting for payment...</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;