import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from "primereact/progressspinner";
import categoryApi from "../../api/categoryApi";
import { toastContext } from '../../contexts/ToastProvider';
import './Category.css';
import DialogEditCategory from './DialogEditCategory';
import DialogAddCategory from './DialogAddCategory';
import DialogDeleteCategory from './DialogDeleteCategory';

var dataset = [
    {"id": "1000","description": "f230fh0g3","name": "Watch",},
    {"id": "1001","description": "f230fh0g4","name": "Hat",},
    {"id": "1002","description": "f230fh123","name": "Clock",},
    {"id": "1003","description": "f230fh0ad","name": "Pant",},
    {"id": "1004","description": "f230fh0zx","name": "Shoes",},
    {"id": "1005","description": "f230fhnbv","name": "Balo",},
    {"id": "1006","description": "f230f253s","name": "Package",},
    {"id": "1007","description": "f230fhgfd","name": "Short",},
    {"id": "1008","description": "f230fdfgj","name": "Phone",},
    {"id": "1009","description": "f230fhcvb","name": "Laptop",},
    {"id": "1010","description": "f230fhfgh","name": "Pen",},
    {"id": "1011","description": "f230fh657","name": "Fan",},
    {"id": "1012","description": "f230fhiop","name": "Mouse",},
    {"id": "1013","description": "f230fhjhg","name": "Paper",},
    {"id": "1014","description": "f230fhida","name": "Book",},
    {"id": "1015","description": "f230fhbcv","name": "Notebook",},
    {"id": "1016","description": "f230fh458","name": "Cream",},
    {"id": "1017","description": "f230fhjkl","name": "Lamp",},
    {"id": "1018","description": "f230fhjqa","name": "Accessory",},
    {"id": "1019","description": "f230fhree","name": "Houseware",},
    {"id": "1020","description": "f230fhfdf","name": "Joinery",},
    {"id": "1021","description": "nvklal433","name": "Clothes",}
]

export default function HomeCategory() {

    let emptyCategory = {
        id: null,
        name: '',
        description: "",
    };

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);

    const [submitted, setSubmitted] = useState(false);
    const [visibleDeletesDialog, setVisibleDeletesDialog] = useState(false);
    const [category, setCategory] = useState(emptyCategory);
    const [visibleAddDialog, setVisibleAddDialog] = useState(false);
    const [visibleEditDialog, setVisibleEditDialog] = useState(false);
    const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [categoryName, setCategoryName] = useState("");


    const { toastError } = toastContext();
    const dt = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await categoryApi.query()
                console.log(response);
                setData(response.data.data);
            } catch(err) {
                toastError(err.response.data.message);
                console.log(err.response);
            }
            setLoading(false);
        }
        fetchData()
    },[visibleDeleteDialog, visibleEditDialog, visibleAddDialog]);

    // const onProductSelect = (product) => {
    //     setSelectedProduct(product);
    //     setShowDialog(true);
    // };
    
    // const onHideDialog = () => {
    //     setSelectedProduct(null);
    //     setShowDialog(false);
    // };

    // const handleAddCategory = () => {
    //     setVisibleAddDialog(true);
    // }

    const handleAddCategory = () => {
        setCategory(emptyCategory);
        setSubmitted(false);
        setVisibleAddDialog(true);
    }

    // const hideDialog = () => {
    //     setSubmitted(false);
    //     setVisibleAddDialog(false);
    // }

    // const hideDeleteCategoryDialog = () => {
    //     setVisibleDeleteDialog(false);
    // }

    // const hideDeleteCategoriesDialog = () => {
    //     setVisibleDeletesDialog(false);
    // }

    const handleEditCategory = (category) => {
        setCategory({...category});
        setVisibleEditDialog(true);
    }

    const confirmDeleteCategory = (category) => {
        setCategory(category);
        setVisibleDeleteDialog(true);
    }

    // const handleDeleteCategory = () => {
    //     let _categories = categories.filter(val => val.id !== category.id);
    //     setCategories(_categories);
    //     setVisibleDeleteDialog(false);
    //     setCategory(emptyCategory);
    //     toast.current.show({ 
    //         severity: 'success', 
    //         summary: 'Successful', 
    //         detail: 'Category Deleted', 
    //         life: 3000 });
    // }


    // const confirmDeleteSelected = () => {
    //     setVisibleDeletesDialog(true);
    // }

    // const deleteSelectedCategories = () => {
    //     let _categories = categories.filter(
    //             val => !selectedCategories.includes(val)
    //         );
    //     setCategories(_categories);
    //     setVisibleDeletesDialog(false);
    //     setSelectedCategories(null);
    //     toast.current.show({ 
    //         severity: 'success', 
    //         summary: 'Successful', 
    //         detail: 'Categories Deleted', 
    //         life: 3000 
    //     });
    // }

    // const onInputChange = (e, name) => {
    //     const val = (e.target && e.target.value) || '';
    //     let _category = {...category};
    //     _category[`${name}`] = val;

    //     setCategory(_category);
    // }

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
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteCategory(rowData)} />
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
    // const categoryDialogFooter = (
    //     <React.Fragment>
    //         <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
    //         <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveCategory} />
    //     </React.Fragment>
    // );
    // const deleteCategoryDialogFooter = (
    //     <React.Fragment>
    //         <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCategoryDialog} />
    //         <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={handleDeleteCategory} />
    //     </React.Fragment>
    // );
    // const deleteCategoriesDialogFooter = (
    //     <React.Fragment>
    //         <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCategoriesDialog} />
    //         <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedCategories} />
    //     </React.Fragment>
    // );

    return (
        <div className="datatable-crud-demo">
            {!loading && (
                <>
                    {/* <Toast ref={toast} /> */}

                    <div className="card">
                        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                        {/* <DataTable ref={dt} value={products} selection={selectedCategories} onSelectionChange={(e) => setSelectedCategories(e.value)} */}
                        <DataTable ref={dt} value={dataset} selection={selectedCategories} 
                            onSelectionChange={(e) => setSelectedCategories(e.value)}
                            dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
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
                        categoryId={categoryId}
                        categoryName={categoryName}
                />
            )}
            {/* display edit dialog */}
            {visibleEditDialog && (
                <DialogEditCategory
                    visible={visibleEditDialog}
                    setVisible={setVisibleEditDialog}
                    category={category}
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