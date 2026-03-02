const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nameKm: {
        type: String,
        required: true
    },
    nameEn: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
        default: null
    },
    onSale: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    brand: {
        type: String,
        default: 'Generic'
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});



module.exports = mongoose.model('Product', productSchema);