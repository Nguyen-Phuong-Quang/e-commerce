import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { toastContext } from "../../contexts/ToastProvider";
import authApi from "../../api/authApi";
import { Button } from "primereact/button";
import successImage from "../../assets/success.svg";
import { Link, useNavigate } from "react-router-dom";
import route from "../../constants/route";
import { ProgressSpinner } from "primereact/progressspinner";

export default function VerifyEmail({ email, handleSignUp }) {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toastError } = toastContext();

    const submit = async () => {
        setLoading(true);
        try {
            const response = await authApi.verifyEmail({ email, code });
            if (response.data.type === "SUCCESS") setSuccess(true);
        } catch (err) {
            console.log(err);
            toastError(err.response.data.type);
        }
        setLoading(false);
    };

    const handleEnterKey = (e) => {
        if (e.key === "Enter") {
            if (success) navigate(route.SIGNIN);
            else submit();
        }
    };

    return (
        <div
            onKeyDown={handleEnterKey}
            className="flex flex-col items-center shadow-2xl border-2 border-slate-300 rounded-xl bg-gradient-to-t from-cyan-50 to-sky-100 py-10 px-20"
        >
            {loading && <ProgressSpinner />}
            {!loading && (
                <>
                    {!success && (
                        <>
                            <div className="mb-4 text-2xl font-semibold">
                                Enter code:
                            </div>
                            <div className="mb-4">
                                <InputText
                                    className="w-full text-center text-xl font-semibold"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>
                            <Button label="Comfirm" onClick={() => submit()} />
                            <div className="mt-2 text-blue-500 cursor-pointer underline">
                                Resend code
                            </div>
                        </>
                    )}
                    {success && (
                        <>
                            <div>
                                <img src={successImage} className="w-28" />
                            </div>
                            <div className="text-xl text-green-700 mt-4">
                                Sign up successfully!
                            </div>

                            <Link
                                to={route.SIGNIN}
                                className="text-blue-500 underline"
                            >
                                Sign in
                            </Link>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
