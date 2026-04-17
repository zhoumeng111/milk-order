<template>
  <view class="container">
    <!-- 搜索框 -->
    <view class="search-box">
      <input 
        class="search-input" 
        placeholder="搜索牛奶商品" 
        v-model="keyword"
        @confirm="doSearch"
        focus
      />
      <text class="search-btn" @click="doSearch">搜索</text>
    </view>

    <!-- 热门搜索 -->
    <view class="hot-search" v-if="!keyword && hotKeywords.length">
      <view class="section-title">热门搜索</view>
      <view class="keyword-list">
        <text 
          v-for="kw in hotKeywords" 
          :key="kw" 
          class="keyword-item"
          @click="searchByKeyword(kw)"
        >{{ kw }}</text>
      </view>
    </view>

    <!-- 搜索历史 -->
    <view class="search-history" v-if="!keyword && searchHistory.length">
      <view class="section-title">
        <text>搜索历史</text>
        <text class="clear-btn" @click="clearHistory">清空</text>
      </view>
      <view class="keyword-list">
        <text 
          v-for="kw in searchHistory" 
          :key="kw" 
          class="keyword-item"
          @click="searchByKeyword(kw)"
        >{{ kw }}</text>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="search-result" v-if="keyword">
      <view class="result-count" v-if="results.length">找到 {{ results.length }} 个商品</view>
      <view class="product-list">
        <view
          v-for="item in results"
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
      <view class="no-result" v-if="results.length === 0 && searched">
        <text>未找到相关商品</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      searched: false,
      hotKeywords: ['鲜牛奶', '酸奶', '纯牛奶', '安慕希', '特仑苏'],
      searchHistory: ['酸奶', '鲜奶'],
      allProducts: [
        { id: 1, name: '每日鲜语鲜牛奶', spec: '1L/瓶', price: 19.9, category: 'fresh', image: '/static/milk1.jpg' },
        { id: 2, name: '安慕希酸奶', spec: '205g/盒', price: 12.9, category: 'yogurt', image: '/static/milk2.jpg' },
        { id: 3, name: '伊利纯牛奶', spec: '250ml/盒', price: 3.5, category: 'milk', image: '/static/milk3.jpg' },
        { id: 4, name: '莫斯利安酸奶', spec: '200g/盒', price: 8.9, category: 'yogurt', image: '/static/milk4.jpg' },
        { id: 5, name: '特仑苏纯牛奶', spec: '250ml/盒', price: 5.5, category: 'milk', image: '/static/milk5.jpg' },
        { id: 6, name: '金典有机奶', spec: '250ml/盒', price: 6.0, category: 'milk', image: '/static/milk6.jpg' }
      ],
      results: []
    }
  },
  methods: {
    doSearch() {
      if (!this.keyword) return
      this.searched = true
      this.results = this.allProducts.filter(p => 
        p.name.toLowerCase().includes(this.keyword.toLowerCase())
      )
      // 添加到历史
      if (!this.searchHistory.includes(this.keyword)) {
        this.searchHistory.unshift(this.keyword)
        if (this.searchHistory.length > 10) {
          this.searchHistory.pop()
        }
      }
    },
    searchByKeyword(kw) {
      this.keyword = kw
      this.doSearch()
    },
    clearHistory() {
      this.searchHistory = []
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
  background: #f5f5f5;
  min-height: 100vh;
}
.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 20rpx;
  border-radius: 40rpx;
}
.search-input {
  flex: 1;
  font-size: 28rpx;
}
.search-btn {
  color: #4A90D9;
  font-size: 28rpx;
  margin-left: 20rpx;
}
.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin: 30rpx 0 20rpx;
  display: flex;
  justify-content: space-between;
}
.clear-btn {
  color: #999;
  font-weight: normal;
  font-size: 24rpx;
}
.keyword-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.keyword-item {
  background: #fff;
  padding: 12rpx 24rpx;
  border-radius: 30rpx;
  font-size: 26rpx;
  color: #666;
}
.result-count {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 20rpx;
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
  height: 300rpx;
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
.no-result {
  text-align: center;
  padding: 100rpx;
  color: #999;
  font-size: 28rpx;
}
</style>
