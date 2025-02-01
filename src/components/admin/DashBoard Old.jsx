import {
  useGetAllCustomer,
  useUpdateCustomer,
} from "@/appwrite/queriesAndMutation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <td className="px-6 py-4">{customer.totalAmount}</td>
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
    <p className="text-gray-700 dark:text-gray-400 mb-2">
      <strong>Total Amount:</strong> {customer.totalAmount}
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
  const { mutateAsync: updateCustomer } = useUpdateCustomer();

  const { data, isLoading, isError } = useGetAllCustomer();
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, setEmail } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/sign-in");
    }
  }, [isLoggedIn, navigate]);

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setEmail("");
    sessionStorage.removeItem("userEmail");
    navigate("/sign-in");
  };

  if (!isLoggedIn) {
    return null;
  }

  const filterHasPaidData = (data) => {
    const filteredData = data.documents.filter((doc) => doc.hasPaid === true);
    return filteredData;
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
      let response = await axios.get(
        `http://localhost:5001/payment-status/${values.transaction_id}`
      );
      let customerData = response.data;
      if (customerData.transaction_status == "settlement") {
        const customer = { ...values, hasPaid: true };
        const updatedCustomer = await updateCustomer(customer);

        console.log("customer Update", updatedCustomer);

        return updatedCustomer;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  useEffect(() => {
    if (data) {
      setFilteredHasPaidData(filterHasPaidData(data));
      updateData(data);
    }
  }, [data]);

  return (
    <div className="w-full p-4">
      <h2 className="text-4xl font-bold my-10">Dashboard</h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden md:block">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
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
                Total Amount
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
      <button
        onClick={handleSignOut}
        className=" bg-blue-500 my-10 text-white p-2 rounded-md cursor-pointer"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
