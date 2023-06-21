import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cartApi from "../../api/cartApi";
import { toastContext } from "../../contexts/ToastProvider";
import { ProgressSpinner } from "primereact/progressspinner";

const Cart = () => {
    const [cart, setCart] = useState({});
    const [items, setItems] = useState([]);
    const [totalProductQuantity, setTotalProductQuantity] = useState(0);
    const [totalProductPrice, setTotalProductPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { toastError, toastSuccess } = toastContext();

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const response = await cartApi.getCart();
            if (response.data.type === "SUCCESS") {
                setCart(response.data.cart);
                setItems(response.data.cart.items);
                setTotalProductPrice(response.data.cart.totalProductPrice);
                setTotalProductQuantity(
                    response.data.cart.totalProductQuantity
                );
                setTotalPrice(response.data.cart.totalPrice);
            }
        } catch (error) {
            toastError(error.response.data.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleDecreaseOne = async (productId, sizeId, colorId) => {
        setLoading(true);
        try {
            const response = await cartApi.decreaseOne(productId, sizeId, colorId);
            if (response.data.type === "SUCCESS") {
                toastSuccess(response.data.message);
                fetchCartItems();
            }
        } catch (error) {
            toastError(error.response.data.message);
        }
        setLoading(false);
    };

    const handleIncreaseOne = async (productId, sizeId, colorId) => {
        setLoading(true);
        try {
            const response = await cartApi.increaseOne(productId, sizeId, colorId);
            if (response.data.type === "SUCCESS") {
                toastSuccess(response.data.message);
                fetchCartItems(response.data);
            }
        } catch (error) {
            toastError(error.response.data.message);
        }
        setLoading(false);
    };

    const handleDeleteItem = async (productId, sizeId, colorId) => {
        setLoading(true);
        try {
            const response = await cartApi.deleteItemInCart(
                productId,
                sizeId,
                colorId
            );
            if (response.data.type === "SUCCESS") {
                fetchCartItems();
                toastSuccess(response.data.message);
            }
        } catch (error) {
            toastError(error.response.data.message);
        }
        setLoading(false);
    };

    const handlePlaceOrder = () => {
        navigate("/order");
    };

    return (
        <div>
            <h1 className="text-4xl my-6 text-center">Shopping Cart</h1>

            {loading && (
                <div className="w-full flex justify-center mt-12">
                    <ProgressSpinner />
                </div>
            )}

            {!loading && (
                <>
                    {items && items.length === 0 ? (
                        <p className="text-center">Your cart is empty.</p>
                    ) : (
                        <>
                            <table className="table-auto w-full">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 w-32">Image</th>
                                        <th className="px-4 py-2">Name</th>
                                        <th className="px-4 py-2">Size</th>
                                        <th className="px-4 py-2">Color</th>
                                        <th className="px-4 py-2">Quantity</th>
                                        <th className="px-4 py-2">Price</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items &&
                                        items.map((item) => (
                                            <tr className="" key={item._id}>
                                                <td className="px-8 py-2">
                                                    <img
                                                        src={item.image}
                                                        alt={item.product.name}
                                                        className="h-16 w-16"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    {item.product.name}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    {item.size.size}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    {item.color.color}
                                                </td>
                                                <td className="pl-4 py-2 text-center">
                                                    <div className="flex items-center">
                                                        <button
                                                            className="px-2 py-1 border border-gray-300 rounded-md"
                                                            onClick={() =>
                                                                handleDecreaseOne(
                                                                    item.product._id,
                                                                    item.size._id,
                                                                    item.color._id
                                                                )
                                                            }
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 mx-2 text-center">
                                                            {
                                                                item.totalProductQuantity
                                                            }
                                                        </span>
                                                        <button
                                                            className="px-2 py-1 border border-gray-300 rounded-md"
                                                            onClick={() =>
                                                                handleIncreaseOne(
                                                                    item.product._id,
                                                                    item.size._id,
                                                                    item.color._id
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    ${item.totalProductPrice}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <button
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() => {
                                                            handleDeleteItem(
                                                                item.product._id,
                                                                item.size._id,
                                                                item.color._id
                                                            );
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <div className="flex justify-between items-center mt-4 ml-4">
                                <span className="text-2xl ml-4">
                                    Total Price: ${cart.totalPrice}
                                </span>
                                <button
                                    className="mr-10 px-4 py-4 bg-blue-500 text-white rounded hover:bg-blue-700"
                                    onClick={handlePlaceOrder}
                                >
                                    Place Order
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Cart;
