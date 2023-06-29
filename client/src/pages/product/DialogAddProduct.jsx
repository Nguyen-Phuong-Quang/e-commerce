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
import { Button } from "primereact/button";
import convertFirstLetterToUpperCase from "../../helpers/convertFirstLetterToUpperCase";

const DialogAddProduct = ({
    visible,
    setVisible,
    categoryOptions,
    fetchData,
}) => {
    const [loading, setLoading] = useState(false);
    const [mainImage, setMainImage] = useState(undefined);
    const [preview, setPreview] = useState(undefined);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [category, setCategory] = useState(null);
    const [images, setImages] = useState([]);
    const { toastSuccess, toastError } = toastContext();
    const [newColor, setNewColor] = useState("");
    const [newSize, setNewSize] = useState("");
    const [products, setProducts] = useState({
        name: "",
        description: "",
        price: 0,
        priceAfterDiscount: 0,
        quantity: null,
    });

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.value);
        setCategory(event.value._id);
    };

    const handleAddColor = () => {
        if (newColor) setColors([...colors, newColor]);
        setNewColor("");
    };

    const handleRemoveColor = (index) => {
        const updatedColor = [...colors];
        updatedColor.splice(index, 1);
        setColors(updatedColor);
    };
    const handleAddSize = () => {
        if (newSize) setSizes([...sizes, newSize]);
        setNewSize("");
    };

    const handleRemoveSize = (index) => {
        const updatedSize = [...sizes];
        updatedSize.splice(index, 1);
        setSizes(updatedSize);
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
        formData.append("colors", colors);
        formData.append("sizes", sizes);
        formData.append("quantity", products.quantity);

        try {
            const response = await productApi.addProduct(formData);

            if (response.data.type === "SUCCESS") {
                toastSuccess(response.data.message);
                setVisible(false);
                fetchData();
            }
        } catch (err) {
            toastError(err.response.data.message);
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

        setMainImage(e.target.files[0]);
    };

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
                header="Add Product"
            >
                {loading && (
                    <div className="flex justify-center items-center w-full h-[60vh]">
                        <ProgressSpinner />
                    </div>
                )}
                {!loading && (
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
                                            <i className="pi pi-image mr-4" />{" "}
                                            <span>Add</span>
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
                                        className="font-bold flex justify-center items-center h-12 w-1/2 mx-auto pt-4 pb-2 bg-blue-500 text-white hover:cursor-pointer rounded-md hover:bg-blue-700"
                                    >
                                        <div className="flex justify-center items-center h-full">
                                            <i className="pi pi-images mr-4" />{" "}
                                            <span>Upload</span>
                                        </div>
                                    </label>
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        {images.map((image, index) => (
                                            <div
                                                key={index}
                                                className="relative"
                                            >
                                                <img
                                                    src={URL.createObjectURL(
                                                        image
                                                    )}
                                                    alt={`images${index + 1}`}
                                                    className="h-40 w-full object-cover rounded-lg"
                                                />
                                                <span
                                                    className="absolute top-2 right-2 text-red-500 hover:text-red-800 cursor-pointer"
                                                    onClick={() =>
                                                        handleImageDelete(index)
                                                    }
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
                            <div className="mb-6 flex flex-row items-center">
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
                            <div className="mb-6 flex flex-row items-center">
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

                            <div className="mb-6 flex flex-row items-center">
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
                            <div className="mb-6 flex flex-row items-center">
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
                            <div className="mb-6 flex flex-row items-center">
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

                            {/* ------------color------------- */}
                            <div className="mb-6 flex flex-row ">
                                <label
                                    htmlFor="sizes"
                                    className="basis-1/3 block text-gray-700 font-bold mb-2 text-right mr-4"
                                >
                                    Sizes
                                </label>
                                <div className="basis-2/3 mr-4 ">
                                    <div
                                        className="flex flex-row mb-4"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                                handleAddSize();
                                        }}
                                    >
                                        <InputText
                                            value={newSize}
                                            id="sizes"
                                            name="sizes"
                                            onChange={(e) =>
                                                setNewSize(e.target.value)
                                            }
                                            className="mr-2 w-2/3"
                                            placeholder="Enter a size"
                                        />
                                        <Button
                                            label="Add"
                                            onClick={handleAddSize}
                                            className="p-button-secondary"
                                        />
                                    </div>
                                    {sizes.length > 0 &&
                                        sizes.map((size, index) => (
                                            <div
                                                key={index}
                                                className="ml-2 w-1/2 flex flex-row items-center justify-between mb-2  "
                                            >
                                                {/* <span className="flex-grow-1 mr-2">{size.toUpperCase()}</span> */}
                                                <span
                                                    key={index}
                                                    className={`flex justify-center items-center h-8 w-8 rounded-full bg-gray-300 border-2 border-gray-300 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md
                         }`}
                                                >
                                                    {size.toUpperCase()}
                                                </span>
                                                <span
                                                    className="text-red-400 hover:text-red-600 cursor-pointer"
                                                    onClick={() =>
                                                        handleRemoveSize(index)
                                                    }
                                                >
                                                    <i className="pi pi-times-circle"></i>
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className="mb-6 flex flex-row ">
                                <label
                                    htmlFor="colors"
                                    className="basis-1/3 block text-gray-700 font-bold mb-2 text-right  mr-4"
                                >
                                    Colors
                                </label>
                                <div className="basis-2/3 mr-4 ">
                                    <div
                                        className="flex flex-row mb-4"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                                handleAddColor();
                                        }}
                                    >
                                        <InputText
                                            value={newColor}
                                            id="colors"
                                            name="colors"
                                            onChange={(e) =>
                                                setNewColor(e.target.value)
                                            }
                                            className="mr-2 w-2/3"
                                            placeholder="Enter a color"
                                        />
                                        <Button
                                            label="Add"
                                            onClick={handleAddColor}
                                            className="p-button-secondary"
                                        />
                                    </div>
                                    {colors.length > 0 &&
                                        colors.map((color, index) => (
                                            <div
                                                key={index}
                                                className="ml-2 w-1/2 flex flex-row items-center justify-between mb-2  "
                                            >
                                                <span
                                                    key={index}
                                                    style={{
                                                        backgroundColor:
                                                            color.toLowerCase(),
                                                        opacity: 0.5,
                                                    }}
                                                    className={`h-8 w-8 rounded-full border-2 border-gray-300 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md 
                        }`}
                                                />
                                                <span className="flex-grow-1 mr-2 text-gray-500 font-semibold">
                                                    {convertFirstLetterToUpperCase(
                                                        color
                                                    )}
                                                </span>
                                                <span
                                                    className="text-red-400 hover:text-red-600 cursor-pointer"
                                                    onClick={() =>
                                                        handleRemoveColor(index)
                                                    }
                                                >
                                                    <i className="pi pi-times-circle"></i>
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className="mb-6 flex flex-row items-center">
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
                                    // integeronly
                                    className="basis-2/3 mr-4"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </>
    );
};

export default DialogAddProduct;
