import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cartApi from "../../api/cartApi";
import { Button } from "primereact/button";
import { toastContext } from "../../contexts/ToastProvider";

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
        try {
            const response = await cartApi.getCart();
            if (response.data.type === "SUCCESS") {
                setCart(response.data.cart);
                setItems(response.data.cart.items);
                setTotalProductPrice(response.data.cart.totalProductPrice);
                setTotalProductQuantity(response.data.cart.totalProductQuantity);
                setTotalPrice(response.data.cart.totalPrice);
            }
        } catch (error) {
            toastError(error.response.data.message);
            console.log(error.response.data.message);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);


    // const calculateTotalPrice = (items) => {
    //     const totalPrice = items.reduce((total, item) => total + item.price * item.totalProductQuantity, 0);
    //     setTotalProductPrice(totalPrice);
    // };


    const handleDecreaseOne = async (productId) => {
        try {
            const response = await cartApi.decreaseOne(productId);
            if (response.data.type === "SUCCESS") {
                fetchCartItems();
                toastSuccess(response.data.message);
            }
        } catch (error) {
            toastError(error.response.data.message);
            console.error(error);
        }
    };
    
    const handleIncreaseOne = async (productId) => {
        try {
            const response = await cartApi.increaseOne(productId);
            if (response.data.type === "SUCCESS") {
                fetchCartItems();
                toastSuccess(response.data.message);
            }
        } catch (error) {
            toastError(error.response.data.message);
            console.error(error);
        }
    };
    
    // const handleQuantityChange = async (productId, totalProductQuantity) => {
    //     try {
    //         const response = await axiosClient.patch(`/cart/${productId}`, { totalProductQuantity });
    //         if (response.data.type === "SUCCESS") {
    //             fetchCartItems();
    //             toastSuccess(response.data.message);
    //         }
    //     } catch (error) {
    //         toastError(error.response.data.message);
    //         console.error(error);
    //     }
    // };

    const handleDeleteItem = async (productId) => {
        try {
            const response = await cartApi.deleteItemInCart(productId);
            if (response.data.type === "SUCCESS") {
                fetchCartItems();
                toastSuccess(response.data.message);
            }
        } catch (error) {
            toastError(error.response.data.message);
            console.error(error);
        }
    };

    const handlePlaceOrder = () => {
        navigate("/order");
    };

    return (
        <div>

        <h1 className="text-4xl my-6 text-center">Shopping Cart</h1>

        {items && items.length === 0 ? (
            <p className="text-center">Your cart is empty.</p>
        ) : (
            <>
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Image</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Size</th>
                            <th className="px-4 py-2">Color</th>
                            <th className="px-4 py-2">Quantity</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items && items.map((item) => (
                            <tr className="" key={item._id}>
                                <td className="pl-8 py-2">
                                    <img src={item.image} alt={item.product.name} className="h-16 w-16" />
                                </td>
                                <td className="pl-8 py-2">{item.product.name}</td>
                                <td className="pl-8 py-2">{item.size.size}</td>
                                <td className="pl-8 py-2">{item.color.color}</td>
                                <td className="pl-8 py-2">
                                    <div className="flex items-center">
                                        <button
                                            className="px-2 py-1 border border-gray-300 rounded-md"
                                            onClick={() => handleDecreaseOne(item._id)}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="w-8 mx-2"
                                            min={1}
                                            max={100}
                                            value={item.totalProductQuantity}
                                            // onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                        />
                                        <button
                                            className="px-2 py-1 border border-gray-300 rounded-md"
                                            onClick={() => handleIncreaseOne(item._id)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="pl-8 py-2">${item.totalProductPrice}</td>
                                <td className="pl-8 py-2">
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleDeleteItem(item._id)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl ml-4">Total Price: ${cart.totalPrice}</span>
                    <button
                        className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </button>
                </div>
            
            </>
        )}
        </div>
    );
};

export default Cart;
