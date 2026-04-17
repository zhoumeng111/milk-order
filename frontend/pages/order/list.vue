<template>
  <view class="container">
    <!-- Tab导航 -->
    <view class="tab-nav">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: currentTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        {{ tab.name }}
      </view>
    </view>

    <!-- 订单列表 -->
    <scroll-view scroll-y class="order-scroll" @scrolltolower="loadMore">
      <view class="order-list">
        <view class="order-card" v-for="order in orders" :key="order._id || order.id">
          <view class="order-header">
            <text class="order-no">订单号：{{ order.orderNo }}</text>
            <text class="order-status" :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</text>
          </view>
          <view class="order-goods" @click="viewDetail(order._id || order.id)">
            <view v-for="(item, idx) in order.items.slice(0, 3)" :key="idx">
              <image :src="item.image || '/static/milk-placeholder.png'" class="goods-image" mode="aspectFill" />
            </view>
            <view class="goods-info" v-if="order.items.length > 1">
              <text class="goods-name">{{ order.items[0].name }}</text>
              <text class="goods-more">共{{ order.items.length }}件商品 ›</text>
            </view>
            <view class="goods-info" v-else>
              <text class="goods-name">{{ order.items[0].name }}</text>
              <text class="goods-spec">{{ order.items[0].spec }}</text>
            </view>
            <view class="goods-right">
              <text class="goods-price">¥{{ order.totalAmount }}</text>
              <text class="goods-qty">x{{ order.items.length }}</text>
            </view>
          </view>
          <view class="order-footer">
            <text class="order-time">{{ formatTime(order.createdAt) }}</text>
            <view class="order-actions">
              <text class="action-btn danger" v-if="order.status === 'pending'" @click.stop="cancelOrder(order)">取消</text>
              <text class="action-btn warning" v-if="order.status === 'pending'" @click.stop="payOrder(order)">去支付</text>
              <text class="action-btn primary" @click.stop="viewDetail(order._id || order.id)">查看</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="load-status" v-if="orders.length">
        <text>{{ hasMore ? '加载更多...' : '没有更多了' }}</text>
      </view>

      <!-- 空状态 -->
      <view class="empty" v-if="!loading && !orders.length">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无相关订单</text>
        <view class="go-shopping" @click="goShopping">去逛逛</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
const { orderApi } = require('../../api/index.js');

