import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import authApi from "../api/authApi";
import { toastContext } from "../contexts/ToastProvider";
import { ProgressSpinner } from "primereact/progressspinner";

export default function ChangePasswordDialog({ visible, setVisible }) {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { toastSuccess, toastError } = toastContext();

    const updatePassword = async () => {
        setLoading(true);
        try {
            const response = await authApi.changePassword({
                password,
                newPassword,
                confirmPassword,
            });

            if (response.data.type === "SUCCESS") {
                setVisible(false);
                toastSuccess(response.data.message);
            }
        } catch (err) {
            toastError(err.response.data.message);
        }
        setLoading(false);
    };

    const footerContent = (
        <div>
            <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={() => setVisible(false)}
                className="p-button-text"
                autoFocus
                severity="danger"
            />
            <Button
                label="Update"
                icon="pi pi-check"
                onClick={() => updatePassword()}
                severity="success"
            />
        </div>
    );

    return (
        <div className="card flex justify-content-center">
            <Dialog
                header="Change password"
                visible={visible}
                style={{ width: "30vw" }}
                onHide={() => setVisible(false)}
                footer={loading ? <></> : footerContent}
            >
                {loading && (
                    <div className="w-full h-40 flex justify-center items-center">
                        <ProgressSpinner />
                    </div>
                )}
                {!loading && (
                    <div className="w-full p-4">
                        <div className="w-full p-float-label mt-2">
                            <InputText
                                id="password_change-password"
                                type="password"
                                className="w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="password_change-password">
                                Password
                            </label>
                        </div>
                        <div className="w-full p-float-label mt-6">
                            <InputText
                                type="password"
                                className="w-full"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <label htmlFor="password_change-password">
                                New password
                            </label>
                        </div>
                        <div className="w-full p-float-label mt-6">
                            <InputText
                                type="password"
                                className="w-full"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                            <label htmlFor="password_change-password">
                                Confirm new password
                            </label>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
}
