<template>
  <view class="container">
    <view class="tab-nav">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: currentTab === tab.key }"
        @click="currentTab = tab.key"
      >
        {{ tab.name }}
      </view>
    </view>

    <view class="order-list">
      <view class="order-card" v-for="order in filteredOrders" :key="order.id">
        <view class="order-header">
          <text class="order-no">订单号：{{ order.no }}</text>
          <text class="order-status" :class="order.statusClass">{{ order.statusText }}</text>
        </view>
        <view class="order-goods">
          <image :src="order.goods[0].image" class="goods-image" />
          <view class="goods-info" v-if="order.goods.length > 1">
            <text class="goods-name">{{ order.goods[0].name }}</text>
            <text class="goods-more">共{{ order.goods.length }}件商品</text>
          </view>
          <view class="goods-info" v-else>
            <text class="goods-name">{{ order.goods[0].name }}</text>
            <text class="goods-spec">{{ order.goods[0].spec }}</text>
          </view>
          <view class="goods-right">
            <text class="goods-price">¥{{ order.total }}</text>
            <text class="goods-qty">x{{ order.goods.length }}</text>
          </view>
        </view>
        <view class="order-footer">
          <text class="order-time">{{ order.time }}</text>
          <view class="order-actions">
            <text class="action-btn" v-if="order.status === 'pending'" @click="cancelOrder(order.id)">取消</text>
            <text class="action-btn primary" @click="viewDetail(order.id)">查看</text>
          </view>
        </view>
      </view>
    </view>

    <view class="empty" v-if="!filteredOrders.length">
      <text>暂无订单</text>
    </view>
  </view>
</template>

<script>
export default {
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
      orders: [
        {
          id: 1,
          no: 'MD202401010001',
          status: 'paid',
          statusText: '待配送',
          statusClass: 'warning',
          goods: [{ name: '每日鲜语鲜牛奶', spec: '1L/瓶', image: '/static/milk1.jpg' }],
          total: 39.8,
          time: '2024-01-15 10:30'
        },
        {
          id: 2,
          no: 'MD202401010002',
          status: 'completed',
          statusText: '已完成',
          statusClass: 'success',
          goods: [
            { name: '安慕希酸奶', spec: '205g/盒', image: '/static/milk2.jpg' },
            { name: '伊利纯牛奶', spec: '250ml/盒', image: '/static/milk3.jpg' }
          ],
          total: 25.8,
          time: '2024-01-14 15:20'
        }
      ]
    }
  },
  computed: {
    filteredOrders() {
      if (this.currentTab === 'all') return this.orders
      return this.orders.filter(o => o.status === this.currentTab)
    }
  },
  methods: {
    cancelOrder(id) {
      uni.showModal({
        title: '提示',
        content: '确定取消该订单吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '订单已取消', icon: 'success' })
          }
        }
      })
    },
    viewDetail(id) {
      uni.navigateTo({ url: `/pages/order/detail?id=${id}` })
    }
  }
}
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; }
.tab-nav { display: flex; background: #fff; padding: 0 20rpx; }
.tab-item { flex: 1; text-align: center; padding: 25rpx 0; font-size: 28rpx; color: #666; border-bottom: 4rpx solid transparent; }
.tab-item.active { color: #4A90D9; border-bottom-color: #4A90D9; }
.order-list { padding: 20rpx; }
.order-card { background: #fff; border-radius: 12rpx; padding: 25rpx; margin-bottom: 20rpx; }
.order-header { display: flex; justify-content: space-between; margin-bottom: 20rpx; }
.order-no { font-size: 24rpx; color: #999; }
.order-status { font-size: 26rpx; }
.order-status.warning { color: #ff9900; }
.order-status.success { color: #4CAF50; }
.order-status.pending { color: #999; }
.order-goods { display: flex; padding: 20rpx 0; border-top: 1rpx solid #f5f5f5; border-bottom: 1rpx solid #f5f5f5; }
.goods-image { width: 120rpx; height: 120rpx; background: #eee; border-radius: 8rpx; }
.goods-info { flex: 1; margin-left: 20rpx; }
.goods-name { display: block; font-size: 28rpx; font-weight: bold; }
.goods-spec, .goods-more { display: block; font-size: 24rpx; color: #999; margin-top: 8rpx; }
.goods-right { text-align: right; }
.goods-price { display: block; font-size: 28rpx; font-weight: bold; }
.goods-qty { display: block; font-size: 24rpx; color: #999; margin-top: 8rpx; }
.order-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 20rpx; }
.order-time { font-size: 24rpx; color: #999; }
.order-actions { display: flex; gap: 20rpx; }
.action-btn { padding: 10rpx 30rpx; border: 1rpx solid #ddd; border-radius: 30rpx; font-size: 24rpx; color: #666; }
.action-btn.primary { background: #4A90D9; color: #fff; border: none; }
.empty { display: flex; flex-direction: column; align-items: center; padding-top: 200rpx; }
.empty text { color: #999; }
</style>
