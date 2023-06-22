import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import ProductDialogFooter from "./Components/ProductDialogFooter";
import { Dialog } from "primereact/dialog";
import productApi from "./../../api/productApi";
import { toastContext } from "./../../contexts/ToastProvider";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";

const DialogEditProduct = ({
    visible,
    setVisible,
    productId,
    categoryOptions,
    fetchData,
}) => {
    const { toastSuccess, toastError } = toastContext();
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState({
        name: "",
        description: "",
        price: 0,
        priceAfterDiscount: 0,

        quantity: 0,
    });

    //get product by id
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await productApi.getProductById(productId);
                if (response.data.type === "SUCCESS") {
                    const productCurrent = response.data.product;
                    setProducts(productCurrent);
                    setSelectedCategory(
                        categoryOptions.find(
                            (item) => item._id === productCurrent.category
                        )
                    );
                    setCategory(
                        categoryOptions.find(
                            (item) => item._id === productCurrent.category
                        )._id
                    );
                }
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };

        fetchData();
    }, [visible]);

    //update another fields of products
    const handleUpdateProduct = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", products.name);
        formData.append("category", category);
        formData.append("description", products.description);
        formData.append("price", products.price);
        formData.append("priceAfterDiscount", products.priceAfterDiscount);
        formData.append("quantity", products.quantity);

        try {
            const response = await productApi.updateProductDetail(
                productId,
                formData
            );

            if (response.data.type === "SUCCESS") {
                toastSuccess("Product detail updated  successfully");
                setVisible(false);
                fetchData();
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
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.value);
        setCategory(event.value._id);
    };

    return (
        <>
            <Dialog
                visible={visible} //pass params as addVisible.
                className="sm:w-full md:w-10/12 lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto"
                footer={
                    loading ? (
                        <></>
                    ) : (
                        <ProductDialogFooter
                            Cancel={handleCancelClick}
                            Save={handleSaveClick}
                        />
                    )
                }
                onHide={() => {
                    setVisible(false);
                }}
                header="Edit Product Detail"
            >
                {/* <div className="flex flex-col md:flex-row "> */}
                {/* <div className="w-full md:w-1/2 text-center mt-4">
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
                    <i className="pi pi-image mr-4" /> <span>Update</span>
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
                {/* <div className=" flex flex-col  w-full  rounded-lg  mr-4 p-4   h-auto ">
                <input
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  hidden
                  id="image-input"
                />
                <label
                  htmlFor="image-input"
                  className="font-bold flex justify-center items-center h-12 w-1/4 mx-auto mt-4 mb-2 bg-blue-500 text-white hover:cursor-pointer rounded-md hover:bg-blue-700 "
                >
                  <div className="flex items-center my-2">
                    <i className="pi pi-images mr-4" /> <span>Upload</span>
                  </div>
                </label>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`images${index + 1}`}
                        className="h-40 w-full object-cover rounded-lg"
                      />

                      <span className="absolute top-2 right-2 text-red-500 hover:text-red-800 cursor-pointer"
                       onClick={() => handleImageDelete(index)}
                      >
                        <i className="pi pi-times-circle "></i>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>  */}

                {loading && (
                    <div className="flex w-full h-[400px] justify-center items-center">
                        <ProgressSpinner />
                    </div>
                )}
                {!loading && (
                    <div className="w-full  mt-4">
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
                                // placeholder="Select a category"
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
                                // integerOnly
                                className="basis-2/3 mr-4"
                            />
                        </div>
                    </div>
                )}
            </Dialog>
        </>
    );
};

export default DialogEditProduct;
