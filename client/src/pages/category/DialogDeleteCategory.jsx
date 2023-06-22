import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { toastContext } from "./../../contexts/ToastProvider";
import { useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import categoryApi from "./../../api/categoryApi";

export default function DialogDeleteCategory({
    id,
    visible,
    setVisible,
    fetchData,
}) {
    const [loading, setLoading] = useState(false);
    const { toastError, toastSuccess } = toastContext();

    const handleDelete = () => {
        const confirmDelete = async () => {
            setLoading(true);
            try {
                const response = await categoryApi.deleteCategory(id);
                if (response.data.type === "SUCCESS") {
                    toastSuccess(response.data.message);
                    fetchData();
                }
            } catch (err) {
                toastError(err.response.data.message);
            }
            setVisible(false);
            setLoading(false);
        };
        confirmDelete();
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
                style={{ width: "600px" }}
                modal
                onHide={() => setVisible(false)}
                footer={loading ? <></> : footerContent}
            >
                <div className="">
                    {!loading && (
                        <span>
                            Are you sure to delete
                            <span className="text-red-500">{}</span>?
                        </span>
                    )}
                    {loading && (
                        <div className="justify-center items-center ">
                            <ProgressSpinner className=" w-full" />
                        </div>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
