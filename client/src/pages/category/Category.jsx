import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
// import { toastContext } from "../../contexts/ToastProvider";
import categoryApi from "../../api/categoryApi";
import DialogEditCategory from "./DialogEditCategory";
import DialogAddCategory from "./DialogAddCategory";
import DialogDeleteCategory from "./DialogDeleteCategory";

export default function Category() {
    let emptyCategory = {
        id: null,
        name: "",
        description: "",
    };

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const [category, setCategory] = useState(emptyCategory);
    const [visibleAddDialog, setVisibleAddDialog] = useState(false);
    const [visibleEditDialog, setVisibleEditDialog] = useState(false);
    const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [editId, setEditId] = useState("");
    const [deleteId, setDeleteId] = useState("");

    // const { toastSuccess } = toastContext();
    const dt = useRef(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await categoryApi.query();
            setData(response.data.categories);
            // toastSuccess(response.data.message);
        } catch (err) {
            // toastError(err.response.data.message);
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleAddCategory = () => {
        setVisibleAddDialog(true);
    };

    const handleEditCategory = (category) => {
        setEditId(category._id);
        setVisibleEditDialog(true);
    };

    const handleDeleteCategory = (category) => {
        setDeleteId(category._id);
        setVisibleDeleteDialog(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    label="New"
                    icon="pi pi-plus"
                    className="p-button-success mr-2"
                    onClick={handleAddCategory}
                />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => handleEditCategory(rowData)}
                />{" "}
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => handleDeleteCategory(rowData)}
                />
            </React.Fragment>
        );
    };

    const header = (
        <div className="table-header flex justify-between ">
            <h5 className="text-2xl mx-2 mt-3">Manage Category</h5>
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
                    <Toolbar
                        className="mb-4"
                        left={leftToolbarTemplate}
                    ></Toolbar>

                    <DataTable
                        ref={dt}
                        value={data}
                        selection={selectedCategories}
                        // onSelectionChange={(e) => setSelectedCategories(e.value)}
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
                            field="description"
                            header="Description"
                            style={{ width: "24rem" }}
                        ></Column>
                        <Column
                            body={actionBodyTemplate}
                            exportable={false}
                            style={{ width: "8rem" }}
                        ></Column>
                    </DataTable>
                </div>
            )}

            {visibleAddDialog && (
                <DialogAddCategory
                    visible={visibleAddDialog}
                    setVisible={setVisibleAddDialog}
                    category={category}
                    fetchData={fetchData}
                />
            )}

            {visibleDeleteDialog && (
                <DialogDeleteCategory
                    visible={visibleDeleteDialog}
                    setVisible={setVisibleDeleteDialog}
                    id={deleteId}
                    fetchData={fetchData}
                />
            )}

            {visibleEditDialog && (
                <DialogEditCategory
                    visible={visibleEditDialog}
                    setVisible={setVisibleEditDialog}
                    id={editId}
                    fetchData={fetchData}
                />
            )}
        </div>
    );
}
