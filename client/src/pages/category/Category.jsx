import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import categoryApi from "../../api/categoryApi";
import { toastContext } from '../../contexts/ToastProvider';
import DialogEditCategory from './DialogEditCategory';
import DialogAddCategory from './DialogAddCategory';
import DialogDeleteCategory from './DialogDeleteCategory';
import './Category.css';

export default function Category() {

    let emptyCategory = {
        id: null,
        name: '',
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
    const [editId,setEditId] = useState("");
    const [deleteId,setDeleteId] = useState("");

    const { toastError } = toastContext();
    const dt = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await categoryApi.query()
                setData(response.data.categories);
            } catch(err) {
                toastError(err.response.data.message);
            }
        }
        fetchData()
    },[visibleAddDialog,visibleDeleteDialog,visibleEditDialog]);

    const handleAddCategory = () => {
        setCategory(emptyCategory);
        setVisibleAddDialog(true);
    }

    const handleEditCategory = (category) => {
        setEditId(category._id);
        setVisibleEditDialog(true);
    }

    const handleDeleteCategory = (category) => {
        setDeleteId(category._id);
        setVisibleDeleteDialog(true);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button 
                    label="New" 
                    icon="pi pi-plus" 
                    className="p-button-success mr-2" 
                    onClick={handleAddCategory} 
                />
                {/* <Button 
                    label="Delete" 
                    icon="pi pi-trash" 
                    className="p-button-danger" 
                    onClick={confirmDeleteSelected} 
                    disabled={!selectedCategories || !selectedCategories.length} 
                /> */}
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => handleEditCategory(rowData)} /> {" "}
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => handleDeleteCategory(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Manage Category</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    return (
        <div className="datatable-crud-demo">
            {!loading && (
                <>
                    {/* <Toast ref={toast} /> */}

                    <div className="card" >
                        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                        <DataTable ref={dt} value={data} selection={selectedCategories} 
                            // onSelectionChange={(e) => setSelectedCategories(e.value)}
                            paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink P  revPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                            globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                            {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column> */}
                            <Column field="name" header="Name" sortable style={{ minWidth: '12rem' }}></Column>
                            <Column field="description" header="Description" style={{ minWidth: '24rem' }}></Column>
                            <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                        </DataTable>
                    </div>

                </>
            )}

            {visibleAddDialog && (
                <DialogAddCategory
                    visible={visibleAddDialog}
                    setVisible={setVisibleAddDialog}
                    category={category}
                />
            )}

            {/* display delete dialog */}
            {visibleDeleteDialog && (
                <DialogDeleteCategory
                        visible={visibleDeleteDialog}
                        setVisible={setVisibleDeleteDialog}
                        id={deleteId}
                />
            )}
            {/* display edit dialog */}
            {visibleEditDialog && (
                <DialogEditCategory
                    visible={visibleEditDialog}
                    setVisible={setVisibleEditDialog}
                    id={editId}
                />
            )}

            {/* {visibleDeletesDialog && (
                <Dialog visible={visibleDeletesDialog} 
                    style={{ width: '450px' }} 
                    header="Confirm" 
                    modal 
                    footer={deleteCategoriesDialogFooter} 
                    onHide={hideDeleteCategoriesDialog}
                >
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                        {category && <span>Are you sure you want to delete the selected Categories?</span>}
                    </div>
                </Dialog>
            )} */}
        </div>
    );
}