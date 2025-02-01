import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignInForm } from "../forms/SignInForm";
import { account } from "../../appwrite/config";

const SignIn = () => {
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
        navigate("/admin/dashboard");
      }
    } catch (error) {
      // If error or no session, stay on sign in page
      console.log("No active session");
    }
  };

  return (
    <div>
      <SignInForm />
    </div>
  );
};

export default SignIn;
