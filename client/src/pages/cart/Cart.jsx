import React, { useState,useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from 'primereact/inputtext';
import { Toast } from "primereact/toast";
import "./Cart.css";

export default function Cart()  {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Product 1",
            quantity: 1,
            price: 10,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 2,
            name: "Product 2",
            quantity: 2,
            price: 20,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 3,
            name: "Product 3",
            quantity: 3,
            price: 30,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 4,
            name: "Product 4",
            quantity: 3,
            price: 30,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 5,
            name: "Product 5",
            quantity: 1,
            price: 10,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 6,
            name: "Product 6",
            quantity: 2,
            price: 20,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 7,
            name: "Product 7",
            quantity: 3,
            price: 30,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 8,
            name: "Product 8",
            quantity: 3,
            price: 30,
            image: "https://via.placeholder.com/150",
        },
    ]);
    const [selectedCartItem, setSelectedCartItem] = useState(null);
    const [totalPrice, setTotalPrice] = useState(
        cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    );
    const [globalFilter, setGlobalFilter] = useState(null);

    const toast = useRef(null);

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

    const handlePayment = () => {
        console.log("Button Payment");
    };

    

    return (
        <div>
            {/* <Toast ref={toast} /> */}
            <h1>Shopping Cart</h1>
            <DataTable value={cartItems} selectionMode="single" selection={selectedCartItem} onSelectionChange={(e) => setSelectedCartItem(e.value)}
            dataKey="id" globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column> */}
                <Column field="name" header="Name"></Column>
                <Column field="image" header="Image" body={imageBodyTemplate} />
                <Column field="quantity" header="Quantity" 
                body={(rowData) => <InputNumber 
                    value={rowData.quantity} 
                    onValueChange={(e) => onQuantityChange(e, rowData)} mode="decimal" showButtons min={1} max={10} />}>
                </Column>
                <Column field="price" header="Price"></Column>
                <Column body={actionBodyTemplate}></Column>
            </DataTable>
            
            <div className="p-d-flex p-jc-between p-ai-center">
                <h2>Total Price: ${totalPrice} {" "}
                    <Button label="Payment" icon="pi pi-credit-card" onClick={handlePayment} />
                </h2>
            </div>
        </div>
    );
};