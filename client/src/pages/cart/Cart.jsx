import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cartApi from "../../api/cartApi";
import { toastContext } from "../../contexts/ToastProvider";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import convertFirstLetterToUpperCase from "../../helpers/convertFirstLetterToUpperCase";
import route from "../../constants/route";

const Cart = () => {
    const [cart, setCart] = useState({});
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toastError, toastSuccess } = toastContext();

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const response = await cartApi.getCart();
            if (response.data.type === "SUCCESS") {
                setCart(response.data.cart);
                setItems(response.data.cart.items);
            }
        } catch (error) {
            // toastError(error.response.data.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleDecreaseOne = async (productId, sizeId, colorId) => {
        setLoading(true);
        try {
            const response = await cartApi.decreaseOne(
                productId,
                sizeId,
                colorId
            );
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
            const response = await cartApi.increaseOne(
                productId,
                sizeId,
                colorId
            );
            if (response.data.type === "SUCCESS") {
                toastSuccess(response.data.message);
                fetchCartItems(response.data);
            }
        } catch (error) {
            toastError(error.response.data.message);
        }
        setLoading(false);
    };

    const handleDeleteItem = async (productId, size, color) => {
        setLoading(true);
        try {
            const response = await cartApi.deleteItemInCart(
                productId,
                size,
                color
            );
            if (response.data.type === "SUCCESS") {
                toastSuccess(response.data.message);
                fetchCartItems();
            }
        } catch (error) {
            console.log(error);
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
                                        <th className="px-4 py-2 w-32">
                                            Image
                                        </th>
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
                                            <tr
                                                className="border-t last:border-b"
                                                key={item._id}
                                            >
                                                <td className="px-8 py-2">
                                                    <img
                                                        src={item.image}
                                                        alt={item.product.name}
                                                        className="h-16 w-16 object-cover rounded-lg"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    {item.product.name}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    {item.size.size
                                                        ? item.size.size.toUpperCase()
                                                        : ""}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    {item.color.color
                                                        ? convertFirstLetterToUpperCase(
                                                              item.color.color
                                                          )
                                                        : ""}
                                                </td>
                                                <td className="pl-4 py-2 text-center">
                                                    <div className="w-full flex justify-center items-center">
                                                        <button
                                                            className="px-2 py-1 border border-gray-300 rounded-md flex justify-center items-center border-t last:border-b hover:bg-cyan-400/40 hover:cursor-pointer"
                                                            onClick={() =>
                                                                handleDecreaseOne(
                                                                    item.product
                                                                        ._id,
                                                                    item.size
                                                                        ._id,
                                                                    item.color
                                                                        ._id
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
                                                            className="px-2 py-1 border border-gray-300 rounded-md flex justify-center items-center border-t last:border-b hover:bg-cyan-400/40 hover:cursor-pointer"
                                                            onClick={() =>
                                                                handleIncreaseOne(
                                                                    item.product
                                                                        ._id,
                                                                    item.size
                                                                        ._id,
                                                                    item.color
                                                                        ._id
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    {new Intl.NumberFormat().format(
                                                        item.totalProductPrice
                                                    )}
                                                    <span className="text-sm text-red-500 pb-2">
                                                        đ
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <Button
                                                        className=""
                                                        onClick={(e) => {
                                                            handleDeleteItem(
                                                                item.product
                                                                    ._id,
                                                                item.size.size,
                                                                item.color.color
                                                            );
                                                        }}
                                                        severity="danger"
                                                    >
                                                        Remove
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <div className="flex justify-between items-center mt-4 ml-4">
                                <span className="text-2xl ml-4">
                                    Total Price:{" "}
                                    <span className="text-red-700 font-bold">
                                        {new Intl.NumberFormat().format(
                                            cart.totalPrice
                                        )}
                                    </span>
                                    <span className="text-sm text-red-500 pb-2">
                                        đ
                                    </span>
                                </span>
                                <button
                                    className="mr-10 px-8 py-4 font-bold bg-blue-500 text-white rounded hover:bg-blue-700"
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
