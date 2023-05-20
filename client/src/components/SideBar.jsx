import { Link, useNavigate } from "react-router-dom";
import { userStateContext } from "../contexts/StateProvider";
import route from "../constants/route";

import { Menu } from "primereact/menu";

export default function SideBar() {
    const navigate = useNavigate();
    const { currentUser } = userStateContext();
    const { role } = currentUser;

    const adminItems = [
        {
            label: "Category",
            icon: "pi pi-fw pi-plus",
            command: () => {
                navigate(route.CATEGORY);
            },
        },
    ];

    const adminSidebar = () => {
        return <Menu className="w-full" model={adminItems}/>;
    };
    const sellerSidebar = () => {
        return <div>seller</div>;
    };
    const customerSidebar = () => {
        return <div>customer</div>;
    };
    return (
        <div className="h-60 bg-white rounded-lg shadow-xl">
            {role === "ADMIN" && adminSidebar()}
            {role === "SELLER" && sellerSidebar()}
            {role === "CUSTOMER" && customerSidebar()}
        </div>
    );
}
