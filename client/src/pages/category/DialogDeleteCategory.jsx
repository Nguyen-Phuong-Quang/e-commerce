import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { toastContext } from "./../../contexts/ToastProvider";
import { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import categoryApi from "./../../api/categoryApi";

export default function DialogDeleteCategory({ id, visible, setVisible }) {
    const [category,setCategory] = useState({});
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description);
    const [loading, setLoading] = useState(false);
    const { toastError, toastSuccess } = toastContext();

    useEffect(() => {
        const getCategory = async () => {
            setLoading(true);
            try {
                const response = await categoryApi.getById(id);
                if (response.data.type === "SUCCESS") {
                    setCategory(response.data.category);
                    setName(response.data.category.name);
                    setDescription(response.data.category.description);
                }
            } catch (err) {
                toastError(err.response.data.message);
            }
            setLoading(false);
        };
        getCategory();
    },[] );

    const handleDelete = () => {
        const confirmDelete = async () => {
            setLoading(true);
            try {
                const response = await categoryApi.deleteCategory(id);
                if (response.data.type === "Success") {
                    toastSuccess("Delete category successfully!");
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
                style={{ width: '600px' }} 
                modal
                onHide={() => setVisible(false)}
                footer={footerContent}
            >
                <div className="">
                    {!loading && (
                        <span>Are you sure to delete 
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
