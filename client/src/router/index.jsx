import { createBrowserRouter } from "react-router-dom";
import route from "../constants/route";
import Home from "../pages/home/Home";
import Signin from "../pages/sign-in/Signin";
import DefaultLayout from "../components/DefaultLayout";
import Signup from "../pages/sign-up/Signup";
import Guest from "../components/Guest";
import Profile from "../pages/profile/Profile";
import User from "../pages/user/User";
import Category from "../pages/category/Category";
import HomeProductSeller from "../pages/product/HomeProductSeller";
import Cart from "../pages/cart/Cart";
import Discountpage from "../pages/discount/DiscountPage";
import Order from "../pages/order/Order";
import Detail from "../pages/home/Detail";
import OrderHistory from "../pages/order-history/OrderHistory";
import OrderDetail from "../pages/order-history/OrderDetail";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: route.HOME,
                element: <Home />,
            },
            {
                path: `${route.DETAIL}/:id`,
                element: <Detail />,
            },
            {
                path: route.PRODUCT,
                element: <HomeProductSeller />,
            },
            {
                path: route.CATEGORY,
                element: <Category />,
            },
            {
                path: route.PROFILE,
                element: <Profile />,
            },
            {
                path: route.USER,
                element: <User />,
            },
            {
                path: route.CART,
                element: <Cart />,
            },
            {
                path: route.DISCOUNT,
                element: <Discountpage />,
            },
            {
                path: route.ORDER,
                element: <Order />,
            },
            {
                path: route.ORDER_HISTORY,
                element: <OrderHistory />,
            },
            {
                path: `${route.ORDER}/:id`,
                element: <OrderDetail />,
            },
        ],
    },
    {
        path: "/",
        element: <Guest />,
        children: [
            {
                path: route.SIGNIN,
                element: <Signin />,
            },
            {
                path: route.SIGNUP,
                element: <Signup />,
            },
        ],
    },
]);

export default router;
