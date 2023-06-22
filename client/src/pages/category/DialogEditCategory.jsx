import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { toastContext } from "./../../contexts/ToastProvider";
import categoryApi from "./../../api/categoryApi";

const DialogEditCategory = ({ visible, setVisible, id, fetchData }) => {
    const [category, setCategory] = useState({});
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description);

    const { toastSuccess, toastError } = toastContext();

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
    }, []);

    const handleSubmit = () => {
        const submit = async () => {
            setLoading(true);
            try {
                const response = await categoryApi.updateDetail(id, {
                    name,
                    description,
                });
                if (response.data.type === "SUCCESS") {
                    setVisible(false);
                    toastSuccess(response.data.message);
                    fetchData();
                }
            } catch (err) {
                toastError(err.response.data.message);
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
                style={{ width: "600px" }}
                modal
                className="p-fluid"
                footer={loading ? <></> : footerContent}
                onHide={() => {
                    setVisible(false);
                }}
                header="Edit Category"
            >
                <div className="">
                    {!loading && (
                        <>
                            <div className="field">
                                <label htmlFor="name">Name</label>
                                <InputText
                                    id="name"
                                    value={name || ""}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="description">
                                        Description
                                    </label>
                                    <InputText
                                        id="description"
                                        value={description || ""}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    {loading && (
                        <div className="justify-center items-center ">
                            <ProgressSpinner className=" w-full" />
                        </div>
                    )}
                </div>
            </Dialog>
        </>
    );
};

export default DialogEditCategory;
