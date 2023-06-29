import React, { useState, useEffect } from "react";
import productApi from "./../../api/productApi";
import categoryApi from "./../../api/categoryApi";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import EvaluationDialog from "../product/DialogEvaluationPage";
import { userStateContext } from "../../contexts/StateProvider";
import { toastContext } from "./../../contexts/ToastProvider";
import { Link, useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import { useSearchContext } from "../../contexts/SearchProvider";
import { Dialog } from "primereact/dialog";
import ProductDialogFooter from "../product/Components/ProductDialogFooter";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import cartApi from "../../api/cartApi";
import convertFirstLetterToUpperCase from "../../helpers/convertFirstLetterToUpperCase";
import route from "../../constants/route";
import { Button } from "primereact/button";

function Home() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [visibleEvaluation, setVisibleEvaluation] = useState(false);
    // const [selectedProduct, setSelectedProduct] = useState(null);
    // const [showDialog, setShowDialog] = useState(false);
    const { toastError, toastSuccess } = toastContext();
    const { searchText } = useSearchContext();
    const [visibleCart, setVisibleCart] = useState(false);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [colorOptions, setColorOptions] = useState([]);
    const [sizeOptions, setSizeOptions] = useState([]);
    const [productId, setProductId] = useState(null);
    const [loadingAddToCart, setLoadingAddToCart] = useState(false);
    const { currentUser } = userStateContext();
    const navigate = useNavigate();

    const handleSaveAddCart = () => {
        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        const isLoggedIn = currentUser;
        /* Kiểm tra logic đăng nhập ở đây */ false;

        if (isLoggedIn) {
            // call api add to cart
            handleCallApiCart();
        } else {
            // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
            navigate(route.SIGNIN);
        }
    };
    const debouncedValue = useDebounce(searchText, 500);

    const fetchApi = async () => {
        setLoading(true);
        try {
            const response = await productApi.getAllProduct(debouncedValue);
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

    useEffect(() => {
        fetchApi();
    }, [debouncedValue]);

    const handleCallApiCart = async () => {
        setLoadingAddToCart(true);
        try {
            const formData = new FormData();
            formData.append("quantity", quantity);
            if (selectedColor) {
                formData.append("colorId", selectedColor._id);
            }
            if (selectedSize) {
                formData.append("sizeId", selectedSize._id);
            }
            //   formData.append("sizeId", selectedSize._id);
            formData.append("productId", productId);
            const response = await cartApi.add(formData);
            if (response.data.type === "SUCCESS") {
                toastSuccess(response.data.message);
                setVisibleCart(false);
                fetchApi();
            }
        } catch (err) {
            toastError(err.response.data.message);
            console.log(err);
        }
        setLoadingAddToCart(false);
    };

    const handleAddCart = (id) => {
        if (!localStorage.getItem("TOKEN")) navigate(route.SIGNIN);
        setSizeOptions(products.find((item) => item._id === id)?.sizes);
        setColorOptions(products.find((item) => item._id === id)?.colors);
        setProductId(id);
        setVisibleCart(true);
    };

    const onHideDialog = () => {
        setSelectedProduct(null);
        setShowDialog(false);
    };

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
                                                            to={`${route.DETAIL}/${product._id}`}
                                                            className="rounded-lg border-blue-600  px-2 py-2 font-bold  text-blue-600 hover:opacity-60 flex items-center"
                                                        >
                                                            <i className="pi pi-eye mr-2" />{" "}
                                                            Detail
                                                        </Link>
                                                    </div>
                                                    {currentUser.role ===
                                                        "CUSTOMER" && (
                                                        <div className="flex justify-between text-[16px]">
                                                            <span
                                                                onClick={() =>
                                                                    handleAddCart(
                                                                        product._id
                                                                    )
                                                                }
                                                                className="rounded-lg border-blue-600  px-2 py-2 font-bold  text-blue-600 hover:opacity-60 flex items-center hover:cursor-pointer"
                                                            >
                                                                <i className="pi pi-shopping-cart mr-2 text-xl text-red-600" />
                                                            </span>
                                                        </div>
                                                    )}
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
                                            In stock:
                                            <span className="text-blue-600 ml-2">
                                                {product.quantity}
                                            </span>
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
                            ))
                        ) : (
                            <div className="font-semibold text-3xl text-red">
                                No products found
                            </div>
                        )}
                    </>
                )}

                {visibleCart && (
                    <Dialog
                        // className="w-1/2 h-auto"
                        className="w-11/12 max-w-11/12 sm:max-w-lg h-auto"
                        visible={visibleCart}
                        onHide={() => {
                            setVisibleCart(false);
                            setColorOptions([]);
                            setSizeOptions([]);
                            setSelectedColor(null);
                            setSelectedSize(null);
                        }}
                        header="Add to Cart"
                        footer={
                            loadingAddToCart ? (
                                <></>
                            ) : (
                                <ProductDialogFooter
                                    Cancel={() => {
                                        setVisibleCart(false);
                                        setColorOptions([]);
                                        setSizeOptions([]);
                                        setSelectedColor(null);
                                        setSelectedSize(null);
                                    }}
                                    Save={handleSaveAddCart}
                                />
                            )
                        }
                    >
                        {loadingAddToCart && (
                            <div className="w-full flex justify-center items-center h-40">
                                <ProgressSpinner />
                            </div>
                        )}
                        {!loadingAddToCart && (
                            <div className="flex flex-col space-y-6">
                                <div>
                                    <label
                                        htmlFor="sizes"
                                        className=" block text-gray-700 font-bold mb-4 text-left mr-4"
                                    >
                                        Size
                                    </label>
                                    <Dropdown
                                        id="sizes"
                                        value={selectedSize}
                                        options={sizeOptions.map((item) => {
                                            item.size = item.size.toUpperCase();
                                            return item;
                                        })}
                                        onChange={(e) =>
                                            setSelectedSize(e.value)
                                        }
                                        optionLabel="size"
                                        className="w-full"
                                        placeholder="Select Size"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="colors"
                                        className=" block text-gray-700 font-bold mb-4 text-left mr-4"
                                    >
                                        Color
                                    </label>
                                    <Dropdown
                                        id="colors"
                                        value={selectedColor}
                                        options={colorOptions.map((item) => {
                                            item.color =
                                                convertFirstLetterToUpperCase(
                                                    item.color
                                                );
                                            return item;
                                        })}
                                        onChange={(e) =>
                                            setSelectedColor(e.value)
                                        }
                                        className="w-full"
                                        placeholder="Select color"
                                        optionLabel="color"
                                    />
                                </div>

                                <label
                                    htmlFor="quantity"
                                    className=" block text-gray-700 font-bold mb-4 text-left mr-4"
                                >
                                    Quantity
                                </label>
                                <div className="flex items-center space-x-4 justify-center ">
                                    <Button
                                        className="p-button-secondary p-button-rounded p-button-icon-only"
                                        onClick={() =>
                                            setQuantity(quantity - 1)
                                        }
                                        disabled={quantity <= 1}
                                    >
                                        <i className="pi pi-minus"></i>
                                    </Button>
                                    <div className="text-lg font-bold mx-3">
                                        {quantity}
                                    </div>
                                    <Button
                                        className="p-button-secondary p-button-rounded p-button-icon-only"
                                        onClick={() =>
                                            setQuantity(quantity + 1)
                                        }
                                    >
                                        <i className="pi pi-plus"></i>
                                    </Button>
                                </div>
                                {/* 
                <InputNumber
                  id="quantity"
                  name="quantity"
                  placeholder="Enter quantity"
                  value={quantity}
                  onValueChange={(e) => setQuantity(e.target.value)}
                  className=""
                /> */}
                            </div>
                        )}
                    </Dialog>
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

export default Home;
