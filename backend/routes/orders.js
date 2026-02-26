const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const bakong = require('../services/bakong');  // Move require to top

// Helper function to generate order number
const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${year}${month}${day}-${random}`;
};

// ========== PUBLIC ROUTES ==========

// CREATE order (public - checkout with Bakong KHQR)
router.post('/', async (req, res) => {
    try {
        console.log('📦 Creating new order with Bakong KHQR...');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        // Validate required fields
        if (!req.body.customer || !req.body.customer.fullName || !req.body.customer.phone || !req.body.customer.address) {
            return res.status(400).json({
                success: false,
                message: 'Missing required customer information'
            });
        }

        if (!req.body.items || req.body.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order must contain at least one item'
            });
        }

        // Generate order number manually
        const orderNumber = generateOrderNumber();
        console.log('Generated order number:', orderNumber);

        // Create order data with manual orderNumber
        const orderData = {
            orderNumber: orderNumber,
            customer: {
                fullName: req.body.customer.fullName,
                phone: req.body.customer.phone,
                address: req.body.customer.address,
                email: req.body.customer.email || '',
                note: req.body.customer.note || ''
            },
            items: req.body.items.map(item => ({
                productId: item.productId,
                nameKm: item.nameKm,
                nameEn: item.nameEn,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            subtotal: req.body.subtotal,
            total: req.body.total,
            paymentMethod: 'Bakong KHQR',
            paymentStatus: 'pending',
            orderStatus: 'pending'
        };

        // Create and save order
        const order = new Order(orderData);
        const savedOrder = await order.save();

        console.log('✅ Order saved to database:', savedOrder.orderNumber);

        // Generate Bakong KHQR for this order
        console.log('🔄 Generating Bakong KHQR...');
        const khqr = await bakong.generateKHQR(savedOrder);

        // Save MD5 to order for later verification
        savedOrder.paymentMd5 = khqr.md5;
        savedOrder.paymentData = {
            amountKHR: khqr.amountKHR,
            qrCode: khqr.qrCode,
            qrImage: khqr.qrImage
        };
        await savedOrder.save();

        console.log('✅ KHQR generated successfully:', khqr.md5);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: {
                id: savedOrder._id,
                orderNumber: savedOrder.orderNumber,
                total: savedOrder.total,
                paymentStatus: savedOrder.paymentStatus,
                createdAt: savedOrder.createdAt,
                qrImage: khqr.qrImage  // Send QR image to frontend
            },
            payment: {
                qrImage: khqr.qrImage,
                md5: khqr.md5,
                amountUSD: khqr.amountUSD,
                amountKHR: khqr.amountKHR
            }
        });

    } catch (error) {
        console.error('❌ Order creation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create order'
        });
    }
});

// Check payment status
router.get('/:id/check-payment', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (!order.paymentMd5) {
            return res.status(400).json({ success: false, message: 'No payment MD5' });
        }

        const result = await bakong.checkPaymentStatus(order.paymentMd5);

        // If payment confirmed, update order
        if (result.status === 'PAID' && order.paymentStatus !== 'paid') {
            order.paymentStatus = 'paid';
            await order.save();
        }

        res.json({
            success: true,
            paid: order.paymentStatus === 'paid',
            status: result.status
        });

    } catch (error) {
        console.error('Error checking payment:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order: {
                id: order._id,
                orderNumber: order.orderNumber,
                total: order.total,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus,
                qrImage: order.paymentData?.qrImage,
                createdAt: order.createdAt
            }
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ========== ADMIN ROUTES (Protected) ==========

// GET all orders (admin only)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// UPDATE order status (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (req.body.orderStatus) order.orderStatus = req.body.orderStatus;
        if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;

        const updatedOrder = await order.save();

        res.json({
            success: true,
            message: 'Order updated successfully',
            order: updatedOrder
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;