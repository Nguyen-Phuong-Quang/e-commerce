import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { toastContext } from "./../../contexts/ToastProvider";
import productApi from "./../../api/categoryApi";

const DialogAddCategory = ({ visible, setVisible, category, fetchData }) => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { toastError, toastSuccess } = toastContext();
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description);

    const addCategory = async () => {
        setLoading(true);
        try {
            const data = {
                name,
                description,
            };
            const response = await productApi.create(data);
            if (response.data.type === "SUCCESS") {
                toastSuccess(response.data.message);
                setName("");
                setDescription("");
                setVisible(false);
                fetchData();
            }
        } catch (err) {
            toastError(err.response.data.message);
        }
        setLoading(false);
    };

    const handleAddCategory = () => {
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
                footer={loading ? <></> : footerContent}
                onHide={() => {
                    setVisible(false);
                }}
                header="Add Category"
            >
                {!loading && (
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
                                className={classNames({
                                    "p-invalid": submitted && !category.name,
                                })}
                            />
                            {submitted && !name && (
                                <small className="p-error">
                                    Name is required.
                                </small>
                            )}
                        </div>

                        <div className="formgrid grid mt-2">
                            <div className="field col">
                                <label htmlFor="description">Description</label>
                                <InputText
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    required
                                    className={classNames({
                                        "p-invalid":
                                            submitted && !category.description,
                                    })}
                                />
                                {submitted && !description && (
                                    <small className="p-error">
                                        Description is required.
                                    </small>
                                )}
                            </div>
                        </div>
                    </>
                )}
                {loading && (
                    <div className="justify-center items-center ">
                        <ProgressSpinner className=" w-full" />
                    </div>
                )}
            </Dialog>
        </>
    );
};

export default DialogAddCategory;
