import React, { useState, useEffect } from "react";
import productApi from "./../../api/productApi";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import DialogDeleteProduct from "./DialogDeleteProduct";
import DialogEditProduct from "./DialogEditProduct";
import EvaluationDialog from "./DialogEvaluationPage";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import DialogAddProduct from "./DialogAddProduct";
import { useSearchContext } from "../../contexts/SearchProvider";
import useDebounce from "../../hooks/useDebounce";
import categoryApi from "../../api/categoryApi";
import DialogUpdateColorSize from "./DialogUpdateColorSize";

function HomeProductSeller() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false);
    const [visibleEditDialog, setvisibleEditDialog] = useState(false);
    const [visibleAddDialog, setvisibleAddDialog] = useState(false);
    const [visibleEvaluation, setVisibleEvaluation] = useState(false);
    const [visibleUpdateSizeColor, setVisibleUpdateSizeColor] = useState(false);
    const [productId, setProductId] = useState(null);
    const [productName, setProductName] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const { searchText } = useSearchContext();
    const [categoryOptions, setCategoryOptions] = useState([]);

    const onProductSelect = (product) => {
        setSelectedProduct(product);
        setShowDialog(true);
    };

    const onHideDialog = () => {
        setSelectedProduct(null);
        setShowDialog(false);
    };

    const debouncedValue = useDebounce(searchText, 500);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await productApi.getSellerProducts(debouncedValue);
            if (response.data.type === "SUCCESS") {
                setProducts(response.data.products);
            }

            if (response.data.products.length < 1) {
                console.log("No product founddd!");
            }
            // setProducts(dataTrain);
        } catch (err) {
            // console.log(err);
            setProducts([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [debouncedValue]);

    useEffect(() => {
        const fetchCategoryOptions = async () => {
            try {
                const response = await categoryApi.query();
                if (response.data.type === "SUCCESS") {
                    const responseCategories = response.data.categories;
                    setCategoryOptions(responseCategories);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchCategoryOptions();
    }, []);

    const handleAdd = () => {
        setvisibleAddDialog(true);
    };

    return (
        <>
            {/* navigation bar */}
            <Toolbar
                className="mb-4"
                left={
                    <>
                        <button
                            type="button"
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 text-white rounded-md shadow-md"
                            onClick={handleAdd}
                        >
                            <i className="pi pi-plus mr-1"></i>Add
                        </button>
                    </>
                }
            ></Toolbar>

            {loading && (
                <div className="w-full h-[600px] flex justify-center items-center">
                    <ProgressSpinner className=" w-full" />
                </div>
            )}
            <div className="grid min-[1200px]:grid-cols-3 min-[1440px]:grid-cols-4 min-[1700px] gap-4 m-4">
                {/* <div className="grid min-[1200px]:grid-cols-3 min-[1440px]:grid-cols-4 min-[1700px]:grid-cols-4  gap-4 m-4"> */}
                {!loading && (
                    <>
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <div
                                    key={product._id}
                                    className="flex flex-col justify-between"
                                >
                                    <Card
                                        // title={product.name}
                                        title={
                                            <div className="h-[50px] overflow-hidden">
                                                {product.name}
                                            </div>
                                        }
                                        subTitle={product.category.name}
                                        footer={[
                                            <div
                                                key="footer"
                                                className="flex justify-between text-[14px]"
                                            >
                                                <span className="flex items-center">
                                                    <div
                                                        className="text-red-500 cursor-pointer px-2 py-1 rounded border border-transparent hover:border-red-500 flex justify-center items-center"
                                                        onClick={() => {
                                                            setProductId(
                                                                product._id
                                                            );
                                                            setvisibleEditDialog(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <i className="pi pi-pencil text-blue-600" />
                                                    </div>
                                                    <div
                                                        className="text-red-500 cursor-pointer px-2 py-1 rounded border border-transparent hover:border-red-500 flex justify-center items-center"
                                                        onClick={() => {
                                                            setProductId(
                                                                product._id
                                                            );
                                                            setProductName(
                                                                product.title
                                                            );
                                                            setVisibleDeleteDialog(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <i className="pi pi-trash" />
                                                    </div>
                                                    <div
                                                        className="text-red-500 cursor-pointer px-2 py-1 rounded border border-transparent hover:border-red-500 flex justify-center items-center"
                                                        onClick={() => {
                                                            onProductSelect(
                                                                product
                                                            );
                                                        }}
                                                    >
                                                        <i className="pi pi-info-circle text-green-500" />
                                                    </div>
                                                    {/* view update size and color */}
                                                    <div
                                                        className="text-red-500 cursor-pointer px-2 py-1 rounded border border-transparent hover:border-red-500 flex justify-center items-center"
                                                        onClick={() => {
                                                            setProductId(
                                                                product._id
                                                            );
                                                            setProductName(
                                                                product.title
                                                            );
                                                            setVisibleUpdateSizeColor(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <i className="pi pi-info text-gray-600" />
                                                    </div>
                                                    <div
                                                        className="text-red-500 cursor-pointer px-2 py-1 rounded border border-transparent hover:border-red-500 flex justify-center items-center"
                                                        onClick={() => {
                                                            setProductId(
                                                                product._id
                                                            );
                                                            setVisibleEvaluation(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <i className="pi pi-star text-purple-700" />
                                                    </div>
                                                </span>
                                            </div>,
                                        ]}
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
                                                {new Intl.NumberFormat().format(
                                                    product.priceAfterDiscount
                                                )}
                                                <span className="text-sm text-red-500 pb-2">
                                                    đ
                                                </span>
                                            </span>
                                            <span className="text-gray-400 text-sm line-through ml-2">
                                                {new Intl.NumberFormat().format(
                                                    product.price
                                                )}
                                                <span className="text-xs text-red-500">
                                                    đ
                                                </span>
                                            </span>
                                        </div>
                                    </Card>
                                </div>

                                // definition review
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
                        header={`${selectedProduct.name} detail`}
                        visible={showDialog}
                        onHide={onHideDialog}
                        className="rounded-md overflow-hidden  mx-auto w-1/2"
                    >
                        <div className="grid grid-cols-2 gap-4 py-4 px-6">
                            <div className="flex flex-col">
                                <img
                                    src={selectedProduct.mainImage}
                                    alt={selectedProduct.name}
                                    // className="h-full rounded-lg shadow-md  object-contain"
                                    className="w-full  object-contain h-auto"
                                />
                                <div className="mt-4 flex flex-row flex-wrap ">
                                    {selectedProduct.images.map(
                                        (image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={selectedProduct.name}
                                                className={`h-20 w-20 m-1 object-cover box-border border-2 border-gray-300 rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md ${
                                                    image ===
                                                        selectedProduct.mainImage &&
                                                    "border-primary-500"
                                                }`}
                                                onClick={() => {
                                                    setSelectedProduct(
                                                        (pre) => ({
                                                            ...pre,
                                                            mainImage: image,
                                                        })
                                                    );
                                                }}
                                            />
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 ">
                                <h3 className="text-3xl font-bold text-red-600">
                                    {selectedProduct.name}
                                </h3>
                                <p className="text-gray-400 font-bold">
                                    {selectedProduct.category.name}
                                </p>
                                <div className=" rounded bg-gray-50">
                                    <p className="text-gray-700 p-4">
                                        {selectedProduct.description}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-3xl font-bold">
                                        {new Intl.NumberFormat().format(
                                            selectedProduct.priceAfterDiscount
                                        )}
                                        <span className="text-xs text-red-500">
                                            ₫
                                        </span>
                                    </span>
                                    <span className="text-gray-400 text-sm line-through ml-2">
                                        {new Intl.NumberFormat().format(
                                            selectedProduct.price
                                        )}
                                        <span className="text-xs text-red-500">
                                            ₫
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-bold text-gray-600">
                                        Colors
                                    </span>
                                </div>
                                <div className="flex space-x-4">
                                    {selectedProduct.colors.map(
                                        (color, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    backgroundColor:
                                                        color.color.toLowerCase(),
                                                    opacity: 0.5,
                                                }}
                                                className={`h-8 w-8 rounded-full  border-2 border-gray-300 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md
                      }`}
                                            />
                                        )
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <span className="font-bold text-gray-600">
                                        Sizes
                                    </span>
                                </div>
                                <div className="flex space-x-4">
                                    {selectedProduct.sizes.map(
                                        (size, index) => (
                                            <span
                                                key={index}
                                                className={`flex justify-center items-center h-8 w-8 rounded-full bg-gray-300 border-2 border-gray-300 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md
                      }`}
                                            >
                                                {size.size.toUpperCase()}
                                            </span>
                                        )
                                    )}
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <span className="font-semibold">
                                        Quantity
                                    </span>
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
                        fetchData={fetchData}
                    />
                )}
                {/* display edit dialog */}
                {visibleEditDialog && (
                    <DialogEditProduct
                        productId={productId}
                        visible={visibleEditDialog}
                        setVisible={setvisibleEditDialog}
                        categoryOptions={categoryOptions}
                        fetchData={fetchData}
                    />
                )}
                {visibleAddDialog && (
                    <DialogAddProduct
                        visible={visibleAddDialog}
                        setVisible={setvisibleAddDialog}
                        categoryOptions={categoryOptions}
                        fetchData={fetchData}
                    />
                )}

                {visibleEvaluation && (
                    <EvaluationDialog
                        visible={visibleEvaluation}
                        setVisible={setVisibleEvaluation}
                        productId={productId}
                        // onHide={onHideDialog}
                    />
                )}
                {visibleUpdateSizeColor && (
                    <DialogUpdateColorSize
                        visible={visibleUpdateSizeColor}
                        setVisible={setVisibleUpdateSizeColor}
                        productId={productId}
                        // onHide={onHideDialog}
                        fetchData={fetchData}
                    />
                )}
            </div>
        </>
    );
}

export default HomeProductSeller;
