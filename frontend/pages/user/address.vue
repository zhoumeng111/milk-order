<template>
  <view class="container">
    <view class="address-list" v-if="addresses.length">
      <view class="address-card" v-for="addr in addresses" :key="addr._id || addr.id" :class="{ default: addr.isDefault }">
        <view class="addr-main" @click="selectAddress(addr)">
          <view class="addr-user">
            <text class="addr-name">{{ addr.name }}</text>
            <text class="addr-phone">{{ addr.phone }}</text>
            <text class="default-tag" v-if="addr.isDefault">默认</text>
          </view>
          <text class="addr-detail">{{ addr.detail }}</text>
        </view>
        <view class="addr-actions">
          <view class="action-btn" @click="setDefault(addr)">
            <text>{{ addr.isDefault ? '✓ 已设为默认' : '设为默认' }}</text>
          </view>
          <view class="action-btn" @click="editAddress(addr)">
            <text>编辑</text>
          </view>
          <view class="action-btn danger" @click="deleteAddress(addr)">
            <text>删除</text>
          </view>
        </view>
      </view>
    </view>

    <view class="empty" v-else>
      <text>暂无收货地址</text>
    </view>

    <view class="add-btn-wrap">
      <view class="add-btn" @click="showAddModal">
        <text>+ 添加收货地址</text>
      </view>
    </view>

    <!-- 添加/编辑地址弹窗 -->
    <view class="modal-mask" v-if="showModal" @click="showModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-title">{{ editingAddr ? '编辑地址' : '添加地址' }}</view>
        <view class="form-item">
          <text class="form-label">收货人</text>
          <input class="form-input" v-model="form.name" placeholder="请输入收货人姓名" />
        </view>
        <view class="form-item">
          <text class="form-label">手机号</text>
          <input class="form-input" v-model="form.phone" type="number" maxlength="11" placeholder="请输入手机号" />
        </view>
        <view class="form-item">
          <text class="form-label">详细地址</text>
          <textarea class="form-textarea" v-model="form.detail" placeholder="请输入详细地址" />
        </view>
        <view class="form-item">
          <checkbox-group @change="onDefaultChange">
            <label class="checkbox-label">
              <checkbox :checked="form.isDefault" />
              <text>设为默认地址</text>
            </label>
          </checkbox-group>
        </view>
        <view class="modal-btns">
          <view class="modal-btn cancel" @click="showModal = false">取消</view>
          <view class="modal-btn confirm" @click="saveAddress">保存</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const { userApi } = require('../../api/index.js');

module.exports = {
  data() {
    return {
      userId: 'demo-user-id',
      addresses: [],
      showModal: false,
      editingAddr: null,
      form: {
        name: '',
        phone: '',
        detail: '',
        isDefault: false
      }
    }
  },
  onLoad() {
    this.loadAddresses();
  },
  onShow() {
    this.loadAddresses();
  },
  methods: {
    async loadAddresses() {
      try {
        const res = await userApi.addresses(this.userId);
        if (res.success) {
          this.addresses = res.data || [];
        }
      } catch (e) {
        // 降级：使用假数据
        this.addresses = [
          { id: '1', name: '张三', phone: '13812348888', detail: '广东省广州市天河区珠江新城花城大道88号', isDefault: true },
          { id: '2', name: '李四', phone: '13912345678', detail: '广东省深圳市南山区科技园南区A栋', isDefault: false }
        ];
      }
    },
    showAddModal() {
      this.editingAddr = null;
      this.form = { name: '', phone: '', detail: '', isDefault: false };
      this.showModal = true;
    },
    editAddress(addr) {
      this.editingAddr = addr;
      this.form = { ...addr };
      this.showModal = true;
    },
    async saveAddress() {
      if (!this.form.name || !this.form.phone || !this.form.detail) {
        uni.showToast({ title: '请填写完整信息', icon: 'none' });
        return;
      }
      if (!/^1\d{10}$/.test(this.form.phone)) {
        uni.showToast({ title: '手机号格式不正确', icon: 'none' });
        return;
      }
      uni.showLoading({ title: '保存中...' });
      try {
        const res = await userApi.addAddress(this.userId, this.form);
        if (res.success) {
          uni.showToast({ title: '保存成功', icon: 'success' });
          this.showModal = false;
          this.loadAddresses();
        }
      } catch (e) {
        // 模拟保存
        if (this.editingAddr) {
          const idx = this.addresses.findIndex(a => a.id === this.editingAddr.id);
          if (idx > -1) this.addresses[idx] = { ...this.editingAddr, ...this.form };
        } else {
          this.addresses.push({ id: Date.now().toString(), ...this.form });
        }
        uni.showToast({ title: '保存成功', icon: 'success' });
        this.showModal = false;
      } finally {
        uni.hideLoading();
      }
    },
    async setDefault(addr) {
      addr.isDefault = !addr.isDefault;
      if (addr.isDefault) {
        this.addresses.forEach(a => { if (a.id !== addr.id) a.isDefault = false; });
      }
      uni.showToast({ title: addr.isDefault ? '已设为默认' : '已取消默认', icon: 'success' });
    },
    deleteAddress(addr) {
      uni.showModal({
        title: '提示',
        content: '确定删除该地址吗？',
        success: (res) => {
          if (res.confirm) {
            this.addresses = this.addresses.filter(a => a.id !== addr.id);
            uni.showToast({ title: '已删除', icon: 'success' });
          }
        }
      });
    },
    selectAddress(addr) {
      // 从地址管理页选择地址：设置到全局，跳转回确认页
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      if (prevPage && prevPage.route.includes('order/confirm')) {
        prevPage.$vm.selectedAddress = addr;
      }
      uni.navigateBack();
    },
    onDefaultChange(e) {
      this.form.isDefault = e.detail.value.length > 0;
    }
  }
};
</script>

