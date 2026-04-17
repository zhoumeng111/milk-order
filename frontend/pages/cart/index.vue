<template>
  <view class="container">
    <!-- 全选栏 -->
    <view class="select-bar" v-if="cartItems.length">
      <checkbox :checked="isAllSelected" @click="toggleAll" />
      <text class="select-text">全选</text>
      <view class="spacer"></view>
      <text class="clear-btn" @click="clearCart">清空</text>
    </view>

    <!-- 购物车列表 -->
    <view class="cart-list" v-if="cartItems.length">
      <view class="cart-item" v-for="item in cartItems" :key="item.productId">
        <checkbox :checked="item.selected" @click="toggleSelect(item.productId)" />
        <image class="item-image" :src="item.image || '/static/milk-placeholder.png'" mode="aspectFill" />
        <view class="item-info">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-spec">{{ item.spec }}</text>
          <view class="item-bottom">
            <text class="item-price">¥{{ item.price }}</text>
            <view class="quantity-control">
              <text class="qty-btn" @click="decrease(item)">-</text>
              <text class="qty-num">{{ item.quantity }}</text>
              <text class="qty-btn" @click="increase(item)">+</text>
            </view>
          </view>
        </view>
        <text class="delete-btn" @click="removeItem(item.productId)">×</text>
      </view>
    </view>

    <!-- 空购物车 -->
    <view class="empty" v-else>
      <text class="empty-icon">🛒</text>
      <text class="empty-text">购物车是空的</text>
      <view class="go-shopping" @click="goShopping">去逛逛</view>
    </view>

    <!-- 底部结算栏 -->
    <view class="bottom-bar" v-if="cartItems.length">
      <view class="total">
        <text>合计：</text>
        <text class="total-price">¥{{ totalPrice }}</text>
      </view>
      <view class="checkout-btn" :class="{ disabled: selectedCount === 0 }" @click="checkout">
        结算 ({{ selectedCount }})
      </view>
    </view>
  </view>
</template>

<script>
const cartStore = require('../../store/cart.js');

module.exports = {
  data() {
    return {
      cartItems: []
    }
  },
  computed: {
    totalPrice() {
      return cartStore.getSelectedTotal().toFixed(2);
    },
    selectedCount() {
      return cartStore.getSelectedCount();
    },
    isAllSelected() {
      return this.cartItems.length > 0 && this.cartItems.every(i => i.selected);
    }
  },
  onShow() {
    this.loadCart();
  },
  methods: {
    loadCart() {
      this.cartItems = cartStore.getItems();
    },
    toggleSelect(productId) {
      cartStore.toggleSelect(productId);
      this.loadCart();
    },
    toggleAll() {
      cartStore.selectAll(!this.isAllSelected);
      this.loadCart();
    },
    decrease(item) {
      cartStore.updateQuantity(item.productId, item.quantity - 1);
      this.loadCart();
    },
    increase(item) {
      cartStore.updateQuantity(item.productId, item.quantity + 1);
      this.loadCart();
    },
    removeItem(productId) {
      uni.showModal({
        title: '提示',
        content: '确定删除该商品吗？',
        success: (res) => {
          if (res.confirm) {
            cartStore.removeItem(productId);
            this.loadCart();
          }
        }
      });
    },
    clearCart() {
      uni.showModal({
        title: '提示',
        content: '确定清空购物车吗？',
        success: (res) => {
          if (res.confirm) {
            cartStore.clear();
            this.loadCart();
          }
        }
      });
    },
    goShopping() {
      uni.switchTab({ url: '/pages/index/index' });
    },
    checkout() {
      if (this.selectedCount === 0) {
        uni.showToast({ title: '请选择商品', icon: 'none' });
        return;
      }
      uni.navigateTo({ url: '/pages/order/confirm' });
    }
  }
};
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; padding-bottom: 120rpx; }
.select-bar { display: flex; align-items: center; padding: 20rpx 30rpx; background: #fff; margin-bottom: 2rpx; }
.select-text { margin-left: 10rpx; font-size: 28rpx; color: #333; }
.spacer { flex: 1; }
.clear-btn { font-size: 26rpx; color: #ff5500; }
.cart-list { padding: 0 20rpx; }
.cart-item { display: flex; align-items: center; padding: 20rpx; background: #fff; margin-bottom: 2rpx; border-radius: 8rpx; position: relative; }
.item-image { width: 160rpx; height: 160rpx; background: #eee; margin: 0 20rpx; border-radius: 8rpx; flex-shrink: 0; }
.item-info { flex: 1; min-width: 0; }
.item-name { display: block; font-size: 28rpx; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.item-spec { display: block; font-size: 24rpx; color: #999; margin: 10rpx 0; }
.item-bottom { display: flex; justify-content: space-between; align-items: center; }
.item-price { color: #ff5500; font-size: 28rpx; font-weight: bold; }
.quantity-control { display: flex; align-items: center; }
.qty-btn { width: 50rpx; height: 50rpx; text-align: center; line-height: 50rpx; background: #f5f5f5; font-size: 28rpx; }
.qty-num { width: 50rpx; text-align: center; font-size: 28rpx; }
.delete-btn { position: absolute; top: 10rpx; right: 10rpx; font-size: 36rpx; color: #ccc; line-height: 1; padding: 10rpx; }
.empty { display: flex; flex-direction: column; align-items: center; padding-top: 200rpx; }
.empty-icon { font-size: 120rpx; margin-bottom: 30rpx; }
.empty-text { color: #999; font-size: 28rpx; margin-bottom: 30rpx; }
.go-shopping { background: #4A90D9; color: #fff; padding: 20rpx 60rpx; border-radius: 40rpx; font-size: 28rpx; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 100rpx; background: #fff; border-top: 1rpx solid #eee; align-items: center; justify-content: space-between; padding: 0 30rpx; }
.total { display: flex; align-items: baseline; font-size: 28rpx; }
.total-price { color: #ff5500; font-size: 36rpx; font-weight: bold; margin-left: 8rpx; }
.checkout-btn { background: #ff5500; color: #fff; padding: 22rpx 50rpx; border-radius: 40rpx; font-size: 30rpx; }
.checkout-btn.disabled { background: #ccc; }
</style>
