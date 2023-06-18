import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import ProductDialogFooter from "./Components/ProductDialogFooter";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import productApi from "./../../api/productApi";
import categoryApi from "./../../api/categoryApi";
import { toastContext } from "./../../contexts/ToastProvider";
import { Dropdown } from "primereact/dropdown";

const DialogAddProduct = ({ visible, setVisible }) => {
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState(undefined);
  const [preview, setPreview] = useState(undefined);
  let [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [category, setCategory] = useState(null);

  const [images, setImages] = useState([]);
  const { toastSuccess } = toastContext();

  const [products, setProducts] = useState({
    name: "",
    // category: "",
    description: "",
    price: 0,
    priceAfterDiscount: 0,
    colors: [],
    sizes: [],
    quantity: null,
  });
  const navigate = useNavigate();

  const colorOptions = ["red", "blue", "green", "yellow"];
  const sizeOptions = ["S", "M", "L", "XL"];

  // fetch category ---------------------------------
  useEffect(() => {
    // Lấy danh sách category từ backend (ví dụ sử dụng hàm getCategoryOptions từ api.js)
    const fetchCategoryOptions = async () => {
      try {
        const response = await categoryApi.query();
        if (response.data.type === "SUCCESS") {
          if (response.data.type === "SUCCESS") {
            console.log(response.data.categories);
            // setCategoryOptions(response.data.categories)
            let categories = response.data.categories;
            categories.map((cate) => {
              categoryOptions.push({ id: cate._id, name: cate.name });
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategoryOptions();
  }, [visible]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.value);
    setCategory(event.value.id);
  };

  const handelAddProduct = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append("mainImage", mainImage);
    images.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("name", products.name);
    formData.append("category", category);
    formData.append("description", products.description);
    formData.append("price", products.price);
    formData.append("priceAfterDiscount", products.priceAfterDiscount);
    formData.append("colors", products.colors);
    formData.append("sizes", products.sizes);
    formData.append("quantity", products.quantity);
    console.log("formdata name: ");
    console.log(formData.get("name"));

    try {
      console.log(mainImage);
      const response = await productApi.addProduct(formData);

      if (response.data.type === "SUCCESS") {
        toastSuccess(response.data.message);
        setVisible(false);
        navigate("/product");
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // const fileURLs = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleImageDelete = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setMainImage(undefined);
      return;
    }
    // I've kept this example simple by using the first image instead of multiple
    setMainImage(e.target.files[0]);
  };

  // const uploadHandler = (event) => {
  //   const uploadedFiles = event.target.files;

  //   const fileURLs = uploadedFiles.map((file) => URL.createObjectURL(file));

  //   setImages((prevSubImages) => [...prevSubImages, ...fileURLs]);
  // };
  // const uploadHandler = (event) => {
  //   const files = event.target.files;
  //   const fileURLs = files.map((file) => URL.createObjectURL(file));
  //   setUploadedFiles(files);
  //   setImages(fileURLs);
  // };

  const handleCancelClick = () => {
    setVisible(false);
    setMainImage(undefined);
    setImages([]);
    setUploadedFiles([]);
  };

  useEffect(() => {
    if (!mainImage) {
      setPreview(undefined);
      return;
    }
    const mainImageUrl = URL.createObjectURL(mainImage);
    setPreview(mainImageUrl);
  }, [mainImage]);

  return (
    <>
      <Dialog
        visible={visible} //pass params as addVisible.
        // style={{ width: "60%" }}
        className="sm:w-full md:w-11/12 lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto"
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
        <div className="flex flex-col md:flex-row ">
          <div className="w-full md:w-1/2 text-center mt-4">
            <div className="mb-4 flex-col items-center">
              <label
                htmlFor="mainImage"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-left mr-4"
              >
                Main Image
              </label>
              <div className="w-full mr-8">
                <img
                  src={preview}
                  alt="preview"
                  className="rounded-md h-52 w-52 object-cover mx-auto shadow-xl"
                />
                <input
                  type="file"
                  id="main-image-upload"
                  hidden
                  onChange={onSelectFile}
                />

                <label
                  htmlFor="main-image-upload"
                  className="font-bold flex justify-center items-center h-12 w-1/4 mx-auto mt-6 mb-2 bg-blue-500 text-white hover:cursor-pointer rounded-md hover:bg-blue-700"
                >
                  <div className="flex items-center my-2">
                    <i className="pi pi-image mr-4" /> <span>Add</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="mb-4 flex-col items-center">
              <label
                htmlFor="images"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-left mr-4"
              >
                Sub Images
              </label>

              {/* --------------------- */}
              <div className=" flex flex-col  w-full  rounded-lg  mr-4 p-4   h-auto">
                <input
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  hidden
                  id="image-input"
                />
                <label
                  htmlFor="image-input"
                  className="font-bold flex justify-center items-center h-12 w-1/4 mx-auto mt-4 mb-2 bg-blue-500 text-white hover:cursor-pointer rounded-md hover:bg-blue-700"
                >
                  <div className="flex items-center my-2">
                    <i className="pi pi-images mr-4" /> <span>Upload</span>
                  </div>
                </label>
                {/* <label
                  htmlFor="image-input"
                  className="bg-blue-500 px-4 py-2 text-white rounded cursor-pointer font-bold py-3"
                >
                  Choose Images
                </label> */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`images${index + 1}`}
                        className="h-40 w-full object-cover rounded-lg"
                      />
                      {/* <button
                        className="absolute top-2 right-2 bg-gray-300 text-white font-bold rounded-full p-2"
                        onClick={() => handleImageDelete(index)}
                      >
                        x
                      </button> */}
                      <span className="absolute top-2 right-2 text-red-500 hover:text-red-800 cursor-pointer"
                                              onClick={() => handleImageDelete(index)}
                      >
                        <i className="pi pi-times-circle "></i>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* ----------------------------------------- */}
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-4">
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
            <div className="mb-6 flex flex-row">
              <label
                htmlFor="category"
                className="basis-1/3 block text-gray-700 font-bold mb-2 text-right mr-4"
              >
                Category
              </label>
              <Dropdown
                className="basis-2/3 mr-4"
                id="category"
                name="category"
                options={categoryOptions}
                value={selectedCategory}
                onChange={handleCategoryChange}
                optionLabel="name" 
                placeholder="Select a category"
              />
            </div>

            {/* --------------- --------------------------------------- */}

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
              <InputNumber
                id="price"
                name="price"
                placeholder="Enter price"
                value={products.price}
                onValueChange={handleChange}
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
              <InputNumber
                id="priceAfterDiscount"
                name="priceAfterDiscount"
                placeholder="Enter price after discount"
                value={products.priceAfterDiscount}
                onValueChange={handleChange}
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
              style={{ overflow: "auto" }}
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
              style={{ overflow: "auto" }}
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