import React, { useState, useEffect } from "react";
import productApi from "./../../api/productApi";
import categoryApi from "./../../api/categoryApi";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import EvaluationDialog from "../product/DialogEvaluationPage";
import { userStateContext } from "../../contexts/StateProvider";
import { toastContext } from "./../../contexts/ToastProvider";
import { Link } from "react-router-dom";

function Home() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [visibleEvaluation, setVisibleEvaluation] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const { toastError, toastSuccess } = toastContext();

    const handleAddCart = () => {
        console.log("handle add product to cart");
    };

    const onHideDialog = () => {
        setSelectedProduct(null);
        setShowDialog(false);
    };

    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            try {
                const response = await productApi.getAllProduct();
                if (response.data.type === "SUCCESS") {
                    setProducts(response.data.products);
                }

                if (response.data.products.length < 1) {
                    console.log("No product foundddd!");
                }
                // setProducts(dataTrain);
            } catch (err) {
                setProducts([]);
                // toastError(err.response.data.message);
                console.log(err);
            }
            setLoading(false);
        };

        fetchApi();
    }, []);

    useEffect(() => {
        const fetchCategory = async () => {
            const catePromise = products.map(async (item) => {
                try {
                    const response = await categoryApi.getById(item.category);
                    return response.data.category;
                } catch (error) {
                    console.log(error);
                    return null;
                }
            });

            const cateData = await Promise.all(catePromise);
            setCategory(cateData);
        };

        fetchCategory();
    }, [products]);

    return (
        <>
            {loading && (
                <div className="w-full h-[600px] flex justify-center items-center ">
                    <ProgressSpinner className=" w-full" />
                </div>
            )}
            <div className="grid min-[1200px]:grid-cols-3 min-[1440px]:grid-cols-4 min-[1700px]:grid-cols-4  gap-4  m-4 ">
                {!loading && (
                    <>
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col justify-between"
                                >
                                    <Card
                                        title={product.name}
                                        subTitle={
                                            category[index]
                                                ? category[index].name
                                                : ""
                                        }
                                        // subTitle={product.category}
                                        footer={
                                            <>
                                                <div className="flex flex-row justify-between">
                                                    <div className="flex justify-between text-[16px]">
                                                        <Link
                                                            to={`/detail/${product._id}`}
                                                            className="rounded-lg border-blue-600  px-2 py-2 font-bold  text-blue-600 hover:opacity-60 flex items-center"
                                                        >
                                                            <i className="pi pi-eye mr-2" />{" "}
                                                            Detail
                                                        </Link>
                                                    </div>
                                                    <div className="flex justify-between text-[16px]">
                                                        <span
                                                            // to={`/order/${product._id}`}
                                                            onClick={
                                                                handleAddCart
                                                            }
                                                            className="rounded-lg border-blue-600  px-2 py-2 font-bold  text-blue-600 hover:opacity-60 flex items-center hover:cursor-pointer"
                                                        >
                                                            <i className="pi pi-shopping-cart mr-2" />
                                                            Cart
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    >
                                        <div className="flex justify-center">
                                            <img
                                                src={product.mainImage}
                                                alt={product.name}
                                                className="w-full  object-contain h-[200px]"
                                            />
                                        </div>

                                        <div className="flex items-center justify-start mt-4 ">
                                            <span className="text-3xl font-bold text-red-700">
                                                {" "}
                                                <span class="text-sm text-red-500 pb-2">
                                                    $
                                                </span>
                                                {product.priceAfterDiscount}
                                            </span>
                                            <span className="text-gray-400 text-sm line-through ml-2">
                                                <span class="text-xs text-red-500">
                                                    $
                                                </span>
                                                {product.price}
                                            </span>
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

                {/* {selectedProduct && (
        //   <Dialog
        //     header={`${selectedProduct.name} detail`}
        //     visible={showDialog}
        //     onHide={onHideDialog}
        //     className="rounded-md overflow-hidden  mx-auto w-1/2"
        //   >
        //     <div className="grid grid-cols-2 gap-4 py-4 px-6">
        //       <div className="flex flex-col">
        //         <img
        //           src={selectedProduct.mainImage}
        //           alt={selectedProduct.name}
        //           className="h-full rounded-lg shadow-md object-cover"
        //         />
        //         <div className="mt-4 flex flex-row flex-wrap ">
        //           {selectedProduct.images.map((image, index) => (
        //             <img
        //               key={index}
        //               src={image}
        //               alt={selectedProduct.name}
        //               className={`h-20 w-20 m-1 object-cover box-border border-2 border-gray-300 rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md ${
        //                 image === selectedProduct.mainImage &&
        //                 "border-primary-500"
        //               }`}
        //               onClick={() => {
        //                 setSelectedProduct((pre) => ({
        //                   ...pre,
        //                   mainImage: image,
        //                 }));
        //               }}
        //             />
        //           ))}
        //         </div>
        //       </div>

        //       <div className="space-y-4 ">
        //         <h3 className="text-3xl font-bold">{selectedProduct.name}</h3>
        //         <p className="text-gray-400 font-bold">
        //           {selectedProduct.category}
        //         </p>
        //         <div className=" rounded bg-gray-50">
        //           <p className="text-gray-700 p-4">
        //             {selectedProduct.description}
        //           </p>
        //         </div>
        //         <div className="flex items-center">
        //           <span className="text-3xl font-bold">
        //             {" "}
        //             <span className="text-xs text-red-500">₫</span>
        //             {selectedProduct.priceAfterDiscount}
        //           </span>
        //           <span className="text-gray-400 text-sm line-through ml-2">
        //             <span className="text-xs text-red-500">₫</span>
        //             {selectedProduct.price}
        //           </span>
        //         </div>
        //         <div className="flex space-x-4">
        //           {selectedProduct.colors.map((color, index) => (
        //             <span
        //               key={index}
        //               className={`h-8 w-8 rounded-full bg-${color.color.toLowerCase()}-500 border-2 border-gray-300 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md
        //               }`}
        //             />
        //           ))}
        //         </div>
        //         <div className="flex space-x-4">
        //           {selectedProduct.sizes.map((size, index) => (
        //             <span
        //               key={index}
        //               className={`flex justify-center items-center h-8 w-8 rounded-full bg-gray-300 border-2 border-gray-300 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md
        //               }`}
        //             >
        //               {size}
        //             </span>
        //           ))}
        //         </div>
        //         <div className="flex items-center space-x-2 pt-2">
        //           <span className="font-semibold">Quantity:</span>
        //           <span>{selectedProduct.quantity}</span>
        //         </div>
        //       </div>
        //     </div>
        //   </Dialog> */}

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

export default Home;
