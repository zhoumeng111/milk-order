<template>
  <view class="container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="search-inner">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          placeholder="搜索牛奶商品"
          v-model="searchKeyword"
          @confirm="onSearch"
          confirm-type="search"
        />
      </view>
    </view>

    <!-- 分类导航 -->
    <scroll-view class="category-nav" scroll-x>
      <view
        v-for="cat in categories"
        :key="cat.id"
        class="category-item"
        :class="{ active: currentCategory === cat.id }"
        @click="selectCategory(cat.id)"
      >
        {{ cat.name }}
      </view>
    </scroll-view>

    <!-- 商品列表 -->
    <scroll-view scroll-y class="product-scroll" @scrolltolower="loadMore">
      <view class="product-list" v-if="filteredProducts.length">
        <view
          v-for="item in filteredProducts"
          :key="item._id || item.id"
          class="product-card"
          @click="goToDetail(item._id || item.id)"
        >
          <image class="product-image" :src="item.image || '/static/milk-placeholder.png'" mode="aspectFill" />
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <text class="product-spec">{{ item.spec }}</text>
            <view class="product-bottom">
              <text class="product-price">¥{{ item.price }}</text>
              <view class="add-cart-btn" @click.stop="addToCart(item)">+</view>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-list" v-else-if="!loading">
        <text>暂无商品</text>
      </view>

      <view class="load-status" v-if="loading">
        <text>加载中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
const { productApi } = require('../../api/index.js');
const cartStore = require('../../store/cart.js');

module.exports = {
  data() {
    return {
      searchKeyword: '',
      currentCategory: 'all',
      categories: [
        { id: 'all', name: '全部' },
        { id: 'fresh', name: '鲜奶' },
        { id: 'yogurt', name: '酸奶' },
        { id: 'milk', name: '纯牛奶' },
        { id: 'cheese', name: '奶酪' }
      ],
      allProducts: [],
      loading: false,
      hasMore: true,
      page: 1
    };
  },
  computed: {
    filteredProducts() {
      let result = this.allProducts;
      if (this.currentCategory !== 'all') {
        result = result.filter(p => p.category === this.currentCategory);
      }
      if (this.searchKeyword) {
        const kw = this.searchKeyword.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(kw));
      }
      return result;
    }
  },
  onShow() {
    if (!this.allProducts.length) {
      this.loadProducts(true);
    }
  },
  onPullDownRefresh() {
    this.loadProducts(true);
    uni.stopPullDownRefresh();
  },
  methods: {
    async loadProducts(refresh = false) {
      if (this.loading) return;
      if (refresh) {
        this.page = 1;
        this.allProducts = [];
        this.hasMore = true;
      }
      this.loading = true;
      try {
        const res = await productApi.list({ page: this.page, limit: 20 });
        if (res.success) {
          const products = res.data || [];
          if (refresh) {
            this.allProducts = products;
          } else {
            this.allProducts.push(...products);
          }
          this.hasMore = products.length >= 20;
          this.page++;
        }
      } catch (e) {
        // 降级：使用假数据
        const mock = [
          { _id: '1', name: '每日鲜语鲜牛奶', spec: '1L/瓶', price: 19.9, category: 'fresh', image: '/static/milk1.jpg' },
          { _id: '2', name: '安慕希酸奶', spec: '205g/盒', price: 12.9, category: 'yogurt', image: '/static/milk2.jpg' },
          { _id: '3', name: '伊利纯牛奶', spec: '250ml/盒', price: 3.5, category: 'milk', image: '/static/milk3.jpg' },
          { _id: '4', name: '莫斯利安酸奶', spec: '200g/盒', price: 8.9, category: 'yogurt', image: '/static/milk4.jpg' }
        ];
        if (refresh) this.allProducts = mock;
        else this.allProducts.push(...mock);
        this.hasMore = false;
      } finally {
        this.loading = false;
      }
    },
    selectCategory(id) {
      if (this.currentCategory === id) return;
      this.currentCategory = id;
    },
    onSearch() {
      // 搜索词已通过 computed 实时过滤，这里可额外触发API搜索
      this.$forceUpdate();
    },
    loadMore() {
      if (this.hasMore && !this.loading) {
        this.loadProducts(false);
      }
    },
    goToDetail(id) {
      uni.navigateTo({ url: `/pages/product/detail?id=${id}` });
    },
    addToCart(item) {
      cartStore.addItem(item, 1);
      uni.showToast({ title: '已加入购物车', icon: 'success' });
    }
  }
};
</script>

<style scoped>
.container { height: 100vh; display: flex; flex-direction: column; background: #f5f5f5; }
.search-bar { background: #4A90D9; padding: 16rpx 20rpx; flex-shrink: 0; }
.search-inner { display: flex; align-items: center; background: rgba(255,255,255,0.2); border-radius: 40rpx; padding: 12rpx 20rpx; }
.search-icon { font-size: 28rpx; margin-right: 10rpx; }
.search-input { flex: 1; background: transparent; color: #fff; font-size: 28rpx; }
.search-input::placeholder { color: rgba(255,255,255,0.7); }
.category-nav { display: flex; white-space: nowrap; padding: 20rpx 0; background: #fff; flex-shrink: 0; }
.category-item { display: inline-block; padding: 10rpx 30rpx; margin-left: 20rpx; background: #f5f5f5; border-radius: 30rpx; font-size: 26rpx; color: #666; }
.category-item.active { background: #4A90D9; color: #fff; }
.product-scroll { flex: 1; height: calc(100vh - 200rpx); }
.product-list { display: flex; flex-wrap: wrap; justify-content: space-between; padding: 20rpx; }
.product-card { width: 48%; background: #fff; border-radius: 12rpx; margin-bottom: 20rpx; overflow: hidden; }
.product-image { width: 100%; height: 320rpx; background: #eee; }
.product-info { padding: 20rpx; }
.product-name { display: block; font-size: 28rpx; font-weight: bold; color: #333; margin-bottom: 10rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.product-spec { display: block; font-size: 24rpx; color: #999; margin-bottom: 15rpx; }
.product-bottom { display: flex; justify-content: space-between; align-items: center; }
.product-price { color: #ff5500; font-size: 32rpx; font-weight: bold; }
.add-cart-btn { width: 50rpx; height: 50rpx; background: #4A90D9; color: #fff; border-radius: 50%; text-align: center; line-height: 50rpx; font-size: 32rpx; }
.empty-list { display: flex; justify-content: center; padding-top: 200rpx; color: #999; font-size: 28rpx; }
.load-status { text-align: center; padding: 20rpx; color: #999; font-size: 24rpx; }
</style>
