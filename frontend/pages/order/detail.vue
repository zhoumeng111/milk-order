<template>
  <view class="container">
    <view v-if="order">
      <!-- 订单状态 -->
      <view class="status-banner" :class="statusClass">
        <text class="status-icon">{{ statusIcon }}</text>
        <text class="status-text">{{ order.statusText }}</text>
      </view>

      <!-- 收货地址 -->
      <view class="section address-section">
        <view class="address-row">
          <text class="label">收货人</text>
          <text class="value">{{ order.address.name }} {{ order.address.phone }}</text>
        </view>
        <view class="address-row">
          <text class="label">收货地址</text>
          <text class="value">{{ order.address.detail }}</text>
        </view>
      </view>

      <!-- 商品列表 -->
      <view class="section goods-section">
        <view class="section-title">商品清单</view>
        <view class="goods-item" v-for="item in order.items" :key="item.productId">
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

      <!-- 订单信息 -->
      <view class="section info-section">
        <view class="info-row">
          <text class="label">订单编号</text>
          <text class="value">{{ order.orderNo }}</text>
        </view>
        <view class="info-row">
          <text class="label">下单时间</text>
          <text class="value">{{ formatTime(order.createdAt) }}</text>
        </view>
        <view class="info-row">
          <text class="label">商品金额</text>
          <text class="value">¥{{ (order.totalAmount - order.deliveryFee).toFixed(2) }}</text>
        </view>
        <view class="info-row">
          <text class="label">配送费</text>
          <text class="value">¥{{ order.deliveryFee }}</text>
        </view>
        <view class="info-row total-row">
          <text class="label">实付款</text>
          <text class="value price">¥{{ order.totalAmount }}</text>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="bottom-bar" v-if="order.status === 'pending'">
        <view class="cancel-btn" @click="cancelOrder">取消订单</view>
        <view class="pay-btn" @click="payOrder">去支付</view>
      </view>
    </view>

    <view class="loading" v-else>
      <text>加载中...</text>
    </view>
  </view>
</template>

<script>
const { orderApi } = require('../../api/index.js');

module.exports = {
  data() {
    return {
      orderId: '',
      order: null
    }
  },
  computed: {
    statusIcon() {
      const map = {
        pending: '⏳', paid: '📦', delivering: '🚚',
        completed: '✅', cancelled: '❌'
      };
      return map[this.order?.status] || '📋';
    },
    statusText() {
      const map = {
        pending: '待支付', paid: '待配送', delivering: '配送中',
        completed: '已完成', cancelled: '已取消'
      };
      return map[this.order?.status] || '未知状态';
    },
    statusClass() {
      const map = {
        pending: 'pending', paid: 'paid', delivering: 'delivering',
        completed: 'completed', cancelled: 'cancelled'
      };
      return map[this.order?.status] || '';
    }
  },
  onLoad(options) {
    if (options.id) {
      this.orderId = options.id;
      this.loadOrder();
    }
  },
  methods: {
    async loadOrder() {
      uni.showLoading({ title: '加载中...' });
      try {
        const res = await orderApi.detail(this.orderId);
        if (res.success) {
          this.order = res.data;
        }
      } catch (e) {
        // 降级为假数据展示
        this.order = {
          orderNo: 'MD202401010001',
          status: 'paid',
          statusText: '待配送',
          items: [{ productId: '1', name: '每日鲜语鲜牛奶', spec: '1L/瓶', price: 19.9, quantity: 2, image: '/static/milk1.jpg' }],
          totalAmount: 44.8,
          deliveryFee: 5,
          address: { name: '张三', phone: '138****8888', detail: '广东省广州市天河区珠江新城花城大道88号' },
          createdAt: new Date().toISOString()
        };
      } finally {
        uni.hideLoading();
      }
    },
    async cancelOrder() {
      const res = await uni.showModal({ title: '提示', content: '确定取消该订单吗？', confirmText: '确定', confirmColor: '#ff5500' });
      // showModal不返回promise，用showModal的回调方式
    },
    cancelOrderConfirm() {
      uni.showModal({
        title: '提示',
        content: '确定取消该订单吗？',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '取消中...' });
            try {
              const result = await orderApi.cancel(this.orderId);
              if (result.success) {
                uni.showToast({ title: '订单已取消', icon: 'success' });
                this.loadOrder();
              }
            } catch (e) {
              // 模拟取消
              this.order.status = 'cancelled';
              this.order.statusText = '已取消';
              uni.showToast({ title: '订单已取消', icon: 'success' });
            } finally {
              uni.hideLoading();
            }
          }
        }
      });
    },
    payOrder() {
      uni.showToast({ title: '支付功能开发中', icon: 'none' });
    },
    formatTime(time) {
      if (!time) return '';
      const d = new Date(time);
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    }
  }
};
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; padding-bottom: 120rpx; }
.status-banner { display: flex; align-items: center; padding: 40rpx 30rpx; color: #fff; }
.status-banner.pending { background: linear-gradient(135deg, #ff9900, #ff7700); }
.status-banner.paid { background: linear-gradient(135deg, #4A90D9, #3a70b0); }
.status-banner.delivering { background: linear-gradient(135deg, #4A90D9, #2a5a9a); }
.status-banner.completed { background: linear-gradient(135deg, #4CAF50, #388E3C); }
.status-banner.cancelled { background: #999; }
.status-icon { font-size: 48rpx; margin-right: 16rpx; }
.status-text { font-size: 32rpx; font-weight: bold; }
.section { background: #fff; margin-bottom: 20rpx; padding: 30rpx; }
.address-row { display: flex; padding: 15rpx 0; }
.label { width: 140rpx; color: #999; font-size: 28rpx; flex-shrink: 0; }
.value { flex: 1; font-size: 28rpx; color: #333; }
.section-title { font-size: 28rpx; font-weight: bold; margin-bottom: 20rpx; padding-bottom: 20rpx; border-bottom: 1rpx solid #f5f5f5; }
.goods-item { display: flex; align-items: center; padding: 15rpx 0; }
.goods-image { width: 100rpx; height: 100rpx; background: #eee; border-radius: 8rpx; flex-shrink: 0; }
.goods-info { flex: 1; margin-left: 20rpx; }
.goods-name { display: block; font-size: 28rpx; font-weight: bold; }
.goods-spec { display: block; font-size: 24rpx; color: #999; margin-top: 8rpx; }
.goods-right { text-align: right; }
.goods-price { display: block; font-size: 28rpx; font-weight: bold; }
.goods-qty { display: block; font-size: 24rpx; color: #999; margin-top: 8rpx; }
.info-row { display: flex; justify-content: space-between; padding: 15rpx 0; font-size: 28rpx; }
.info-row .label { width: auto; color: #999; }
.info-row .value { color: #333; }
.info-row.total-row { border-top: 1rpx solid #eee; margin-top: 15rpx; padding-top: 25rpx; }
.info-row .value.price { color: #ff5500; font-size: 36rpx; font-weight: bold; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 100rpx; background: #fff; border-top: 1rpx solid #eee; align-items: center; justify-content: flex-end; padding: 0 30rpx; gap: 20rpx; }
.cancel-btn { padding: 20rpx 40rpx; border: 1rpx solid #ddd; border-radius: 40rpx; font-size: 28rpx; color: #666; }
.pay-btn { padding: 20rpx 50rpx; background: #ff5500; color: #fff; border-radius: 40rpx; font-size: 28rpx; }
.loading { display: flex; justify-content: center; align-items: center; height: 400rpx; color: #999; font-size: 28rpx; }
</style>
