import { createContext, useContext, useEffect, useState } from "react";
import userApi from "../api/userApi";

const StateContext = createContext({
    currentUser: {},
    setCurrentUser: () => {},
});

export const StateProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        if (localStorage.getItem("TOKEN")) {
            const fetch = async () => {
                try {
                    const response = await userApi.getUserByToken();
                    if (response.data.type === "SUCCESS") {
                        setCurrentUser(response.data.user);
                    }
                } catch (err) {
                    setCurrentUser({});
                    localStorage.removeItem("TOKEN");
                    localStorage.removeItem("REFRESH_TOKEN");
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
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const userStateContext = () => useContext(StateContext);
