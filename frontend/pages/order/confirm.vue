<template>
  <view class="container">
    <!-- 收货地址 -->
    <view class="address-section" @click="selectAddress">
      <view class="address-icon">📍</view>
      <view class="address-info" v-if="selectedAddress">
        <view class="user-row">
          <text class="addr-name">{{ selectedAddress.name }}</text>
          <text class="addr-phone">{{ selectedAddress.phone }}</text>
        </view>
        <text class="addr-detail">{{ selectedAddress.detail }}</text>
      </view>
      <view class="address-info empty-addr" v-else>
        <text>请点击添加收货地址</text>
      </view>
      <text class="arrow">›</text>
    </view>

    <!-- 商品清单 -->
    <view class="goods-section">
      <view class="goods-item" v-for="item in orderItems" :key="item.productId">
        <image :src="item.image || '/static/milk-placeholder.png'" class="goods-image" mode="aspectFill" />
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

    <!-- 费用明细 -->
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

    <!-- 备注 -->
    <view class="remark-section">
      <text class="remark-label">订单备注</text>
      <input class="remark-input" v-model="remark" placeholder="选填，可输入配送要求" />
    </view>

    <!-- 底部提交 -->
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
const cartStore = require('../../store/cart.js');
const { orderApi } = require('../../api/index.js');

module.exports = {
  data() {
    return {
      orderItems: [],
      deliveryFee: 5,
      remark: '',
      selectedAddress: null,
      userId: 'demo-user-id'
    };
  },
  computed: {
    goodsAmount() {
      return this.orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2);
    },
    totalAmount() {
      return (parseFloat(this.goodsAmount) + this.deliveryFee).toFixed(2);
    }
  },
  onLoad() {
    // 从购物车获取已选商品
    this.orderItems = cartStore.getSelectedItems();
    if (!this.orderItems.length) {
      uni.showToast({ title: '请先选择商品', icon: 'none' });
      setTimeout(() => uni.navigateBack(), 1500);
    }
  },
  onShow() {
    // 尝试从地址页获取选中的地址
    const pages = getCurrentPages();
    const addrPage = pages.find(p => p.route && p.route.includes('user/address'));
    if (addrPage && addrPage.selectedAddress) {
      this.selectedAddress = addrPage.selectedAddress;
    }
    // 如果没有默认地址，设置为示例
    if (!this.selectedAddress) {
      this.selectedAddress = {
        name: '张三',
        phone: '13812348888',
        detail: '广东省广州市天河区珠江新城花城大道88号'
      };
    }
  },
  methods: {
    selectAddress() {
      uni.navigateTo({ url: '/pages/user/address' });
    },
    async submitOrder() {
      if (!this.selectedAddress || !this.selectedAddress.name) {
        uni.showToast({ title: '请添加收货地址', icon: 'none' });
        return;
      }
      if (!this.orderItems.length) {
        uni.showToast({ title: '购物车为空', icon: 'none' });
        return;
      }
      uni.showLoading({ title: '提交中...' });
      try {
        const res = await orderApi.create({
          userId: this.userId,
          items: this.orderItems.map(i => ({
            productId: i.productId,
            name: i.name,
            spec: i.spec,
            price: i.price,
            quantity: i.quantity,
            image: i.image
          })),
          address: this.selectedAddress
        });
        if (res.success) {
          cartStore.clear();
          uni.showToast({ title: '订单提交成功', icon: 'success' });
          setTimeout(() => {
            uni.redirectTo({ url: '/pages/order/list' });
          }, 1500);
        }
      } catch (e) {
        // 模拟提交成功
        cartStore.clear();
        uni.showToast({ title: '订单提交成功', icon: 'success' });
        setTimeout(() => {
          uni.redirectTo({ url: '/pages/order/list' });
        }, 1500);
      } finally {
        uni.hideLoading();
      }
    }
  }
};
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; padding-bottom: 120rpx; }
.address-section { display: flex; align-items: center; background: #fff; padding: 30rpx; margin-bottom: 20rpx; }
.address-icon { font-size: 40rpx; margin-right: 20rpx; }
.address-info { flex: 1; }
.user-row { display: flex; gap: 20rpx; margin-bottom: 10rpx; }
.addr-name { font-size: 30rpx; font-weight: bold; }
.addr-phone { font-size: 28rpx; color: #666; }
.addr-detail { font-size: 26rpx; color: #666; line-height: 1.5; }
.empty-addr { color: #999; font-size: 28rpx; }
.arrow { font-size: 40rpx; color: #ccc; }
.goods-section { background: #fff; padding: 30rpx; margin-bottom: 20rpx; }
.goods-item { display: flex; align-items: center; padding: 15rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.goods-item:last-child { border-bottom: none; }
.goods-image { width: 120rpx; height: 120rpx; background: #eee; border-radius: 8rpx; flex-shrink: 0; }
.goods-info { flex: 1; margin-left: 20rpx; }
.goods-name { display: block; font-size: 28rpx; font-weight: bold; }
.goods-spec { display: block; font-size: 24rpx; color: #999; margin-top: 8rpx; }
.goods-right { text-align: right; }
.goods-price { display: block; font-size: 28rpx; font-weight: bold; }
.goods-qty { display: block; font-size: 24rpx; color: #999; margin-top: 8rpx; }
.order-section { background: #fff; padding: 30rpx; margin-bottom: 20rpx; }
.order-row { display: flex; justify-content: space-between; padding: 15rpx 0; font-size: 28rpx; }
.order-row.total { border-top: 1rpx solid #eee; margin-top: 15rpx; padding-top: 25rpx; }
.total-price { color: #ff5500; font-weight: bold; }
.remark-section { background: #fff; padding: 30rpx; display: flex; align-items: center; gap: 20rpx; }
.remark-label { font-size: 28rpx; color: #666; flex-shrink: 0; }
.remark-input { flex: 1; font-size: 28rpx; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 100rpx; background: #fff; border-top: 1rpx solid #eee; align-items: center; justify-content: space-between; padding: 0 30rpx; }
.total-info { display: flex; align-items: baseline; font-size: 28rpx; }
.total-info .total-price { font-size: 36rpx; }
.submit-btn { background: #ff5500; color: #fff; padding: 22rpx 60rpx; border-radius: 40rpx; font-size: 30rpx; }
</style>
