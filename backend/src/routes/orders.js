const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');

// 生成订单号
const generateOrderNo = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `MD${dateStr}${random}`;
};

// 创建订单
router.post('/', async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    
    // 计算总金额
    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += item.price * item.quantity;
    });
    const deliveryFee = 5;
    
    const order = new Order({
      orderNo: generateOrderNo(),
      userId,
      items,
      totalAmount,
      deliveryFee,
      address
    });
    
    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 获取用户订单列表
router.get('/user/:userId', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { userId: req.params.userId };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取订单详情
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId');
    if (!order) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新订单状态
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 取消订单
router.put('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
