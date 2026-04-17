<template>
  <view class="container">
    <!-- 用户头部 -->
    <view class="user-header">
      <view class="avatar-wrap" @click="editProfile">
        <image class="avatar" :src="user.avatar || '/static/avatar.png'" mode="aspectFill" />
        <view class="edit-tag">编辑</view>
      </view>
      <view class="user-info">
        <text class="nickname">{{ user.nickname || '牛奶用户' }}</text>
        <text class="phone">{{ user.phone || '点击登录' }}</text>
      </view>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-section">
      <view class="quick-item" @click="goTo('/pages/order/list?status=pending')">
        <text class="quick-icon">💳</text>
        <text class="quick-text">待支付</text>
      </view>
      <view class="quick-item" @click="goTo('/pages/order/list?status=paid')">
        <text class="quick-icon">📦</text>
        <text class="quick-text">待配送</text>
      </view>
      <view class="quick-item" @click="goTo('/pages/order/list?status=delivering')">
        <text class="quick-icon">🚚</text>
        <text class="quick-text">配送中</text>
      </view>
      <view class="quick-item" @click="goTo('/pages/order/list?status=completed')">
        <text class="quick-icon">✅</text>
        <text class="quick-text">已完成</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="goTo('/pages/user/address')">
        <text class="menu-icon">📍</text>
        <text class="menu-text">收货地址</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goTo('/pages/order/list')">
        <text class="menu-icon">📋</text>
        <text class="menu-text">我的订单</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="contactService">
        <text class="menu-icon">🔔</text>
        <text class="menu-text">消息通知</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="contactService">
        <text class="menu-icon">📞</text>
        <text class="menu-text">联系客服</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="showAbout">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="showSettings">
        <text class="menu-icon">⚙️</text>
        <text class="menu-text">设置</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script>
const { userApi } = require('../../api/index.js');

module.exports = {
  data() {
    return {
      userId: 'demo-user-id',
      user: {}
    };
  },
  onShow() {
    this.loadUser();
  },
  methods: {
    async loadUser() {
      try {
        const res = await userApi.profile(this.userId);
        if (res.success) {
          this.user = res.data;
        }
      } catch (e) {
        this.user = {
          nickname: '牛奶用户',
          phone: '138****8888',
          avatar: '/static/avatar.png'
        };
      }
    },
    goTo(url) {
      uni.navigateTo({ url });
    },
    editProfile() {
      uni.showToast({ title: '个人信息编辑开发中', icon: 'none' });
    },
    contactService() {
      uni.makePhoneCall({ phoneNumber: '400-800-0000' });
    },
    showAbout() {
      uni.showModal({
        title: '关于我们',
        content: '牛奶订购 v1.0.0\n为您提供新鲜牛奶配送服务。',
        showCancel: false
      });
    },
    showSettings() {
      uni.showToast({ title: '设置功能开发中', icon: 'none' });
    }
  }
};
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; padding-bottom: 40rpx; }
.user-header { display: flex; align-items: center; background: linear-gradient(135deg, #4A90D9, #3a70b0); padding: 60rpx 30rpx; }
.avatar-wrap { position: relative; margin-right: 30rpx; }
.avatar { width: 120rpx; height: 120rpx; background: rgba(255,255,255,0.3); border-radius: 60rpx; }
.edit-tag { position: absolute; bottom: 0; right: 0; background: #fff; color: #4A90D9; font-size: 20rpx; padding: 4rpx 12rpx; border-radius: 20rpx; }
.user-info { display: flex; flex-direction: column; }
.nickname { font-size: 36rpx; font-weight: bold; color: #fff; margin-bottom: 10rpx; }
.phone { font-size: 26rpx; color: rgba(255,255,255,0.8); }
.quick-section { display: flex; background: #fff; padding: 30rpx 0; margin-bottom: 20rpx; }
.quick-item { flex: 1; display: flex; flex-direction: column; align-items: center; }
.quick-icon { font-size: 48rpx; margin-bottom: 10rpx; }
.quick-text { font-size: 24rpx; color: #666; }
.menu-section { background: #fff; margin-bottom: 20rpx; }
.menu-item { display: flex; align-items: center; padding: 30rpx; border-bottom: 1rpx solid #f5f5f5; }
.menu-item:last-child { border-bottom: none; }
.menu-icon { font-size: 40rpx; margin-right: 20rpx; }
.menu-text { flex: 1; font-size: 28rpx; color: #333; }
.menu-arrow { color: #ccc; font-size: 36rpx; }
</style>
