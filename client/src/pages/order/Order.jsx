import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import orderApi from '../../api/orderApi';
import { toastContext } from "../../contexts/ToastProvider";

const Order = () => {
    const [user,setUser] = useState();
    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const { toastError,toastSuccess } = toastContext();
    const toast = useRef(null);
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Product 1",
            size: "M",
            color: "Red",
            quantity: 1,
            price: 10,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 2,
            name: "Product 2",
            size: "M",
            color: "Red",
            quantity: 2,
            price: 20,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 3,
            name: "Product 3",
            size: "M",
            color: "Red",
            quantity: 3,
            price: 30,
            image: "https://via.placeholder.com/150",
        },
    ]);

    const fetch = async () => {
        setLoading(true);
        try {
            const response = await orderApi.query();
            if (response.data.type === "SUCCESS") {
                toastSuccess(response.data)
            }
        } catch (err) {
            toastError(err.response.data.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetch();
    }, []);

    const imageBodyTemplate = (rowData) => {
        return <img src={rowData.image} alt={rowData.name} />;
    };

    const handlePlaceOrder = () => {
        // Perform order placement logic here

        // Show success toast message
    };

    const handleCancelOrder = () => {
        // Perform order cancellation logic here

        // Show cancel toast message
    }

    return (
        <div className="order-container">
        <h1 className="flex justify-center items-center text-4xl my-6">Order</h1>

        <div className="">
            <h2 className="m-5 text-xl">Products</h2>
            <table className="min-w-full">
                <thead>
                    <tr>
                    <th className="px-4 py-2">Image</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Size</th>
                    <th className="px-4 py-2">Color</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                    <tr key={item.id}>
                        <td className="px-4 py-2">
                        <img src={item.image} alt={item.name} className="w-20 h-20" />
                        </td>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">{item.size}</td>
                        <td className="px-4 py-2">{item.color}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">{item.price}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            
            <h2 className="m-5 text-xl">Order Price</h2>
            <h2 className="m-5 text-xl">Tax Price</h2>
            <h2 className="m-5 text-xl">Shipping Price</h2>
            <h2 className="m-5 text-xl">Total Price</h2>
            <h2 className="m-5 text-xl">Is Paid</h2>
            <h2 className="m-5 text-xl">Paid At</h2>
            <h2 className="m-5 text-xl">Is Delivery</h2>
            <h2 className="m-5 text-xl">Status</h2>

            <h2 className="m-5 text-xl">User</h2>
            <div className="p-fluid m-5">
                <div className="p-field m-5">    
                    <InputText
                        id="user"
                        value={user}
                        required
                        defaultValue={JSON.parse(localStorage.getItem('profile'))}
                    />
                </div>
            </div>
            <h2 className="m-5 text-xl">Shipping Address</h2>
            <div className="p-fluid m-5">
                <div className="p-field m-5">
                    <label htmlFor="address">Address</label>
                    <InputText
                    id="address"
                    value={shippingAddress.address}
                    required
                    onChange={(e) =>
                        setShippingAddress((prevState) => ({
                        ...prevState,
                        address: e.target.value,
                        }))
                    }
                    />
                </div>
                <div className="p-field m-5">
                    <label htmlFor="city">City</label>
                    <InputText
                    id="city"
                    value={shippingAddress.city}
                    required
                    onChange={(e) =>
                        setShippingAddress((prevState) => ({
                        ...prevState,
                        city: e.target.value,
                        }))
                    }
                    />
                </div>
                <div className="p-field m-5">
                    <label htmlFor="postalCode">Postal Code</label>
                    <InputText
                    id="postalCode"
                    value={shippingAddress.postalCode}
                    required
                    onChange={(e) =>
                        setShippingAddress((prevState) => ({
                        ...prevState,
                        postalCode: e.target.value,
                        }))
                    }
                    />
                </div>
                <div className="p-field m-5">
                    <label htmlFor="country">Country</label>
                    <InputText
                    id="country"
                    value={shippingAddress.country}
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

            <h2 className="m-5 text-xl">Payment Method</h2>
            <div className="p-field m-5">
            <Dropdown
                id="paymentMethod"
                value={paymentMethod}
                options={[
                { label: 'Cash', value: 'cash' },
                { label: 'Debit Card', value: 'debitCard' },
                { label: 'Credit Card', value: 'creditCard' },
                { label: 'Mobile Payment', value: 'mobilePayment' },
                { label: 'E-Banking', value: 'e-banking' },
                ]}
                onChange={(e) => setPaymentMethod(e.value)}
                placeholder="Select a payment method"
                optionLabel="label"
            />
            </div>

            <h2 className="m-5 text-xl">Contact Phone</h2>
            <div className="p-field m-5">
                <InputText
                    id="phone"
                    value={phone}
                    required
                    onChange={(e) => setPhone(e.target.value)}
                />
                {" "}
                <div className='flex justify-center'>
                    <Button
                        label="Comfirm Order"
                        onClick={handlePlaceOrder}
                        className="p-button-success ml-10"
                    />
                    <Button
                        label="Cancel"
                        onClick={handleCancelOrder}
                        className="p-button-danger ml-10"
                    />

                </div>
            </div>

            <Toast ref={toast} />

        </div>
    </div>
    );
};

export default Order;

