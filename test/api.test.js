// 牛奶订购系统 - 接口测试用例

const BASE_URL = 'http://localhost:3000/api';

describe('商品接口测试', () => {
  test('GET /api/products - 获取商品列表', async () => {
    const response = await fetch(`${BASE_URL}/products`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  test('POST /api/products - 创建商品', async () => {
    const newProduct = {
      name: '测试商品',
      category: 'fresh',
      price: 15.9,
      spec: '500ml/瓶'
    };
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    expect(response.status).toBe(200);
  });
});

describe('订单接口测试', () => {
  test('POST /api/orders - 创建订单', async () => {
    const orderData = {
      userId: 'test-user-id',
      items: [{ name: '测试商品', price: 15.9, quantity: 2 }],
      address: { name: '张三', phone: '13800000000', detail: '测试地址' }
    };
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.orderNo).toBeDefined();
  });
});

describe('用户接口测试', () => {
  test('POST /api/users - 创建/更新用户', async () => {
    const userData = { phone: '13800000000', nickname: '测试用户' };
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    expect(response.status).toBe(200);
  });
});
