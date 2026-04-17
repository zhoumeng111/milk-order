<template>
  <view class="container">
    <view class="search-bar">
      <input class="search-input" v-model="keyword" placeholder="搜索商品" confirm-type="search" @confirm="doSearch" />
      <text class="cancel-btn" @click="goBack">取消</text>
    </view>
    <view class="hot-section" v-if="!keyword">
      <view class="section-title">热门搜索</view>
      <view class="hot-tags">
        <text v-for="tag in hotTags" :key="tag" class="tag" @click="useTag(tag)">{{ tag }}</text>
      </view>
    </view>
    <view class="result-section" v-else>
      <view class="product-list" v-if="results.length">
        <view v-for="item in results" :key="item._id || item.id" class="product-item" @click="goToDetail(item._id || item.id)">
          <image :src="item.image || '/static/milk-placeholder.jpg'" class="p-img" />
          <view class="p-info">
            <text class="p-name">{{ item.name }}</text>
            <text class="p-spec">{{ item.spec }}</text>
            <text class="p-price">¥{{ item.price }}</text>
          </view>
        </view>
      </view>
      <view class="empty" v-else>
        <text>未找到相关商品</text>
      </view>
    </view>
  </view>
</template>

<script>
const { productApi } = require('../../api/index.js');
module.exports = {
  data() {
    return {
      keyword: '',
      results: [],
      hotTags: ['鲜奶', '酸奶', '纯牛奶', '有机', '安慕希', '伊利']
    };
  },
  methods: {
    doSearch() { this.search(); },
    useTag(tag) { this.keyword = tag; this.search(); },
    async search() {
      if (!this.keyword) return;
      try {
        const res = await productApi.list({ keyword: this.keyword });
        if (res.success) this.results = res.data || [];
      } catch (e) {
        this.results = [];
      }
    },
    goToDetail(id) { uni.navigateTo({ url: `/pages/product/detail?id=${id}` }); },
    goBack() { uni.navigateBack(); }
  }
};
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; }
.search-bar { display: flex; align-items: center; background: #4A90D9; padding: 16rpx 20rpx; }
.search-input { flex: 1; background: rgba(255,255,255,0.2); border-radius: 40rpx; padding: 12rpx 20rpx; font-size: 28rpx; color: #fff; }
.search-input::placeholder { color: rgba(255,255,255,0.7); }
.cancel-btn { color: #fff; font-size: 28rpx; margin-left: 20rpx; }
.hot-section { padding: 30rpx; }
.section-title { font-size: 28rpx; font-weight: bold; margin-bottom: 20rpx; }
.hot-tags { display: flex; flex-wrap: wrap; gap: 16rpx; }
.tag { background: #fff; padding: 12rpx 30rpx; border-radius: 30rpx; font-size: 26rpx; color: #666; }
.result-section { padding: 20rpx; }
.product-list {}
.product-item { display: flex; background: #fff; padding: 20rpx; margin-bottom: 2rpx; border-radius: 8rpx; align-items: center; }
.p-img { width: 120rpx; height: 120rpx; background: #eee; border-radius: 8rpx; flex-shrink: 0; }
.p-info { flex: 1; margin-left: 20rpx; }
.p-name { display: block; font-size: 28rpx; font-weight: bold; }
.p-spec { display: block; font-size: 24rpx; color: #999; margin: 8rpx 0; }
.p-price { font-size: 28rpx; color: #ff5500; font-weight: bold; }
.empty { text-align: center; padding-top: 200rpx; color: #999; font-size: 28rpx; }
</style>
