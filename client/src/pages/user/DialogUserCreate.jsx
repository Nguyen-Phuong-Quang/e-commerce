import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { toastContext } from "../../contexts/ToastProvider";
import userApi from "../../api/userApi";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";

export default function DialogUserCreate({ visible, setVisible, fetchData }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [role, setRole] = useState(null);
    const roles = ["Admin", "Seller", "Customer"];
    const [image, setImage] = useState(undefined);
    const [preview, setPreview] = useState();
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const { toastSuccess, toastError } = toastContext();

    const handleCreate = () => {
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
                    role: roles.find(
                        (i) => i.toLowerCase() === role.toLowerCase()
                    ),
                    image,
                };
                const response = await userApi.create(data);
                if (response.data.type === "SUCCESS") {
                    toastSuccess(response.data.message);
                    fetchData();
                }
            } catch (err) {
                toastError(err.response.data.message);
            }
            setLoading(false);
            setVisible(false);
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

    const footer = (
        <div className="">
            <Button
                icon="pi pi-check"
                label="Save"
                severity="success"
                className=" text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 "
                onClick={handleCreate}
            />
            <Button
                icon="pi pi-times"
                label="Cancel"
                severity="secondary"
                className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2 "
                onClick={() => {
                    setVisible(false);
                }}
            />
        </div>
    );

    return (
        <Dialog
            visible={visible}
            className="sm:w-full md:w-11/12 lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto"
            footer={loading ? <></> : footer}
            onHide={() => {
                setVisible(false);
            }}
            header="CREATE USER"
        >
            {loading && (
                <div className="w-full h-80 flex justify-center items-center">
                    <ProgressSpinner />
                </div>
            )}
            {!loading && (
                <>
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
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <span className="text-red-500 text-sm h-2"></span>
                            </div>
                            <div className="flex flex-col">
                                <label className="m-2 text-lg font-medium">
                                    Address
                                </label>
                                <InputText
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                <span className="text-red-500 text-sm h-2"></span>
                            </div>
                            <div className="flex flex-col">
                                <label className="m-2 text-lg font-medium">
                                    Phone
                                </label>
                                <InputText
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
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
                                    onChange={(e) => setEmail(e.target.value)}
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
                                        setConfirmPassword(e.target.value)
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
                </>
            )}
        </Dialog>
    );
}
