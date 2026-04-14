const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 获取用户信息
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建/更新用户
router.post('/', async (req, res) => {
  try {
    const { phone, nickname } = req.body;
    
    let user = await User.findOne({ phone });
    if (user) {
      // 更新
      user.nickname = nickname || user.nickname;
      await user.save();
    } else {
      // 创建
      user = new User({ phone, nickname });
      await user.save();
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 更新用户信息
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 添加收货地址
router.post('/:id/address', async (req, res) => {
  try {
    const { name, phone, detail, isDefault } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push({ name, phone, detail, isDefault: isDefault || false });
    await user.save();
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 获取收货地址列表
router.get('/:id/address', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    res.json({ success: true, data: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
