import React, {  useState, useEffect } from 'react';
import productApi from "./../../api/productApi";
import { ProgressSpinner } from "primereact/progressspinner";
import {Card}  from "primereact/card";
import DialogDeleteProduct from "./DialogDeleteProduct";
import DialogEditProduct from './DialogEditProduct';
import EvaluationDialog from './DialogEvaluationPage';
import { Toolbar } from "primereact/toolbar";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import DialogAddProduct from './DialogAddProduct';
import hermet from "./image/hermet.jpg";
import mer1 from "./image/mer1.jpg";
import jacket1 from "./image/jacket-1.jpeg";
import jacket2 from "./image/jacket-2.jpg";
import ava from "./image/ava.jpg";
import merpro from "./image/merpro.jpg";





function HomeProductSeller() {
  const [loading, setLoading] = useState(false);
  const[products, setProducts] = useState([]);
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false);
  const [visibleEditDialog, setvisibleEditDialog] = useState(false);
  const [visibleAddDialog, setvisibleAddDialog] = useState(false);
  const [visibleEvaluation, setVisibleEvaluation] = useState(false);
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  

  const onProductSelect = (product) => {
    setSelectedProduct(product);
    setShowDialog(true);
  };
  
  const onHideDialog = () => {
    setSelectedProduct(null);
    setShowDialog(false);
  };

const dataTrain = [
    {
      name: "Mercurial 9",
      category: "Soccer boots",
      mainImage: merpro,
      subImages: [mer1, merpro,jacket1, jacket2, mer1 , hermet],
      description: "no thing",
      price: "232.000",
      discountPrice: "111.000",
      colors: ["blue", "red", "green", "gray"],
      sizes: ["38", "39", "40", "41", "42"],
      quantity: 23,
    },
    {
      name: "Mercurial pro",
      category: "Soccer boot",
      mainImage: merpro,
      subImages: [hermet],
      description: "no thing to say no thing to say no thing to say no thing to say no thing to say",
      price: "343.000",
      discountPrice: "98.000",
      colors: ["red", "blue", "green"],
      sizes: ["S", "M", "L"],
      quantity: 12,
    },
    {
      name: "Gucci shoes",
      category: "Shoes",
      mainImage: hermet,
      subImages: [hermet],
      description: "no thing",
      price: "232.000",
      discountPrice: "111.000",
      colors: ["red", "blue", "green"],
      sizes: ["S", "M", "L"],
      quantity: 23,
    },
    {
      name: "Hermes shoes",
      category: "Shoes",
      mainImage: hermet,
      subImages: [hermet],
      description: "no thing to say",
      price: "343.000",
      discountPrice: "98.000",
      colors: ["red", "blue", "green"],
      sizes: ["S", "M", "L"],
      quantity: 12,
    },
    {
      name: "Gucci short",
      category: "Clothes",
      mainImage: hermet,
      subImages: [hermet],
      description: "no thing",
      price: "232.000",
      discountPrice: "111.000",
      colors: ["red", "blue", "green"],
      sizes: ["S", "M", "L"],
      quantity: 23,
    },
    {
      name: "Hermes short",
      category: "Hermet",
      mainImage: hermet,
      subImages: [hermet],
      description: "no thing to say",
      price: "343.000",
      discountPrice: "98.000",
      colors: ["red", "blue", "green"],
      sizes: ["S", "M", "L"],
      quantity: 12,
    },
  ];

  const EvaluationTest = [
    {
      id:1,
      avatar:ava,
      author: "Nguyen Quang",
      date: "20-03-2022",
      comment:"Very beautiful"
    },
    {
      id:2,
      avatar:ava,
      author: "Quang Nguyen",
      date: "21-03-2022",
      comment:"Very beautiful, it ok, ok and then comeback soon"
    },
    {
      id:3,
      avatar:ava,
      author: "Nguyen Ngoc",
      date: "22-03-2022",
      comment:"Very bad"
    },
    {
      id:4,
      avatar:ava,
      author: "Ngoc Quang",
      date: "23-03-2022",
      comment:"Quite ok"
    },
    {
      id:5,
      avatar:ava,
      author: "Ng Quang",
      date: "24-03-2022",
      comment:"Beautiful, it deserve with this cost, comeback soon "
    },
  ]

  useEffect(() => {
    const fetchApi = async () => {
        setLoading(true);
        try {
            // const response = await productApi.getAllProduct();
            // // console.log(response);
            // if (response.data.type === "Success") {
            //     setProducts(response.data.products);
            // }

            // if (response.data.products.length < 1) {
            //     console.log("No product founddd!");
            // }
            setProducts(dataTrain);
        } catch (err) {
            setProducts([]);
            // console.log(err);
        }
        setLoading(false);
    };

    fetchApi();
}, [visibleDeleteDialog, visibleEditDialog]);

const handleAdd = () => {
    setvisibleAddDialog(true);
}