<style scoped>
.container { min-height: 100vh; background: #f5f5f5; padding-bottom: 140rpx; }
.address-card { background: #fff; margin: 20rpx; border-radius: 12rpx; padding: 30rpx; }
.address-card.default { border: 2rpx solid #4A90D9; }
.addr-main { padding-bottom: 20rpx; border-bottom: 1rpx solid #f5f5f5; }
.addr-user { display: flex; align-items: center; gap: 16rpx; margin-bottom: 10rpx; }
.addr-name { font-size: 30rpx; font-weight: bold; }
.addr-phone { font-size: 28rpx; color: #666; }
.default-tag { background: #4A90D9; color: #fff; font-size: 22rpx; padding: 4rpx 12rpx; border-radius: 20rpx; }
.addr-detail { font-size: 26rpx; color: #666; line-height: 1.5; }
.addr-actions { display: flex; padding-top: 20rpx; gap: 30rpx; }
.action-btn { font-size: 26rpx; color: #4A90D9; }
.action-btn.danger { color: #ff5500; }
.empty { display: flex; flex-direction: column; align-items: center; padding-top: 200rpx; }
.empty text { color: #999; font-size: 28rpx; }
.add-btn-wrap { position: fixed; bottom: 0; left: 0; right: 0; padding: 20rpx 30rpx; background: #fff; border-top: 1rpx solid #eee; }
.add-btn { background: #4A90D9; color: #fff; text-align: center; padding: 24rpx; border-radius: 40rpx; font-size: 30rpx; }
.modal-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 999; display: flex; align-items: flex-end; }
.modal-content { background: #fff; border-radius: 24rpx 24rpx 0 0; padding: 40rpx 30rpx; width: 100%; }
.modal-title { font-size: 32rpx; font-weight: bold; text-align: center; margin-bottom: 40rpx; }
.form-item { margin-bottom: 30rpx; }
.form-label { display: block; font-size: 28rpx; color: #666; margin-bottom: 12rpx; }
.form-input { border: 1rpx solid #ddd; border-radius: 8rpx; padding: 20rpx; font-size: 28rpx; }
.form-textarea { border: 1rpx solid #ddd; border-radius: 8rpx; padding: 20rpx; font-size: 28rpx; width: 100%; box-sizing: border-box; height: 150rpx; }
.checkbox-label { display: flex; align-items: center; gap: 10rpx; font-size: 28rpx; }
.modal-btns { display: flex; gap: 20rpx; margin-top: 40rpx; }
.modal-btn { flex: 1; text-align: center; padding: 24rpx; border-radius: 40rpx; font-size: 30rpx; }
.modal-btn.cancel { background: #f5f5f5; color: #666; }
.modal-btn.confirm { background: #4A90D9; color: #fff; }
</style>
