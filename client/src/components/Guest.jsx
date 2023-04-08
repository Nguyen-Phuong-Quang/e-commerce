import { Navigate, Outlet } from "react-router-dom";
import route from "../constants/route";
import { userStateContext } from "../contexts/StateProvider";

export default function Guest() {
    const { currentUser, userToken } = userStateContext();
    if (userToken && currentUser) return <Navigate to={route.HOME} />;
    return <Outlet />;
}
