<template>
  <view class="container">
    <!-- Tab切换 -->
    <view class="tabs">
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'available' }"
        @click="currentTab = 'available'"
      >可使用</view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'used' }"
        @click="currentTab = 'used'"
      >已使用</view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'expired' }"
        @click="currentTab = 'expired'"
      >已过期</view>
    </view>

    <!-- 优惠券列表 -->
    <view class="coupon-list">
      <view 
        v-for="coupon in filteredCoupons" 
        :key="coupon.id"
        class="coupon-card"
        :class="{ disabled: currentTab !== 'available' }"
      >
        <view class="coupon-left">
          <text class="coupon-value">{{ coupon.value }}</text>
          <text class="coupon-unit">元</text>
        </view>
        <view class="coupon-right">
          <text class="coupon-name">{{ coupon.name }}</text>
          <text class="coupon-condition">{{ coupon.condition }}</text>
          <text class="coupon-expire">有效期至 {{ coupon.expireDate }}</text>
        </view>
        <view class="coupon-tag" v-if="currentTab === 'available'">立即使用</view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty" v-if="!filteredCoupons.length">
      <text class="empty-icon">🎫</text>
      <text class="empty-text">{{ emptyText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'available',
      coupons: [
        { id: 1, name: '新人专享券', value: 10, condition: '满50元可用', expireDate: '2026-12-31', status: 'available' },
        { id: 2, name: '会员满减券', value: 20, condition: '满100元可用', expireDate: '2026-06-30', status: 'available' },
        { id: 3, name: '限时折扣券', value: 5, condition: '满30元可用', expireDate: '2026-05-01', status: 'used' },
        { id: 4, name: '节日特惠券', value: 15, condition: '满80元可用', expireDate: '2026-03-01', status: 'expired' }
      ]
    }
  },
  computed: {
    filteredCoupons() {
      return this.coupons.filter(c => c.status === this.currentTab)
    },
    emptyText() {
      const texts = {
        available: '暂无可用优惠券',
        used: '暂无已使用优惠券',
        expired: '暂无已过期优惠券'
      }
      return texts[this.currentTab]
    }
  }
}
</script>

<style scoped>
.container {
  background: #f5f5f5;
  min-height: 100vh;
}
.tabs {
  display: flex;
  background: #fff;
  border-bottom: 1rpx solid #eee;
}
.tab-item {
  flex: 1;
  text-align: center;
  padding: 30rpx 0;
  font-size: 28rpx;
  color: #666;
}
.tab-item.active {
  color: #4A90D9;
  font-weight: bold;
  border-bottom: 4rpx solid #4A90D9;
}
.coupon-list {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.coupon-card {
  display: flex;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;
}
.coupon-card.disabled {
  opacity: 0.6;
}
.coupon-left {
  width: 180rpx;
  background: #ff5500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0;
}
.coupon-value {
  font-size: 60rpx;
  font-weight: bold;
  color: #fff;
}
.coupon-unit {
  font-size: 28rpx;
  color: #fff;
  margin-left: 8rpx;
}
.coupon-right {
  flex: 1;
  padding: 20rpx 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.coupon-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}
.coupon-condition {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}
.coupon-expire {
  font-size: 22rpx;
  color: #ccc;
}
.coupon-tag {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  background: #4A90D9;
  color: #fff;
  font-size: 22rpx;
  padding: 10rpx 20rpx;
  border-radius: 30rpx;
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 150rpx 0;
}
.empty-icon {
  font-size: 100rpx;
  margin-bottom: 30rpx;
}
.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>
