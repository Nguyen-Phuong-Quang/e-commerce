import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import productApi from "./../../api/productApi";
import { toastContext } from "./../../contexts/ToastProvider";
import { useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";

export default function DeleteDialog({
    id,
    name,
    visible,
    setVisible,
    fetchData,
}) {
    const { toastError, toastSuccess } = toastContext();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await productApi.deleteProduct(id);
            if (response.data.type === "SUCCESS") {
                toastSuccess(response.data.message);
                setVisible(false);
                fetchData();
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
                header="Delete product"
                visible={visible}
                style={{ width: "50vw", height: "30vh" }}
                onHide={() => setVisible(false)}
                footer={loading ? <></> : footerContent}
            >
                {!loading && (
                    <span>
                        Are you sure to delete{" "}
                        <span className="text-red-500">{name}</span>?
                    </span>
                )}
                {loading && (
                    <div className="w-full h-full flex justify-center items-center">
                        <ProgressSpinner className="" />
                    </div>
                )}
            </Dialog>
        </div>
    );
}
