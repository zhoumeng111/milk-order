<template>
  <view class="container">
    <!-- 地址列表 -->
    <view class="address-list" v-if="addresses.length">
      <view
        v-for="item in addresses"
        :key="item.id"
        class="address-card"
        :class="{ default: item.isDefault }"
      >
        <view class="address-content" @click="selectAddress(item)">
          <view class="address-header">
            <text class="contact-name">{{ item.name }}</text>
            <text class="contact-phone">{{ item.phone }}</text>
            <text class="default-tag" v-if="item.isDefault">默认</text>
          </view>
          <view class="address-detail">{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}</view>
        </view>
        <view class="address-actions">
          <view class="action-btn edit" @click="editAddress(item)">编辑</view>
          <view class="action-btn delete" @click="deleteAddress(item.id)">删除</view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty" v-if="!addresses.length">
      <text class="empty-icon">📍</text>
      <text class="empty-text">暂无收货地址</text>
    </view>

    <!-- 新增按钮 -->
    <view class="add-btn" @click="addAddress">
      <text>+ 新增收货地址</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      addresses: [
        {
          id: 1,
          name: '张三',
          phone: '13800138000',
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          detail: '建国路88号SOHO现代城',
          isDefault: true
        },
        {
          id: 2,
          name: '李四',
          phone: '13900139000',
          province: '上海市',
          city: '上海市',
          district: '浦东新区',
          detail: '世纪大道100号环球金融中心',
          isDefault: false
        }
      ]
    }
  },
  methods: {
    selectAddress(item) {
      // 返回选中的地址
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      if (prevPage) {
        prevPage.$vm.selectedAddress = item
      }
      uni.navigateBack()
    },
    addAddress() {
      uni.showToast({ title: '新增地址功能开发中', icon: 'none' })
    },
    editAddress(item) {
      uni.showToast({ title: '编辑地址功能开发中', icon: 'none' })
    },
    deleteAddress(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该地址吗？',
        success: (res) => {
          if (res.confirm) {
            this.addresses = this.addresses.filter(a => a.id !== id)
            uni.showToast({ title: '已删除', icon: 'success' })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  padding-bottom: 120rpx;
  background: #f5f5f5;
  min-height: 100vh;
}
.address-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.address-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
}
.address-card.default {
  border: 2rpx solid #4A90D9;
}
.address-content {
  margin-bottom: 20rpx;
}
.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}
.contact-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-right: 20rpx;
}
.contact-phone {
  font-size: 28rpx;
  color: #666;
}
.default-tag {
  background: #4A90D9;
  color: #fff;
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  margin-left: 20rpx;
}
.address-detail {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}
.address-actions {
  display: flex;
  justify-content: flex-end;
  gap: 30rpx;
  border-top: 1rpx solid #eee;
  padding-top: 20rpx;
}
.action-btn {
  font-size: 26rpx;
  color: #666;
}
.action-btn.delete {
  color: #ff5500;
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 150rpx 0;
}
.empty-icon {
  font-size: 100rpx;
  margin-bottom: 30rpx;
}
.empty-text {
  font-size: 28rpx;
  color: #999;
}
.add-btn {
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
