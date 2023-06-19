import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const OrderHistory = () => {
  const orders = [
    {
      orderId: '12345',
      date: '2023-06-15',
      totalAmount: '99.99',
      status: 'Completed',
    },
    {
      orderId: '67890',
      date: '2023-06-12',
      totalAmount: '149.99',
      status: 'In Progress',
    },
    {
      orderId: '54321',
      date: '2023-06-10',
      totalAmount: '79.99',
      status: 'Cancelled',
    },
  ];

  const viewOrderDetails = (orderId) => {
    // Handle logic for viewing order details
    console.log(`Viewing details for order ${orderId}`);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => viewOrderDetails(rowData.orderId)}
      >
        View Details
      </button>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold my-4 flex justify-center">Order History</h2>
      <DataTable value={orders} className="w-full">
        <Column field="orderId" header="Order ID" sortable></Column>
        <Column field="date" header="Date" sortable></Column>
        <Column field="totalAmount" header="Total Amount" sortable></Column>
        <Column field="status" header="Status" sortable></Column>
        <Column body={actionBodyTemplate}></Column>
      </DataTable>
    </div>
  );
};

export default OrderHistory;
