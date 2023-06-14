import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import categoryApi from "./../../api/categoryApi";
import { toastContext } from "./../../contexts/ToastProvider";
import { useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";

export default function DialogDeleteCategory({ id, name, visible, setVisible }) {
    const { toastError, toastSuccess } = toastContext();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await categoryApi.deleteCategory(id);
            if (response.data.type === "Success") {
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
                label="Delete"
                icon="pi pi-trash"
                onClick={() => handleDelete()}
                autoFocus
                severity="danger"
            />
            <Button
                icon="pi pi-times"
                label="Cancel"
                onClick={() => setVisible(false)}
                className="p-button-text"
            />
        </div>
    );

    return (
        <div className="card flex justify-content-center">
            <Dialog
                header="Delete Category"
                visible={visible}
                style={{ width: "50vw", height: "30vh" }}
                onHide={() => setVisible(false)}
                footer={footerContent}
            >
                    <span>Are you sure to delete <span className="text-red-500">{name}</span>?</span>
                {loading && (
                    <div className="w-full h-full flex justify-center items-center">
                        <ProgressSpinner className="" />
                    </div>
                )}
            </Dialog>
        </div>
    );
}
