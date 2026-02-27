import { useState, useEffect } from 'react';
import { Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Search and Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    const API_URL = import.meta.env.DEV
        ? 'http://localhost:5000/api'
        : 'https://sabay-tenh.onrender.com/api';

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...orders];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(order =>
                order.orderNumber?.toLowerCase().includes(term) ||
                order.customer?.fullName?.toLowerCase().includes(term) ||
                order.customer?.phone?.includes(term)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.orderStatus === statusFilter);
        }

        // Payment filter
        if (paymentFilter !== 'all') {
            filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
        }

        setFilteredOrders(filtered);
        setCurrentPage(1);
    }, [searchTerm, statusFilter, paymentFilter, orders]);

    // Pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const updateOrderStatus = async (orderId, status) => {
        const token = localStorage.getItem('token');
        try {
            await fetch(`${API_URL}/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ orderStatus: status })
            });
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const updatePaymentStatus = async (orderId, status) => {
        const token = localStorage.getItem('token');
        try {
            await fetch(`${API_URL}/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ paymentStatus: status })
            });
            fetchOrders();
        } catch (error) {
            console.error('Error updating payment:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            case 'shipped': return 'bg-purple-100 text-purple-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'failed': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setPaymentFilter('all');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2 font-khmer">គ្រប់គ្រងការបញ្ជាទិញ</h2>
                    <p className="text-gray-600 font-sans">Orders Management</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                {/* Search Bar */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by order number, customer name, or phone..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    />
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                </div>

                {/* Filter Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    >
                        <option value="all">All Payments</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                    </select>

                    {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all') && (
                        <button
                            onClick={clearFilters}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-sans border border-red-200"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Results Count */}
                <div className="mt-3 text-sm text-gray-500 font-sans">
                    Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {currentOrders.map(order => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-sans text-sm font-medium">{order.orderNumber || 'N/A'}</td>
                                <td className="px-4 py-3">
                                    <div className="font-sans text-sm">{order.customer?.fullName || 'N/A'}</div>
                                    <div className="text-xs text-gray-500">{order.customer?.phone || 'N/A'}</div>
                                </td>
                                <td className="px-4 py-3 font-sans text-sm font-medium">${order.total?.toFixed(2) || '0.00'}</td>
                                <td className="px-4 py-3">
                                    <select
                                        value={order.paymentStatus || 'pending'}
                                        onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                                        className={`text-xs px-2 py-1 rounded font-sans border-0 cursor-pointer ${getPaymentStatusColor(order.paymentStatus || 'pending')}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={order.orderStatus || 'pending'}
                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                        className={`text-xs px-2 py-1 rounded font-sans border-0 cursor-pointer ${getStatusColor(order.orderStatus || 'pending')}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 font-sans text-xs text-gray-500">
                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {filteredOrders.length > 0 && (
                    <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
                        <div className="text-sm text-gray-500 font-sans">
                            Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className={`p-2 rounded ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="px-3 py-1 text-sm font-sans">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold font-sans">Order Details</h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        {/* Order details content */}
                        <div className="space-y-4">
                            <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                            <p><strong>Customer:</strong> {selectedOrder.customer?.fullName}</p>
                            <p><strong>Phone:</strong> {selectedOrder.customer?.phone}</p>
                            <p><strong>Address:</strong> {selectedOrder.customer?.address}</p>
                            <p><strong>Total:</strong> ${selectedOrder.total?.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;