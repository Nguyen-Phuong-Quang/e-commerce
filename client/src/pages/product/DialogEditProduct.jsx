import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from 'primereact/multiselect';
import { InputNumber } from "primereact/inputnumber";
import ProductDialogFooter from "./Components/ProductDialogFooter";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";
import productApi from "./../../api/productApi";
import { toastContext } from "./../../contexts/ToastProvider";

const DialogEditProduct = ({visible, setVisible}) => {
  const { toastSuccess, toastError } = toastContext();
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [subImages, setSubImages] = useState([]);
  const [products, setProducts] = useState({
    name: "",
    category: "",
    description: "",
    price: 0,
    discountPrice: 0,
    colors: [],
    sizes: [],
    quantities: 0,
  });
  const navigate = useNavigate();

  const colorOptions = ["red", "blue", "green", "yellow"];
  const sizeOptions = ["S", "M", "L", "XL"];

  // const showToast = (severity, summary, detail) => {
  //   toast.current.showToast({ severity, summary, detail, life: 3000 });
  // };

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await productApi.getProductById(id);
            if (response.data.type === "Success") {
                setProducts(response.data.products);
            }
        } catch (err) {
          toastError("Error", "Failed to fetch products");
        }
        setLoading(false);
    };

    fetchData();
}, []);

  const handleUpdateProduct = async () => {
    setLoading(true);
    try {
        const data = products;
        const response = await productApi.updateProductById(id, data, mainImage, subImages);
        if (response.data.type === "Success") {
            navigate("/");
            toastSuccess("success", "Product updated successfully");
        }
    } catch (err) {
        toastError("error", "Failed to update product");
    }
    setLoading(false);
};

const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setProducts((values) => ({ ...values, [name]: value }));
};


  const handleSaveClick = () => {
    handleUpdateProduct();
  };

  const handleCancelClick = () => {
    setVisible(false);
    setMainImage(null);
    setSubImages([]);
  }

  return (
    <>
      <Dialog
        visible={visible}///
        style={{ width: "50%" }}
        footer={<ProductDialogFooter Cancel={(handleCancelClick)} Save={handleSaveClick}/>}
        onHide={() => {setVisible(false)}}
        header="Edit Product"
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={products.name}
              onChange={handleChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="category">Category</label>
            <InputText
              id="category"
              value={products.category}
              onChange={handleChange}
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
              value={products.description}
              onChange={handleChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="price">Price</label>
            <InputText
              id="price"
              value={products.price}
              onChange={handleChange}
            />
          </div>
          <div className="p-field">
            <label htmlFor="discountPrice">Price After Discount</label>
            <InputText
              id="discountPrice"
              value={products.price}
              onChange={handleChange}
            />
          </div>

          <div className="p-field">
            <label htmlFor="colors">Colors</label>
            <MultiSelect
              filter
              id="colors"
              options={colorOptions}
              value={products.colors}
              onChange={handleChange}
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
              value={products.sizes}
              onChange={handleChange}
              //optionLabel="name"
              placeholder="Select Sizes"
              display="chip"
            />
          </div>

          <div className="p-field">
            <label htmlFor="quantities">Quantities</label>
            <InputNumber
              id="quantities"
              value={products.quantities}
              onValueChange={handleChange}
              integeronly
            />
          </div>
          
        </div>
      </Dialog>
    </>
  );
};

export default DialogEditProduct;
