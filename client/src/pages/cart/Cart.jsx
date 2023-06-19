// import React, { useState,useRef,useEffect } from "react";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { Button } from "primereact/button";
// import { InputNumber } from "primereact/inputnumber";
// import { InputText } from 'primereact/inputtext';
// import { useNavigate } from "react-router-dom";
// import { Toast } from "primereact/toast";
// import { toastContext } from "../../contexts/ToastProvider";
// import cartApi from "../../api/cartApi";

// export default function Cart()  {
//     const [cartItems, setCartItems] = useState([
//         {
//             id: 1,
//             name: "Product 1",
//             size: "M",
//             color: "Red",
//             quantity: 1,
//             price: 10,
//             image: "https://via.placeholder.com/150",
//         },
//         {
//             id: 2,
//             name: "Product 2",
//             size: "M",
//             color: "Red",
//             quantity: 2,
//             price: 20,
//             image: "https://via.placeholder.com/150",
//         },
//         {
//             id: 3,
//             name: "Product 3",
//             size: "M",
//             color: "Red",
//             quantity: 3,
//             price: 30,
//             image: "https://via.placeholder.com/150",
//         },
//     ]);


//     const [cart,setCart] = ([]);
//     const [selectedCartItem, setSelectedCartItem] = useState(null);
//     const [totalPrice, setTotalPrice] = useState(
//         cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
//     );
//     const [globalFilter, setGlobalFilter] = useState(null);
//     const { toastError,toastSuccess } = toastContext();
//     const navigate = useNavigate();

//     const toast = useRef(null);

//     const fetch = async () => {
//         try {
//             const response = await cartApi.getCart();
//             if (response.data.type === "SUCCESS") {
//                 setCart(response.data.cart);
//                 console.log(response);
//                 toastSuccess(response.data)
//             }
//         } catch (err) {
//             console.log("123");
//             toastError(err.response.data.message);
//             console.log(err.response);
//             console.log(err);
//         }
//     };

//     useEffect(() => {
//         fetch();
//     }, []);

    

//     const onQuantityChange = (event, rowData) => {
//         const updatedItems = [...cartItems];
//         const index = updatedItems.findIndex((item) => item.id === rowData.id);
//         updatedItems[index].quantity = event.value;
//         setCartItems(updatedItems);
//         setTotalPrice(
//             updatedItems.reduce((total, item) => total + item.price * item.quantity, 0)
//         );
//         toast.current.show({
//             severity: "success",
//             summary: "Quantity updated",
//             detail: `${rowData.name} quantity updated to ${event.value}`,
//             life: 3000,
//         });
//     };

//     const deleteCartItem = (rowData) => {
//         const updatedItems = cartItems.filter((item) => item.id !== rowData.id);
//         setCartItems(updatedItems);
//         setTotalPrice(
//             updatedItems.reduce((total, item) => total + item.price * item.quantity, 0)
//         );
//         toast.current.show({
//             severity: "success",
//             summary: "Item removed",
//             detail: `${rowData.name} removed from the cart`,
//             life: 3000,
//         });
//     };

//     const actionBodyTemplate = (rowData) => {
//         return (
//             <Button
//                 icon="pi pi-trash"
//                 className="p-button-rounded p-button-danger p-mr-2"
//                 onClick={() => deleteCartItem(rowData)}
//             />
//         );
//     };
    
//     const imageBodyTemplate = (rowData) => {
//         return <img src={rowData.image} alt={rowData.name} />;
//     };

//     const header = (
//         <div className="table-header">
//             <span className="p-input-icon-left">
//                 <i className="pi pi-search" />
//                 <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
//             </span>
//         </div>
//     );

//     const handlePlaceOrder = () => {
//         console.log("Button Place Order");
//         navigate('/order');
//     };

//     const sizes = ['S', 'M', 'L']

//     return (
//         <div>
//             <Toast ref={toast} />
//             <h1>Shopping Cart</h1>
//             <DataTable value={cart} selectionMode="single" selection={selectedCartItem} onSelectionChange={(e) => setSelectedCartItem(e.value)}
//             dataKey="id" globalFilter={globalFilter} header={header} responsiveLayout="scroll">
//                 {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column> */}
//                 <Column field="name" header="Name"></Column>
//                 <Column field="image" header="Image" body={imageBodyTemplate} />
//                 <Column field="size" header="Size" ></Column>
//                 <Column field="color" header="Color" ></Column>
//                 <Column field="quantity" header="Quantity" 
//                     body={(rowData) => <InputNumber 
//                     value={rowData.quantity} 
//                     onValueChange={(e) => onQuantityChange(e, rowData)} mode="decimal" showButtons min={1} max={100} />}>
//                 </Column>
//                 <Column field="price" header="Price"></Column>
//                 <Column body={actionBodyTemplate}></Column>
//             </DataTable>
            
