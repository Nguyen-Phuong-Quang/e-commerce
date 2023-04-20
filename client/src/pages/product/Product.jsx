import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { FileUpload } from "primereact/fileupload";

export default function Product() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const colorOptions = ["red", "blue", "green"];
    const sizeOptions = ["S", "M", "L", "XL"];

    //load data from db.getapi
    useEffect(() => {
        setLoading(true);
        axios
            .get("/api/products")
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error(error);
                showToast("error", "Failed to fetch products");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };

    //postapi
    const handleAddProduct = (product) => {
        setLoading(true);
        axios
            .post("/product", product)
            .then((response) => {
                setProducts([...products, response.data]);
                showToast("success", "Product added successfully");
            })
            .catch((error) => {
                console.error(error);
                showToast("error", "Failed to add product");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    //putapi
    const handleUpdateProduct = (product) => {
        setLoading(true);
        axios
            .put(`/api/products/${selectedProduct.id}`, product)
            .then((response) => {
                const updatedProducts = products.map((p) =>
                    p.id === response.data.id ? response.data : p
                );
                setProducts(updatedProducts);
                setSelectedProduct(null);
                showToast("success", "Product updated successfully");
            })
            .catch((error) => {
                console.error(error);
                showToast("error", "Failed to update product");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    //deleteapi
    const handleDeleteProduct = (product) => {
        setLoading(true);
        axios
            .delete(`/api/products/${product.id}`)
            .then(() => {
                const updatedProducts = products.filter(
                    (p) => p.id !== product.id
                );
                setProducts(updatedProducts);
                showToast("success", "Product deleted successfully");
            })
            .catch((error) => {
                console.error(error);
                showToast("error", "Failed to delete product");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const renderFooter = () => {
        return (
            <div className="p-clearfix">
                <Button
                    color="green"
                    size="sm"
                    icon="pi pi-plus"
                    label="Add new"
                    onClick={() => setSelectedProduct({})}
                />
            </div>
        );
    };

    const header = (
        <div className="flex justify-center items-center">
            <h5 className="mx-0 my-1">Manage Products</h5>
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

    const productColumns = [
        { field: "name", header: "Name" },
        { field: "image", header: "Image" },
        { field: "price", header: "Price" },
        { field: "color", header: "Colors" },
        { field: "size", header: "Sizes" },
        { field: "quantity", header: "Quantity" },
        {
            field: "actions",
            header: "Actions",
            body: (rowData) => {
                return (
                    <>
                        <Button
                            icon="pi pi-pencil"
                            onClick={() => setSelectedProduct(rowData)}
                        />
                        <Button
                            icon="pi pi-trash"
                            onClick={() => handleDeleteProduct(rowData)}
                        />
                    </>
                );
            },
        },
    ];

    return (
        <div className="p-grid p-dir">
            <div className="p-col-12">
                <Card title="Products" footer={renderFooter()}>
                    {loading ? (
                        <div className="p-grid p-justify-center">
                            <ProgressSpinner />
                        </div>
                    ) : (
                        <DataTable
                            globalFilter={globalFilter}
                            header={header}
                            value={products}
                            selectionMode="single"
                            selection={selectedProduct}
                            onSelectionChange={(e) =>
                                setSelectedProduct(e.value)
                            }
                            responsive
                            resizableColumns
                            columnResizeMode="fit"
                            autoLayout
                        >
                            {productColumns.map((col) => (
                                <DataTable.Column
                                    key={col.field}
                                    field={col.field}
                                    header={col.header}
                                    sortable
                                    filter
                                    filterPlaceholder={`Search by ${col.field}`}
                                    body={col.body}
                                />
                            ))}
                        </DataTable>

                        // <DataTable
                        //   value={products}
                        //   header={header}
                        //   footer={footer}
                        //   tableStyle={{ minWidth: "60rem" }}
                        // >
                        //   <Column field="name" header="Name"></Column>
                        //   <Column header="Image" body={imageBodyTemplate}></Column>
                        //   <Column
                        //     field="price"
                        //     header="Price"
                        //     body={priceBodyTemplate}
                        //   ></Column>
                        //   <Column field="category" header="Category"></Column>
                        //   <Column
                        //     field="rating"
                        //     header="Reviews"
                        //     body={ratingBodyTemplate}
                        //   ></Column>
                        //   <Column header="Status" body={statusBodyTemplate}></Column>
                        // </DataTable>
                    )}
                </Card>
            </div>

            <div className="p-col-12">
                <Panel
                    header={`${selectedProduct ? "Edit" : "Add"} Product`}
                    visible={!!selectedProduct}
                    toggleable
                    style={{ marginTop: "2em" }}
                >
                    {selectedProduct && (
                        <div className="p-grid p-fluid">
                            <div class="grid">
                                <div class="col-5">
                                    <label htmlFor="name">Name</label>
                                    <InputText
                                        id="name"
                                        placeholder="Enter product name"
                                        value={selectedProduct.name || ""}
                                        onChange={(e) =>
                                            setSelectedProduct({
                                                ...selectedProduct,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div class="col-5">
                                    <label htmlFor="category">Category</label>
                                    <InputText
                                        id="category"
                                        placeholder="Enter category"
                                        value={selectedProduct.category || ""}
                                        onChange={(e) =>
                                            setSelectedProduct({
                                                ...selectedProduct,
                                                category: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="p-col-4">
                                <label htmlFor="description">Description</label>
                                <InputText
                                    placeholder="Enter some description"
                                    id="description"
                                    value={selectedProduct.description || ""}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="p-col-4">
                                <label htmlFor="mainImage">Main Image</label>
                                <FileUpload
                                    id="mainImage"
                                    mode="basic"
                                    uploadLabel="Upload"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    customUpload
                                    chooseLabel="Choose file"
                                    //  uploadHandler={handleMainImageUpload}
                                    onUpload={({ files }) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            image: files[0].objectURL,
                                        })
                                    }
                                />
                            </div>
                            <div className="p-col-4">
                                <label htmlFor="image">Image</label>
                                <FileUpload
                                    id="Image"
                                    mode="basic"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    customUpload
                                    chooseLabel="Choose file"
                                    //  uploadHandler={handleMainImageUpload}
                                    onUpload={({ files }) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            image: files[0].objectURL,
                                        })
                                    }
                                />
                            </div>
                            <div className="p-col-4">
                                <label htmlFor="price">Price</label>
                                <InputText
                                    id="price"
                                    placeholder="Enter price"
                                    value={selectedProduct.price || ""}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            price: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="p-col-4">
                                <label htmlFor="pricediscount">
                                    Price after discount
                                </label>
                                <InputText
                                    placeholder="Enter price after discount"
                                    id="pricediscount"
                                    value={selectedProduct.pricediscount || ""}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            pricediscount: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="p-col-4">
                                <label htmlFor="quantity">Quantity</label>
                                <InputText
                                    id="quantity"
                                    placeholder="Enter quantity"
                                    value={selectedProduct.quantity || ""}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            quantity: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="p-col-12">
                                <label htmlFor="quantity">Size</label>
                                <MultiSelect
                                    filter
                                    placeholder="Select sizes"
                                    value={selectedProduct.size}
                                    options={sizeOptions}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            size: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="p-col-12">
                                <label htmlFor="quantity">Color</label>
                                <MultiSelect
                                    filter
                                    placeholder="Select colors"
                                    value={selectedProduct.color}
                                    options={colorOptions}
                                    // onChange={(e) => set(e.value)}
                                    onChange={(e) =>
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            color: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div class="mt-[2em] flex justify-center w-1/2">
                                {/* <Button
                  rounded
                  label="Save"
                  icon="pi pi-bookmark"
                  size="normal"
                  className="p-button-success mr-2"
                  onClick={() =>
                    selectedProduct.id
                      ? handleUpdateProduct(selectedProduct)
                      : handleAddProduct(selectedProduct)
                  }
                />
                <Button
                  rounded
                  label="Cancel"
                  icon="pi pi-times"
                  size="normal"
                  severity="secondary"
                  onClick={() => setSelectedProduct(null)}
                /> */}
                                <Button
                                    label={selectedProduct ? "Update" : "Save"}
                                    icon={
                                        selectedProduct
                                            ? "pi pi-check"
                                            : "pi pi-plus"
                                    }
                                    className="p-button-success"
                                    onClick={() =>
                                        selectedProduct
                                            ? handleUpdateProduct(
                                                  selectedProduct
                                              )
                                            : handleAddProduct(selectedProduct)
                                    }
                                    disabled={
                                        !selectedProduct?.name ||
                                        !selectedProduct?.price
                                    }
                                />
                                <Button
                                    label="Cancel"
                                    icon="pi pi-times"
                                    className="p-button-secondary "
                                    onClick={() => setSelectedProduct(null)}
                                />
                            </div>

                            {/* <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </React.Fragment> */}
                        </div>
                    )}
                </Panel>
            </div>

            <Toast ref={toast} />
        </div>
    );
}
