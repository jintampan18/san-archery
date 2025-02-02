import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const ManagerFormProduct = ({ product, onSubmit }) => {
  const [status, setStatus] = useState(product.status);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setStatus(e.target.value);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   onSubmit(status);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(status); // Call the onSubmit function passed as a prop
      navigate("/manager/product"); // Redirect to the product list after successful update
    } catch (error) {
      console.error("Error updating product status:", error);
      alert("Failed to update product status.");
    }
  };

  // 1. Define your form.
  const form = useForm({
    defaultValues: {
      name: product ? product.name : "",
      description: product ? product.description : "",
      price: product ? product.price : "",
      discountPrice: product ? product.discountPrice : "",
      stock: product ? product.stock : "", // Pastikan default value untuk stock ada di sini
      weight: product ? product.weight : "",
      status: product ? product.status : "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display Product Image */}
        {product.imageUrl && (
          <div className="flex mb-4 justify-center">
            <img
              src={product.imageUrl}
              alt={product.description}
              className="w-1/3 h-auto rounded-md"
            />
          </div>
        )}
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Nama</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="text-black border rounded-md h-12 md:h-14 text-lg md:text-xl p-3"
                  readOnly
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                Description
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="text-black border rounded-md h-12 md:h-14 text-lg md:text-xl p-3"
                  readOnly
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="text-black border rounded-md h-12 md:h-14 text-lg md:text-xl p-3"
                  readOnly
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="discountPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                Discount Price
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="text-black border rounded-md h-12 md:h-14 text-lg md:text-xl p-3"
                  readOnly
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="text-black border rounded-md h-12 md:h-14 text-lg md:text-xl p-3"
                  readOnly
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                Berat (gram)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="text-black border rounded-md h-12 md:h-14 text-lg md:text-xl p-3"
                  readOnly
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="status"
          render={() => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Status</FormLabel>
              <FormControl>
                <select
                  value={status}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md h-12 md:h-14 text-lg md:text-xl p-3"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white rounded-md p-2"
        >
          Update Status
        </button>
      </form>
    </Form>
  );
};
