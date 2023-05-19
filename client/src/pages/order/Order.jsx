import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import './Order.css';

const Order = () => {
    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('');
    const [phone, setPhone] = useState('');

    const toast = useRef(null);

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

    return (
        <div className="order-container">
        <h1>Order</h1>

        <div className="order-form">
            <h2 className="content">Shipping Address</h2>
            <div className="p-fluid">
            <div className="p-field">
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
            <div className="p-field">
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
            <div className="p-field">
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
            <div className="p-field">
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

            <h2 className="content">Payment Method</h2>
            <div className="p-field">
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

            <h2 className="content">Contact Phone</h2>
            <div className="p-field">
                <InputText
                    id="phone"
                    value={phone}
                    required
                    onChange={(e) => setPhone(e.target.value)}
                />
                {" "}
                <Button
                    label="Place Order"
                    onClick={handlePlaceOrder}
                    className="p-button-success ml-10"
                />
            </div>

            <Toast ref={toast} />

        </div>
    </div>
    );
};

export default Order;

