import React, { useState } from "react";
import { useUpdateCustomerNoResi } from "@/appwrite/queriesAndMutation";

const ModalNoResi = ({ isOpen, onClose, customer }) => {
  const { mutateAsync: updateCustomerNoResi } = useUpdateCustomerNoResi();

  const [noResi, setNoResi] = useState(customer.noResi || ""); // Pre-fill with existing noResi

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("No Resi:", noResi);
    onUpdateNoResi(noResi); // Call the function to handle the update
    onClose(); // Close the modal after submission
  };

  const onUpdateNoResi = async (noResi) => {
    const id = customer.$id;

    try {
      await updateCustomerNoResi({
        id,
        noResi,
      });
      console.log("No Resi updated successfully!");
    } catch (error) {
      console.error("Error updating No Resi:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg z-10 p-6">
        <h2 className="text-xl font-bold mb-4">{customer.name}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="noResi"
            maxLength={20}
            value={noResi}
            onChange={(e) => setNoResi(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Update No Resi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNoResi;
