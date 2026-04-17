<template>
  <view class="container">
    <view class="address-list" v-if="addresses.length">
      <view class="address-card" v-for="addr in addresses" :key="addr._id || addr.id">
        <view class="addr-main" @click="selectAddr(addr)">
          <view class="addr-user">
            <text class="addr-name">{{ addr.name }}</text>
            <text class="addr-phone">{{ addr.phone }}</text>
            <text class="default-tag" v-if="addr.isDefault">默认</text>
          </view>
          <text class="addr-detail">{{ addr.detail }}</text>
        </view>
        <view class="addr-actions">
          <text class="action-btn" @click="deleteAddr(addr)">删除</text>
        </view>
      </view>
    </view>
    <view class="empty" v-else>
      <text>暂无收货地址</text>
    </view>
    <view class="add-btn-wrap">
      <view class="add-btn" @click="goToAdd">
        <text>+ 添加收货地址</text>
      </view>
    </view>
  </view>
</template>

<script>
module.exports = {
  data() { return { addresses: [
    { id: '1', name: '张三', phone: '13812348888', detail: '广东省广州市天河区珠江新城花城大道88号', isDefault: true },
    { id: '2', name: '李四', phone: '13912345678', detail: '广东省深圳市南山区科技园', isDefault: false }
  ]}; },
  methods: {
    selectAddr(addr) {
      const pages = getCurrentPages();
      const prev = pages[pages.length - 2];
      if (prev) prev.selectedAddress = addr;
      uni.navigateBack();
    },
    deleteAddr(addr) {
      uni.showModal({ title: '提示', content: '确定删除？', success: (res) => {
        if (res.confirm) this.addresses = this.addresses.filter(a => a.id !== addr.id);
      }});
    },
    goToAdd() { uni.navigateTo({ url: '/pages/user/address' }); }
  }
};
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; padding-bottom: 140rpx; }
.address-card { background: #fff; margin: 20rpx; border-radius: 12rpx; padding: 30rpx; }
.addr-main { padding-bottom: 20rpx; border-bottom: 1rpx solid #f5f5f5; }
.addr-user { display: flex; align-items: center; gap: 16rpx; margin-bottom: 10rpx; }
.addr-name { font-size: 30rpx; font-weight: bold; }
.addr-phone { font-size: 28rpx; color: #666; }
.default-tag { background: #4A90D9; color: #fff; font-size: 22rpx; padding: 4rpx 12rpx; border-radius: 20rpx; }
.addr-detail { font-size: 26rpx; color: #666; line-height: 1.5; }
.addr-actions { padding-top: 20rpx; display: flex; justify-content: flex-end; }
.action-btn { font-size: 26rpx; color: #ff5500; }
.empty { display: flex; justify-content: center; padding-top: 200rpx; color: #999; font-size: 28rpx; }
.add-btn-wrap { position: fixed; bottom: 0; left: 0; right: 0; padding: 20rpx 30rpx; background: #fff; border-top: 1rpx solid #eee; }
.add-btn { background: #4A90D9; color: #fff; text-align: center; padding: 24rpx; border-radius: 40rpx; font-size: 30rpx; }
</style>
