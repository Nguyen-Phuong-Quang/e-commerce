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
import "./Cart.css";

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
        {
            id: 4,
            name: "Product 4",
            size: "M",
            color: "Red",
            quantity: 3,
            price: 30,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 5,
            name: "Product 5",
            size: "M",
            color: "Red",
            quantity: 1,
            price: 10,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 6,
            name: "Product 6",
            size: "M",
            color: "Red",
            quantity: 2,
            price: 20,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 7,
            name: "Product 7",
            size: "M",
            color: "Red",
            quantity: 3,
            price: 30,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 8,
            name: "Product 8",
            size: "M",
            color: "Red",
            quantity: 3,
            price: 30,
            image: "https://via.placeholder.com/150",
        },
    ]);
    const [cart,setCart] = ("");
    const [selectedCartItem, setSelectedCartItem] = useState(null);
    const [totalPrice, setTotalPrice] = useState(
        cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    );
    const [globalFilter, setGlobalFilter] = useState(null);
    const { toastError,toastSuccess } = toastContext();
    const navigate = useNavigate();

    const toast = useRef(null);

    const fetch = async () => {
        setLoading(true);
        try {
            const response = await cartApi.getCart();
            if (response.data.type === "SUCCESS") {
                setCart(response.data.user);
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

    const onQuantityChange = (event, rowData) => {
        const updatedItems = [...cartItems];
        const index = updatedItems.findIndex((item) => item.id === rowData.id);
        updatedItems[index].quantity = event.value;
        setCartItems(updatedItems);
        setTotalPrice(
            updatedItems.reduce((total, item) => total + item.price * item.quantity, 0)
        );
        toast.current.show({
            severity: "success",
            summary: "Quantity updated",
            detail: `${rowData.name} quantity updated to ${event.value}`,
            life: 3000,
        });
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
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const handlePlaceOrder = () => {
        console.log("Button Place Order");
        navigate('/order');
    };

    const sizes = ['S', 'M', 'L']

    return (
        <div>
            <Toast ref={toast} />
            <h1>Shopping Cart</h1>
            <DataTable value={cartItems} selectionMode="single" selection={selectedCartItem} onSelectionChange={(e) => setSelectedCartItem(e.value)}
            dataKey="id" globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column> */}
                <Column field="name" header="Name"></Column>
                <Column field="image" header="Image" body={imageBodyTemplate} />
                <Column field="size" header="Size" ></Column>
                <Column field="color" header="Color" ></Column>
                <Column field="quantity" header="Quantity" 
                    body={(rowData) => <InputNumber 
                    value={rowData.quantity} 
                    onValueChange={(e) => onQuantityChange(e, rowData)} mode="decimal" showButtons min={1} max={100} />}>
                </Column>
                <Column field="price" header="Price"></Column>
                <Column body={actionBodyTemplate}></Column>
            </DataTable>
            
            <div className="p-d-flex p-jc-between p-ai-center">
                <h2>Total Price: ${totalPrice} {" "}
                    <Button label="Place Order" icon="pi pi-credit-card" onClick={handlePlaceOrder} />
                </h2>
            </div>
        </div>
    );
};