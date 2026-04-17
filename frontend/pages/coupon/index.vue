<template>
  <view class="container">
    <view class="coupon-list">
      <view class="coupon-card" v-for="coupon in coupons" :key="coupon.id">
        <view class="coupon-left">
          <text class="coupon-value">{{ coupon.value }}</text>
          <text class="coupon-unit">元</text>
        </view>
        <view class="coupon-right">
          <text class="coupon-title">{{ coupon.title }}</text>
          <text class="coupon-desc">{{ coupon.desc }}</text>
          <text class="coupon-time">有效期至 {{ coupon.expire }}</text>
        </view>
        <view class="coupon-action" @click="receiveCoupon(coupon)">
          <text>{{ coupon.received ? '已领取' : '立即领取' }}</text>
        </view>
      </view>
    </view>
    <view class="empty" v-if="!coupons.length">
      <text>暂无可领取优惠券</text>
    </view>
  </view>
</template>

<script>
module.exports = {
  data() {
    return {
      coupons: [
        { id: 1, value: '10', title: '新人专享券', desc: '满59元可用', expire: '2026-04-30', received: false },
        { id: 2, value: '20', title: '满减优惠券', desc: '满129元可用', expire: '2026-05-15', received: false },
        { id: 3, value: '5', title: '配送费券', desc: '无门槛', expire: '2026-04-25', received: false }
      ]
    };
  },
  methods: {
    receiveCoupon(coupon) {
      if (coupon.received) return;
      coupon.received = true;
      uni.showToast({ title: '领取成功', icon: 'success' });
    }
  }
};
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; padding: 20rpx; }
.coupon-card { display: flex; background: #fff; margin-bottom: 20rpx; border-radius: 12rpx; overflow: hidden; }
.coupon-left { width: 180rpx; background: linear-gradient(135deg, #ff5500, #ff7700); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; padding: 30rpx 0; }
.coupon-value { font-size: 56rpx; font-weight: bold; }
.coupon-unit { font-size: 24rpx; }
.coupon-right { flex: 1; padding: 30rpx 20rpx; }
.coupon-title { display: block; font-size: 30rpx; font-weight: bold; margin-bottom: 10rpx; }
.coupon-desc { display: block; font-size: 24rpx; color: #666; margin-bottom: 10rpx; }
.coupon-time { font-size: 22rpx; color: #999; }
.coupon-action { width: 160rpx; display: flex; align-items: center; justify-content: center; background: #ff5500; color: #fff; font-size: 26rpx; }
.coupon-action text { color: #fff; font-size: 26rpx; }
.empty { text-align: center; padding-top: 200rpx; color: #999; font-size: 28rpx; }
</style>
