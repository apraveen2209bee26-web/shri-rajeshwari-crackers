import { Route, Routes } from 'react-router-dom';

import AdminLayout from '../components/layout/AdminLayout';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import RegisterPage from '../pages/RegisterPage';
import ShopPage from '../pages/ShopPage';
import OrderDetailsPage from '../pages/user/OrderDetailsPage';
import OrdersPage from '../pages/user/OrdersPage';
import ProfilePage from '../pages/user/ProfilePage';

const App = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route element={<HomePage />} index />
      <Route element={<ShopPage />} path="/shop" />
      <Route element={<ProductDetailsPage />} path="/shop/:slug" />
      <Route element={<CartPage />} path="/cart" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />

      <Route element={<ProtectedRoute roles={['user']} />}>
        <Route element={<CheckoutPage />} path="/checkout" />
        <Route element={<OrdersPage />} path="/account/orders" />
        <Route element={<OrderDetailsPage />} path="/account/orders/:orderId" />
        <Route element={<ProfilePage />} path="/account/profile" />
      </Route>
    </Route>

    <Route element={<AdminLoginPage />} path="/admin/login" />
    <Route element={<ProtectedRoute redirectTo="/admin/login" roles={['admin']} />}>
      <Route element={<AdminLayout />} path="/admin">
        <Route element={<AdminDashboardPage />} index />
        <Route element={<AdminProductsPage />} path="products" />
        <Route element={<AdminOrdersPage />} path="orders" />
      </Route>
    </Route>
  </Routes>
);

export default App;

