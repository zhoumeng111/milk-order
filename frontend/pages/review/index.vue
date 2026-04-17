<template>
  <view class="container">
    <!-- 商品卡片 -->
    <view class="product-card" v-if="product">
      <image :src="product.image || '/static/milk-placeholder.jpg'" class="p-img" />
      <view class="p-info">
        <text class="p-name">{{ product.name }}</text>
        <text class="p-spec">{{ product.spec }}</text>
      </view>
    </view>

    <!-- 评分 -->
    <view class="rating-section">
      <text class="rating-label">商品评分</text>
      <view class="stars">
        <text
          v-for="i in 5"
          :key="i"
          class="star"
          :class="{ active: i <= rating }"
          @click="setRating(i)"
        >★</text>
      </view>
      <text class="rating-text">{{ ratingText }}</text>
    </view>

    <!-- 评价内容 -->
    <view class="review-section">
      <textarea
        class="review-input"
        v-model="content"
        placeholder="分享您的购买体验..."
        maxlength="200"
      />
      <text class="word-count">{{ content.length }}/200</text>
    </view>

    <!-- 匿名发布 -->
    <view class="anonymous-row">
      <checkbox-group @change="onAnonymousChange">
        <label class="anon-label">
          <checkbox :checked="anonymous" />
          <text>匿名发布</text>
        </label>
      </checkbox-group>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-wrap">
      <view class="submit-btn" @click="submitReview">发布评价</view>
    </view>
  </view>
</template>

<script>
module.exports = {
  data() {
    return {
      product: null,
      rating: 5,
      content: '',
      anonymous: false
    };
  },
  computed: {
    ratingText() {
      const texts = ['', '很差', '较差', '一般', '满意', '非常满意'];
      return texts[this.rating] || '';
    }
  },
  onLoad(options) {
    if (options.product) {
      try { this.product = JSON.parse(decodeURIComponent(options.product)); } catch (e) {}
    }
    if (!this.product) {
      this.product = { name: '商品名称', spec: '规格', image: '/static/milk1.jpg' };
    }
  },
  methods: {
    setRating(n) { this.rating = n; },
    onAnonymousChange(e) { this.anonymous = e.detail.value.length > 0; },
    submitReview() {
      if (!this.content.trim()) {
        uni.showToast({ title: '请输入评价内容', icon: 'none' });
        return;
      }
      uni.showToast({ title: '评价发布成功', icon: 'success' });
      setTimeout(() => uni.navigateBack(), 1500);
    }
  }
};
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; padding: 20rpx; }
.product-card { display: flex; background: #fff; padding: 20rpx; border-radius: 12rpx; margin-bottom: 20rpx; align-items: center; }
.p-img { width: 120rpx; height: 120rpx; background: #eee; border-radius: 8rpx; flex-shrink: 0; }
.p-info { flex: 1; margin-left: 20rpx; }
.p-name { display: block; font-size: 28rpx; font-weight: bold; }
.p-spec { display: block; font-size: 24rpx; color: #999; margin-top: 8rpx; }
.rating-section { background: #fff; padding: 30rpx; border-radius: 12rpx; margin-bottom: 20rpx; }
.rating-label { font-size: 28rpx; font-weight: bold; display: block; margin-bottom: 20rpx; }
.stars { display: flex; gap: 10rpx; margin-bottom: 10rpx; }
.star { font-size: 52rpx; color: #ddd; }
.star.active { color: #ff9900; }
.rating-text { font-size: 24rpx; color: #ff9900; }
.review-section { background: #fff; padding: 30rpx; border-radius: 12rpx; margin-bottom: 20rpx; position: relative; }
.review-input { width: 100%; height: 200rpx; font-size: 28rpx; box-sizing: border-box; }
.word-count { position: absolute; bottom: 20rpx; right: 30rpx; font-size: 24rpx; color: #999; }
.anonymous-row { background: #fff; padding: 30rpx; border-radius: 12rpx; margin-bottom: 20rpx; }
.anon-label { display: flex; align-items: center; gap: 10rpx; font-size: 28rpx; }
.submit-wrap { padding: 20rpx 0; }
.submit-btn { background: #4A90D9; color: #fff; text-align: center; padding: 24rpx; border-radius: 40rpx; font-size: 30rpx; }
</style>
