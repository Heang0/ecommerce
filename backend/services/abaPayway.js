const crypto = require('crypto');

class ABAPayway {
    constructor() {
        this.merchantId = process.env.ABA_MERCHANT_ID || 'TEST0123456';
        this.apiKey = process.env.ABA_API_KEY || 'test_abc123xyz789';
        this.baseUrl = process.env.ABA_BASE_URL || 'https://checkout-sandbox.payway.com.kh';
        this.returnUrl = process.env.ABA_RETURN_URL || 'http://localhost:5173/payment-success';
        this.continueUrl = process.env.ABA_CONTINUE_URL || 'http://localhost:5173/order-success';
    }

    // Generate hash for security
    generateHash(items, total) {
        const data = `${this.merchantId}${items}${total}${this.apiKey}`;
        return crypto.createHash('sha512').update(data).digest('hex');
    }

    // Create payment form data
    createPaymentData(order) {
        const total = order.total.toFixed(2);
        const itemsString = order.items.map(item =>
            `${item.nameEn}_${item.quantity}_${item.price}`
        ).join(',');

        const firstName = order.customer.fullName.split(' ')[0] || 'Customer';
        const lastName = order.customer.fullName.split(' ').slice(1).join(' ') || 'Name';

        return {
            req_time: new Date().toISOString().slice(0, 19).replace(/[-:T]/g, ''),
            merchant_id: this.merchantId,
            tran_id: order.orderNumber,
            amount: total,
            currency: 'USD',
            items: itemsString,
            hash: this.generateHash(itemsString, total),
            continue_url: this.continueUrl,
            return_url: this.returnUrl,
            payment_option: 'cards',
            firstname: firstName,
            lastname: lastName,
            phone: order.customer.phone,
            email: order.customer.email || 'customer@example.com',
            shipping: '0.00'
        };
    }
}

module.exports = new ABAPayway();