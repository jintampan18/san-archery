import React from "react";
import { useParams } from "react-router-dom";
import {
  useGetProductById,
  useUpdateProductStatus,
} from "@/appwrite/queriesAndMutation";
import { ManagerFormProduct } from "./components/ManagerFormProduct";

const ManagerEditProduct = () => {
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductById(id || "");
  const { mutate: updateProductStatus } = useUpdateProductStatus();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error fetching product: {error.message}</p>
      </div>
    );
  }

  const handleUpdateStatus = async (status) => {
    // Call your update function here
    await updateProductStatus({ id, status });
  };

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product Status</h1>
      <ManagerFormProduct product={product} onSubmit={handleUpdateStatus} />
    </div>
  );
};

export default ManagerEditProduct;
