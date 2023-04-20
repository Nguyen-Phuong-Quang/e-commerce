import { createContext, useContext, useEffect, useState } from "react";
import userApi from "../api/userApi";

const StateContext = createContext({
    currentUser: {},
    userToken: null,
    setCurrentUser: () => {},
    setUserToken: () => {},
});

export const StateProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});
    const [userToken, _setUserToken] = useState(localStorage.getItem("TOKEN"));

    const setUserToken = (token) => {
        if (token) {
            localStorage.setItem("TOKEN", token);
        } else {
            localStorage.removeItem("TOKEN");
        }

        _setUserToken(token);
    };

    useEffect(() => {
        if (localStorage.getItem("TOKEN")) {
            const fetch = async () => {
                try {
                    const response = await userApi.getUserById(
                        localStorage.getItem("userId")
                    );
                    if (response.data.type === "SUCCESS") {
                        setCurrentUser(response.data.user);
                    }
                } catch (err) {
                    console.log(err);
                }
            };

            fetch();
        }
    }, []);

    return (
        <StateContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                userToken,
                setUserToken,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const userStateContext = () => useContext(StateContext);
