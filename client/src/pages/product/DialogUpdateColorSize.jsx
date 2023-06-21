import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import ProductDialogFooter from "./Components/ProductDialogFooter";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";
import productApi from "./../../api/productApi";
import { toastContext } from "./../../contexts/ToastProvider";
import { Button } from "primereact/button";

const DialogUpdateColorSize = ({
    visible,
    setVisible,
    productId
}) => {
    const { toastSuccess, toastError } = toastContext();
    const [loading, setLoading] = useState(false);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [newColor, setNewColor] = useState("");
    const [newSize, setNewSize] = useState("");
    const navigate = useNavigate();

    const handleAddColor = () => {
        setColors([...colors, newColor]);
        setNewColor("");
      };
    
      const handleRemoveColor = (index) => {
        const updatedColor = [...colors];
        updatedColor.splice(index, 1);
        setColors(updatedColor);
      };
      const handleAddSize = () => {
        setSizes([...sizes, newSize]);
        setNewSize("");
      };
    
      const handleRemoveSize = (index) => {
        const updatedSize = [...sizes];
        updatedSize.splice(index, 1);
        setSizes(updatedSize);
      };


    //get product by id
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await productApi.getProductById(productId);
                if (response.data.type === "SUCCESS") {
                    const productCurrent = response.data.product;
                    const responseColor = response.data.product.colors;
                    const responseSize = response.data.product.sizes;
                    setSizes(responseSize.map(item => item.size));
                    setColors(responseColor.map(item => item.color));
                    // setProducts(productCurrent);
                    // setSelectedCategory(
                    //     categoryOptions.find(
                    //         (item) => item._id === productCurrent.category
                    //     )
                    // );
                }
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };

        fetchData();
    }, [visible]);

    //update another fields of products
    // const handleUpdateProduct = async () => {
    //     setLoading(true);
    //     const formData = new FormData();
    //     formData.append("name", products.name);
    //     formData.append("category", category);
    //     formData.append("description", products.description);
    //     formData.append("price", products.price);
    //     formData.append("priceAfterDiscount", products.priceAfterDiscount);
    //     formData.append("colors", products.colors);
    //     formData.append("sizes", products.sizes);
    //     formData.append("quantity", products.quantity);

    //     console.log("Form data: ");
    //     console.log(formData);

    //     try {
    //         const response = await productApi.updateProductDetail(
    //             productId,
    //             formData
    //         );

    //         if (response.data.type === "SUCCESS") {
    //             toastSuccess("Product detail updated  successfully");
    //             setVisible(false);
    //         }
    //     } catch (err) {
    //         toastError("error", "Failed to update product");
    //     }

    //     setLoading(false);
    // };

    const handleSaveClick = () => {
        handleUpdateProduct();
    };

    const handleCancelClick = () => {
        setVisible(false);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.value);
        // setCategory(event.value._id);
        setCategory(event.value ? event.value._id : null);
    };

    return (
        <>
            <Dialog
                visible={visible} //pass params as addVisible.
                className="sm:w-full md:w-10/12 lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto"
                footer={
                    <ProductDialogFooter
                        Cancel={handleCancelClick}
                        Save={handleSaveClick}
                    />
                }
                onHide={() => {
                    setVisible(false);
                }}
                header="Edit Color and Size Detail"
            >

                <div>
                <div className="mb-6 flex flex-row ">
                <label
                  htmlFor="sizes"
                  className="basis-1/3 block text-gray-700 font-bold mb-2 text-right  mr-4"
                >
                  Sizes
                </label>
                <div className="basis-2/3 mr-4 ">
                  <div className="flex flex-row mb-4">
                    <InputText
                      value={newSize}
                      id="sizes"
                      name="sizes"
                      onChange={(e) => setNewSize(e.target.value)}
                      className="mr-2 w-2/3"
                      placeholder="Enter a size"
                    />
                    <Button
                      label="Add"
                      onClick={newSize && handleAddSize}
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
                          onClick={() => handleRemoveSize(index)}
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
                  <div className="flex flex-row mb-4">
                    <InputText
                      value={newColor}
                      id="colors"
                      name="colors"
                      onChange={(e) => setNewColor(e.target.value)}
                      className="mr-2 w-2/3"
                      placeholder="Enter a color"
                    />
                    <Button
                      label="Add"
                      onClick={newColor && handleAddColor}
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
                            backgroundColor: color.toLowerCase(),
                            opacity: 0.5,
                          }}
                          className={`h-8 w-8 rounded-full border-2 border-gray-300 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md 
                        }`}
                        />
                          <span className="flex-grow-1 mr-2 text-gray-500 font-semibold">{color.toUpperCase()}</span>
                        <span
                          className="text-red-400 hover:text-red-600 cursor-pointer"
                          onClick={() => handleRemoveColor(index)}
                        >
                          <i className="pi pi-times-circle"></i>
                        </span>
                      </div>
                    ))}
                </div>
              </div>
                </div>
                {/* </div> */}
            </Dialog>
        </>
    );
};

export default DialogUpdateColorSize;
