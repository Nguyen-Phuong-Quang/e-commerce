import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import orderApi from '../../api/orderApi';
import cartApi from '../../api/cartApi';
import { toastContext } from "../../contexts/ToastProvider";
import { ProgressSpinner } from "primereact/progressspinner";

const Order = () => {
    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });
    const [discountCode, setDiscountCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [phone, setPhone] = useState('');

    const [loading, setLoading] = useState(false);
    const { toastError, toastSuccess } = toastContext();
    const [cart, setCart] = useState({});
    const [items, setItems] = useState([]);
    const [totalProductQuantity, setTotalProductQuantity] = useState(0);
    const [totalProductPrice, setTotalProductPrice] = useState(0);
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
                setTotalProductPrice(response.data.cart.totalProductPrice);
                setTotalProductQuantity(
                    response.data.cart.totalProductQuantity
                );
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
                setShippingAddress('');
                setDiscountCode('');
                setPaymentMethod('');
                setPhone('');
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
        toastSuccess('Order placed successfully');
        navigate('/order-history');
    };

    return (
        <div className="order-container">
            <h1 className="flex justify-center items-center text-4xl my-6">Order</h1>
            
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
                            onClick={() => setShowConfirmationDialog(false)}
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

                    <div className="">
                        <h2 className="m-2 pl-10 text-xl">Products</h2>
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
                                {items.map((item) => (
                                    <tr key={item._id}>
                                        <td className="pl-8 py-2">
                                            <img src={item.image} alt={item.product.name} className="w-20 h-20" />
                                        </td>
                                        <td className="px-4 py-2 text-center">{item.product.name}</td>
                                        <td className="px-4 py-2 text-center">{item.size.size}</td>
                                        <td className="px-4 py-2 text-center">{item.color.color}</td>
                                        <td className="px-4 py-2 text-center">{item.totalProductQuantity}</td>
                                        <td className="px-4 py-2 text-center">{item.totalProductPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <h2 className="m-2 pl-10 text-xl">Order Price: {cart.totalPrice}</h2>
                        <h2 className="m-2 pl-10 text-xl">Tax Price: </h2>
                        <h2 className="m-2 pl-10 text-xl">Shipping Price: </h2>
                        <h2 className="m-2 pl-10 text-xl">Final Price: </h2>
                        {/* <h2 className="m-2 pl-10 text-xl">Is Paid</h2>
                        <h2 className="m-2 pl-10 text-xl">Paid At</h2>
                        <h2 className="m-2 pl-10 text-xl">Is Delivery</h2>
                        <h2 className="m-2 pl-10 text-xl">Status</h2> */}

                        {/* <h2 className="m-2 pl-10 text-xl">User</h2> */}
                        {/* <div className="p-fluid m-2">
                            <div className="p-field m-2">    
                                <InputText
                                    id="user"
                                    // value={user}
                                    required
                                    // defaultValue={JSON.parse(localStorage.getItem('profile'))}
                                    onChange={(e) => setUser(e.target.value)}
                                />
                            </div>
                        </div> */}
                        <h2 className="ml-2 pl-10 text-xl">Discount code</h2>
                        <div className="p-fluid">
                            <div className="p-field ml-10 w-5/6">    
                                <InputText
                                    className='m-2 h-8'
                                    id="discountCode"
                                    onChange={(e) => 
                                        setDiscountCode(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <h2 className="ml-2 pl-10 text-xl">Shipping Address</h2>
                        <div className="p-fluid ml-10 w-5/6">
                            <div className="p-field">
                                <label htmlFor="address" className='ml-4'>Address</label>
                                <InputText
                                    id="address"
                                    value={shippingAddress.address}
                                    className='m-2 h-8'
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
                                <label htmlFor="city" className='ml-4'>City</label>
                                <InputText
                                    id="city"
                                    value={shippingAddress.city}
                                    className='m-2 h-8'
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
                                <label htmlFor="postalCode" className='ml-4'>Postal Code</label>
                                <InputText
                                    id="postalCode"
                                    value={shippingAddress.postalCode}
                                    className='m-2 h-8'
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
                                <label htmlFor="country" className='ml-4'>Country</label>
                                <InputText
                                    id="country"
                                    value={shippingAddress.country}
                                    className='m-2 h-8'
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

                        <h2 className="ml-2 pl-10 text-xl">Contact Phone</h2>
                        <div className="p-field ml-5 pl-5">
                            <InputText
                                id="phone"
                                className='m-2 h-8'
                                value={phone}
                                required
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <h2 className="m-2 pl-10 text-xl">Payment Method</h2>
                        <div className="p-field">
                            <Dropdown
                                id="paymentMethod"
                                value={paymentMethod}
                                className='ml-12 mb-2 w-1/4'
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

                        <div className='flex justify-center ml-2'>
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

