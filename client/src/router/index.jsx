import { createBrowserRouter } from "react-router-dom";
import route from "../constants/route";
import Home from "../pages/home/home";
import Signin from "../pages/sign-in/Signin";
import DefaultLayout from "../components/DefaultLayout";
import Signup from "../pages/sign-up/Signup";
import Product from "../pages/product/Product";
import Guest from "../components/Guest";
import Profile from "../pages/profile/Profile";
import Category from "../pages/category/Category";
import PRODUCT from "../pages/product/Product";

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
                path: route.PRODUCT,
                element: <Product />,
            },
            {
                path: "/demo-product",
                element: <></>,
            },
            {
                path: route.CATEGORY,
                element: <Category />,
            },
            
            {
                path: route.PRODUCTSELLER,
                element: <PRODUCT/>,
            },
            {
                path: route.PROFILE,
                element: <Profile />,
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
