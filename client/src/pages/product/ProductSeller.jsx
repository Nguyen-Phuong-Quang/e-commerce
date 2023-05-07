import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from 'primereact/multiselect';
import { Toolbar } from "primereact/toolbar";
import { InputNumber } from "primereact/inputnumber";
import ProductDialogFooter from "./Components/ProductDialogFooter";
import LeftToolbarTemplate from "./Components/LeftToolbarTemplate";
import hermet from "./image/hermet.jpg";

const dataTrain = [
  {
    name: "gucci",
    category: "clothes",
    mainImage: hermet,
    Image: hermet,
    description: "no thing",
    price: "232",
    discountPrice: "111",
    colors: 1,
    sizes: 1,
    quantities: 23,
  },
  {
    name: "hermes",
    category: "helmet",
    mainImage: hermet,
    Image: hermet,
    description: "no thing to say",
    price: "343",
    discountPrice: "98",
    colors: 2,
    sizes: 2,
    quantities: 12,
  },
];

const ProductSeller = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [subImages, setSubImages] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [quantities, setQuantities] = useState(0);
  const dt = useRef(null);
  const [globalFilter, setGlobalFilter] = useState(null);

  const colorOptions = ["red", "blue", "green", "yellow"];
  const sizeOptions = ["S", "M", "L", "XL"];

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

  // postapi
  const handleAddProduct = (product) => {
    setLoading(true);
    axios
      .post("/api/products", product)
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
        const updatedProducts = products.filter((p) => p.id !== product.id);
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

  const header = (
    <div className="flex justify-between text-xl text-center items-center ">
      <div className="basis-1/4">
        <strong>Manage Product Page</strong>
      </div>
      <div className="basis-1/4">
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

  const handleAddClick = () => {
    setSelectedProduct(null);
    setIsEditMode(false);
    setVisible(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditMode(true);
    setName(product.name);
    setCategory(product.category);
    setMainImage(product.mainImage);
    setSubImages(product.subImages);
    setDescription(product.description);
    setPrice(product.price);
    setDiscountPrice(product.discountPrice);
    setColors(product.colors);
    setSizes(product.sizes);
    setQuantities(product.quantities);
    setVisible(true);
  };

  const handleDeleteClick = (product) => {
    // Implement the logic for deleting a product
    handleDeleteProduct();
  };

  const handleSaveClick = () => {
    const product = {
      name,
      category,
      mainImage,
      subImages,
      description,
      price,
      discountPrice,
      colors,
      sizes,
      quantities,
    };
    if (isEditMode) {
      // Implement the logic for updating a product
      handleUpdateProduct();
    } else {
      // Implement the logic for adding a new product
      handleAddProduct();
    }
    setVisible(false);
    setName("");
    setCategory("");
    setMainImage(null);
    setSubImages([]);
    setDescription("");
    setPrice("");
    setDiscountPrice("");
    setColors([]);
    setSizes([]);
    setQuantities([]);
  };

  const handleCancelClick = () => {
    setVisible(false);
    setName("");
    setCategory("");
    setMainImage(null);
    setSubImages([]);
    setDescription("");
    setPrice("");
    setDiscountPrice("");
    setColors([]);
    setSizes([]);
    setQuantities([]);
  };

  const imageTemplate = (rowData) => {
    return (
      <img
        src={rowData.mainImage}
        alt={rowData.name}
        style={{ width: "50px", height: "50px" }}
      />
    );
  };

  const rightToolbarTemplate = () => {
    return <React.Fragment></React.Fragment>;
  };

  return (
    <>
      <div className="card">
        <Toolbar
          className="mb-4"
          left={<LeftToolbarTemplate handleAddClick={handleAddClick} delete={handleDeleteClick}
          selectedProduct={selectedProduct}
          />}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          //value={products}
          value={dataTrain}
          selection={selectedProduct}
          onSelectionChange={(e) => setSelectedProduct(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
          header={header}
          responsiveLayout="scroll"
          resizableColumns
          columnResizeMode="fit"
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="name" header="Name" />
          <Column field="category" header="Category" />
          <Column body={imageTemplate} header="Main Image" />
          <Column field="description" header="Description" />
          <Column field="price" header="Price" />
          <Column field="discountPrice" header="Price After Discount" />
          <Column field="colors" header="Colors" />
          <Column field="sizes" header="Sizes" />
          <Column field="quantities" header="Quantities" />
          <Column
            field="acitons"
            header="Actions"
            body={(rowData) => (
              <>
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-success mr-2"
                  onClick={() => handleEditClick(rowData)}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-warning"
                  onClick={() => handleDeleteClick(rowData)}
                />
              </>
            )}
          />
        </DataTable>
      </div>

      <Dialog
        visible={visible}
        style={{ width: "50%" }}
        footer={<ProductDialogFooter Cancel={handleCancelClick} Save={handleSaveClick}/>}
        onHide={handleCancelClick}
        header={isEditMode ? "Edit Product" : "Add Product"}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="p-field">
            <label htmlFor="category">Category</label>
            <InputText
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="p-field">
          <label htmlFor="mainImage">Main Image</label>
            <div className="card">
              <FileUpload
                chooseLabel="Select Image"
                uploadLabel="Upload Image"
                name="mainImage"
                multiple="false"
                accept="image/*"
                maxFileSize={1000000}
                emptyTemplate={
                  <p className="m-0">Drag and drop files to here to upload.</p>
                }
                uploadHandler={(event) => {
                  setMainImage(URL.createObjectURL(event.files[0]));
                }}
              />
            </div>
          </div>

          <div className="p-field">
          <label htmlFor="subImage">Sub Image</label>
            <div className="card">
              <FileUpload
                chooseLabel="Select Image"
                uploadLabel="Upload Image"
                name="subImages[]"
                multiple="true"
                accept="image/*"
                maxFileSize={1000000}
                emptyTemplate={
                  <p className="m-0">Drag and drop files to here to upload.</p>
                }
                uploadHandler={(event) => {
                  const subImageUrls = event.files.map((file) =>
                    URL.createObjectURL(file)
                  );
                  setSubImages((prevSubImages) => [
                    ...prevSubImages,
                    ...subImageUrls,
                  ]);
                }}
              />
            </div>
          </div>

          <div className="p-field">
            <label htmlFor="description">Description</label>
            <InputTextarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="p-field">
            <label htmlFor="price">Price</label>
            <InputText
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="p-field">
            <label htmlFor="discountPrice">Price After Discount</label>
            <InputText
              id="discountPrice"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
            />
          </div>

          <div className="p-field">
            <label htmlFor="colors">Colors</label>
            <MultiSelect
              filter
              id="colors"
              options={colorOptions}
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              // optionLabel="name"
              placeholder="Select Colors"
              display="chip"
            />
          </div>

          <div className="p-field">
            <label htmlFor="sizes">Sizes</label>
            <MultiSelect
              filter
              id="sizes"
              options={sizeOptions}
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              //optionLabel="name"
              placeholder="Select Sizes"
              display="chip"
            />
          </div>

          <div className="p-field">
            <label htmlFor="quantities">Quantities</label>
            <InputNumber
              id="quantities"
              value={quantities}
              onValueChange={(e) => {
                setQuantities(e.target.value);
              }}
              integeronly
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ProductSeller;
