import { createBrowserRouter } from "react-router-dom";
import route from "../constants/route";
import Home from "../pages/home/home";
import Signin from "../pages/sign-in/Signin";
import DefaultLayout from "../components/DefaultLayout";
import Signup from "../pages/sign-up/Signup";
import Guest from "../components/Guest";
import Profile from "../pages/profile/Profile";
import Category from "../pages/category/Category";
import ProductSeller from "../pages/product/ProductSeller";
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
                path: route.PRODUCTSELLER,
                element: <ProductSeller />,
            },
            {
                path: route.CATEGORY,
                element: <Category />,
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
