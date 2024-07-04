import routesConfig from '../config/routes';

//import pages
import NotFound404 from '../pages/NotFound404/NotFound404';
import Forbiden403 from '../pages/Forbiden403/Forbiden403';
import Home from '../pages/users/Home/Home';
import Login from '../pages/auths/Login/Login';
import ResetPassword from '../pages/auths/Login/ResetPassword';
import Signup from '../pages/auths/Signup';
import BooksList from '../pages/users/BooksList/BooksList';
import { BookDetail } from '../pages/users/BooksList/BookDetail';
import Policy from '../pages/users/Policy/Policy';
import HandmadeItems from '../pages/users/HandmadeItems/HandmadeItems';
import BorrowerCard from '../pages/users/BorrowerCard/BorrowerCard';
import Cart from '../pages/users/Cart/Cart';
import Profile from '../pages/users/Profile/Profile';
import BorrowerSlips from '../pages/users/BorrowerSlips/BorrowerSlips';
import UserOrders from '../pages/users/Orders/UserOrders';

import BookList from '../pages/admins/BookManage/BookList';
import OnBorrowerSlip from '../pages/admins/BorrowerSlip/OnBorrowerSlip';
import OffBorrowerSlip from '../pages/admins/BorrowerSlip/OffBorrowerSlip';
import BorrowerList from '../pages/admins/BorrowerAcc/BorrowerList';
import Products from '../pages/admins/HandmadeManage/Products';
import Orders from '../pages/admins/HandmadeManage/Orders';

import Statistics from '../pages/admins/Statistics/Statistics';
import DefaultLayout from '../layouts/AdminLayout/DefaultLayout/DefaultLayout';
//import layout

//public route

const userRoutes = [
    { path: routesConfig.login, component: Login, layout: null },
    { path: routesConfig.resetPassword, component: ResetPassword, layout: null },
    { path: routesConfig.signup, component: Signup, layout: null },
    { path: routesConfig.home, component: Home, layout: null, title: 'Tổng quan' },
    { path: routesConfig.listBooks, component: BooksList, layout: null, title: 'Tủ sách' },
    { path: routesConfig.bookDetail, component: BookDetail, layout: null, title: 'Chi tiết về sách' },
    { path: routesConfig.policy, component: Policy, layout: null, title: 'Quy định' },
    { path: routesConfig.handmadeItem, component: HandmadeItems, layout: null, title: 'Tiệm hand' },
    { path: routesConfig.borrowerCard, component: BorrowerCard, layout: null, title: 'Thẻ đọc' },
    { path: routesConfig.cart, component: Cart, layout: null, title: 'Giỏ hàng' },
    { path: routesConfig.borrowerSlips, component: BorrowerSlips, layout: null, title: 'Phiếu mượn của bạn đọc' },
    { path: routesConfig.orders, component: UserOrders, layout: null, title: 'Đơn hàng' },
    { path: routesConfig.profile, component: Profile, layout: null, title: 'Thông tin bạn đọc' },
    { path: routesConfig.notfound404user, component: NotFound404, layout: null, title: '' },
];

const adminRoutes = [
    //{ path: routesConfig.adminHome, component: BookList, title: 'Quản lý sách' },
    { path: routesConfig.bookListAdmin, component: BookList, title: 'Quản lý sách' },
    { path: routesConfig.onSlipAdmin, component: OnBorrowerSlip, title: 'Quản lý phiếu mượn sách On' },
    { path: routesConfig.offSlipAdmin, component: OffBorrowerSlip, title: 'Quản lý phiếu mượn sách Off' },
    { path: routesConfig.borrowerListAdmin, component: BorrowerList, title: 'Quản lý tài khoản bạn đọc' },
    { path: routesConfig.productsAdmin, component: Products, title: 'Sản phẩm' },
    { path: routesConfig.ordersAdmin, component: Orders, title: 'Đơn đặt hàng' },
    { path: routesConfig.statistics, component: Statistics, title: 'Thống kê' },
    { path: routesConfig.notfound404admin, component: NotFound404, layout: DefaultLayout, title: '' },
];

export { userRoutes, adminRoutes };
