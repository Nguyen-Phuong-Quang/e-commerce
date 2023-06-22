import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";
import productApi from "./../../api/productApi";
import { toastContext } from "./../../contexts/ToastProvider";
import { Button } from "primereact/button";

const DialogUpdateColorSize = ({ visible, setVisible, productId }) => {
  const { toastSuccess, toastError } = toastContext();
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");
  const navigate = useNavigate();

  const handleAddColor = async () => {
    setLoading(true);
    try {
      const response = await productApi.addColor(productId, newColor);
      if (response.data.type === "SUCCESS") {
        toastSuccess(response.data.message);
        setColors([...colors, newColor]);
        setNewColor("");
      }
    } catch (err) {
      toastError(err.response.data.message);
      console.log(err);
    }
    setLoading(false);
  };

  const handleAddSize = async () => {
    setLoading(true);
    try {
      const response = await productApi.addSize(productId, newSize);
      if (response.data.type === "SUCCESS") {
        toastSuccess(response.data.message);
        setSizes([...sizes, newSize]);
        setNewSize("");
      }
    } catch (err) {
      toastError(err.response.data.message);
      console.log(err);
    }
    setLoading(false);
  };

  const handleRemoveColor = async (index) => {
    setLoading(true);
    try {
      const response = await productApi.deleteColor(productId, colors[index]);
      if (response.data.type === "SUCCESS") {
        toastSuccess(response.data.message);
        const updatedColor = [...colors];
        updatedColor.splice(index, 1);
        setColors(updatedColor);
      }
    } catch (err) {
      toastError(err.response.data.message);
      console.log(err);
    }
    setLoading(false);
  };

  const handleRemoveSize = async (index) => {
    setLoading(true);
    try {
      const response = await productApi.deleteSize(productId, sizes[index]);
      if (response.data.type === "SUCCESS") {
        toastSuccess(response.data.message);
        const updatedSize = [...sizes];
        updatedSize.splice(index, 1);
        setSizes(updatedSize);
      }
    } catch (err) {
      toastError(err.response.data.message);
      console.log(err);
    }
    setLoading(false);
  };

  //get product by id
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await productApi.getProductById(productId);
        if (response.data.type === "SUCCESS") {
          const responseColor = response.data.product.colors;
          const responseSize = response.data.product.sizes;
          setSizes(responseSize.map((item) => item.size));
          setColors(responseColor.map((item) => item.color));
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchData();
  }, [visible]);

  return (
    <>
      <Dialog
        visible={visible}
        className="sm:w-11/12 md:w-10/12 lg:w-3/4 xl:w-2/3 2xl:w-1/3 mx-auto h-auto"
        header="Edit Color and Size Detail"
        onHide={() => {
          setVisible(false);
        }}
      >
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center">
              <ProgressSpinner />
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-row items-center">
                <label
                  htmlFor="sizes"
                  className="basis-1/3 block text-gray-700 font-bold mb-4 text-right  mr-4"
                >
                  Sizes
                </label>
                <div
                  className="basis-2/3 mr-4"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (newSize) handleAddSize();
                    }
                  }}
                >
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
                      onClick={() => {
                        if (newSize) handleAddSize();
                      }}
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
                        {size.toUpperCase() !== "DEFAULT" && 
                          <span
                            key={index}
                            className="flex justify-center items-center h-8 w-8 rounded-full bg-gray-300 border-2 border-gray-300 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md
                                                                         "
                          >
                            {size.toUpperCase()}
                          </span>
                        }
                        {(size.toUpperCase() === "DEFAULT") && 
                        <span className="text-sm text-gray-400 font-bold">Default</span>
                        }
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

              <div className="mb-6 flex flex-row items-center">
                <label
                  htmlFor="colors"
                  className="basis-1/3 block text-gray-700 font-bold mb-4 text-right  mr-4"
                >
                  Colors
                </label>
                <div className="basis-2/3 mr-4 ">
                  <div
                    className="flex flex-row mb-4"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (newColor) handleAddColor();
                      }
                    }}
                  >
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
                      onClick={() => {
                        if (newColor) handleAddColor();
                      }}
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
                        <span className="flex-grow-1 mr-2 text-gray-500 font-semibold">
                          {color.toUpperCase()}
                        </span>
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
            </>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default DialogUpdateColorSize;
