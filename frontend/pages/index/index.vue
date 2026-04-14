<template>
  <view class="container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <input class="search-input" placeholder="搜索牛奶商品" v-model="searchKeyword" />
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
    <view class="product-list">
      <view
        v-for="item in filteredProducts"
        :key="item.id"
        class="product-card"
        @click="goToDetail(item.id)"
      >
        <image class="product-image" :src="item.image" mode="aspectFill" />
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
  </view>
</template>

<script>
export default {
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
      products: [
        { id: 1, name: '每日鲜语鲜牛奶', spec: '1L/瓶', price: 19.9, category: 'fresh', image: '/static/milk1.jpg' },
        { id: 2, name: '安慕希酸奶', spec: '205g/盒', price: 12.9, category: 'yogurt', image: '/static/milk2.jpg' },
        { id: 3, name: '伊利纯牛奶', spec: '250ml/盒', price: 3.5, category: 'milk', image: '/static/milk3.jpg' },
        { id: 4, name: '莫斯利安酸奶', spec: '200g/盒', price: 8.9, category: 'yogurt', image: '/static/milk4.jpg' }
      ]
    }
  },
  computed: {
    filteredProducts() {
      let result = this.products
      if (this.currentCategory !== 'all') {
        result = result.filter(p => p.category === this.currentCategory)
      }
      if (this.searchKeyword) {
        result = result.filter(p => p.name.includes(this.searchKeyword))
      }
      return result
    }
  },
  methods: {
    selectCategory(id) {
      this.currentCategory = id
    },
    goToDetail(id) {
      uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
    },
    addToCart(item) {
      uni.showToast({ title: '已加入购物车', icon: 'success' })
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
}
.search-bar {
  background: #4A90D9;
  padding: 20rpx;
  border-radius: 8rpx;
}
.search-input {
  background: #fff;
  padding: 15rpx 20rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
}
.category-nav {
  display: flex;
  white-space: nowrap;
  padding: 20rpx 0;
}
.category-item {
  display: inline-block;
  padding: 10rpx 30rpx;
  margin-right: 20rpx;
  background: #fff;
  border-radius: 30rpx;
  font-size: 26rpx;
}
.category-item.active {
  background: #4A90D9;
  color: #fff;
}
.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.product-card {
  width: 48%;
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}
.product-image {
  width: 100%;
  height: 320rpx;
  background: #eee;
}
.product-info {
  padding: 20rpx;
}
.product-name {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}
.product-spec {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-bottom: 15rpx;
}
.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product-price {
  color: #ff5500;
  font-size: 32rpx;
  font-weight: bold;
}
.add-cart-btn {
  width: 50rpx;
  height: 50rpx;
  background: #4A90D9;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 50rpx;
  font-size: 32rpx;
}
</style>
