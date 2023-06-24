import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { toastContext } from "../../contexts/ToastProvider";
import userApi from "../../api/userApi";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";

const roles = ["Admin", "Seller", "Customer"];

export default function DialogUserCreate({
    id,
    visible,
    setVisible,
    fetchData,
}) {
    const [data, setData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        companyName: "",
    });
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(null);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const { toastSuccess, toastError } = toastContext();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await userApi.getUserById(id);
                if (response.data.type === "SUCCESS") {
                    setData(response.data.user);
                    const userRole = roles.find(
                        (i) =>
                            i.toLowerCase() ===
                            response.data.user.role.toLowerCase()
                    );
                    setRole(userRole);
                }
            } catch (err) {
                toastError(err.response.data.message);
            }
        };

        fetchUser();
    }, []);

    const handleChangeInput = (field, value) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handleEdit = () => {
        const submit = async () => {
            setLoading(true);
            try {
                const newData = {
                    ...data,
                    role: roles.find(
                        (i) => i.toLowerCase() === role.toLowerCase()
                    ),
                };
                if (password) {
                    newData.password = password;
                }
                const response = await userApi.updateUserDetailById(
                    id,
                    newData
                );
                if (response.data.type === "SUCCESS") {
                    toastSuccess(response.data.message);
                    fetchData();
                    setVisible(false);
                }
            } catch (err) {
                toastError(err.response.data.message);
            }
            setLoading(false);
        };

        submit();
    };

    const footer = (
        <div className="">
            <Button
                icon="pi pi-check"
                label="Save"
                severity="success"
                className=" text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 "
                onClick={handleEdit}
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
            header="EDIT USER"
        >
            {loading && (
                <div className="w-full h-80 flex justify-center items-center">
                    <ProgressSpinner />
                </div>
            )}
            {!loading && (
                <>
                    <div className="flex gap-4 w-full px-4 pt-4">
                        <div className="flex flex-col gap-2 w-1/2">
                            <div className="flex flex-col">
                                <label className="m-2 text-lg font-medium">
                                    Name
                                </label>
                                <InputText
                                    value={data.name}
                                    onChange={(e) =>
                                        handleChangeInput(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                />
                                <span className="text-red-500 text-sm h-2"></span>
                            </div>
                            <div className="flex flex-col">
                                <label className="m-2 text-lg font-medium">
                                    Address
                                </label>
                                <InputText
                                    value={data.address}
                                    onChange={(e) =>
                                        handleChangeInput(
                                            "address",
                                            e.target.value
                                        )
                                    }
                                />
                                <span className="text-red-500 text-sm h-2"></span>
                            </div>
                            <div className="flex flex-col">
                                <label className="m-2 text-lg font-medium">
                                    Phone
                                </label>
                                <InputText
                                    value={data.phone}
                                    onChange={(e) =>
                                        handleChangeInput(
                                            "phone",
                                            e.target.value
                                        )
                                    }
                                />
                                <span className="text-red-500 text-sm h-2"></span>
                            </div>
                            <div className="flex flex-col">
                                <label className="m-2 text-lg font-medium">
                                    Company Name
                                </label>
                                <InputText
                                    value={data.companyName}
                                    onChange={(e) =>
                                        handleChangeInput(
                                            "companyName",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <div className="flex flex-col">
                                <label className="m-2 text-lg font-medium">
                                    Email
                                </label>
                                <InputText
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        handleChangeInput(
                                            "email",
                                            e.target.value
                                        )
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
