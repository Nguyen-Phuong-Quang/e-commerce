import React, { useEffect, useState } from "react";
import { userStateContext } from "../contexts/StateProvider";
import { Link, useNavigate, useLocation } from "react-router-dom";
import route from "../constants/route";
import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";
import authApi from "../api/authApi";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useSearchContext } from "../contexts/SearchProvider";

export default function MenuBar() {
    const [visibleChangePassword, setVisibleChangePassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, setCurrentUser } = userStateContext();

    const { searchText, setSearchText } = useSearchContext();

    useEffect(() => {
        setSearchText("");
    }, [location]);

    const handleSignOut = () => {
        const signOut = async () => {
            try {
                const response = await authApi.signout();
                if (response.data.type === "SUCCESS") {
                    setCurrentUser({});
                    localStorage.removeItem("TOKEN");
                    localStorage.removeItem("REFRESH_TOKEN");
                    navigate(route.HOME);
                }
            } catch (err) {
                console.log(err);
                setCurrentUser({});
                localStorage.removeItem("TOKEN");
                localStorage.removeItem("REFRESH_TOKEN");
                navigate(route.HOME);
            }
        };

        signOut();
    };

    const start = (
        <Link className="mr-2 h-16" to={route.HOME}>
            <img
                alt="logo"
                src="https://primefaces.org/cdn/primereact/images/logo.png"
                className="mr-2 h-16 hover:cursor-pointer p-2"
            ></img>
        </Link>
    );
    const search = (
        <span className="p-input-icon-left p-input-icon-right w-1/3">
            <i className="pi pi-search" />
            <InputText
                placeholder="Search"
                type="text"
                className="my-2 w-full rounded-full"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
        </span>
    );

    const end = () => {
        if (!localStorage.getItem("TOKEN"))
            return (
                <div className="flex h-full items-center">
                    <Link
                        to={route.SIGNIN}
                        className="font-bold hover:cursor-pointer hover:text-white hover:bg-blue-400 text-blue-400 h-2/3 flex justify-center px-4 items-center border-2 border-blue-400 rounded-lg mr-4"
                    >
                        Sign in
                    </Link>
                    <Link
                        to={route.SIGNUP}
                        className="font-bold hover:cursor-pointer hover:text-white hover:bg-red-400 text-red-400 h-2/3 flex justify-center px-4 items-center border-2 border-red-400 rounded-lg"
                    >
                        Sign up
                    </Link>
                </div>
            );

        if (localStorage.getItem("TOKEN")) {
            return (
                <div className="flex h-full items-center">
                    {currentUser.role === "CUSTOMER" && (
                        <Link
                            className="px-4 hover:cursor-pointer hover:text-blue-400"
                            to={route.CART}
                        >
                            <i className="pi pi-shopping-cart text-2xl"></i>
                        </Link>
                    )}
                    <div className="hover:cursor-pointer relative group px-4">
                        <Avatar
                            image={currentUser.profileImage}
                            shape="circle"
                            className="object-cover"
                        />
                        <div className="absolute right-0 invisible group-hover:visible pt-2 shadow-md rounded-lg bg-transparent bg-white w-48">
                            <div className="border-b-2 border-x py-2 hover:bg-gray-200 border-t-2 rounded-t-lg overflow-hidden border-transparent">
                                <Link
                                    className="flex items-center w-full h-full"
                                    to={route.PROFILE}
                                >
                                    <span className="pi pi-user mx-2"></span>{" "}
                                    Profile
                                </Link>
                            </div>
                            {currentUser.role === "CUSTOMER" && (
                                <div className="border-x py-2 hover:bg-gray-200 overflow-hidden">
                                    <Link
                                        className="flex items-center w-full h-full"
                                        to={route.ORDER_HISTORY}
                                    >
                                        <span className="pi pi-book mx-2"></span>{" "}
                                        Orders
                                    </Link>
                                </div>
                            )}
                            <div
                                className="border-t-2 border-x py-2 hover:bg-gray-200 overflow-hidden"
                                onClick={() => {
                                    setVisibleChangePassword(true);
                                }}
                            >
                                <div className="flex items-center w-full h-full">
                                    <span className="pi pi-key mx-2"></span>{" "}
                                    Change password
                                </div>
                            </div>
                            <div
                                className="border-b-2 border-x py-2 hover:bg-gray-200 rounded-b-lg overflow-hidden"
                                onClick={() => handleSignOut()}
                            >
                                <div className="flex items-center w-full h-full">
                                    <span className="pi pi-sign-out mx-2"></span>{" "}
                                    Sign out
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };
    return (
        <>
            <div className="w-full fixed top-0 h-16 flex justify-between px-4 bg-white z-20 border-b border-slate-200 shadow-sm">
                {start}
                {search}
                {end()}
            </div>
            {visibleChangePassword && (
                <ChangePasswordDialog
                    visible={visibleChangePassword}
                    setVisible={setVisibleChangePassword}
                />
            )}
        </>
    );
}
