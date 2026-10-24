import http from './http';

export const api = {
  register: (payload) => http.post('/auth/register', payload).then((response) => response.data),
  login: (payload) => http.post('/auth/login', payload).then((response) => response.data),
  loginAdmin: (payload) => http.post('/auth/admin/login', payload).then((response) => response.data),
  getMe: () => http.get('/auth/me').then((response) => response.data),
  updateProfile: (payload) => http.patch('/auth/profile', payload).then((response) => response.data),

  getProducts: (params) => http.get('/products', { params }).then((response) => response.data),
  getFeaturedProducts: () => http.get('/products/featured').then((response) => response.data),
  getCategories: () => http.get('/products/categories').then((response) => response.data),
  getProductBySlug: (slug) => http.get(`/products/${slug}`).then((response) => response.data),

  getCart: () => http.get('/cart').then((response) => response.data),
  addCartItem: (payload) => http.post('/cart/items', payload).then((response) => response.data),
  updateCartItem: (productId, payload) =>
    http.patch(`/cart/items/${productId}`, payload).then((response) => response.data),
  removeCartItem: (productId) => http.delete(`/cart/items/${productId}`).then((response) => response.data),
  clearCart: () => http.delete('/cart/clear').then((response) => response.data),

  createCheckout: (payload) => http.post('/orders/checkout', payload).then((response) => response.data),
  verifyPayment: (payload) =>
    http.post('/orders/verify-payment', payload).then((response) => response.data),
  getMyOrders: () => http.get('/orders/my-orders').then((response) => response.data),
  getOrderById: (orderId) => http.get(`/orders/${orderId}`).then((response) => response.data),
  trackOrder: (orderNumber) => http.get(`/orders/track/${orderNumber}`).then((response) => response.data),

  getAdminOverview: () => http.get('/admin/overview').then((response) => response.data),
  getAdminProducts: () => http.get('/admin/products').then((response) => response.data),
  getAdminStock: () => http.get('/admin/stock').then((response) => response.data),
  createProduct: (payload) =>
    http
      .post('/admin/products', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data),
  createStockItem: (payload) =>
    http
      .post('/admin/stock/create', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data),
  updateProduct: (productId, payload) =>
    http
      .patch(`/admin/products/${productId}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data),
  updateStockItem: (productId, payload) =>
    http
      .put(`/admin/stock/${productId}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data),
  updateProductStock: (productId, payload) =>
    http.patch(`/admin/products/${productId}/stock`, payload).then((response) => response.data),
  updateStockQuantity: (productId, payload) =>
    http.patch(`/admin/stock/${productId}/quantity`, payload).then((response) => response.data),
  deleteProduct: (productId) => http.delete(`/admin/products/${productId}`).then((response) => response.data),
  deleteStockItem: (productId) => http.delete(`/admin/stock/${productId}`).then((response) => response.data),
  getAdminOrders: () => http.get('/admin/orders').then((response) => response.data),
  updateOrderStatus: (orderId, payload) =>
    http.patch(`/admin/orders/${orderId}/status`, payload).then((response) => response.data),
};
