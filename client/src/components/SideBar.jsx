import { userStateContext } from "../contexts/StateProvider";

export default function SideBar() {
    const { currentUser } = userStateContext();
    const { role } = currentUser;

    const adminSidebar = () => {
        return <div>admin</div>;
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
