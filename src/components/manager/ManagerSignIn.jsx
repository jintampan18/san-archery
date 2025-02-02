import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwrite/config";
import { ManagerSignInForm } from "./components/ManagerSignInForm";

const ManagerSignIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if there's an active session
      const session = await account.getSession("current");
      if (session) {
        // If session exists, redirect to dashboard
        navigate("/manager/dashboard");
      }
    } catch (error) {
      // If error or no session, stay on sign in page
      console.log("No active session");
    }
  };

  return (
    <div>
      <ManagerSignInForm />
    </div>
  );
};

export default ManagerSignIn;
