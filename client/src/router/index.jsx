import { createBrowserRouter } from "react-router-dom";
import route from "../constants/route";
import Home from "../pages/home/home";
import Signin from "../pages/sign-in/Signin";
import DefaultLayout from "../components/DefaultLayout";
import Signup from "../pages/sign-up/Signup";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: route.HOME,
                element: <Home />,
            },
        ],
    },
    {
        path: route.SIGNIN,
        element: <Signin />,
    },
    {
        path: route.SIGNUP,
        element: <Signup />,
    },
]);

export default router;