const rightToolbarTemplate = () => {
    return(
        <>
        </>
    );
}

  return (
    <>
      {/* navigation bar */}
      <Toolbar
        className="mb-4"
        left={
          <>
            <button
              type="button"
              class="px-4 py-2 bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 text-white rounded-md shadow-md"
              onClick={handleAdd}
            >
              <i class="pi pi-plus mr-1"></i>Add 
            </button>
          </>
        }
      ></Toolbar>

      {loading && (
        <div className="w-full h-[600px] flex justify-center items-center">
          <ProgressSpinner className=" w-full" />
        </div>
      )}
      <div className="grid min-[1200px]:grid-cols-3 min-[1440px]:grid-cols-4 min-[1700px]:grid-cols-4  gap-4">
        {!loading && (
          <>
            {products.length > 0 ? (
              products.map((product, index) => (
                <div key={product.id} className="flex flex-col justify-between">
                  <Card
                    title={product.name}
                    subTitle={product.category}
                    footer={
                      <div className="flex justify-between text-[14px]">
                        <span className="flex items-center">
                          <div
                            className="text-red-500 cursor-pointer px-2 py-1 rounded border border-transparent hover:border-red-500 flex justify-center items-center"
                            onClick={() => {
                              setvisibleEditDialog(true);
                            }}
                          >
                            <i className="pi pi-pencil" />
                          </div>
                          <div
                            className="text-red-500 cursor-pointer px-2 py-1 rounded border border-transparent hover:border-red-500 flex justify-center items-center"
                            onClick={() => {
                              setProductId(product._id);
                              setProductName(product.title);
                              setVisibleDeleteDialog(true);
                            }}
                          >
                            <i className="pi pi-trash" />
                          </div>
                          <div
                            className="text-red-500 cursor-pointer px-2 py-1 rounded border border-transparent hover:border-red-500 flex justify-center items-center"
                            onClick={() => {
                              onProductSelect(product);
                            }}
                          >
                            <i className="pi pi-info-circle" />
                          </div>
                          <div
                            className="text-red-500 cursor-pointer px-2 py-1 rounded border border-transparent hover:border-red-500 flex justify-center items-center"
                            onClick={() => {
                              setVisibleEvaluation(true);
                            }}
                          >
                            <i className="pi pi-star" />
                          </div>
                        </span>
                      </div>
                    }
                  >
                    <div className="flex justify-center">
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="mt-4">
                      <div>
                        <strong>Price: </strong>
                        <span class="text-s text-red-500">₫</span>
                        {product.price}
                      </div>
                      <div>
                        <strong>Price Discount: </strong>
                        <span class="text-s text-red-500">₫</span>
                        {product.discountPrice}
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <div className="font-semibold text-3xl text-red">
                No products found
              </div>
            )}
          </>
        )}
        {selectedProduct && (
          <Dialog
            header={selectedProduct.name}
            visible={showDialog}
            onHide={onHideDialog}
            className="rounded-md overflow-hidden  mx-auto w-1/2"
          >
            <div className="grid grid-cols-2 gap-4 py-4 px-6">
              <div className="flex flex-col">
                <img
                  src={selectedProduct.mainImage}
                  alt={selectedProduct.name}
                  className="h-full rounded-lg shadow-md object-cover"
                />
                <div className="mt-4 flex flex-row flex-wrap ">
                  {selectedProduct.subImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={selectedProduct.name}
                      className={`h-20 w-20 m-1 object-cover box-border border-2 border-gray-300 rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md ${
                        image === selectedProduct.mainImage &&
                        "border-primary-500"
                      }`}
                      onClick={() => {
                        setSelectedProduct((pre) => ({
                          ...pre,
                          mainImage: image,
                        }));
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{selectedProduct.name}</h3>
                <p className="text-gray-500">{selectedProduct.category}</p>
                <p className="text-gray-700">{selectedProduct.description}</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold">
                    {" "}
                    <span class="text-xs text-red-500">₫</span>
                    {selectedProduct.discountPrice}
                  </span>
                  <span className="text-gray-400 text-sm line-through ml-2">
                    <span class="text-xs text-red-500">₫</span>
                    {selectedProduct.price}
                  </span>
                </div>
                <div className="flex space-x-4">
                  {selectedProduct.colors.map((color, index) => (
                    <span
                      key={index}
                      className={`h-8 w-8 rounded-full bg-${color.toLowerCase()}-500 border-2 border-gray-300 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md
                      }`}
                    />
                  ))}
                </div>
                <div className="flex space-x-4">
                  {selectedProduct.sizes.map((size, index) => (
                    <span
                      key={index}
                      className={`flex justify-center items-center h-8 w-8 rounded-full bg-gray-300 border-2 border-gray-300 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md
                      }`}
                    >
                      {size}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">Quantity:</span>
                  <span>{selectedProduct.quantity}</span>
                </div>
              </div>
            </div>
          </Dialog>
        )}

        {/* display delete dialog */}
        {visibleDeleteDialog && (
          <DialogDeleteProduct
            id={productId}
            name={productName}
            visible={visibleDeleteDialog}
            setVisible={setVisibleDeleteDialog}
          />
        )}
        {/* display edit dialog */}
        {visibleEditDialog && (
          <DialogEditProduct
            visible={visibleEditDialog}
            setVisible={setvisibleEditDialog}
          />
        )}
        {visibleAddDialog && (
          <DialogAddProduct
            visible={visibleAddDialog}
            setVisible={setvisibleAddDialog}
          />
        )}

        {visibleEvaluation && (
          <EvaluationDialog
            visible={visibleEvaluation}
            setVisible={setVisibleEvaluation}
            evaluations={EvaluationTest}
          />
        )}
      </div>
    </>
  );
}

export default HomeProductSeller;