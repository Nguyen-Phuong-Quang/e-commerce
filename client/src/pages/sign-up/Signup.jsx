import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import route from "../../constants/route";
import VerifyEmail from "./VerifyEmail";
import { toastContext } from "../../contexts/ToastProvider";
import authApi from "../../api/authApi";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [role, setRole] = useState(null);
    const roles = ["Seller", "Customer"];
    const [image, setImage] = useState(undefined);
    const [preview, setPreview] = useState();
    const [comfirmCode, setComfirmCode] = useState(false);
    const [error, setError] = useState({});

    const [loading, setLoading] = useState(false);

    const { toastError } = toastContext();

    const handleSignUp = () => {
        if (password !== confirmPassword) {
            setError((prev) => ({
                ...prev,
                confirmPassword: "Password does not match",
            }));
            return;
        }

        const submit = async () => {
            setLoading(true);
            try {
                const data = {
                    name,
                    email,
                    password,
                    address,
                    phone,
                    companyName,
                    role: role === "Seller" ? "SELLER" : "CUSTOMER",
                    image,
                };
                const response = await authApi.signup(data);
                if (response.data.type === "SUCCESS") setComfirmCode(true);
            } catch (err) {
                toastError(err.response.data.message);
            }
            setLoading(false);
        };

        submit();
    };

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!image) {
            setPreview(undefined);
            return;
        }

        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [image]);

    const onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setImage(undefined);
            return;
        }
        // I've kept this example simple by using the first image instead of multiple
        setImage(e.target.files[0]);
    };
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            {loading && <ProgressSpinner />}
            {!loading && (
                <>
                    {!comfirmCode && (
                        <div className="relative flex flex-col items-center shadow-2xl border-2 border-slate-300 rounded-xl w-2/3 bg-gradient-to-t from-cyan-50 to-sky-100">
                            <div className="py-2.5 border-b-2 border-slate-300 w-full text-center">
                                <span className="text-3xl font-bold">
                                    Sign up
                                </span>
                            </div>
                            <div className="flex gap-4 w-full px-4 pt-4">
                                <div className="relative flex flex-col items-center w-1/3">
                                    {image ? (
                                        <img
                                            src={preview}
                                            alt="profile"
                                            className="my-6 rounded-full h-52 w-52 object-cover"
                                        />
                                    ) : (
                                        <i className="flex items-center justify-center pi pi-user my-6 rounded-full h-52 w-52 text-[42px] bg-slate-300" />
                                    )}
                                    <label
                                        htmlFor="profile-image-sign-up"
                                        className="absolute bottom-1/4 font-bold flex justify-center items-center h-12 w-1/2 mt-6 mb-2 bg-cyan-600 text-white hover:cursor-pointer rounded-md"
                                    >
                                        <div>
                                            <i className="pi pi-image mr-2" />{" "}
                                            <span>Upload</span>
                                        </div>
                                    </label>
                                    <input
                                        id="profile-image-sign-up"
                                        type="file"
                                        hidden
                                        onChange={onSelectFile}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 w-1/3">
                                    <div className="flex flex-col">
                                        <label className="m-2 text-lg font-medium">
                                            Name
                                        </label>
                                        <InputText
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                        <span className="text-red-500 text-sm h-2"></span>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="m-2 text-lg font-medium">
                                            Address
                                        </label>
                                        <InputText
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(e.target.value)
                                            }
                                        />
                                        <span className="text-red-500 text-sm h-2"></span>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="m-2 text-lg font-medium">
                                            Phone
                                        </label>
                                        <InputText
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(e.target.value)
                                            }
                                        />
                                        <span className="text-red-500 text-sm h-2"></span>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="m-2 text-lg font-medium">
                                            Company Name
                                        </label>
                                        <InputText
                                            value={companyName}
                                            onChange={(e) =>
                                                setCompanyName(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 w-1/3">
                                    <div className="flex flex-col">
                                        <label className="m-2 text-lg font-medium">
                                            Email
                                        </label>
                                        <InputText
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                        <span className="text-red-500 text-sm h-2"></span>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="m-2 text-lg font-medium">
                                            Password
                                        </label>
                                        <InputText
                                            type="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                        <span className="text-red-500 text-sm h-2"></span>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="m-2 text-lg font-medium">
                                            Confim Password
                                        </label>
                                        <InputText
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <span className="text-red-500 text-sm h-2">
                                            {error.confirmPassword}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="m-2 text-lg font-medium">
                                            Role
                                        </label>
                                        <Dropdown
                                            options={roles}
                                            value={role}
                                            onChange={(e) => setRole(e.value)}
                                            placeholder="Select role"
                                        />
                                        <span className="text-red-500 text-sm h-2"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-center mt-8 mb-4 w-full">
                                <Button
                                    onClick={() => handleSignUp()}
                                    label="Sign up"
                                    className="w-1/4"
                                />
                                <Link
                                    to={route.SIGNIN}
                                    className="text-sm text-blue-600 mt-2 hover:underline"
                                >
                                    Or you already have account? Sign in here.
                                </Link>
                            </div>
                        </div>
                    )}
                    {comfirmCode && (
                        <VerifyEmail
                            email={email}
                            handleSignUp={handleSignUp}
                        />
                    )}
                </>
            )}
        </div>
    );
}
