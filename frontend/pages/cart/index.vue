<template>
  <view class="container">
    <view class="cart-list" v-if="cartItems.length">
      <view class="cart-item" v-for="item in cartItems" :key="item.id">
        <checkbox :checked="item.selected" @click="toggleSelect(item.id)" />
        <image class="item-image" :src="item.image" mode="aspectFill" />
        <view class="item-info">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-spec">{{ item.spec }}</text>
          <view class="item-bottom">
            <text class="item-price">¥{{ item.price }}</text>
            <view class="quantity-control">
              <text @click="decrease(item)">-</text>
              <text>{{ item.quantity }}</text>
              <text @click="increase(item)">+</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="empty" v-else>
      <text>购物车是空的</text>
      <button @click="goShopping">去逛逛</button>
    </view>

    <view class="bottom-bar" v-if="cartItems.length">
      <view class="total">
        <text>合计：</text>
        <text class="total-price">¥{{ totalPrice }}</text>
      </view>
      <view class="checkout-btn" @click="checkout">结算 ({{ selectedCount }})</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [
        { id: 1, name: '每日鲜语鲜牛奶', spec: '1L/瓶', price: 19.9, quantity: 2, selected: true, image: '/static/milk1.jpg' }
      ]
    }
  },
  computed: {
    totalPrice() {
      return this.cartItems.filter(i => i.selected).reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
    },
    selectedCount() {
      return this.cartItems.filter(i => i.selected).length
    }
  },
  methods: {
    toggleSelect(id) {
      const item = this.cartItems.find(i => i.id === id)
      if (item) item.selected = !item.selected
    },
    decrease(item) {
      if (item.quantity > 1) item.quantity--
    },
    increase(item) {
      item.quantity++
    },
    goShopping() {
      uni.switchTab({ url: '/pages/index/index' })
    },
    checkout() {
      uni.navigateTo({ url: '/pages/order/confirm' })
    }
  }
}
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; padding-bottom: 120rpx; }
.cart-item { display: flex; align-items: center; padding: 20rpx; background: #fff; margin-bottom: 20rpx; }
.item-image { width: 160rpx; height: 160rpx; background: #eee; margin: 0 20rpx; border-radius: 8rpx; }
.item-info { flex: 1; }
.item-name { display: block; font-size: 28rpx; font-weight: bold; }
.item-spec { display: block; font-size: 24rpx; color: #999; margin: 10rpx 0; }
.item-bottom { display: flex; justify-content: space-between; align-items: center; }
.item-price { color: #ff5500; font-size: 28rpx; font-weight: bold; }
.quantity-control { display: flex; align-items: center; }
.quantity-control text { width: 50rpx; height: 50rpx; text-align: center; line-height: 50rpx; background: #f5f5f5; font-size: 28rpx; }
.empty { display: flex; flex-direction: column; align-items: center; padding-top: 200rpx; }
.empty text { color: #999; margin-bottom: 30rpx; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 100rpx; background: #fff; border-top: 1rpx solid #eee; align-items: center; justify-content: space-between; padding: 0 30rpx; }
.total { display: flex; align-items: baseline; }
.total-price { color: #ff5500; font-size: 36rpx; font-weight: bold; }
.checkout-btn { background: #ff5500; color: #fff; padding: 20rpx 50rpx; border-radius: 40rpx; }
</style>