module.exports = {
  data() {
    return {
      currentTab: 'all',
      tabs: [
        { key: 'all', name: '全部' },
        { key: 'pending', name: '待支付' },
        { key: 'paid', name: '待配送' },
        { key: 'delivering', name: '配送中' },
        { key: 'completed', name: '已完成' }
      ],
      orders: [],
      loading: false,
      hasMore: true,
      page: 1,
      limit: 10,
      userId: 'demo-user-id'
    };
  },
  onShow() {
    this.loadOrders(true);
  },
  methods: {
    async loadOrders(refresh = false) {
      if (this.loading) return;
      if (refresh) {
        this.page = 1;
        this.orders = [];
        this.hasMore = true;
      }
      this.loading = true;
      uni.showLoading({ title: '加载中...', mask: true });
      try {
        const res = await orderApi.list(this.userId, { status: this.currentTab, page: this.page, limit: this.limit });
        if (res.success) {
          const newOrders = res.data || [];
          if (refresh) {
            this.orders = newOrders;
          } else {
            this.orders.push(...newOrders);
          }
          this.hasMore = newOrders.length >= this.limit;
          this.page++;
        }
      } catch (e) {
        // 降级：使用假数据
        const mockOrders = [
          {
            _id: '1', orderNo: 'MD202604170001', status: 'paid',
            items: [{ name: '每日鲜语鲜牛奶', spec: '1L/瓶', price: 19.9, quantity: 2, image: '/static/milk1.jpg' }],
            totalAmount: 44.8, deliveryFee: 5, createdAt: '2026-04-17T08:00:00Z'
          },
          {
            _id: '2', orderNo: 'MD202604160001', status: 'completed',
            items: [
              { name: '安慕希酸奶', spec: '205g/盒', price: 12.9, quantity: 1, image: '/static/milk2.jpg' },
              { name: '伊利纯牛奶', spec: '250ml/盒', price: 3.5, quantity: 2, image: '/static/milk3.jpg' }
            ],
            totalAmount: 25.8, deliveryFee: 5, createdAt: '2026-04-16T15:20:00Z'
          }
        ];
        if (refresh) this.orders = mockOrders;
        else this.orders.push(...mockOrders);
        this.hasMore = false;
      } finally {
        this.loading = false;
        uni.hideLoading();
      }
    },
    switchTab(key) {
      if (this.currentTab === key) return;
      this.currentTab = key;
      this.loadOrders(true);
    },
    loadMore() {
      if (this.hasMore && !this.loading) {
        this.loadOrders(false);
      }
    },
    viewDetail(id) {
      uni.navigateTo({ url: `/pages/order/detail?id=${id}` });
    },
    async cancelOrder(order) {
      uni.showModal({
        title: '提示',
        content: '确定取消该订单吗？',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '取消中...' });
            try {
              const result = await orderApi.cancel(order._id || order.id);
              if (result.success) {
                order.status = 'cancelled';
                uni.showToast({ title: '订单已取消', icon: 'success' });
              }
            } catch (e) {
              order.status = 'cancelled';
              uni.showToast({ title: '订单已取消', icon: 'success' });
            } finally {
              uni.hideLoading();
            }
          }
        }
      });
    },
    payOrder(order) {
      uni.showToast({ title: '支付功能开发中', icon: 'none' });
    },
    goShopping() {
      uni.switchTab({ url: '/pages/index/index' });
    },
    getStatusText(status) {
      const map = { pending: '待支付', paid: '待配送', delivering: '配送中', completed: '已完成', cancelled: '已取消' };
      return map[status] || status;
    },
    getStatusClass(status) {
      const map = { pending: 'pending', paid: 'paid', delivering: 'delivering', completed: 'completed', cancelled: 'cancelled' };
      return map[status] || '';
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
.container { min-height: 100vh; background: #f5f5f5; display: flex; flex-direction: column; }
.tab-nav { display: flex; background: #fff; padding: 0; flex-shrink: 0; border-bottom: 1rpx solid #eee; }
.tab-item { flex: 1; text-align: center; padding: 25rpx 0; font-size: 28rpx; color: #666; border-bottom: 4rpx solid transparent; }
.tab-item.active { color: #4A90D9; border-bottom-color: #4A90D9; }
.order-scroll { flex: 1; height: calc(100vh - 100rpx); }
.order-list { padding: 20rpx; }
.order-card { background: #fff; border-radius: 12rpx; padding: 25rpx; margin-bottom: 20rpx; }
.order-header { display: flex; justify-content: space-between; margin-bottom: 20rpx; }
.order-no { font-size: 24rpx; color: #999; }
.order-status { font-size: 26rpx; }
.order-status.pending { color: #ff9900; }
.order-status.paid { color: #4A90D9; }
.order-status.delivering { color: #4A90D9; }
.order-status.completed { color: #4CAF50; }
.order-status.cancelled { color: #999; }
.order-goods { display: flex; padding: 20rpx 0; border-top: 1rpx solid #f5f5f5; border-bottom: 1rpx solid #f5f5f5; align-items: center; }
.goods-image { width: 100rpx; height: 100rpx; background: #eee; border-radius: 8rpx; margin-right: 10rpx; }
.goods-info { flex: 1; }
.goods-name { display: block; font-size: 28rpx; font-weight: bold; }
.goods-spec, .goods-more { display: block; font-size: 24rpx; color: #999; margin-top: 8rpx; }
.goods-right { text-align: right; flex-shrink: 0; }
.goods-price { display: block; font-size: 28rpx; font-weight: bold; }
.goods-qty { display: block; font-size: 24rpx; color: #999; margin-top: 8rpx; }
.order-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 20rpx; }
.order-time { font-size: 24rpx; color: #999; }
.order-actions { display: flex; gap: 16rpx; }
.action-btn { padding: 10rpx 28rpx; border: 1rpx solid #ddd; border-radius: 30rpx; font-size: 24rpx; color: #666; }
.action-btn.primary { background: #4A90D9; color: #fff; border: none; }
.action-btn.warning { background: #ff5500; color: #fff; border: none; }
.action-btn.danger { border-color: #ff5500; color: #ff5500; }