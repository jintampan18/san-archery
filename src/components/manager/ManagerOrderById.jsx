import { useGetOrderById, useUpdateOrder } from "@/appwrite/queriesAndMutation";
import rupiah from "@/utils/rupiahFormater";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { account } from "@/appwrite/config";

const Loading = () => <div className="text-center">Loading...</div>;

const Error = ({ message }) => (
  <div className="text-center">Error: {message}</div>
);

const OrderRow = ({ order, onUpdateStatus }) => {
  const handleStatusChange = (e) => {
    onUpdateStatus(order.$id, e.target.value);
  };

  console.log(order, "ini order");

  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <td className="px-6 py-4">{order.product}</td>
      <td className="px-6 py-4">{order.quantity}</td>
      <td className="px-6 py-4">{rupiah(order.totalPrice)}</td>
      <td className="px-6 py-4">
        <select
          defaultValue={order.status}
          onChange={handleStatusChange}
          className="w-full p-2 border rounded-md"
        >
          <option selected disabled>
            {order.status}
          </option>
          <option value="Pending">Pending</option>
          <option value="Shipping">Shipping</option>
          <option value="Delivered">Delivered</option>
        </select>
      </td>
    </tr>
  );
};

const OrderCard = ({ order, onUpdateStatus }) => {
  const handleStatusChange = (e) => {
    onUpdateStatus(order.$id, e.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
        {order.product}
      </h3>
      <p className="text-gray-700 dark:text-gray-400 mb-2">
        <strong>Quantity:</strong> {order.quantity}
      </p>
      <p className="text-gray-700 dark:text-gray-400 mb-2">
        <strong>Total Price:</strong> {rupiah(order.totalPrice)}
      </p>
      <div className="mb-2">
        <strong>Status:</strong>
        <select
          defaultValue={order.status}
          className="ml-2 w-full p-2 border rounded-md"
          onChange={handleStatusChange}
        >
          <option value="Pending">Pending</option>
          <option value="Shipping">Shipping</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>
    </div>
  );
};

const ManagerOrderById = () => {
  const { id } = useParams();
  const { data: orders, isLoading, isError, error } = useGetOrderById(id);
  const { mutate: updateOrder } = useUpdateOrder();

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Try to get current session
      const session = await account.getSession("current");
      if (session) {
        // Get user details if session exists
        const userData = await account.get();
        setUser(userData);
      } else {
        // Redirect to login if no session
        navigate("/manager/sign-in");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      navigate("/manager/sign-in");
    }
  };

  // Guard clause - if no user is logged in, show nothing
  if (!user) {
    return null;
  }

  if (isLoading) return <Loading />;
  if (isError) return <Error message={error.message} />;

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center">No orders found for this customer.</div>
    );
  }

  const handleUpdateStatus = (orderId, newStatus) => {
    updateOrder({ orderId, status: newStatus });
  };

  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold my-10">Orders</h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden md:block">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Total Price
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow
                key={order.$id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {orders.map((order) => (
          <OrderCard
            key={order.$id}
            order={order}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default ManagerOrderById;
