import React, { useState, useEffect } from "react";
import { toastContext } from "../../contexts/ToastProvider";
import { ProgressSpinner } from "primereact/progressspinner";
import {  useNavigate, useParams } from "react-router-dom";
import orderApi from "../../api/orderApi";
import convertFirstLetterToUpperCase from "../../helpers/convertFirstLetterToUpperCase";
import route from "../../constants/route";

const paymentOption = [
    { label: "Cash", value: "cash" },
    {
        label: "Debit Card",
        value: "debitCard",
    },
    {
        label: "Credit Card",
        value: "creditCard",
    },
    {
        label: "Mobile Payment",
        value: "mobilePayment",
    },
    {
        label: "E-Banking",
        value: "e-banking",
    },
];

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

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState({});
    const [products, setProducts] = useState([]);
    const [shippingAddress, setShippingAddress] = useState("");
    const { toastError } = toastContext();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDetail();
    }, []);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const response = await orderApi.getById(id);
            if (response.data.type === "SUCCESS") {
                setOrder(response.data.order);
                setProducts(response.data.order.products);
                setShippingAddress(response.data.order.shippingAddress);
            }
        } catch (error) {
            toastError(error.response.data.message);
        }
        setLoading(false);
    };

    return (
        <div className="order-container">
            <h1 className="flex justify-center items-center text-4xl m1/2 mt-6">
                Order {id}
            </h1>

            {loading && (
                <div className="w-full flex justify-center mt-12">
                    <ProgressSpinner />
                </div>
            )}

            {!loading && (
                <>
                    <div className="mt-4">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 w-40">Image</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Size</th>
                                    <th className="px-4 py-2">Color</th>
                                    <th className="px-4 py-2">Quantity</th>
                                    <th className="px-4 py-2">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((item, index) => (
                                    <tr
                                        key={item._id}
                                        className={`h-24 border-t last:border-b hover:bg-cyan-400/40 hover:cursor-pointer`}
                                        onClick={() =>
                                            navigate(
                                                `${route.DETAIL}/${item.product._id}`
                                            )
                                        }
                                    >
                                        <td className="flex justify-center pt-2">
                                            <img
                                                src={item.image}
                                                alt={item.product.name}
                                                className="w-20 h-20 rounded-lg object-cover"
                                            />
                                        </td>
                                        <td className="px-4 h-full text-center ">
                                            {item.product.name}
                                        </td>
                                        <td className="px-4 h-full text-center">
                                            {item.size.size.toUpperCase()}
                                        </td>
                                        <td className="px-4 h-full text-center">
                                            {convertFirstLetterToUpperCase(
                                                item.color.color
                                            )}
                                        </td>
                                        <td className="px-4 h-full text-center">
                                            {item.totalProductQuantity}
                                        </td>
                                        <td className="px-4 h-full text-center">
                                            {new Intl.NumberFormat().format(
                                                item.totalProductPrice
                                            )}
                                            <span className="text-red-600">
                                                đ
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h2 className="m-2 pl-10 text-xl">
                            <span className="font-semibold">Price</span>:{" "}
                            <span className=" font-bold text-red-700">
                                {new Intl.NumberFormat().format(
                                    order.orderPrice
                                )}
                                <span className="text-sm text-red-500 pb-2">
                                    đ
                                </span>
                            </span>
                        </h2>

                        <h2 className="m-2 pl-10 text-xl">
                            <span className="font-semibold">
                                Shipping price
                            </span>
                            :{" "}
                            <span className=" font-bold text-red-700">
                                {new Intl.NumberFormat().format(
                                    order.shippingPrice
                                )}
                                <span className="text-sm text-red-500 pb-2">
                                    đ
                                </span>
                            </span>
                        </h2>

                        {/* <h2 className="m-2 pl-10 text-xl">
                            <span className="font-semibold">Total</span>:{" "}
                            <span className=" font-bold text-red-700">
                                {new Intl.NumberFormat().format(order.taxPrice)}
                                <span className="text-sm text-red-500 pb-2">
                                    đ
                                </span>
                            </span>
                        </h2> */}

                        <h2 className="m-2 pl-10 text-xl">
                            <span className="font-semibold">Total</span>:{" "}
                            <span className=" font-bold text-red-700">
                                {new Intl.NumberFormat().format(
                                    order.totalPrice
                                )}
                                <span className="text-sm text-red-500 pb-2">
                                    đ
                                </span>
                            </span>
                        </h2>

                        <h2 className="m-2 pl-10 text-xl">
                            <span className="font-semibold">Contact Phone</span>
                            :{" "}
                            <span className=" font-bold text-red-700">
                                {order.phone}
                            </span>
                        </h2>

                        <h2 className="m-2 pl-10 text-xl">
                            <span className="font-semibold">Address</span>:{" "}
                            <span className=" font-bold text-red-700">
                                {shippingAddress.address}
                            </span>
                        </h2>

                        <h2 className="m-2 pl-10 text-xl">
                            <span className="font-semibold">Is Paid</span>:{" "}
                            <span className=" font-bold text-red-700">
                                {order.isPaid ? "Yes" : "No"}
                            </span>
                        </h2>

                        <h2 className="m-2 pl-10 text-xl">
                            <span className="font-semibold">Is Delivered</span>:{" "}
                            <span className=" font-bold text-red-700">
                                {order.isDelivered ? "Yes" : "No"}
                            </span>
                        </h2>

                        <h2 className="m-2 pl-10 text-xl">
                            <span className="font-semibold">Paid At</span>:{" "}
                            <span className=" font-bold text-red-700">
                                {formatDate(order.paidAt)}
                            </span>
                        </h2>

                        <h2 className="m-2 pl-10 text-xl">
                            <span className="font-semibold">Status</span>:{" "}
                            <span className=" font-bold text-red-700">
                                {order.status}
                            </span>
                        </h2>

                        <h2 className="m-2 pl-10 text-xl">
                            <span className="font-semibold">Time</span>:{" "}
                            <span className=" font-bold text-red-700">
                                {formatDate(order.createdAt)}
                            </span>
                        </h2>

                        <h2 className="m-2 pl-10 text-xl">
                            <span className="font-semibold">
                                Payment Method
                            </span>
                            :{" "}
                            <span className=" font-bold text-red-700">
                                {order.paymentMethod &&
                                    paymentOption.find(
                                        (option) =>
                                            option.value === order.paymentMethod
                                    ).label}
                                {/* {order.paymentMethod &&
                                    order.paymentMethod.toUpperCase()} */}
                            </span>
                        </h2>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderDetail;
