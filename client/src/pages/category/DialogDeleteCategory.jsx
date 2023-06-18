import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import categoryApi from "./../../api/categoryApi";
import { toastContext } from "./../../contexts/ToastProvider";
import { useState, useEffect } from "react";

export default function DialogDeleteCategory({ id, visible, setVisible }) {
    const [category,setCategory] = useState({});
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description);
    const { toastError, toastSuccess } = toastContext();
    

    useEffect(() => {
        const getCategory = async () => {
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
        };
        getCategory();
    },[] );

    const handleDelete = () => {
        const confirmDelete = async () => {
            try {
                const response = await categoryApi.deleteCategory(id);
                if (response.data.type === "Success") {
                    setVisible(false);
                    toastSuccess(response.data.message);
                }
            } catch (err) {
                toastError(err.response.data.message);
                console.log(err);
            }
            setVisible(false);
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
                style={{ width: "50vw", height: "30vh" }}
                onHide={() => setVisible(false)}
                footer={footerContent}
            >
                    <span>Are you sure to delete 
                        <span className="text-red-500">{}</span>?
                    </span>
            </Dialog>
        </div>
    );
}
