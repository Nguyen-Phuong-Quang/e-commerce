import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from 'primereact/multiselect';
import { InputNumber } from "primereact/inputnumber";
import ProductDialogFooter from "./Components/ProductDialogFooter";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import productApi from "./../../api/productApi";
import { toastContext } from "./../../contexts/ToastProvider";
import { userStateContext } from "../../contexts/StateProvider";


const DialogAddProduct = ({visible, setVisible}) => {
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const { toastError, toastSuccess } = toastContext();
  const { currentUser } = userStateContext();

  const [products, setProducts] = useState({
    name: "",
    category: "",
    description: "",
    price: null,
    priceAfterDiscount : null,
    colors: [],
    sizes: [],
    quantity: null,
  });
  const navigate = useNavigate();

  const colorOptions = ["red", "blue", "green", "yellow"];
  const sizeOptions = ["S", "M", "L", "XL"];



  const handelAddProduct = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("mainImage", mainImage);

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }


    try {
      const response = await productApi.addProduct({
        ...products, 
        formData,
        // mainImage, 
        // images,
        sellerId: currentUser.id
      });

        if (response.data.type === "Success") {
            navigate("/");
            toastSuccess(response.data.message);
        }
    } catch (err) {
        //  toastError(err.response.data.message);
        console.log(err);
    }
    setLoading(false);
};

const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setProducts((values) => ({ ...values, [name]: value }));
};


  const handleSaveClick = () => {
    handelAddProduct();
  };

  const handleCancelClick = () => {
    setVisible(false);
    setMainImage(null);
    setImages([]);
  }



  return (
    <>
      <Dialog
        visible={visible} //pass params as addVisible.
        style={{ width: "60%" }}
        footer={
          <ProductDialogFooter
            Cancel={handleCancelClick}
            Save={handleSaveClick}
          />
        }
        onHide={() => {
          setVisible(false);
        }}
        header="Add Product"
      >
        <div className="flex flex-row ">
          <div className="w-1/2 text-center mt-4">
            <div className="mb-4 flex-col items-center">
              <label
                htmlFor="mainImage"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-left mr-4"
              >
                Main Image
              </label>
              <div className="w-full mr-8">
                <img
                  src={mainImage}
                  alt="mainImage"
                  className="rounded-md h-52 w-52 object-cover mx-auto shadow-xl"
                />
                <input
                  type="file"
                  id="mainImage"
                  name="mainImage"
                  hidden
                  onChange={(event) => {
                    setMainImage(URL.createObjectURL(event.target.files[0]));
                  }}
                />
                
                <label
                  htmlFor="mainImage"
                  className="font-bold flex justify-center items-center h-12 w-1/4 mx-auto mt-6 mb-2 bg-blue-500 text-white hover:cursor-pointer rounded-md"
                >
                  <div className="flex items-center my-2">
                    <i className="pi pi-image mr-4" /> <span>Add</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="mb-4 flex-col items-center">
              <label
                htmlFor="subImage"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-left mr-4"
              >
                Sub Images
              </label>
              <div className="card">
                <FileUpload
                type="file"
                className="mr-8"
                  chooseLabel="New"
                  uploadLabel="Upload"
                  cancelLabel="Cancel"
                  uploadOptions={{className: "text-blue-700"}}
                  cancelOptions={{className: "text-blue-700"}}
                  name="images"
                  multiple="true"
                  accept="image/*"
                  maxFileSize={1000000}
                  emptyTemplate={
                    <p className="m-0 p-2">
                      Drag and drop files to here to upload.
                    </p>
                  }
                  uploadHandler={(event) => {
                    const uploadedFiles = event.files;
                    setImages((prevImages) => [...prevImages, ...uploadedFiles]);
                  }}
                  
                  // uploadHandler={(event) => {
                  //   const subImageUrls = event.files.map((file) =>
                  //     URL.createObjectURL(file)
                  //   );
                  //   setImages((prevSubImages) => [
                  //     ...prevSubImages,
                  //     ...subImageUrls,
                  //   ]);
                  // }}
                />

              </div>
            </div>
          </div>

          <div className="w-1/2 mt-4">
            <div className="mb-6 flex flex-row ">
              <label
                htmlFor="name"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right mr-4"
              >
                Name
              </label>
              <InputText
                id="name"
                name="name"
                placeholder="Enter name"
                value={products.name}
                onChange={handleChange}
                className="basis-2/3 mr-4"
              />
            </div>
            <div className="mb-6 flex flex-row ">
              <label
                htmlFor="category"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right mr-4"
              >
                Category
              </label>
              <InputText
                id="category"
                name="category"
                placeholder="Enter category"
                value={products.category}
                onChange={handleChange}
                className="basis-2/3 mr-4"
              />
            </div>

            <div className="mb-6 flex flex-row ">
              <label
                htmlFor="description"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right mr-4"
              >
                Description
              </label>
              <InputTextarea
                id="description"
                name="description"
                placeholder="Enter description"
                value={products.description}
                onChange={handleChange}
                className="basis-2/3 mr-4"
                rows={3}
                cols={30}
              />
            </div>
            <div className="mb-6 flex flex-row ">
              <label
                htmlFor="price"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right mr-4"
              >
                Price
              </label>
              <InputText
                id="price"
                name="price"
                placeholder="Enter price"
                value={products.price}
                onChange={handleChange}
                className="basis-2/3 mr-4"
              />
            </div>
            <div className="mb-6 flex flex-row ">
              <label
                htmlFor="priceAfterDiscount "
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right mr-4"
              >
                Price After Discount
              </label>
              <InputText
                id="priceAfterDiscount "
                name="priceAfterDiscount "
                placeholder="Enter price after discount"
                value={products.priceAfterDiscount }
                onChange={handleChange}
                className="basis-2/3 mr-4"
              />
            </div>

            <div className="mb-6 flex flex-row ">
              <label
                htmlFor="colors"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right mr-4 "
              >
                Colors
              </label>
              <MultiSelect
                filter
                id="colors"
                name="colors"
                options={colorOptions}
                value={products.colors}
                onChange={handleChange}
                placeholder="Select Colors"
                display="chip"
                className="w-2/3 md:w-20rem  mr-4"
              />
            </div>

            <div className="mb-6 flex flex-row ">
              <label
                htmlFor="sizes"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right mr-4 "
              >
                Sizes
              </label>
              <MultiSelect
                filter
                id="sizes"
                name="sizes"
                options={sizeOptions}
                value={products.sizes}
                onChange={handleChange}
                //optionLabel="name"
                placeholder="Select Sizes"
                display="chip"
                className="basis-2/3 mr-4"
              />
            </div>

            <div className="mb-6 flex flex-row ">
              <label
                htmlFor="quantity"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right mr-4 "
              >
                Quantity
              </label>
              <InputNumber
                id="quantity"
                name="quantity"
                placeholder="Enter quantity"
                value={products.quantity}
                onValueChange={handleChange}
                integeronly
                className="basis-2/3 mr-4"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DialogAddProduct;
