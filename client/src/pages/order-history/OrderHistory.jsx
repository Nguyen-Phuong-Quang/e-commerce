import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { toastContext } from "../../contexts/ToastProvider";
import { ProgressSpinner } from "primereact/progressspinner";
import orderApi from "../../api/orderApi";
import route from "../../constants/route";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    // const { toastError } = toastContext();
    const [loading, setLoading] = useState(false);

    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await orderApi.query();
                if (response.data.type === "SUCCESS") {
                    setOrders(response.data.orders);
                }
            } catch (error) {
                // toastError(error.response.data.message);
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);

    const handleViewDetail = (orderId) => {
        navigate(`${route.ORDER}/${orderId}`);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold my-4 flex justify-center">
                Order History
            </h2>

            {loading && (
                <div className="w-full flex justify-center mt-12">
                    <ProgressSpinner />
                </div>
            )}

            {!loading && (
                <>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="py-2 px-4">Order ID</th>
                                <th className="py-2 px-4">Time</th>
                                <th className="py-2 px-4">Total Price</th>
                                <th className="py-2 px-4">Status</th>
                                <th className="py-2 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="py-2 px-4">
                                        <div className="w-full flex justify-center">
                                            {order._id}
                                        </div>
                                    </td>
                                    <td className="py-2 px-4">
                                        <div className="w-full flex justify-center">
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </td>
                                    <td className="py-2 px-4">
                                        <div className="w-full flex justify-center">
                                            {new Intl.NumberFormat().format(
                                                order.totalPrice
                                            )}
                                            <span className="text-sm text-red-500">
                                                đ
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4">
                                        <div className="w-full flex justify-center">
                                            {order.status}
                                        </div>
                                    </td>
                                    <td className="py-2 px-4">
                                        <div className="w-full flex justify-center">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                onClick={() =>
                                                    handleViewDetail(order._id)
                                                }
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default OrderHistory;
