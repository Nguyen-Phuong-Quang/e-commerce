import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import CategoryDialogFooter from "./components/CategoryDialogFooter";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { classNames } from 'primereact/utils';
import categoryApi from "./../../api/categoryApi";
import { toastContext } from "./../../contexts/ToastProvider";

const DialogEditCategory = ({visible, setVisible, category}) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description);
    
    const { toastSuccess, toastError } = toastContext();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        const submit = async () => {
            setLoading(true);
            try {
                const response = await categoryApi.updateDetail({
                    name,
                    description
                });
                if (response.data.type === "SUCCESS") {
                    setVisible(false);
                    toastSuccess("Edit profile successfully!");
                }
            } catch (err) {
                console.log(err);
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
                label="Confirm"
                icon="pi pi-check"
                onClick={() => handleSubmit()}
            />
        </div>
    );

    return (
        <>
        <Dialog
            visible={visible} 
            style={{ width: '600px' }} 
            modal 
            className="p-fluid" 
            footer={footerContent}
            onHide={() => {
                setVisible(false);
            }}
            header="Edit Category"
        >
            <div className="field">
                    <label htmlFor="name">Name</label>
                    <InputText 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        autoFocus 
                        className={classNames({ 'p-invalid': submitted && !category.name })} 
                    />
                    {submitted && !name && <small className="p-error">Name is required.</small>}
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="description">Description</label>
                        <InputText 
                            id="description" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            required 
                            className={classNames({ 'p-invalid': submitted && !category.description })} 
                        />
                    {submitted && !description && <small className="p-error">Description is required.</small>}
                </div>
            </div>
        </Dialog>
        </>
    );
};

export default DialogEditCategory;
