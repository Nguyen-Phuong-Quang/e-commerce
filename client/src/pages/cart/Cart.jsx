import React, { useState,useRef,useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from 'primereact/inputtext';
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { toastContext } from "../../contexts/ToastProvider";
import cartApi from "../../api/cartApi";

export default function Cart()  {
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

    // const [cart,setCart] = useState([]);

    const [selectedCartItem, setSelectedCartItem] = useState(null);
    const [totalPrice, setTotalPrice] = useState(
        cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    );
    const [globalFilter, setGlobalFilter] = useState(null);
    const { toastError, toastSuccess } = toastContext();
    const navigate = useNavigate();

    const toast = useRef(null);

    const fetch = async () => {
        try {
            const response = await cartApi.getCart();
            if (response.data.type === "SUCCESS") {

                setCartItems(response.data.cartItems);
                toastSuccess(response.data);

            }
        } catch (err) {
            toastError(err.response.data.message);
            console.log(err.response.data.message);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    

    const onQuantityChange = (event, rowData) => {
        const updatedItems = [...cartItems];
        const index = updatedItems.findIndex((item) => item.id === rowData.id);
        updatedItems[index].quantity = event.value;
        setCartItems(updatedItems);
        setTotalPrice(
            updatedItems.reduce((total, item) => total + item.price * item.quantity, 0)
        );
        // toast.current.show({
        //     severity: "success",
        //     summary: "Quantity updated",
        //     detail: `${rowData.name} quantity updated to ${event.value}`,
        //     life: 3000,
        // });
    };

    const deleteCartItem = (rowData) => {
        const updatedItems = cartItems.filter((item) => item.id !== rowData.id);
        setCartItems(updatedItems);
        setTotalPrice(
            updatedItems.reduce((total, item) => total + item.price * item.quantity, 0)
        );
        toast.current.show({
            severity: "success",
            summary: "Item removed",
            detail: `${rowData.name} removed from the cart`,
            life: 3000,
        });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-mr-2"
                onClick={() => deleteCartItem(rowData)}
            />
        );
    };
    
    const imageBodyTemplate = (rowData) => {
        return <img src={rowData.image} alt={rowData.name} />;
    };

    const header = (
        <div className="table-header">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" 
                    onInput={(e) => setGlobalFilter(e.target.value)} 
                    placeholder="Search..." />
            </span>
        </div>
    );

    const handlePlaceOrder = () => {
        navigate('/order');
    };

    const sizes = ['S', 'M', 'L']

    return (
        <div>
            <Toast ref={toast} />
            <h1 className="flex justify-center items-center text-4xl my-6">Shopping Cart</h1>
            <DataTable value={cartItems} 
            selectionMode="single" selection={selectedCartItem} onSelectionChange={(e) => setSelectedCartItem(e.value)}
            dataKey="id" globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column> */}
                <Column field="image" header="Image"style={{ width: '12rem' }} body={imageBodyTemplate} />
                <Column field="name" header="Name "style={{ width: '8rem' }}></Column>
                <Column field="size" header="Size"style={{ width: '8rem' }} ></Column>
                <Column field="color" header="Color"style={{ width: '8rem' }} ></Column>
                <Column field="quantity" header="Quantity" style={{ width: '8rem' }}
                    body={
                        (rowData) => <InputNumber 
                            value={rowData.quantity} 
                            onValueChange={(e) => onQuantityChange(e, rowData)} 
                            mode="decimal" showButtons min={1} max={100} 
                        />}
                >
                </Column>
                <Column field="price" header="Price"style={{ width: '8rem' }}></Column>
                <Column body={actionBodyTemplate}style={{ width: '12rem' }}></Column>
            </DataTable>
            
            <div className="flex justify-between ">
                <span className="text-2xl mx-4 my-2">Total Price: ${totalPrice}</span>
                <Button label="Place Order" icon="pi pi-credit-card" onClick={handlePlaceOrder} />
            </div>
        </div>
    );
};
// import React, { useEffect, useState } from 'react';
// import cartApi from '../../api/cartApi';

// const Cart = () => {
//     const [cart, setCart] = useState([]);

//     useEffect(() => {
//         // Fetch the cart data when the component mounts
//         fetchCart();
//     }, []);

//     const fetchCart = async () => {
//         try {
//         const response = await cartApi.getCart();
//         setCart(response.data.cart);
//         } catch (error) {
//         console.error('Error fetching cart:', error);
//         }
//     };

//     const handleRemoveItem = async (productId) => {
//         try {
//         await cartApi.deleteItemInCart(productId);
//         fetchCart(); // Refresh the cart after removing an item
//         } catch (error) {
//         console.error('Error removing item from cart:', error);
//         }
//     };

//     const handleDecreaseQuantity = async (productId) => {
//         try {
//         await cartApi.decreaseOne(productId);
//         fetchCart(); // Refresh the cart after decreasing quantity
//         } catch (error) {
//         console.error('Error decreasing quantity:', error);
//         }
//     };

//     const handleIncreaseQuantity = async (productId) => {
//         try {
//         await cartApi.increaseOne(productId);
//         fetchCart(); // Refresh the cart after increasing quantity
//         } catch (error) {
//         console.error('Error increasing quantity:', error);
//         }
//     };

//     return (
//         <div className="container mx-auto">
//             <h2 className="text-2xl font-bold mb-4">Cart</h2>
//             {cart.length === 0 ? (
//                 <p>Your cart is empty.</p>
//             ) : (
//                 <ul>
//                 {cart.map((item) => (
//                     <li key={item.productId} className="flex items-center justify-between border-b py-2">
//                         <div>
//                             <h3 className="font-semibold">{item.productName}</h3>
//                             <p>Quantity: {item.quantity}</p>
//                         </div>
//                         <div>
//                             <button
//                                 className="bg-red-500 text-white px-2 py-1 rounded mr-2"
//                                 onClick={() => handleRemoveItem(item.productId)}
//                             >
//                             Remove
//                             </button>
//                             <button
//                                 className="bg-gray-300 text-gray-700 px-2 py-1 rounded mr-2"
//                                 onClick={() => handleDecreaseQuantity(item.productId)}
//                             >
//                             -
//                             </button>
//                             <button
//                                 className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
//                                 onClick={() => handleIncreaseQuantity(item.productId)}
//                             >
//                             +
//                             </button>
//                         </div>
//                     </li>
//                 ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default Cart;
