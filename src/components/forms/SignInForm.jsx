import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { account } from "../../appwrite/config";

// Define the validation schema using zod
const formSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password harus memiliki setidaknya 8 karakter"),
});

export function SignInForm() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setError("");
      setIsLoading(true);

      // Create email session using the imported account instance
      const session = await account.createEmailPasswordSession(
        data.email,
        data.password
      );

      console.log("session", session);

      // Get user data after successful login
      const user = await account.get();

      // Store user data in session storage
      sessionStorage.setItem("userEmail", user.email);
      sessionStorage.setItem("userId", user.$id);
      sessionStorage.setItem("sessionId", session.$id);

      // Navigate to dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      // More specific error messages based on error types
      if (error.code === 401) {
        setError("Email atau password salah. Silakan coba lagi.");
      } else if (error.code === 429) {
        setError("Terlalu banyak percobaan. Silakan tunggu beberapa saat.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi nanti.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Sign In
        </h2>

        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="text-black dark:text-white border rounded-md h-12 md:h-14 text-lg md:text-xl p-3 w-full bg-gray-100 dark:bg-gray-700"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="text-black dark:text-white border rounded-md h-12 md:h-14 text-lg md:text-xl p-3 w-full bg-gray-100 dark:bg-gray-700"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full md:w-80 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-lg md:text-xl p-4 md:p-6"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
