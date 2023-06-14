import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import CategoryDialogFooter from "./components/CategoryDialogFooter";
import { classNames } from 'primereact/utils';
import productApi from "./../../api/categoryApi";
import { toastContext } from "./../../contexts/ToastProvider";


const DialogAddCategory = ({visible, setVisible, category}) => {

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toastError, toastSuccess } = toastContext();
    const [name,setName] = useState(category.name);
    const [description,setDescription] = useState(category.description);
    const navigate = useNavigate();

    const handleAddCategory = () => {
        const addCategory = async () => {
            setLoading(true);
            try {
                const data = {
                    name,
                    description,
                }
                const response = await productApi.create(data);
                console.log(response);
                if (response.data.type === "SUCCESS") {
                    setName('');
                    setDescription('');
                    toastSuccess(response.data.message);
                }
            } catch (err) {
                toastError(err.response.data.message);
                console.log(err);
            }
            setLoading(false);
        };
        addCategory();
    };

    const handleSaveClick = () => {
        handleAddCategory();
    };

    const handleCancelClick = () => {
        setVisible(false);
    }

    return (
        <>
            <Dialog
                visible={visible} //pass params as addVisible.
                style={{ width: "600px" }}
                modal 
                className="p-fluid"
                footer={
                    <CategoryDialogFooter
                        Cancel={handleCancelClick}
                        Save={handleSaveClick}
                    />
                    }
                    onHide={() => {
                        setVisible(false);
                    }   
                }
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
