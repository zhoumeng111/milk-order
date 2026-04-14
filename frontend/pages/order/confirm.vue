<template>
  <view class="container">
    <view class="address-section">
      <text class="section-title">收货地址</text>
      <view class="address-info">
        <view class="user-info">
          <text>张三</text>
          <text>138****8888</text>
        </view>
        <text class="address-text">广东省广州市天河区珠江新城花城大道88号</text>
      </view>
      <text class="edit-btn">修改</text>
    </view>

    <view class="goods-section">
      <view class="goods-item" v-for="item in orderItems" :key="item.id">
        <image :src="item.image" class="goods-image" />
        <view class="goods-info">
          <text class="goods-name">{{ item.name }}</text>
          <text class="goods-spec">{{ item.spec }}</text>
        </view>
        <view class="goods-right">
          <text class="goods-price">¥{{ item.price }}</text>
          <text class="goods-qty">x{{ item.quantity }}</text>
        </view>
      </view>
    </view>

    <view class="order-section">
      <view class="order-row">
        <text>商品金额</text>
        <text>¥{{ goodsAmount }}</text>
      </view>
      <view class="order-row">
        <text>配送费</text>
        <text>¥{{ deliveryFee }}</text>
      </view>
      <view class="order-row total">
        <text>合计</text>
        <text class="total-price">¥{{ totalAmount }}</text>
      </view>
    </view>

    <view class="bottom-bar">
      <view class="total-info">
        <text>实付款：</text>
        <text class="total-price">¥{{ totalAmount }}</text>
      </view>
      <view class="submit-btn" @click="submitOrder">提交订单</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderItems: [
        { id: 1, name: '每日鲜语鲜牛奶', spec: '1L/瓶', price: 19.9, quantity: 2, image: '/static/milk1.jpg' }
      ],
      deliveryFee: 5
    }
  },
  computed: {
    goodsAmount() {
      return this.orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
    },
    totalAmount() {
      return (parseFloat(this.goodsAmount) + this.deliveryFee).toFixed(2)
    }
  },
  methods: {
    submitOrder() {
      uni.showLoading({ title: '提交中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '订单提交成功', icon: 'success' })
        setTimeout(() => {
          uni.redirectTo({ url: '/pages/order/list' })
        }, 1500)
      }, 1000)
    }
  }
}
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; padding-bottom: 120rpx; }
.address-section { display: flex; background: #fff; padding: 30rpx; margin-bottom: 20rpx; align-items: center; }
.address-info { flex: 1; }
.user-info { display: flex; gap: 20rpx; margin-bottom: 10rpx; }
.address-text { font-size: 26rpx; color: #666; }
.edit-btn { color: #4A90D9; font-size: 26rpx; }
.goods-section { background: #fff; padding: 30rpx; margin-bottom: 20rpx; }
.goods-item { display: flex; align-items: center; padding: 20rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.goods-image { width: 120rpx; height: 120rpx; background: #eee; border-radius: 8rpx; }
.goods-info { flex: 1; margin-left: 20rpx; }
.goods-name { display: block; font-size: 28rpx; font-weight: bold; }
.goods-spec { display: block; font-size: 24rpx; color: #999; margin-top: 8rpx; }
.goods-right { text-align: right; }
.goods-price { display: block; font-size: 28rpx; color: #333; }
.goods-qty { display: block; font-size: 24rpx; color: #999; margin-top: 8rpx; }
.order-section { background: #fff; padding: 30rpx; }
.order-row { display: flex; justify-content: space-between; padding: 15rpx 0; font-size: 28rpx; }
.order-row.total { border-top: 1rpx solid #eee; margin-top: 15rpx; padding-top: 25rpx; }
.total-price { color: #ff5500; font-weight: bold; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 100rpx; background: #fff; border-top: 1rpx solid #eee; align-items: center; justify-content: space-between; padding: 0 30rpx; }
.total-info { display: flex; align-items: baseline; }
.total-info .total-price { font-size: 36rpx; }
.submit-btn { background: #ff5500; color: #fff; padding: 25rpx 60rpx; border-radius: 40rpx; font-size: 30rpx; }
</style>
