import {
  useGetAllCustomer,
  useUpdateCustomer,
} from "@/appwrite/queriesAndMutation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { account } from "../../appwrite/config";

const Loading = () => <div className="text-center">Loading...</div>;

const Error = () => <div className="text-center">Error loading data</div>;

const CustomerRow = ({ customer }) => (
  <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
    <th
      scope="row"
      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {customer.name}
    </th>
    <td className="px-6 py-4">{customer.tanggalTransaksi}</td>
    <td className="px-6 py-4">{customer.email}</td>
    <td className="px-6 py-4">{customer.phoneNumber}</td>
    <td className="px-6 py-4">{customer.address}</td>
    <td className="px-6 py-4">{customer.shippingOption}</td>
    <td className="px-6 py-4">
      <Link
        to={`/admin/dashboard/order/${customer.$id}`}
        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
      >
        View
      </Link>
    </td>
  </tr>
);

const CustomerCard = ({ customer }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
      {customer.name}
    </h3>
    <p className="text-gray-700 dark:text-gray-400 mb-2">
      <strong>Transaction Time:</strong> {customer.tanggalTransaksi}
    </p>
    <p className="text-gray-700 dark:text-gray-400 mb-2">
      <strong>Email:</strong> {customer.email}
    </p>
    <p className="text-gray-700 dark:text-gray-400 mb-2">
      <strong>Phone Number:</strong> {customer.phoneNumber}
    </p>
    <p className="text-gray-700 dark:text-gray-400 mb-2">
      <strong>Address:</strong> {customer.address}
    </p>
    <p className="text-gray-700 dark:text-gray-400 mb-2">
      <strong>Shipping Options:</strong> {customer.shippingOption}
    </p>
    <Link
      to={`/admin/dashboard/order/${customer.$id}`}
      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
    >
      View
    </Link>
  </div>
);

const Dashboard = () => {
  const [filteredHasPaidData, setFilteredHasPaidData] = useState([]);
  const [user, setUser] = useState(null);
  const { mutateAsync: updateCustomer } = useUpdateCustomer();
  const { data, isLoading, isError } = useGetAllCustomer();
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
        navigate("/sign-in");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      navigate("/sign-in");
    }
  };

  const handleSignOut = async () => {
    try {
      // Delete the current session
      await account.deleteSession("current");

      // Clear user data from state
      setUser(null);

      // Clear session storage
      sessionStorage.clear();

      // Redirect to login
      navigate("/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const filterHasPaidData = (data) => {
    return data.documents.filter((doc) => doc.hasPaid === true);
  };

  const updateData = (data) => {
    const updatedData = data.documents.filter((doc) => doc.hasPaid === false);
    updatedData.forEach((element) => {
      checkingCustomer(element);
    });
    return updatedData;
  };

  async function checkingCustomer(values) {
    try {
      const response = await axios.get(
        `http://localhost:5001/payment-status/${values.transaction_id}`
      );
      const customerData = response.data;

      if (customerData.transaction_status === "settlement") {
        const customer = { ...values, hasPaid: true };
        const updatedCustomer = await updateCustomer(customer);
        console.log("customer Update", updatedCustomer);
        return updatedCustomer;
      }
    } catch (error) {
      console.error("Error checking customer:", error);
    }
  }

  useEffect(() => {
    if (data) {
      setFilteredHasPaidData(filterHasPaidData(data));
      updateData(data);
    }
  }, [data]);

  // Guard clause - if no user is logged in, show nothing
  if (!user) {
    return null;
  }

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center my-10">
        <h2 className="text-4xl font-bold">Dashboard</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user.email}</span>
          <button
            onClick={handleSignOut}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden md:block">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Transaction Time
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Shipping Options
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <Loading />
            ) : isError ? (
              <Error />
            ) : (
              filteredHasPaidData.map((customer) => (
                <CustomerRow key={customer.$id} customer={customer} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <Error />
        ) : (
          filteredHasPaidData.map((customer) => (
            <CustomerCard key={customer.$id} customer={customer} />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
