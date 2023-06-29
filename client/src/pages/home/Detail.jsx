import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productApi from "./../../api/productApi";
import userApi from "./../../api/userApi";
import reviewApi from "./../../api/reviewApi";
import { toastContext } from "./../../contexts/ToastProvider";
import { ProgressSpinner } from "primereact/progressspinner";
import { Rating } from "primereact/rating";
import { Avatar } from "primereact/avatar";
import route from "../../constants/route";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import ProductDialogFooter from "../product/Components/ProductDialogFooter";
import { userStateContext } from "./../../contexts/StateProvider";
import cartApi from "../../api/cartApi";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

export default function Detail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toastError, toastSuccess } = toastContext();
    const [data, setData] = useState({});
    const [review, setReview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState([]);
    const [visibleCart, setVisibleCart] = useState(false);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [colorOptions, setColorOptions] = useState([]);
    const [sizeOptions, setSizeOptions] = useState([]);
    const { currentUser } = userStateContext();
    const [loadingAddToCart, setLoadingAddToCart] = useState(false);
    const [comment, setComment] = useState("");
    const [loadingComment, setLoadingComment] = useState(false);
    const [rating, setRating] = useState(0);
    const [visibleRemoveReview, setVisibleRemoveReview] = useState(false);
    const [loadingRemoveReview, setLoadingRemoveReview] = useState(false);
    const [currentReviewId, setCurrentReviewId] = useState(null);

    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const fetchReivew = async () => {
        setLoadingComment(true);
        try {
            const response = await reviewApi.getAllReviews(id);
            if (response.data.type === "SUCCESS") {
                setReview(response.data.reviews);
                // toastSuccess(response.data.message);
            }
        } catch (err) {
            // toastError(err.response.data.message);
            console.log(err);
        }
        setLoadingComment(false);
    };

    const handleRemoveReview = (reviewId) => {
        console.log(reviewId);
        setCurrentReviewId(reviewId);
        setVisibleRemoveReview(true);
    };

    const handleRemoveReivewApi = async () => {
        setLoadingRemoveReview(true);
        try {
            const response = await reviewApi.delete(id, currentReviewId);
            if (response.data.type === "SUCCESS") {
                toastSuccess(response.data.message);
                setVisibleRemoveReview(false);
                fetchReivew();
            }
        } catch (err) {
            toastError(err.response.data.message);
        }
        setLoadingRemoveReview(false);
    };

    const footerContent = (
        <div>
            <Button
                label="Delete"
                icon="pi pi-trash"
                onClick={() => handleRemoveReivewApi()}
                autoFocus
                severity="danger"
            />
            <Button
                icon="pi pi-times"
                label="Cancel"
                onClick={() => setVisibleRemoveReview(false)}
                className="p-button-text"
            />
        </div>
    );

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSendComment = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("review", comment);
            formData.append("rating", rating);

            const response = await reviewApi.add(id, formData);
            if (response.data.type === "SUCCESS") {
                toastSuccess(response.data.message);
                setComment("");
                setRating(0);
                fetchReivew();
            }
        } catch (err) {
            toastError(err.response.data.message);
            console.log(err);
        }
        setLoading(false);
    };
    // Xử lý gửi comment, có thể sử dụng API hoặc hàm xử lý tương ứng

    // Sau khi gửi thành công, có thể làm các công việc như cập nhật danh sách đánh giá, xóa nội dung comment đã nhập, vv.

    const handleCallApiCart = async () => {
        setLoadingAddToCart(true);
        try {
            const formData = new FormData();
            formData.append("quantity", quantity);
            formData.append(" colorId", selectedColor._id);
            formData.append("sizeId", selectedSize._id);
            formData.append("productId", id);
            const response = await cartApi.add(formData);
            if (response.data.type === "SUCCESS") {
                toastSuccess(response.data.message);
                setVisibleCart(false);
            }
        } catch (err) {
            toastError(err.response.data.message);
            console.log(err);
        }
        setLoadingAddToCart(false);
    };

    const handleSave = () => {
        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        const isLoggedIn = currentUser;
        /* Kiểm tra logic đăng nhập ở đây */ false;

        if (isLoggedIn) {
            // call api add to cart
            handleCallApiCart();
            setVisibleCart(false);
        } else {
            // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
            navigate(route.SIGNIN);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await productApi.getProductById(id);
                if (response.data.type === "SUCCESS") {
                    const productData = response.data.product;
                    setData(productData);
                    setColorOptions(productData.colors);
                    setSizeOptions(productData.sizes);

                    // toastSuccess(response.data.message);
                }
            } catch (err) {
                // toastError(err.response.data.message);
                console.log(err);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        fetchReivew();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            const userDataPromises = review.map(async (item) => {
                try {
                    const response = await userApi.getUserById(item.user);
                    return response.data.user;
                } catch (error) {
                    console.log(error);
                    return null;
                }
            });

            const uData = await Promise.all(userDataPromises);
            setUserData(uData);
        };

        fetchUserData();
    }, [review]);

    const handleAddCart = () => {
        if (!localStorage.getItem("TOKEN")) navigate(route.SIGNIN);
        setVisibleCart(true);
    };

    return (
        <>
            {loading && (
                <div className="w-full h-[600px] flex justify-center items-center">
                    <ProgressSpinner className=" w-full" />
                </div>
            )}
            {!loading && (
                <div className="flex flex-col ">
                    {/* first--------------- */}
                    <div className="grid grid-cols-2 gap-4 py-4 px-6">
                        <div className="flex flex-col">
                            <img
                                src={data.mainImage}
                                alt={data.name}
                                className="h-[400px] object-contain rounded-lg shadow-md"
                            />
                            <div className="mt-4 flex flex-row flex-wrap ">
                                {data.images &&
                                    data.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={data.name}
                                            className={`h-20 w-20 m-1 object-cover box-border border-2 border-gray-300 rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md ${
                                                image === data.mainImage &&
                                                "border-primary-500"
                                            }`}
                                            onClick={() => {
                                                setData((pre) => ({
                                                    ...pre,
                                                    mainImage: image,
                                                }));
                                            }}
                                        />
                                    ))}
                            </div>
                        </div>

                        {/* <div className="space-y-4  ml-4  p-4 rounded-lg"> */}
                        <div className="flex flex-col justify-between mb-4 ml-4 shadow-lg p-4 rounded-lg">
                            {/* name  */}
                            <div className="flex flex-row justify-between">
                                <h3 className="text-3xl font-bold text-red-600">
                                    {data.name}
                                </h3>
                                {currentUser.role === "CUSTOMER" && (
                                    <button
                                        className="flex justify-between text-[20px]  border-red-500 "
                                        onClick={handleAddCart}
                                    >
                                        <span className="rounded-lg border-red-600  px-2 py-2 font-bold  text-orange-600 hover:opacity-60 flex items-center hover:cursor-pointer">
                                            <i className="pi pi-shopping-cart mr-2" />
                                            Add to cart
                                        </span>
                                    </button>
                                )}
                            </div>
                            {/* price  */}
                            <div className="flex items-center ">
                                <span className="text-3xl font-bold">
                                    {new Intl.NumberFormat().format(
                                        data.priceAfterDiscount
                                    )}
                                    <span className="text-xs text-red-500">
                                        ₫
                                    </span>
                                </span>
                                <span className="text-gray-400 text-sm line-through ml-2">
                                    {new Intl.NumberFormat().format(data.price)}
                                    <span className="text-xs text-red-500">
                                        ₫
                                    </span>
                                </span>
                            </div>
                            {/* colorsss  */}
                            <div>
                                <span className="font-semibold">Colors</span>
                                {!colorOptions
                                    .map((item) => item.color.toLowerCase())
                                    .includes("default") && (
                                    <div className="flex space-x-4 mt-4">
                                        {data.colors &&
                                            data.colors.map((color) => (
                                                <span
                                                    key={color._id}
                                                    style={{
                                                        backgroundColor:
                                                            color.color.toLowerCase(),
                                                        opacity: 0.5,
                                                    }}
                                                    className={`h-8 w-8 rounded-full border-2 border-gray-300 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md 
                         }`}
                                                />
                                            ))}
                                    </div>
                                )}
                                {colorOptions
                                    .map((item) => item.color.toLowerCase())
                                    .includes("default") && (
                                    <div className="ml-4 mt-4">
                                        <h3 className="text-sm text-gray-400 font-bold">
                                            Default
                                        </h3>
                                    </div>
                                )}
                            </div>
                            {/* size   */}
                            <div>
                                <span className="font-semibold">Sizes</span>
                                {!sizeOptions
                                    .map((item) => item.size.toLowerCase())
                                    .includes("default") && (
                                    <div className="flex space-x-4 mt-4">
                                        {data.sizes &&
                                            data.sizes.map((size, index) => (
                                                <span
                                                    key={size._id}
                                                    className={`flex justify-center items-center h-8 w-8 rounded-full bg-gray-300 border-2 border-gray-300 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md
                         }`}
                                                >
                                                    {size.size.toUpperCase()}
                                                </span>
                                            ))}
                                    </div>
                                )}
                                {sizeOptions
                                    .map((item) => item.size.toLowerCase())
                                    .includes("default") && (
                                    <div className="ml-4 mt-4">
                                        <h3 className="text-sm text-gray-400 font-bold">
                                            Default
                                        </h3>
                                    </div>
                                )}
                            </div>
                            {/* quantity   */}
                            <div className="flex items-center space-x-2 pt-2 mb-8">
                                <span className="font-semibold">Quantity:</span>
                                <span className="text-blue-700">
                                    {data.quantity}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 block font-bold text-black opacity-70 ml-4 mr-4 text-2xl  capitalize bg-gray-200 py-4  rounded-lg">
                        <p className="px-4">DESCRIPTION</p>
                    </div>
                    <div className="mx-8 mb-8">
                        {data.description && (
                            <p className="text-gray-700 p-4">
                                {data.description}
                            </p>
                        )}
                        {!data.description && (
                            <p className="text-gray-700 p-4">
                                {
                                    "The seller does not ask anything about this product"
                                }
                            </p>
                        )}
                    </div>

                    <div className="mt-8 block font-bold text-black opacity-70 mr-4 text-2xl  capitalize bg-gray-200 py-4 ml-4 rounded-lg">
                        <p className="px-4">REVIEWS</p>
                    </div>

                    {/* second----------------- */}
                    <div className="w-full mt-8">
                        <div className="flex flex-col bg-gray-100 rounded-lg mx-8">
                            <div className="flex  space-x-4 items-center mr-8 ml-16 mt-8 ">
                                {/* ///avatar user  */}
                                <Avatar
                                    image={currentUser?.profileImage}
                                    shape="circle"
                                    size="large"
                                    className="mr-2 mb-4"
                                />
                                <div className="w-full">
                                    <div className="relative w-full my-4">
                                        <InputTextarea
                                            value={comment}
                                            onChange={handleCommentChange}
                                            className="w-full mr-8"
                                            placeholder="Write a comment..."
                                            rows={2}
                                            cols={30}
                                        />
                                        <span
                                            className="absolute top-1/2 text-orange-500 hover:text-red-800 right-6 transform -translate-y-1/2 cursor-pointer"
                                            onClick={handleSendComment}
                                        >
                                            <i className="pi pi-send" />
                                        </span>
                                    </div>
                                    <Rating
                                        value={rating}
                                        onChange={(e) => setRating(e.value)}
                                        stars={5}
                                        cancel={false}
                                        className="text-orange-500 hover:text-orange-800  cursor-pointer mb-4"
                                    />
                                </div>
                            </div>
                            {/* <Rating
                                value={rating}
                                onChange={(e) => setRating(e.value)}
                                stars={5}
                                cancel={false}
                                className="text-orange-500 hover:text-orange-800  cursor-pointer ml-16 mb-8"
                            /> */}
                        </div>

                        {/* //////////review */}
                        {loadingComment && (
                            <div className="flex w-full justify-center">
                                <ProgressSpinner />
                            </div>
                        )}
                        {!loadingComment && (
                            <>
                                {review.length > 0 &&
                                    review.map((item, index) => (
                                        <div
                                            className="flex items-start space-x-4 ml-16  mx-8 my-8 w-full  "
                                            key={index}
                                        >
                                            {userData[index] && (
                                                <Avatar
                                                    label={"Avatar"}
                                                    image={
                                                        userData[index]
                                                            .profileImage
                                                    }
                                                    shape="circle"
                                                    size="xlarge"
                                                    className="object-cover"
                                                />
                                            )}
                                            <div className="flex flex-col  ">
                                                {userData[index] && (
                                                    <span className="text-2xl font-bold text-gray-700 mb-2">
                                                        {" "}
                                                        {userData[index].name}
                                                    </span>
                                                )}
                                                <Rating
                                                    value={item.rating}
                                                    readOnly
                                                    stars={5}
                                                    cancel={false}
                                                    className="text-primary-500"
                                                />
                                                <p>
                                                    {formatDate(item.createdAt)}
                                                </p>
                                                <p className="text-gray-600 mt-1">
                                                    {item.review}
                                                </p>
                                            </div>
                                            {userData[index] &&
                                                currentUser._id ===
                                                    userData[index]._id && (
                                                    <span
                                                        className=" mx-8 mt-2 text-red-400 hover:text-red-600 cursor-pointer"
                                                        onClick={() =>
                                                            handleRemoveReview(
                                                                item._id
                                                            )
                                                        }
                                                    >
                                                        <i className="pi pi-trash"></i>
                                                    </span>
                                                )}
                                        </div>
                                    ))}

                                {review.length === 0 && (
                                    <p className="text-gray-700 p-4 mx-8">
                                        {
                                            "No one has written a review for this product yet. "
                                        }
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* // dialog remove review  */}
            {visibleRemoveReview && (
                <div className="card flex justify-content-center">
                    <Dialog
                        header="Delete Review"
                        visible={visibleRemoveReview}
                        style={{ width: "50vw", height: "30vh" }}
                        onHide={() => setVisibleRemoveReview(false)}
                        footer={loadingRemoveReview ? <></> : footerContent}
                    >
                        {!loadingRemoveReview && (
                            <span>Are you sure to delete this review</span>
                        )}
                        {loadingRemoveReview && (
                            <div className="w-full h-full flex justify-center items-center">
                                <ProgressSpinner className="" />
                            </div>
                        )}
                    </Dialog>
                </div>
            )}

            {visibleCart && (
                <Dialog
                    className="w-1/2 h-auto"
                    visible={visibleCart}
                    onHide={() => {
                        setVisibleCart(false);
                    }}
                    header="Add to Cart"
                    footer={
                        loadingAddToCart ? (
                            <></>
                        ) : (
                            <ProductDialogFooter
                                Cancel={() => {
                                    setVisibleCart(false);
                                }}
                                Save={handleSave}
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
                            {
                                <div>
                                    <label
                                        htmlFor="sizess"
                                        className=" block text-gray-700 font-bold mb-4 text-left mr-4"
                                    >
                                        Size
                                    </label>
                                    <Dropdown
                                        id="sizess"
                                        value={selectedSize}
                                        options={sizeOptions}
                                        onChange={(e) =>
                                            setSelectedSize(e.value)
                                        }
                                        optionLabel="size"
                                        className="w-full"
                                        placeholder="Select Size"
                                    />
                                </div>
                            }

                            {
                                <div>
                                    <label
                                        htmlFor="coloss"
                                        className=" block text-gray-700 font-bold mb-4 text-left mr-4"
                                    >
                                        Color
                                    </label>
                                    <Dropdown
                                        id="coloss"
                                        value={selectedColor}
                                        options={colorOptions}
                                        onChange={(e) =>
                                            setSelectedColor(e.value)
                                        }
                                        className="w-full"
                                        placeholder="Select color"
                                        optionLabel="color"
                                    />
                                </div>
                            }
                            <label
                                htmlFor="quantity"
                                className=" block text-gray-700 font-bold mb-4 text-left mr-4"
                            >
                                Quantity
                            </label>
                            <div className="flex items-center space-x-4 justify-center ">
                                <Button
                                    className="p-button-secondary p-button-rounded p-button-icon-only"
                                    onClick={() => setQuantity(quantity - 1)}
                                    disabled={quantity <= 1}
                                >
                                    <i className="pi pi-minus"></i>
                                </Button>
                                <div className="text-lg font-bold mx-3">
                                    {quantity}
                                </div>
                                <Button
                                    className="p-button-secondary p-button-rounded p-button-icon-only"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <i className="pi pi-plus"></i>
                                </Button>
                            </div>
                        </div>
                    )}
                </Dialog>
            )}
        </>
    );
}
