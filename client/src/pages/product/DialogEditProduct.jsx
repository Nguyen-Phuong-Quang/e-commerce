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
import { Button } from "primereact/button";
import jacket1 from "./image/jacket-1.jpeg";

const DialogEditProduct = ({visible, setVisible}) => {
  const { toastSuccess, toastError } = toastContext();
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [mainImageUpdated, setMainImageUpdated] = useState(false);
  const [preview, setPreview] = useState(undefined);
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


//   useEffect(() => {
//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const response = await productApi.getProductById(id);
//             if (response.data.type === "Success") {
//                 setProducts(response.data.products);
//                 setPreview(response.data.products.mainImage);
//             }
//         } catch (err) {
//           toastError("Error", "Failed to fetch products");
//         }
//         setLoading(false);
//     };

//     fetchData();
// }, []);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try{
      // setProducts(dataTrain);
      setPreview(jacket1);
      setSubImages([{url:jacket1},{url:jacket1}, {url:jacket1}, {url:jacket1}  ]);
    }
    catch(err){
      console.log(err);
    }
    setLoading(false);
  };
  fetchData();
}, [visible]);

//update another fields of products
  const handleUpdateProduct = async () => {
    setLoading(true);
    try {
        const data = products;
        const response = await productApi.updateProductById(id, data);
        if (response.data.type === "Success") {
            toastSuccess("success", "Product updated successfully");
        }
    } catch (err) {
        toastError("error", "Failed to update product");
    }
    setLoading(false);
};

//update main image
const handleUpdateMainImage = async () => {
  setLoading(true);
  try{
    const response = await productApi.updateMainImage({mainImage});
    if(response.data.type == "Success"){
      setMainImageUpdated(false);
      toastSuccess(response.data.message);
    }
  }
  catch(err){
    console.log(err);
  }
  setLoading(false);
}

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
  }

  useEffect(() => {
    if (!mainImage) {
        setPreview(undefined);
        return;
    }

    const objectUrl = URL.createObjectURL(mainImage);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
}, [mainImage]);

const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
        setMainImage(undefined);
        return;
    }
    // I've kept this example simple by using the first image instead of multiple
    setMainImage(e.target.files[0]);

    setMainImageUpdated(true);
};

  const handleRemoveSubimage = (index) => {
    const updatedSubimages = [...subImages];
    updatedSubimages.splice(index, 1);
    setSubImages(updatedSubimages);
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = event.files.map((file) => {
      return {
        name: file.name,
        url: URL.createObjectURL(file),
      };
    });

    setSubImages([...subImages, ...uploadedFiles]);
  };

  return (
    <>
      <Dialog
        visible={visible} ///
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
        header="Edit Product"
      >
        <div className="flex flex-row ">
          <div className="w-1/2 text-center mt-4">
            <div className="mb-4 flex-col items-center ">
              <label
                htmlFor="mainImage"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-left mr-4"
              >
                Main Image
              </label>

              <div className="shadow-xl  w-full mr-8 mt-4 pb-4">
                <img
                  src={preview}
                  alt="mainImage"
                  className="mt-4 mb-4 rounded-xl border h-52 w-52 object-cover mx-auto shadow-xl"
                />

                <input
                  id="profile-image-sign-up"
                  type="file"
                  hidden
                  onChange={onSelectFile}
                />
                {mainImageUpdated ? (
                  <Button
                    className="font-bold flex justify-center items-center h-12 w-1/4 mx-auto mt-6 mb-2 bg-blue-600 text-white hover:cursor-pointer rounded-md"
                    label="Submit"
                    icon="pi pi-check"
                    onClick={() => handleUpdateMainImage()}
                  />
                ) : (
                  <label
                    htmlFor="profile-image-sign-up"
                    className="font-bold flex justify-center items-center h-12 w-1/4 mx-auto mt-6 mb-2 bg-white text-blue-500 border-radius border border-blue-600 hover:cursor-pointer hover:bg-blue-500 hover:text-white rounded-md"
                  >
                    <div className="flex items-center my-2">
                      <i className="pi pi-image mr-2" /> <span>Update</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div className="mb-4 flex-col items-center shadow-xl ">
              <label
                htmlFor="subImage"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-left mr-4"
              >
                Sub Images
              </label>
              {/* <div className="card">
                <FileUpload
                  className="mr-8"
                  chooseLabel="New"
                  uploadLabel="Upload"
                  cancelLabel="Cancel"
                  uploadOptions={{ className: "text-blue-700" }}
                  cancelOptions={{ className: "text-blue-700" }}
                  name="subImages[]"
                  multiple="true"
                  accept="image/*"
                  maxFileSize={1000000}
                  emptyTemplate={
                    <p className="m-0 p-2">
                      Drag and drop files to here to upload.
                    </p>
                  }
                  uploadHandler={handleFileUpload}
                />

                {/* handle edit sub image  */}
              {/* <div className="sub-images">
                  {subImages.map((subImage, index) => (
                    <div key={index} className="sub-image">
                      <img src={subImage} alt="Sub Image" />
                      <Button onChange={() => handleEditSubImage(index)} label="Edit"  className="bg-red-500 text-white-700"/>
                    </div>
                  ))}
                </div>
                
              </div> */}
              <FileUpload

                accept="image/*"
                maxFileSize={1000000}
                multiple={true}
                customUpload
                chooseLabel="New"

                uploadOptions={{ className: "text-blue-500" }}
                cancelOptions={{ className: "text-blue-500" }}
                chooseOptions={{className: "bg-white text-blue-500"}}
                uploadHandler={handleFileUpload}
              />

              <div className="grid grid-cols-4 gap-4  pb-2 mx-2 my-2 ">
                {subImages.map((subimage, index) => (
                  <div key={index} className="relative">
                    <img
                      src={subimage.url}
                      alt="subimage"
                      className="w-full h-32 object-cover rounded"
                    />
                      <div className="absolute top-1 right-1 overflow-hidden text-red-500 font-bold cursor-pointer inline-block" onClick={() => handleRemoveSubimage(index)}>
                        <i className="pi pi-times-circle  bg-white-500  hover:bg-white-500 hover:text-red-700 hover:cursor-pointer "></i>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-1/2  shadow-xl mt-4 mb-4 ml-4">
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
                htmlFor="discountPrice"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right mr-4"
              >
                Price After Discount
              </label>
              <InputText
                id="discountPrice"
                name="discountPrice"
                placeholder="Enter price after discount"
                value={products.price}
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
                htmlFor="quantities"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right mr-4 "
              >
                Quantities
              </label>
              <InputNumber
                id="quantities"
                name="quantities"
                placeholder="Enter quantity"
                value={products.quantities}
                onValueChange={handleChange}
                integeronly
                className="basis-2/3 mr-4"
              />
            </div>
          </div>
        </div>
        {/* <div className="p-fluid">
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
          
        </div> */}
      </Dialog>
    </>
  );
};

export default DialogEditProduct;
