const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const ProductSchema =new Schema ({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    qty: {
        type: Number,
        required: true
    },
    availableQuantity: {
        type: Number,
        required: true
    },
    date:{
        type:Date,
        default:Date.now
    }
});


module.exports = mongoose.model('products', ProductSchema);

