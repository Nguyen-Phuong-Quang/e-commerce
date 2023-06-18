import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { classNames } from 'primereact/utils';
import { Button } from "primereact/button";
import productApi from "./../../api/categoryApi";
import { toastContext } from "./../../contexts/ToastProvider";


const DialogAddCategory = ({visible, setVisible, category}) => {

    const [submitted, setSubmitted] = useState(false);
    const { toastError, toastSuccess } = toastContext();
    const [name,setName] = useState(category.name);
    const [description,setDescription] = useState(category.description);

    const handleAddCategory = () => {
        const addCategory = async () => {
            try {
                const data = {
                    name,
                    description,
                }
                const response = await productApi.create(data);
                if (response.data.type === "SUCCESS") {
                    setName('');
                    setDescription('');
                    toastSuccess(response.data.message);
                }
            } catch (err) {
                toastError(err.response.data.message);
            }
            setVisible(false);
        };
        addCategory();
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
                onClick={() => handleAddCategory()}
            />
        </div>
    );

    return (
        <>
            <Dialog
                visible={visible} //pass params as addVisible.
                style={{ width: "600px" }}
                modal 
                className="p-fluid"
                footer={footerContent}
                header="Add Category"
            >
            {/* {!loading && ( */}
                <>
                    <div className="field">
                        <label htmlFor="name">Name</label>
                        <InputText 
                            id="name" 
                            value={name} 
                            name="name"
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
                                name="description"
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
                                required 
                                className={classNames({ 'p-invalid': submitted && !category.description })} 
                            />
                            {submitted && !description && <small className="p-error">Description is required.</small>}
                        </div>
                    </div>
                </>
            {/* )} */}
            
            </Dialog>
        </>
    );
};

export default DialogAddCategory;
