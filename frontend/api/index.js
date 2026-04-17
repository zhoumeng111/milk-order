/**
 * API 服务层 - 对接后端 Express API
 * 后端地址默认 http://localhost:3000，可通过环境变量配置
 */
const BASE_URL = 'http://localhost:3000/api';

/**
 * 统一请求封装
 */
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      ...options,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          uni.showToast({ title: res.data.message || '请求失败', icon: 'none' });
          reject(res.data);
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络错误', icon: 'none' });
        reject(err);
      }
    });
  });
}

/**
 * 商品 API
 */
const productApi = {
  // 获取商品列表
  list: (params = {}) => {
    const query = [];
    if (params.category && params.category !== 'all') query.push(`category=${params.category}`);
    if (params.keyword) query.push(`keyword=${params.keyword}`);
    const qs = query.length ? '?' + query.join('&') : '';
    return request(`/products${qs}`);
  },
  // 获取商品详情
  detail: (id) => request(`/products/${id}`)
};

/**
 * 订单 API
 */
const orderApi = {
  // 创建订单
  create: (data) => request('/orders', { method: 'POST', data }),
  // 获取用户订单列表
  list: (userId, params = {}) => {
    const query = [`userId=${userId}`];
    if (params.status && params.status !== 'all') query.push(`status=${params.status}`);
    return request(`/orders/user/${userId}?${query.join('&')}`);
  },
  // 获取订单详情
  detail: (id) => request(`/orders/${id}`),
  // 更新订单状态
  updateStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PUT', data: { status } }),
  // 取消订单
  cancel: (id) => request(`/orders/${id}/cancel`, { method: 'PUT' })
};

/**
 * 用户 API
 */
const userApi = {
  // 获取用户信息
  profile: (id) => request(`/users/${id}`),
  // 登录/注册（手机号）
  login: (phone, nickname) => request('/users', { method: 'POST', data: { phone, nickname } }),
  // 更新用户信息
  update: (id, data) => request(`/users/${id}`, { method: 'PUT', data }),
  // 获取收货地址列表
  addresses: (userId) => request(`/users/${userId}/address`),
  // 添加收货地址
  addAddress: (userId, address) => request(`/users/${userId}/address`, { method: 'POST', data: address })
};

module.exports = { request, productApi, orderApi, userApi };
