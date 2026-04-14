const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nickname: { type: String, default: '牛奶用户' },
  phone: { type: String, required: true, unique: true },
  avatar: String,
  addresses: [{
    name: String,
    phone: String,
    detail: String,
    isDefault: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
