import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { toastContext } from "../../contexts/ToastProvider";
import { Dialog } from "primereact/dialog";


export default function User() {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([
        {
            name: "John Doe",
            email: "xyz@gmail.com",
            role: "Admin",
        },
        {
            name: "ABC X",
            email: "abc@gmail.com",
            role: "Seller",
        },
    ]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [visibleEditDialog, setVisibleEditDialog] = useState(false);
    const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [editId, setEditId] = useState("");
    const [deleteId, setDeleteId] = useState("");

    const { toastSuccess } = toastContext();
    const dt = useRef(null);

    


    const handleEditUser = (user) => {
        setEditId(user._id);
        setVisibleEditDialog(true);
    };

    const handleDeleteUser = (user) => {
        setDeleteId(user._id);
        setVisibleDeleteDialog(true);
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => handleEditUser(rowData)}
                />{" "}
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => handleDeleteUser(rowData)}
                />
            </React.Fragment>
        );
    };

    const header = (
        <div className="table-header flex justify-between ">
            <h5 className="text-2xl mx-2 mt-3">Manage User</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                />
            </span>
        </div>
    );

    return (
        <div className="datatable-crud-demo">
            {loading && (
                <div className="w-full h-[400px] flex items-center justify-center">
                    <ProgressSpinner />
                </div>
            )}
            {!loading && (
                
                <div className="card">
                    <Dialog
                        visible={visibleEditDialog}
                        onHide={() => setVisibleEditDialog(false)}
                        style={{ width: "450px" }}
                        className="p-fluid"
                        header="Edit user"
                        footer={
                            <div>
                                <Button
                                    label="Cancel"
                                    className="p-button-secondary"
                                    onClick={() =>
                                        setVisibleEditDialog(false)
                                    }
                                />
                                <Button
                                    label="Confirm"
                                    className="p-button-success"
                                    onClick={() =>
                                        handleEditUser(editId)}
                                />
                            </div>
                        }
                    >
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
                                    <label htmlFor="email">
                                        Email
                                    </label>
                                    <InputText
                                        id="email"
                                        value={email || ""}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>
                    </Dialog>

                    <Dialog
                        visible={visibleDeleteDialog}
                        onHide={() => visibleDeleteDialog(false)}
                        header="Delete user"
                        footer={
                            <div>
                                <Button
                                    label="Cancel"
                                    className="p-button-secondary"
                                    onClick={() =>
                                        setVisibleDeleteDialog(false)
                                    }
                                />
                                <Button
                                    label="Confirm"
                                    className="p-button-success"
                                    onClick={() =>
                                        handleDeleteUser(deleteId)}
                                />
                            </div>
                        }
                    >
                        <p>Are you sure you want to delete this user account?</p>
                    </Dialog>

                    <DataTable
                        ref={dt}
                        value={data}
                        selection={selectedUser}
                        // onSelectionChange={(e) => setSelectedUser(e.value)}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink P  revPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        header={header}
                    >
                        <Column
                            field="name"
                            header="Name"
                            sortable
                            style={{ width: "12rem" }}
                        ></Column>
                        <Column
                            field="email"
                            header="Email"
                            style={{ width: "12rem" }}
                        ></Column>
                        <Column
                            field="role"
                            header="Role"
                            style={{ width: "12rem" }}
                        ></Column>
                        <Column
                            body={actionBodyTemplate}
                            exportable={false}
                            style={{ width: "8rem" }}
                        ></Column>
                    </DataTable>
                </div>
            )}

        </div>
    );
}
