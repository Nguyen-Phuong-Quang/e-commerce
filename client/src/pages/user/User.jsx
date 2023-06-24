import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { toastContext } from "../../contexts/ToastProvider";
import { Dialog } from "primereact/dialog";
import userApi from "../../api/userApi";
import DialogUserCreate from "./DialogUserCreate";
import DialogUserEdit from "./DialogUserEdit";

export default function User() {
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [data, setData] = useState([]);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleEditDialog, setVisibleEditDialog] = useState(false);
    const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [editId, setEditId] = useState("");
    const [deleteId, setDeleteId] = useState("");
    const { toastSuccess, toastError } = toastContext();

    const dt = useRef(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await userApi.query(1);
            if (response.data.type === "SUCCESS") {
                setData(response.data.users);
            }
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditUser = (user) => {
        setEditId(user._id);
        setVisibleEditDialog(true);
    };

    const handleDeleteUser = (user) => {
        setDeleteId(user._id);
        setVisibleDeleteDialog(true);
    };

    const deleteUser = async (id) => {
        setLoadingDelete(true);
        try {
            const response = await userApi.deleteUser(id);
            if (response.data.type === "SUCCESS") {
                toastSuccess(response.data.message);
                fetchData();
                setVisibleDeleteDialog(false);
            }
        } catch (err) {
            toastError(err.response.data.message);
        }
        setLoadingDelete(false);
        setVisibleDeleteDialog(false);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-info mr-2"
                    onClick={() => handleEditUser(rowData)}
                />{" "}
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => handleDeleteUser(rowData)}
                    severity="danger"
                />
            </React.Fragment>
        );
    };

    const header = (
        <div className="table-header flex justify-between ">
            <h5 className="text-2xl mx-2 mt-3">Manage User</h5>
            <div>
                <Button
                    label="Create"
                    icon="pi pi-plus"
                    severity="success"
                    className="mr-2"
                    onClick={() => {
                        setVisibleAdd(true);
                    }}
                />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search..."
                    />
                </span>
            </div>
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
                        visible={visibleDeleteDialog}
                        onHide={() => setVisibleDeleteDialog(false)}
                        header="Delete user"
                        footer={
                            loadingDelete ? (
                                <></>
                            ) : (
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
                                        onClick={() => deleteUser(deleteId)}
                                        severity="danger"
                                    />
                                </div>
                            )
                        }
                    >
                        {loadingDelete && (
                            <div className="w-80 flex justify-center">
                                <ProgressSpinner />
                            </div>
                        )}
                        {!loadingDelete && (
                            <p>
                                Are you sure you want to delete this user
                                account?
                            </p>
                        )}
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
                            style={{ width: "10rem" }}
                        ></Column>
                        <Column
                            field="phone"
                            header="Phone"
                            style={{ width: "10rem" }}
                        ></Column>
                        <Column
                            field="role"
                            header="Role"
                            style={{ width: "4rem" }}
                        ></Column>
                        <Column
                            body={actionBodyTemplate}
                            exportable={false}
                            style={{ width: "8rem" }}
                        ></Column>
                    </DataTable>
                </div>
            )}
            {visibleAdd && (
                <DialogUserCreate
                    visible={visibleAdd}
                    setVisible={setVisibleAdd}
                    fetchData={fetchData}
                />
            )}
            {visibleEditDialog && (
                <DialogUserEdit
                    id={editId}
                    visible={visibleEditDialog}
                    setVisible={setVisibleEditDialog}
                    fetchData={fetchData}
                />
            )}
        </div>
    );
}