//             <div className="p-d-flex p-jc-between p-ai-center">
//                 <h2>Total Price: ${totalPrice} {" "}
//                     <Button label="Place Order" icon="pi pi-credit-card" onClick={handlePlaceOrder} />
//                 </h2>
//             </div>
//         </div>
//     );
// };

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cartApi from "../../api/cartApi";
import { Button } from "primereact/button";
import { toastContext } from "../../contexts/ToastProvider";

const Cart = () => {
    const [user,setUser] = useState('');
    const [email,setEmail] = useState('');
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { toastError, toastSuccess } = toastContext();

    const fetchCartItems = async () => {
        try {
            const response = await cartApi.getCart();
            if (response.data.type === "SUCCESS") {
                console.log(response.data.cart);
                setCart(response.data.cart);
                calculateTotalPrice(response.data.cart);
                toastSuccess(response.data.message);
            }
        } catch (error) {
            toastError(error.response.data.message);
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);


    const calculateTotalPrice = (items) => {
        const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
        setTotalPrice(totalPrice);
    };


    const handleDecreaseOne = async (itemId) => {
        try {
            const response = await cartApi.decreaseOne(itemId);
            if (response.data.type === "SUCCESS") {
                fetchCartItems();
                toastSuccess(response.data.message);
            }
        } catch (error) {
            toastError(error.response.data.message);
            console.error(error);
        }
    };
    
    const handleIncreaseOne = async (itemId) => {
        try {
            const response = await cartApi.increaseOne(itemId);
            if (response.data.type === "SUCCESS") {
                fetchCartItems();
                toastSuccess(response.data.message);
            }
        } catch (error) {
            toastError(error.response.data.message);
            console.error(error);
        }
    };
    
    // const handleQuantityChange = async (itemId, quantity) => {
    //     try {
    //         const response = await axiosClient.patch(`/cart/${itemId}`, { quantity });
    //         if (response.data.type === "SUCCESS") {
    //             fetchCartItems();
    //             toastSuccess(response.data.message);
    //         }
    //     } catch (error) {
    //         toastError(error.response.data.message);
    //         console.error(error);
    //     }
    // };

    const handleDeleteItem = async (itemId) => {
        try {
            const response = await cartApi.deleteItemInCart(itemId);
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

        {/* {cart.length === 0 ? (
            <p className="text-center">Your cart is empty.</p>
        ) : ( */}
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
                    {cart.map((item) => (
                        <tr key={item._id}>
                            <td className="px-4 py-2">
                                <img src={item.image} alt={item.name} className="h-16 w-16" />
                            </td>
                            <td className="px-4 py-2">{item.name}</td>
                            <td className="px-4 py-2">{item.size}</td>
                            <td className="px-4 py-2">{item.color}</td>
                            {/* <td className="px-4 py-2">
                                <input
                                    type="number"
                                    className="w-16"
                                    min={1}
                                    max={100}
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                />
                            </td> */}
                            <td className="px-4 py-2">
                                <div className="flex items-center">
                                    <button
                                        className="px-2 py-1 border border-gray-300 rounded-md"
                                        onClick={() => handleDecreaseOne(item.id)}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        className="w-16 mx-2"
                                        min={1}
                                        max={100}
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                    />
                                    <button
                                        className="px-2 py-1 border border-gray-300 rounded-md"
                                        onClick={() => handleIncreaseOne(item.id)}
                                    >
                                        +
                                    </button>
                                </div>
                            </td>
                            <td className="px-4 py-2">${item.price}</td>
                            <td className="px-4 py-2">
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteItem(item.id)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        {/* )} */}

        {cart.length > 0 && (
            <div className="flex justify-between items-center mt-4">
                <span className="text-2xl">Total Price: ${totalPrice}</span>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={handlePlaceOrder}
                >
                    Place Order
                </button>
            </div>
        )}
        </div>
    );
};

export default Cart;
