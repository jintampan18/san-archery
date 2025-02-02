import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormProduct } from "../forms/AddProduct";
import { account } from "@/appwrite/config";

const TambahProduct = () => {
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
        navigate("/admin/sign-in");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      navigate("/admin/sign-in");
    }
  };

  // Guard clause - if no user is logged in, show nothing
  if (!user) {
    return null;
  }

  return (
    <div>{user ? <FormProduct action="Create" /> : <p>Loading...</p>}</div>
  );
};

export default TambahProduct;
