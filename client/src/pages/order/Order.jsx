import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
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
        toast.current.show({
        severity: 'success',
        summary: 'Order Placed',
        detail: 'Your order has been placed successfully!',
        life: 3000,
        });
    };

    const handleCancelOrder = () => {
        // Perform order cancellation logic here

        // Show cancel toast message
        toast.current.show({
        severity: 'warn',
        summary: 'Order Cancelled',
        detail: 'Your order has been cancelled!',
        life: 3000,
        });
    }

    return (
        <div className="order-container">
        <h1 className="flex justify-center items-center text-4xl my-6">Order</h1>

        <div className="">
            <h2 className="m-5 text-xl">Products</h2>
            <DataTable value={cartItems} selectionMode="single"
            dataKey="id">
                {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column> */}
                <Column field="image" header="Image" body={imageBodyTemplate} style={{ width: '8rem' }}/>
                <Column field="name" header="Name" style={{ width: '12rem' }}></Column>
                <Column field="size" header="Size" style={{ width: '12rem' }} ></Column>
                <Column field="color" header="Color" style={{ width: '12rem' }}></Column>
                <Column field="quantity" header="Quantity" style={{ width: '12rem' }}></Column>
                <Column field="price" header="Price" style={{ width: '12rem' }}></Column>
            </DataTable>
            
            <h2 className="m-5 text-xl">Order Price</h2>
            <h2 className="m-5 text-xl">Tax Price</h2>
            <h2 className="m-5 text-xl">Shipping Price</h2>
            <h2 className="m-5 text-xl">Total Price</h2>

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

