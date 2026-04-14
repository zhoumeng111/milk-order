<template>
  <view class="container">
    <image class="product-image" :src="product.image" mode="aspectFill" />
    <view class="product-detail">
      <view class="price-row">
        <text class="price">¥{{ product.price }}</text>
        <text class="unit">/{{ product.spec }}</text>
      </view>
      <text class="name">{{ product.name }}</text>
      <text class="desc">{{ product.description }}</text>

      <view class="quantity-row">
        <text>数量</text>
        <view class="quantity-control">
          <text @click="decrease">-</text>
          <input type="number" v-model="quantity" />
          <text @click="increase">+</text>
        </view>
      </view>
    </view>

    <view class="bottom-bar">
      <view class="add-cart" @click="addToCart">加入购物车</view>
      <view class="buy-now" @click="buyNow">立即购买</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      product: {
        id: 1,
        name: '每日鲜语鲜牛奶',
        spec: '1L/瓶',
        price: 19.9,
        image: '/static/milk1.jpg',
        description: '来自优质牧场的鲜牛奶，保留更多营养成分，口感醇厚。'
      },
      quantity: 1
    }
  },
  methods: {
    decrease() {
      if (this.quantity > 1) this.quantity--
    },
    increase() {
      this.quantity++
    },
    addToCart() {
      uni.showToast({ title: '已加入购物车', icon: 'success' })
    },
    buyNow() {
      uni.navigateTo({ url: '/pages/order/confirm' })
    }
  }
}
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; padding-bottom: 120rpx; }
.product-image { width: 100%; height: 600rpx; background: #eee; }
.product-detail { background: #fff; padding: 30rpx; }
.price-row { display: flex; align-items: baseline; margin-bottom: 20rpx; }
.price { color: #ff5500; font-size: 48rpx; font-weight: bold; }
.unit { color: #999; font-size: 24rpx; margin-left: 10rpx; }
.name { font-size: 32rpx; font-weight: bold; display: block; margin-bottom: 15rpx; }
.desc { font-size: 26rpx; color: #666; display: block; line-height: 1.6; }
.quantity-row { display: flex; justify-content: space-between; align-items: center; margin-top: 30rpx; padding-top: 30rpx; border-top: 1rpx solid #eee; }
.quantity-control { display: flex; align-items: center; }
.quantity-control text { width: 60rpx; height: 60rpx; text-align: center; line-height: 60rpx; background: #f5f5f5; font-size: 32rpx; }
.quantity-control input { width: 80rpx; text-align: center; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 100rpx; background: #fff; border-top: 1rpx solid #eee; }
.add-cart, .buy-now { flex: 1; display: flex; align-items: center; justify-content: center; font-size: 30rpx; }
.add-cart { background: #ff9900; color: #fff; }
.buy-now { background: #ff5500; color: #fff; }
</style>
