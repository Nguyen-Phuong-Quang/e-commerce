import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import route from "../../constants/route";
import { useState } from "react";
import authApi from "../../api/authApi";
import { userStateContext } from "../../contexts/StateProvider";
import { toastContext } from "../../contexts/ToastProvider";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Signin() {
    const navigate = useNavigate();
    const { setCurrentUser } = userStateContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { toastError } = toastContext();

    const submit = async () => {
        setLoading(true);
        try {
            const data = {
                email,
                password,
            };
            const response = await authApi.signin(data);

            if (response.data.type === "SUCCESS") {
                setCurrentUser(response.data.user);
                localStorage.setItem("userId", response.data.user._id);
                localStorage.setItem(
                    "REFRESH_TOKEN",
                    response.data.tokens.refreshToken
                );
                localStorage.setItem("TOKEN", response.data.tokens.accessToken);
                return navigate(route.HOME);
            }
        } catch (err) {
            toastError(err.response.data.message);
            console.log(err);
        }
        setLoading(false);
    };

    const handleEnterKey = (e) => {
        if (e.key === "Enter") submit();
    };

    const handleSignin = () => {
        submit();
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            {loading && <ProgressSpinner />}
            {!loading && (
                <div
                    onKeyDown={handleEnterKey}
                    className="flex flex-col items-center shadow-2xl border-2 border-slate-300 rounded-xl w-[520px] bg-white"
                >
                    <div className="py-2.5 border-b-2 border-slate-300 w-full text-center my-2 pb-5">
                        <span className="text-3xl font-bold">Sign in</span>
                    </div>
                    <div className="w-full px-16">
                        <div className="flex flex-col mt-4 mx-4">
                            <label
                                htmlFor="username"
                                className="m-2 text-lg font-medium"
                            >
                                Email
                            </label>
                            <InputText
                                aria-describedby="username-help"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col mt-4 mx-4">
                            <label
                                htmlFor="username"
                                className="m-2 text-lg font-medium"
                            >
                                Password
                            </label>
                            <InputText
                                aria-describedby="username-help"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center mt-8 mb-4 w-full">
                        <Button
                            label="Sign in"
                            className="w-1/2"
                            raised
                            onClick={() => handleSignin()}
                        />
                        <Link
                            to={route.SIGNUP}
                            className="text-sm text-blue-600 mt-2 hover:underline"
                        >
                            Or you don't have account? Sign up here.
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
