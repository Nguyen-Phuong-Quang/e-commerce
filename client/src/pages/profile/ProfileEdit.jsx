import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import userApi from "../../api/userApi";
import { toastContext } from "../../contexts/ToastProvider";

export default function ProfileEdit({ visible, setVisible, user }) {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [address, setAddress] = useState(user.address);
    const [companyName, setCompanyName] = useState(user.companyName);
    const [loading, setLoading] = useState(false);

    const { toastSuccess, toastError } = toastContext();

    const handleSubmit = () => {
        const submit = async () => {
            setLoading(true);
            try {
                const response = await userApi.updateUserDetail({
                    name,
                    email,
                    phone,
                    address,
                    companyName,
                });
                if (response.data.type === "SUCCESS") {
                    setVisible(false);
                    toastSuccess("Edit profile successfully!");
                }
            } catch (err) {
                console.log(err);
                toastError(err.response.data.message);
            }
            setLoading(false);
        };
        submit();
    };

    const footerContent = (
        <div>
            <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={() => setVisible(false)}
                className="p-button-text"
                severity="danger"
                autoFocus
                outlined
            />
            <Button
                label="Apply"
                icon="pi pi-check"
                onClick={() => handleSubmit()}
            />
        </div>
    );

    return (
        <div className="flex justify-center">
            <Dialog
                header="Edit Profile"
                visible={visible}
                style={{ width: "60vw" }}
                onHide={() => setVisible(false)}
                footer={loading ? <></> : footerContent}
            >
                <div className="">
                    {!loading && (
                        <>
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
                            <div className="flex flex-col mt-[2px]">
                                <label className="m-2 text-lg font-medium">
                                    Email
                                </label>
                                <InputText
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <span className="text-red-500 text-sm h-2"></span>
                            </div>
                            <div className="flex flex-col mt-[2px]">
                                <label className="m-2 text-lg font-medium">
                                    Phone
                                </label>
                                <InputText
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <span className="text-red-500 text-sm h-2"></span>
                            </div>
                            <div className="flex flex-col mt-[2px]">
                                <label className="m-2 text-lg font-medium">
                                    Address
                                </label>
                                <InputText
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                <span className="text-red-500 text-sm h-2"></span>
                            </div>
                            <div className="flex flex-col mt-[2px]">
                                <label className="m-2 text-lg font-medium">
                                    Company
                                </label>
                                <InputText
                                    value={companyName}
                                    onChange={(e) =>
                                        setCompanyName(e.target.value)
                                    }
                                />
                                <span className="text-red-500 text-sm h-2"></span>
                            </div>
                        </>
                    )}
                    {loading && (
                        <div className="flex justify-center items-center w-full h-60">
                            <ProgressSpinner />
                        </div>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
