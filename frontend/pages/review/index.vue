<template>
  <view class="container">
    <!-- 商品信息 -->
    <view class="product-info" v-if="product">
      <image class="product-image" :src="product.image" mode="aspectFill" />
      <view class="product-detail">
        <text class="product-name">{{ product.name }}</text>
        <text class="product-spec">{{ product.spec }}</text>
      </view>
    </view>

    <!-- 评分 -->
    <view class="rating-section">
      <text class="section-title">商品评分</text>
      <view class="stars">
        <text 
          v-for="i in 5" 
          :key="i"
          class="star"
          :class="{ active: i <= rating }"
          @click="rating = i"
        >★</text>
      </view>
      <text class="rating-text">{{ ratingText }}</text>
    </view>

    <!-- 评价内容 -->
    <view class="content-section">
      <text class="section-title">评价内容</text>
      <textarea 
        class="review-input" 
        placeholder="分享你的使用体验~"
        v-model="content"
        maxlength="500"
      />
      <text class="word-count">{{ content.length }}/500</text>
    </view>

    <!-- 上传图片 -->
    <view class="image-section">
      <text class="section-title">上传图片</text>
      <view class="image-list">
        <view class="image-item" v-for="(img, index) in images" :key="index">
          <image :src="img" mode="aspectFill" />
          <text class="remove-btn" @click="removeImage(index)">×</text>
        </view>
        <view class="add-image" @click="chooseImage">
          <text>+</text>
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-btn" @click="submitReview">
      <text>提交评价</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      product: {
        id: 1,
        name: '每日鲜语鲜牛奶',
        spec: '1L/瓶',
        image: '/static/milk1.jpg'
      },
      rating: 5,
      content: '',
      images: [],
      ratingTexts: ['', '非常差', '较差', '一般', '满意', '非常满意']
    }
  },
  computed: {
    ratingText() {
      return this.ratingTexts[this.rating]
    }
  },
  methods: {
    chooseImage() {
      uni.chooseImage({
        count: 3 - this.images.length,
        success: (res) => {
          this.images = [...this.images, ...res.tempFilePaths]
        }
      })
    },
    removeImage(index) {
      this.images.splice(index, 1)
    },
    submitReview() {
      if (!this.content) {
        uni.showToast({ title: '请填写评价内容', icon: 'none' })
        return
      }
      uni.showLoading({ title: '提交中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '评价成功', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }, 1000)
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120rpx;
}
.product-info {
  display: flex;
  background: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}
.product-image {
  width: 120rpx;
  height: 120rpx;
  background: #eee;
  border-radius: 8rpx;
}
.product-detail {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.product-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}
.product-spec {
  font-size: 24rpx;
  color: #999;
}
.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}
.rating-section {
  background: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}
.stars {
  display: flex;
  gap: 20rpx;
  margin-bottom: 15rpx;
}
.star {
  font-size: 50rpx;
  color: #ddd;
}
.star.active {
  color: #ff9900;
}
.rating-text {
  font-size: 26rpx;
  color: #666;
}
.content-section {
  background: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  position: relative;
}
.review-input {
  width: 100%;
  height: 200rpx;
  font-size: 28rpx;
  line-height: 1.6;
}
.word-count {
  position: absolute;
  right: 30rpx;
  bottom: 30rpx;
  font-size: 24rpx;
  color: #999;
}
.image-section {
  background: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.image-item {
  position: relative;
  width: 150rpx;
  height: 150rpx;
}
.image-item image {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}
.remove-btn {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 36rpx;
  height: 36rpx;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 36rpx;
  font-size: 28rpx;
}
.add-image {
  width: 150rpx;
  height: 150rpx;
  background: #f5f5f5;
  border: 2rpx dashed #ddd;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.add-image text {
  font-size: 60rpx;
  color: #999;
}
.submit-btn {
  position: fixed;
  bottom: 40rpx;
  left: 30rpx;
  right: 30rpx;
  background: #4A90D9;
  color: #fff;
  text-align: center;
  padding: 25rpx;
  border-radius: 50rpx;
  font-size: 30rpx;
}
</style>
