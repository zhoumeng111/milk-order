<template>
  <view class="container">
    <image class="product-image" :src="product.image || '/static/milk-placeholder.png'" mode="aspectFill" />
    <view class="product-detail">
      <view class="price-row">
        <text class="price">¥{{ product.price }}</text>
        <text class="unit">/{{ product.spec }}</text>
      </view>
      <text class="name">{{ product.name }}</text>
      <text class="desc">{{ product.description || '优质牛奶，新鲜配送。' }}</text>
      <view class="stock-row" v-if="product.stock">
        <text class="stock-text">库存: {{ product.stock }} 件</text>
      </view>

      <view class="quantity-row">
        <text>数量</text>
        <view class="quantity-control">
          <text class="qty-btn" @click="decrease">-</text>
          <input class="qty-input" type="number" v-model="quantity" @change="onQuantityChange" />
          <text class="qty-btn" @click="increase">+</text>
        </view>
      </view>
    </view>

    <!-- 相关推荐可以后续扩展 -->

    <view class="bottom-bar">
      <view class="service-btn">
        <text>客服</text>
      </view>
      <view class="add-cart" @click="addToCart">加入购物车</view>
      <view class="buy-now" @click="buyNow">立即购买</view>
    </view>
  </view>
</template>

<script>
const { productApi } = require('../../api/index.js');
const cartStore = require('../../store/cart.js');

module.exports = {
  data() {
    return {
      productId: '',
      product: {},
      quantity: 1
    }
  },
  onLoad(options) {
    if (options.id) {
      this.productId = options.id;
      this.loadProduct();
    } else if (options.scene) {
      // 扫码等场景
      this.productId = options.scene;
      this.loadProduct();
    }
  },
  methods: {
    async loadProduct() {
      uni.showLoading({ title: '加载中...' });
      try {
        const res = await productApi.detail(this.productId);
        if (res.success) {
          this.product = res.data;
          uni.setNavigationBarTitle({ title: this.product.name });
        }
      } catch (e) {
        // 降级：使用假数据
        const mockProducts = {
          '1': { _id: '1', name: '每日鲜语鲜牛奶', spec: '1L/瓶', price: 19.9, description: '来自优质牧场的鲜牛奶，保留更多营养成分，口感醇厚。', image: '/static/milk1.jpg', stock: 50 },
          '2': { _id: '2', name: '安慕希酸奶', spec: '205g/盒', price: 12.9, description: '希腊风味酸奶，浓稠醇香。', image: '/static/milk2.jpg', stock: 80 },
          '3': { _id: '3', name: '伊利纯牛奶', spec: '250ml/盒', price: 3.5, description: '精选奶源，品质保证。', image: '/static/milk3.jpg', stock: 200 },
          '4': { _id: '4', name: '莫斯利安酸奶', spec: '200g/盒', price: 8.9, description: '长寿村菌种，常温酸奶。', image: '/static/milk4.jpg', stock: 60 }
        };
        this.product = mockProducts[this.productId] || mockProducts['1'];
      } finally {
        uni.hideLoading();
      }
    },
    decrease() {
      if (this.quantity > 1) this.quantity--;
    },
    increase() {
      if (this.product.stock && this.quantity >= this.product.stock) {
        uni.showToast({ title: '库存不足', icon: 'none' });
        return;
      }
      this.quantity++;
    },
    onQuantityChange() {
      const qty = parseInt(this.quantity);
      if (isNaN(qty) || qty < 1) this.quantity = 1;
      if (this.product.stock && qty > this.product.stock) {
        this.quantity = this.product.stock;
        uni.showToast({ title: '库存不足', icon: 'none' });
      }
    },
    addToCart() {
      cartStore.addItem(this.product, this.quantity);
      uni.showToast({ title: '已加入购物车', icon: 'success' });
    },
    buyNow() {
      // 直接购买：先把单个商品加入购物车，然后跳转确认页
      cartStore.clear();
      cartStore.addItem(this.product, this.quantity);
      uni.navigateTo({ url: '/pages/order/confirm' });
    }
  }
};
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
.stock-row { margin-top: 20rpx; }
.stock-text { font-size: 24rpx; color: #4A90D9; }
.quantity-row { display: flex; justify-content: space-between; align-items: center; margin-top: 30rpx; padding-top: 30rpx; border-top: 1rpx solid #eee; }
.quantity-row > text { font-size: 28rpx; color: #333; }
.quantity-control { display: flex; align-items: center; }
.qty-btn { width: 60rpx; height: 60rpx; text-align: center; line-height: 60rpx; background: #f5f5f5; font-size: 32rpx; border-radius: 8rpx; }
.qty-input { width: 80rpx; text-align: center; font-size: 28rpx; margin: 0 10rpx; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 100rpx; background: #fff; border-top: 1rpx solid #eee; }
.service-btn { width: 100rpx; display: flex; align-items: center; justify-content: center; font-size: 22rpx; color: #999; border-right: 1rpx solid #eee; }
.add-cart { flex: 1; display: flex; align-items: center; justify-content: center; background: #ff9900; color: #fff; font-size: 30rpx; }
.buy-now { flex: 1; display: flex; align-items: center; justify-content: center; background: #ff5500; color: #fff; font-size: 30rpx; }
</style>
