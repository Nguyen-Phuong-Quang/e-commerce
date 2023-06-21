import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { toastContext } from '../../contexts/ToastProvider';
import { ProgressSpinner } from 'primereact/progressspinner';
import orderApi from '../../api/orderApi';

const OrderHistory = () => {

  const [orders,setOrders] = useState([]);
  const navigate = useNavigate();
  const { toastError } = toastContext();
  const [loading,setLoading] = useState(false);

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await orderApi.query();
        if(response.data.type === "SUCCESS"){
          setOrders(response.data.orders);
        }
      }catch(error){
        toastError(error.response.data.message);
      }
      setLoading(false);
    };
    fetchOrders();
  },[]);

  const handleViewDetail = (orderId) => {
    navigate(`/order/${orderId}`);
  };
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold my-4 flex justify-center">
        Order History
      </h2>

      {loading && (
        <div className="w-full flex justify-center mt-12">
          <ProgressSpinner />
        </div>
      )}

      {!loading && (
        <>
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-2 px-4">Order ID</th>
                <th className="py-2 px-4">Time</th>
                <th className="py-2 px-4">Total Price</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="py-2 px-4">{order._id}</td>
                  <td className="py-2 px-4">{formatDate(order.createdAt)}</td>
                  <td className="py-2 px-4">{order.totalPrice}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleViewDetail(order._id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default OrderHistory;
