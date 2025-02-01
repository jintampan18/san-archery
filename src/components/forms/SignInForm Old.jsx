import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useNavigate } from "react-router-dom";
import { useFindUserByEmail } from "@/appwrite/queriesAndMutation";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password harus memiliki setidaknya 8 karakter"),
});

export function SignInForm() {
  // 1. Define your form.
  const { isLoggedIn, setIsLoggedIn, setEmail } = useAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { errors } = form.formState;
  const navigate = useNavigate();
  const email = form.watch("email");
  const { data, isLoading, isError } = useFindUserByEmail(email);

  // 2. Define a submit handler.
  async function onSubmit(values) {
    if (isError) {
      console.error("Error finding user");
      return;
    }
    console.log(data);
    // Navigate to another page if needed
    setIsLoggedIn(true);
    setEmail(values.email); // Simpan email ke dalam AuthContext
    sessionStorage.setItem("userEmail", values.email); // Simpan email ke session storage
    navigate("/admin/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Sign In
        </h2>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              console.log("Form is being submitted");
              e.preventDefault();
              form.handleSubmit((data) => {
                console.log("Form data:", data);
                onSubmit(data);
              })(e);
            }}
            className="space-y-6"
          >
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
                      className="text-black dark:text-white border rounded-md h-12 md:h-14 text-lg md:text-xl p-3 w-full bg-gray-100 dark:bg-gray-700"
                      {...field}
                    />
                  </FormControl>
                  {errors.email && (
                    <FormMessage>{errors.email.message}</FormMessage>
                  )}
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
                      {...field}
                    />
                  </FormControl>
                  {errors.password && (
                    <FormMessage>{errors.password.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full md:w-80 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-lg md:text-xl p-4 md:p-6"
              >
                Sign In
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
