import {
  useDeleteProduct,
  useGetAllProductsAdmin,
} from "@/appwrite/queriesAndMutation";
import rupiah from "@/utils/rupiahFormater";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../ui/Loader";
import { account } from "../../appwrite/config";

const ProductAdmin = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useGetAllProductsAdmin();
  const { mutate: deleteProduct } = useDeleteProduct();
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [localProducts, setLocalProducts] = useState([]);
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
        navigate("/sign-in");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      navigate("/sign-in");
    }
  };

  useEffect(() => {
    if (products) {
      setLocalProducts(products.documents);
    }
  }, [products]);

  if (!user) {
    return null;
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (isError) return <div>Error: {error.message}</div>;

  const handleDelete = async (productId) => {
    setLoadingDeleteId(productId);
    deleteProduct(productId, {
      onSuccess: () => {
        setLocalProducts(
          localProducts.filter((product) => product.$id !== productId)
        );
        setLoadingDeleteId(null);
      },
      onError: () => {
        setLoadingDeleteId(null);
      },
    });
  };

  const handleAddProduct = () => {
    setLoadingAdd(true);
    setTimeout(() => {
      setLoadingAdd(false);
      window.location.href = "/admin/product/tambah";
    }, 1000);
  };

  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold my-10">Product</h2>
      <div className="flex justify-center md:justify-end mb-4">
        {loadingAdd ? (
          <Loader />
        ) : (
          <button
            onClick={handleAddProduct}
            className="bg-blue-500 text-white px-3 py-2 rounded-md"
          >
            Tambahkan Product
          </button>
        )}
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 hidden md:table">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Image
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {localProducts.map((list) => (
              <tr key={list.$id}>
                <td className="px-6 py-4">
                  <img
                    src={list.imageUrl}
                    alt={list.name}
                    className="w-20 h-20"
                  />
                </td>
                <td className="px-6 py-4">{list.name}</td>
                <td className="px-6 py-4">{list.description}</td>
                <td className="px-6 py-4">{rupiah(list.price)}</td>
                <td className="px-6 py-4">{list.status}</td>
                <td className="px-6 py-4 flex flex-col md:flex-row">
                  <Link
                    to={`/admin/product/${list.$id}/edit`}
                    className="bg-blue-500 text-white px-3 py-2 rounded-md mr-3 mb-2 md:mb-0"
                  >
                    Edit
                  </Link>
                  <div className="relative">
                    {loadingDeleteId === list.$id ? (
                      <div className="flex justify-center items-center h-full">
                        <Loader />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDelete(list.$id)}
                        className="bg-red-500 text-white px-3 py-2 rounded-md"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {localProducts.map((list) => (
            <div key={list.$id} className="bg-white p-4 rounded-lg shadow-md">
              <img
                src={list.imageUrl}
                alt={list.name}
                className="w-full h-40 object-cover mb-4"
              />
              <h3 className="text-lg font-bold mb-2">{list.name}</h3>
              <p className="text-gray-700 mb-4">{list.description}</p>
              <p className="text-gray-700 mb-4">{rupiah(list.price)}</p>
              <div className="flex flex-col">
                <Link
                  to={`/admin/product/${list.$id}/edit`}
                  className="bg-blue-500 text-center text-white px-3 py-2 rounded-md mb-2"
                >
                  Edit
                </Link>
                <div className="relative">
                  {loadingDeleteId === list.$id ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader />
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDelete(list.$id)}
                      className="bg-red-500 w-full text-white px-3 py-2 rounded-md"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductAdmin;
