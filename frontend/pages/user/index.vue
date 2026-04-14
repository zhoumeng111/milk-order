<template>
  <view class="container">
    <view class="user-header">
      <image class="avatar" src="/static/avatar.png" />
      <view class="user-info">
        <text class="nickname">牛奶用户</text>
        <text class="phone">138****8888</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="goTo('/pages/order/list')">
        <text class="menu-icon">📦</text>
        <text class="menu-text">我的订单</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="goTo('/pages/user/address')">
        <text class="menu-icon">📍</text>
        <text class="menu-text">收货地址</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item">
        <text class="menu-icon">🔔</text>
        <text class="menu-text">消息通知</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item">
        <text class="menu-icon">⚙️</text>
        <text class="menu-text">设置</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item">
        <text class="menu-icon">📞</text>
        <text class="menu-text">联系客服</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">></text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    goTo(url) {
      uni.navigateTo({ url })
    }
  }
}
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; }
.user-header { display: flex; align-items: center; background: #4A90D9; padding: 60rpx 30rpx; }
.avatar { width: 120rpx; height: 120rpx; background: #fff; border-radius: 60rpx; margin-right: 30rpx; }
.user-info { display: flex; flex-direction: column; }
.nickname { font-size: 36rpx; font-weight: bold; color: #fff; margin-bottom: 10rpx; }
.phone { font-size: 26rpx; color: rgba(255,255,255,0.8); }
.menu-section { background: #fff; margin-bottom: 20rpx; }
.menu-item { display: flex; align-items: center; padding: 30rpx; border-bottom: 1rpx solid #f5f5f5; }
.menu-item:last-child { border-bottom: none; }
.menu-icon { font-size: 40rpx; margin-right: 20rpx; }
.menu-text { flex: 1; font-size: 28rpx; color: #333; }
.menu-arrow { color: #ccc; font-size: 28rpx; }
</style>
