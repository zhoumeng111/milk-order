<template>
  <view class="container">
    <view class="category-layout">
      <!-- 左侧分类导航 -->
      <scroll-view class="left-nav" scroll-y>
        <view
          v-for="cat in categories"
          :key="cat.id"
          class="cat-item"
          :class="{ active: currentCat === cat.id }"
          @click="selectCat(cat.id)"
        >
          <text>{{ cat.name }}</text>
        </view>
      </scroll-view>

      <!-- 右侧商品列表 -->
      <scroll-view class="right-list" scroll-y>
        <view class="sub-title">{{ currentCatName }}</view>
        <view class="product-grid">
          <view
            v-for="item in filteredProducts"
            :key="item._id || item.id"
            class="product-card"
            @click="goToDetail(item._id || item.id)"
          >
            <image :src="item.image || '/static/milk-placeholder.jpg'" mode="aspectFill" class="p-img" />
            <text class="p-name">{{ item.name }}</text>
            <text class="p-price">¥{{ item.price }}</text>
          </view>
        </view>
        <view class="empty" v-if="!filteredProducts.length">
          <text>该分类暂无商品</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
const { productApi } = require('../../api/index.js');
module.exports = {
  data() {
    return {
      currentCat: 'all',
      categories: [
        { id: 'all', name: '全部' },
        { id: 'fresh', name: '鲜奶' },
        { id: 'yogurt', name: '酸奶' },
        { id: 'milk', name: '纯牛奶' },
        { id: 'cheese', name: '奶酪' }
      ],
      allProducts: []
    };
  },
  computed: {
    currentCatName() {
      return this.categories.find(c => c.id === this.currentCat)?.name || '';
    },
    filteredProducts() {
      if (this.currentCat === 'all') return this.allProducts;
      return this.allProducts.filter(p => p.category === this.currentCat);
    }
  },
  onLoad() { this.loadProducts(); },
  methods: {
    async loadProducts() {
      try {
        const res = await productApi.list({ limit: 100 });
        if (res.success) this.allProducts = res.data || [];
      } catch (e) {
        this.allProducts = [
          { _id: '1', name: '每日鲜语鲜牛奶', spec: '1L/瓶', price: 19.9, category: 'fresh', image: '/static/milk1.jpg' },
          { _id: '2', name: '安慕希酸奶', spec: '205g/盒', price: 12.9, category: 'yogurt', image: '/static/milk2.jpg' },
          { _id: '3', name: '伊利纯牛奶', spec: '250ml/盒', price: 3.5, category: 'milk', image: '/static/milk3.jpg' },
          { _id: '4', name: '莫斯利安酸奶', spec: '200g/盒', price: 8.9, category: 'yogurt', image: '/static/milk4.jpg' }
        ];
      }
    },
    selectCat(id) { this.currentCat = id; },
    goToDetail(id) { uni.navigateTo({ url: `/pages/product/detail?id=${id}` }); }
  }
};
</script>

<style scoped>
.container { height: 100vh; background: #f5f5f5; }
.category-layout { display: flex; height: 100vh; }
.left-nav { width: 180rpx; background: #fff; flex-shrink: 0; }
.cat-item { padding: 30rpx 20rpx; text-align: center; font-size: 26rpx; color: #666; border-left: 4rpx solid transparent; }
.cat-item.active { background: #f5f5f5; color: #4A90D9; border-left-color: #4A90D9; font-weight: bold; }
.right-list { flex: 1; padding: 20rpx; }
.sub-title { font-size: 28rpx; font-weight: bold; margin-bottom: 20rpx; color: #333; }
.product-grid { display: flex; flex-wrap: wrap; gap: 20rpx; }
.product-card { width: calc(50% - 10rpx); background: #fff; border-radius: 12rpx; overflow: hidden; }
.p-img { width: 100%; height: 200rpx; background: #eee; }
.p-name { display: block; font-size: 26rpx; padding: 10rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.p-price { display: block; font-size: 28rpx; color: #ff5500; font-weight: bold; padding: 0 10rpx 15rpx; }
.empty { text-align: center; padding-top: 100rpx; color: #999; font-size: 28rpx; }
</style>
