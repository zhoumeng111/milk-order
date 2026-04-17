/**
 * 全局购物车状态管理
 * 使用 uni-app globalData 模拟 Vuex
 */

const CART_KEY = 'milk_cart';

// 初始化全局数据
const app = getApp();
if (app && app.globalData) {
  if (!app.globalData.cartItems) {
    app.globalData.cartItems = [];
  }
}

function getCart() {
  if (app && app.globalData) {
    return app.globalData.cartItems;
  }
  return [];
}

function saveCart(items) {
  if (app && app.globalData) {
    app.globalData.cartItems = items;
  }
  uni.setStorageSync(CART_KEY, items);
}

function loadCart() {
  try {
    const stored = uni.getStorageSync(CART_KEY);
    if (stored && app && app.globalData) {
      app.globalData.cartItems = stored;
    }
    return stored || [];
  } catch (e) {
    return [];
  }
}

// 购物车操作
const cartStore = {
  // 获取购物车列表
  getItems() {
    return loadCart();
  },

  // 添加商品到购物车
  addItem(product, quantity = 1) {
    const items = loadCart();
    const existIndex = items.findIndex(i => i.productId === product._id);
    if (existIndex > -1) {
      items[existIndex].quantity += quantity;
    } else {
      items.push({
        productId: product._id,
        name: product.name,
        spec: product.spec,
        price: product.price,
        image: product.image || '/static/milk-placeholder.png',
        quantity,
        selected: true
      });
    }
    saveCart(items);
    return items;
  },

  // 更新商品数量
  updateQuantity(productId, quantity) {
    const items = loadCart();
    const idx = items.findIndex(i => i.productId === productId);
    if (idx > -1) {
      if (quantity <= 0) {
        items.splice(idx, 1);
      } else {
        items[idx].quantity = quantity;
      }
    }
    saveCart(items);
    return items;
  },

  // 切换选中状态
  toggleSelect(productId) {
    const items = loadCart();
    const idx = items.findIndex(i => i.productId === productId);
    if (idx > -1) {
      items[idx].selected = !items[idx].selected;
    }
    saveCart(items);
    return items;
  },

  // 全选/取消全选
  selectAll(selected) {
    const items = loadCart();
    items.forEach(i => i.selected = selected);
    saveCart(items);
    return items;
  },

  // 删除商品
  removeItem(productId) {
    const items = loadCart().filter(i => i.productId !== productId);
    saveCart(items);
    return items;
  },

  // 清空购物车
  clear() {
    saveCart([]);
    return [];
  },

  // 获取已选商品
  getSelectedItems() {
    return loadCart().filter(i => i.selected);
  },

  // 计算已选商品总价
  getSelectedTotal() {
    return loadCart()
      .filter(i => i.selected)
      .reduce((sum, i) => sum + i.price * i.quantity, 0);
  },

  // 获取已选商品数量
  getSelectedCount() {
    return loadCart().filter(i => i.selected).length;
  }
};

module.exports = cartStore;
