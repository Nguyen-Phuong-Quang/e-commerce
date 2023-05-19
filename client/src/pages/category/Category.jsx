import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CategoryService } from './CategoryService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import './Category.css';

var dataset = [
    {"id": "1000","code": "f230fh0g3","name": "Watch","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1001","code": "f230fh0g4","name": "Hat","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1002","code": "f230fh123","name": "Clock","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1003","code": "f230fh0ad","name": "Pant","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1004","code": "f230fh0zx","name": "Shoes","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1005","code": "f230fhnbv","name": "Balo","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1006","code": "f230f253s","name": "Package","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1007","code": "f230fhgfd","name": "Short","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1008","code": "f230fdfgj","name": "Phone","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1009","code": "f230fhcvb","name": "Laptop","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1010","code": "f230fhfgh","name": "Pen","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1011","code": "f230fh657","name": "Fan","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1012","code": "f230fhiop","name": "Mouse","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1013","code": "f230fhjhg","name": "Paper","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1014","code": "f230fhida","name": "Book","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1015","code": "f230fhbcv","name": "Notebook","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1016","code": "f230fh458","name": "Cream","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1017","code": "f230fhjkl","name": "Lamp","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1018","code": "f230fhjqa","name": "Accessory","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1019","code": "f230fhree","name": "Houseware","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1020","code": "f230fhfdf","name": "Joinery","quantity": 24,"inventoryStatus": "INSTOCK"},
    {"id": "1021","code": "nvklal433","name": "Clothes","quantity": 61,"inventoryStatus": "INSTOCK"}
]

export default function Category() {

    let emptyCategory = {
        id: null,
        name: '',
        quantity: 0,
        inventoryStatus: 'INSTOCK'
    };

    const [categories, setCategories] = useState(null);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [deleteCategoriesDialog, setDeleteCategoriesDialog] = useState(false);
    const [category, setCategory] = useState(emptyCategory);
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const categoryService = new CategoryService();

    useEffect(() => {
        categoryService.getCategories().then(data => setCategories(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const openNew = () => {
        setCategory(emptyCategory);
        setSubmitted(false);
        setCategoryDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryDialog(false);
    }

    const hideDeleteCategoryDialog = () => {
        setDeleteCategoryDialog(false);
    }

    const hideDeleteCategoriesDialog = () => {
        setDeleteCategoriesDialog(false);
    }

    const saveCategory = () => {
        setSubmitted(true);

        if (category.name.trim()) {
            let _categories = [...categories];
            let _category = {...category};
            if (category.id) {
                const index = findIndexById(category.id);

                _categories[index] = _category;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Category Updated', life: 3000 });
            }
            else {
                _category.id = createId();
                _category.image = 'product-placeholder.svg';
                _categories.push(_category);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Category Created', life: 3000 });
            }

            setCategories(_categories);
            setCategoryDialog(false);
            setCategory(emptyCategory);
        }
    }

    const editCategory = (category) => {
        setCategory({...category});
        setCategoryDialog(true);
    }

    const confirmDeleteCategory = (category) => {
        setCategory(category);
        setDeleteCategoryDialog(true);
    }

    const deleteCategory = () => {
        let _categories = categories.filter(val => val.id !== category.id);
        setCategories(_categories);
        setDeleteCategoryDialog(false);
        setCategory(emptyCategory);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Category Deleted', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const confirmDeleteSelected = () => {
        setDeleteCategoriesDialog(true);
    }

    const deleteSelectedCategories = () => {
        let _categories = categories.filter(val => !selectedCategories.includes(val));
        setCategories(_categories);
        setDeleteCategoriesDialog(false);
        setSelectedCategories(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Categories Deleted', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _category = {...category};
        _category[`${name}`] = val;

        setCategory(_category);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _category = {...category};
        _category[`${name}`] = val;

        setCategory(_category);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedCategories || !selectedCategories.length} />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
            </React.Fragment>
        )
    }

    const statusBodyTemplate = (rowData) => {
        return <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCategory(rowData)} />
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
    const categoryDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveCategory} />
        </React.Fragment>
    );
    const deleteCategoryDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCategoryDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteCategory} />
        </React.Fragment>
    );
    const deleteCategoriesDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCategoriesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedCategories} />
        </React.Fragment>
    );

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                {/* <DataTable ref={dt} value={products} selection={selectedCategories} onSelectionChange={(e) => setSelectedCategories(e.value)} */}
                <DataTable ref={dt} value={dataset} selection={selectedCategories} onSelectionChange={(e) => setSelectedCategories(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    <Column field="code" header="Code" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={categoryDialog} style={{ width: '450px' }} header="Category Details" modal className="p-fluid" footer={categoryDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <InputText id="name" value={category.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !category.name })} />
                    {submitted && !category.name && <small className="p-error">Name is required.</small>}
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="quantity">Quantity</label>
                        <InputNumber id="quantity" value={category.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteCategoryDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCategoryDialogFooter} onHide={hideDeleteCategoryDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {category && <span>Are you sure you want to delete <b>{category.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteCategoriesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCategoriesDialogFooter} onHide={hideDeleteCategoriesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {category && <span>Are you sure you want to delete the selected Categories?</span>}
                </div>
            </Dialog>
        </div>
    );
}