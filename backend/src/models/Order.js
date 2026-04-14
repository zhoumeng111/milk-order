const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  spec: String,
  price: Number,
  quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  orderNo: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 5 },
  address: {
    name: String,
    phone: String,
    detail: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'delivering', 'completed', 'cancelled'],
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
