import {
  useGetAllCustomer,
  useUpdateCustomer,
} from "@/appwrite/queriesAndMutation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { account } from "../../appwrite/config";
import dateFormater from "@/utils/dateFormater";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

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
    <td className="px-6 py-4">{dateFormater(customer.tanggalTransaksi)}</td>
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

const ManagerDashboard = () => {
  const [filteredHasPaidData, setFilteredHasPaidData] = useState([]);
  const [user, setUser] = useState(null);
  const { mutateAsync: updateCustomer } = useUpdateCustomer();
  const { data, isLoading, isError } = useGetAllCustomer();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const handleSignOut = async () => {
    try {
      await account.deleteSession("current");

      setUser(null);

      sessionStorage.clear();

      navigate("/manager/sign-in");
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

  const filterDataByDate = (data) => {
    if (!startDate || !endDate) return data;

    return data.filter((doc) => {
      const transactionDate = new Date(doc.tanggalTransaksi);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const columns = [
      { title: "Name", dataKey: "name" },
      { title: "Transaction Time", dataKey: "tanggalTransaksi" },
      { title: "Email", dataKey: "email" },
      { title: "Phone Number", dataKey: "phoneNumber" },
      { title: "Address", dataKey: "address" },
      { title: "Shipping Options", dataKey: "shippingOption" },
      { title: "Total Amount", dataKey: "totalAmount" },
    ];

    // Filter data based on selected start and end dates
    const filteredDataForPDF = filterDataByDate(filteredHasPaidData);

    // Check if there are any records to display
    if (filteredDataForPDF.length === 0) {
      alert("No data available for the selected date range.");
      return;
    }

    const rows = filteredDataForPDF.map((customer) => ({
      name: customer.name,
      tanggalTransaksi: dateFormater(customer.tanggalTransaksi),
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      shippingOption: customer.shippingOption,
      totalAmount: customer.totalAmount, // Assuming totalAmount is available in customer data
    }));

    doc.autoTable({
      head: [columns.map((col) => col.title)],
      body: rows.map((row) => columns.map((col) => row[col.dataKey])),
      startY: 20,
      theme: "grid",
    });

    doc.save("customers_report.pdf");
  };

  // Guard clause - if no user is logged in, show nothing
  if (!user) {
    return null;
  }

  const filteredData = filterDataByDate(filteredHasPaidData);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center my-10">
        <h2 className="text-4xl font-bold">Manager Dashboard</h2>
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

      <div className="flex mb-4 items-center justify-end">
        <span className="mr-4">Start Date:</span>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            if (endDate && date > endDate) {
              setEndDate(null); // Reset end date if start date is after end date
            }
          }}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy/MM/dd"
          placeholderText="Select start date"
        />
        <span className="mr-4 ml-4">End Date:</span>
        <DatePicker
          selected={endDate}
          onChange={(date) => {
            if (startDate && date < startDate) {
              return; // Prevent selecting an end date before the start date
            }
            setEndDate(date);
          }}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy/MM/dd"
          placeholderText="Select end date"
          disabled={!startDate} // Disable end date picker if start date is not selected
        />
        <button
          onClick={generatePDF}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors ml-4"
        >
          Export to PDF
        </button>
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
              currentItems.map((customer) => (
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
          currentItems.map((customer) => (
            <CustomerCard key={customer.$id} customer={customer} />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <label htmlFor="itemsPerPage" className="mr-2">
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when items per page changes
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Previous
          </button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
