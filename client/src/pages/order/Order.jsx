import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import orderApi from "../../api/orderApi";
import cartApi from "../../api/cartApi";
import { toastContext } from "../../contexts/ToastProvider";
import { ProgressSpinner } from "primereact/progressspinner";

const Order = () => {
    const [shippingAddress, setShippingAddress] = useState({
        address: "",
        city: "",
        postalCode: "",
        country: "",
    });
    const [discountCode, setDiscountCode] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [phone, setPhone] = useState("");
    const [shippingPrice,setShippingPrice] = useState(30000);

    const [loading, setLoading] = useState(false);
    const { toastError, toastSuccess } = toastContext();
    const [cart, setCart] = useState({});
    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const navigate = useNavigate();

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const response = await cartApi.getCart();
            if (response.data.type === "SUCCESS") {
                setCart(response.data.cart);
                setItems(response.data.cart.items);
                setTotalPrice(response.data.cart.totalPrice);
            }
        } catch (error) {
            toastError(error.response.data.message);
            console.log(error.response);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const createOrder = async () => {
        setLoading(true);
        try {
            const data = {
                shippingAddress,
                discountCode,
                paymentMethod,
                phone,
            };
            const response = await orderApi.create(data);
            if (response.data.type === "SUCCESS") {
                setShippingAddress("");
                setDiscountCode("");
                setPaymentMethod("");
                setPhone("");
                toastSuccess(response.data.message);
            }
        } catch (error) {
            toastError(error.response.data.message);
            console.log(error.response);
        }
        setLoading(false);
    };

    const handlePlaceOrder = () => {
        createOrder();
        setShowConfirmationDialog(false);
        toastSuccess("Order placed successfully");
        navigate("/order-history");
    };

    const total = totalPrice + shippingPrice;

    return (
        <div className="order-container">
            <h1 className="flex justify-center items-center text-4xl m1/2 mt-6">
                Order
            </h1>

            {loading && (
                <div className="w-full flex justify-center mt-12">
                    <ProgressSpinner />
                </div>
            )}

            {!loading && (
                <>
                    <Dialog
                        visible={showConfirmationDialog}
                        onHide={() => setShowConfirmationDialog(false)}
                        header="Confirm Order"
                        footer={
                            <div>
                                <Button
                                    label="Cancel"
                                    className="p-button-secondary"
                                    onClick={() =>
                                        setShowConfirmationDialog(false)
                                    }
                                />
                                <Button
                                    label="Confirm"
                                    className="p-button-success"
                                    onClick={handlePlaceOrder}
                                />
                            </div>
                        }
                    >
                        <p>Are you sure you want to place this order?</p>
                    </Dialog>

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
                                {items.map((item, index) => (
                                    <tr
                                        key={item._id}
                                        className={`h-24 ${
                                            index % 2 == 0
                                                ? "bg-yellow-100/50"
                                                : ""
                                        }`}
                                    >
                                        <td className="flex justify-center pt-2">
                                            <img
                                                src={item.image}
                                                alt={item.product.name}
                                                className="w-20 h-20 rounded-lg"
                                            />
                                        </td>
                                        <td className="px-4 h-full text-center ">
                                            {item.product.name}
                                        </td>
                                        <td className="px-4 h-full text-center">
                                            {item.size.size}
                                        </td>
                                        <td className="px-4 h-full text-center">
                                            {item.color.color}
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
                            <span className="font-semibold">Order Price</span>:{" "}
                            <span className=" font-bold text-red-700">
                                {new Intl.NumberFormat().format(cart.totalPrice)}
                                <span className="text-sm text-red-500 pb-2">
                                    đ
                                </span>
                            </span>
                        </h2>
                        {/* <h2 className="m-2 pl-10 text-xl">Tax Price: </h2> */}
                        <h2 className="m-2 pl-10 text-xl">
                            <span className="font-semibold">Shipping price</span>:{" "}
                            <span className=" font-bold text-red-700">
                                {new Intl.NumberFormat().format(shippingPrice)}
                                <span className="text-sm text-red-500 pb-2">
                                    đ
                                </span>
                            </span>
                        </h2>
                        <h2 className="m-2 pl-10 text-xl">
                            <span className="font-semibold">Total</span>:{" "}
                            <span className=" font-bold text-red-700">
                                {new Intl.NumberFormat().format(total)}
                                <span className="text-sm text-red-500 pb-2">
                                    đ
                                </span>
                            </span>
                        </h2>

                        {/* <h2 className="flex m-2 pl-10 text-xl">
                            Discount code
                            <div className="p-field ml-60">
                                <InputText
                                    className="h-8 w-96 ml-8"
                                    id="discountCode"
                                    onChange={(e) =>
                                        setDiscountCode(e.target.value)
                                    }
                                />
                            </div>
                        </h2> */}

                        <h2 className="flex m-2 pl-10 text-xl">
                            <span className="text-xl font-semibold">
                                Contact Phone
                            </span>
                            <div className="p-field ml-3">
                                <InputText
                                    id="phone"
                                    className="h-8 w-96 ml-6"
                                    value={phone}
                                    required
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </h2>
                        <h2 className="flex ml-2 my-6 pl-10 text-xl items-center">
                            <span className="font-semibold">
                                Payment Method
                            </span>
                            <div className="p-field ml-2">
                                <Dropdown
                                    id="paymentMethod"
                                    value={paymentMethod}
                                    className="ml-1 w-60"
                                    options={[
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
                                    ]}
                                    onChange={(e) => setPaymentMethod(e.value)}
                                    placeholder="Select a payment method"
                                    optionLabel="label"
                                />
                            </div>
                        </h2>
                        <h2 className="ml-2 pl-10 text-xl font-semibold">
                            Shipping Address
                        </h2>
                        <div className="p-fluid ml-10">
                            <div className="p-field my-4 flex">
                                <label htmlFor="address" className="ml-14 w-24">
                                    Address
                                </label>
                                <div className="p-field w-96">
                                    <InputText
                                        id="address"
                                        value={shippingAddress.address}
                                        className="ml-6 h-8"
                                        required
                                        onChange={(e) =>
                                            setShippingAddress((prevState) => ({
                                                ...prevState,
                                                address: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="p-field my-4 flex">
                                <label htmlFor="city" className="ml-14 w-24">
                                    City
                                </label>
                                <div className="p-field w-96">
                                    <InputText
                                        id="city"
                                        value={shippingAddress.city}
                                        className="ml-6 h-8"
                                        required
                                        onChange={(e) =>
                                            setShippingAddress((prevState) => ({
                                                ...prevState,
                                                city: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="p-field my-4 flex">
                                <label
                                    htmlFor="postalCode"
                                    className="ml-14 w-24"
                                >
                                    Postal code
                                </label>
                                <div className="p-field w-96">
                                    <InputText
                                        id="postalCode"
                                        value={shippingAddress.postalCode}
                                        className="ml-6 h-8"
                                        required
                                        onChange={(e) =>
                                            setShippingAddress((prevState) => ({
                                                ...prevState,
                                                postalCode: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="p-field my-4 flex">
                                <label htmlFor="country" className="ml-14 w-24">
                                    Country
                                </label>
                                <div className="p-field w-96">
                                    <InputText
                                        id="country"
                                        value={shippingAddress.country}
                                        className="ml-6 h-8"
                                        required
                                        onChange={(e) =>
                                            setShippingAddress((prevState) => ({
                                                ...prevState,
                                                country: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center ml-2">
                            <Button
                                label="Confirm Order"
                                className="p-button-success m-8"
                                onClick={() => setShowConfirmationDialog(true)}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Order;
