<template>
  <view class="container">
    <!-- 左侧分类导航 -->
    <scroll-view class="category-left" scroll-y>
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

    <!-- 右侧商品列表 -->
    <scroll-view class="category-right" scroll-y>
      <view class="category-title">{{ currentCategoryName }}</view>
      <view class="product-grid">
        <view
          v-for="item in categoryProducts"
          :key="item.id"
          class="product-card"
          @click="goToDetail(item.id)"
        >
          <image class="product-image" :src="item.image" mode="aspectFill" />
          <text class="product-name">{{ item.name }}</text>
          <text class="product-price">¥{{ item.price }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentCategory: 'fresh',
      categories: [
        { id: 'fresh', name: '鲜奶' },
        { id: 'yogurt', name: '酸奶' },
        { id: 'milk', name: '纯牛奶' },
        { id: 'cheese', name: '奶酪' },
        { id: 'cream', name: '奶油' },
        { id: 'butter', name: '黄油' },
        { id: 'yogurt-drink', name: '乳酸菌' },
        { id: 'milk-tea', name: '奶茶' }
      ],
      products: [
        { id: 1, name: '每日鲜语鲜牛奶', spec: '1L/瓶', price: 19.9, category: 'fresh', image: '/static/milk1.jpg' },
        { id: 2, name: '安慕希酸奶', spec: '205g/盒', price: 12.9, category: 'yogurt', image: '/static/milk2.jpg' },
        { id: 3, name: '伊利纯牛奶', spec: '250ml/盒', price: 3.5, category: 'milk', image: '/static/milk3.jpg' },
        { id: 4, name: '莫斯利安酸奶', spec: '200g/盒', price: 8.9, category: 'yogurt', image: '/static/milk4.jpg' },
        { id: 5, name: '马苏里拉奶酪', spec: '200g/袋', price: 25.9, category: 'cheese', image: '/static/cheese1.jpg' },
        { id: 6, name: '安佳淡奶油', spec: '1L/盒', price: 29.9, category: 'cream', image: '/static/cream1.jpg' },
        { id: 7, name: '总统黄油', spec: '250g/块', price: 18.9, category: 'butter', image: '/static/butter1.jpg' },
        { id: 8, name: '味全乳酸菌', spec: '435ml/瓶', price: 6.9, category: 'yogurt-drink', image: '/static/drink1.jpg' }
      ]
    }
  },
  computed: {
    currentCategoryName() {
      const cat = this.categories.find(c => c.id === this.currentCategory)
      return cat ? cat.name : ''
    },
    categoryProducts() {
      return this.products.filter(p => p.category === this.currentCategory)
    }
  },
  methods: {
    selectCategory(id) {
      this.currentCategory = id
    },
    goToDetail(id) {
      uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}
.category-left {
  width: 180rpx;
  background: #f5f5f5;
}
.category-item {
  padding: 30rpx 20rpx;
  font-size: 28rpx;
  color: #666;
  text-align: center;
}
.category-item.active {
  background: #fff;
  color: #4A90D9;
  font-weight: bold;
  border-left: 6rpx solid #4A90D9;
}
.category-right {
  flex: 1;
  background: #fff;
  padding: 20rpx;
}
.category-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}
.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.product-card {
  width: 48%;
  margin-bottom: 20rpx;
}
.product-image {
  width: 100%;
  height: 200rpx;
  background: #eee;
  border-radius: 12rpx;
}
.product-name {
  display: block;
  font-size: 26rpx;
  color: #333;
  margin-top: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.product-price {
  display: block;
  color: #ff5500;
  font-size: 28rpx;
  font-weight: bold;
  margin-top: 8rpx;
}
</style>
