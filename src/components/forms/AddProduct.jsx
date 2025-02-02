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
import {
  useCreateProduct,
  useUpdateProduct,
} from "@/appwrite/queriesAndMutation";
import { useNavigate } from "react-router-dom";
import FileUploader from "../shared/FileUploader.jsx";
import { toast } from "../ui/use-toast.js";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Nama harus memiliki setidaknya 2 karakter")
    .max(50, "Nama tidak boleh lebih dari 50 karakter"),
  description: z
    .string()
    .min(2, "Description harus memiliki setidaknya 2 karakter")
    .max(200, "Description tidak boleh lebih dari 200 karakter"),
  file: z.any(),
  price: z.preprocess(
    (val) => parseFloat(val),
    z
      .number()
      .min(0, "Harga tidak boleh kurang dari 0")
      .max(1000000000, "Harga tidak boleh lebih dari 1000000000")
  ),
  discountPrice: z.preprocess(
    (val) => (val === "" ? undefined : parseFloat(val)),
    z
      .number()
      .min(0, "Harga diskon tidak boleh kurang dari 0")
      .max(1000000000, "Harga diskon tidak boleh lebih dari 1000000000")
      .optional()
  ),
  stock: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().min(0, "Stok tidak boleh kurang dari 0")
  ), // Ubah stok menjadi angka
  weight: z.preprocess(
    (val) => parseInt(val, 10),
    z.number().min(1, "Berat harus lebih dari 0")
  ),
});

export function FormProduct({ product, action }) {
  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();

  const navigate = useNavigate();
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product ? product.name : "",
      description: product ? product.description : "",
      file: [],
      price: product ? product.price : "",
      discountPrice: product ? product.discountPrice : "",
      stock: product ? product.stock : "", // Pastikan default value untuk stock ada di sini
      weight: product ? product.weight : "",
      status: product ? product.status : "pending",
    },
  });

  const { errors } = form.formState;

  // 2. Define a submit handler.
  async function onSubmit(values) {
    console.log("Form submitted with values:", values); // Log nilai values
    try {
      if (product && action === "Update") {
        const updatedProduct = await updateProduct({
          ...values,
          productId: product?.$id,
          imageUrl: product?.imageUrl,
        });
        console.log("Updated product:", updatedProduct); // Log hasil update
        if (!updatedProduct) {
          toast({ title: "Please try again" });
        } else {
          navigate("/admin/product");
        }
      } else {
        const newProduct = await createProduct({
          ...values,
          stock: values.stock,
          weight: values.weight,
        });
        console.log("New product:", newProduct); // Log hasil create
        if (!newProduct) {
          toast({ title: "Please try again" });
        } else {
          navigate("/admin/product");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({ title: "An error occurred. Please try again." });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          console.log("Form is being submitted"); // Tambahkan log ini
          e.preventDefault(); // Tambahkan ini untuk mencegah pengiriman form default
          form.handleSubmit((data) => {
            console.log("Form data:", data); // Tambahkan log ini
            onSubmit(data);
          })(e);
        }}
        className="space-y-8 p-6 bg-white shadow-md rounded-lg"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Nama</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="text-black border rounded-md h-12 md:h-14 text-lg md:text-xl p-3"
                  {...field}
                />
              </FormControl>
              {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
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
                  {...field}
                />
              </FormControl>
              {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Add Photo</FormLabel>
              <FormControl>
                <div className="w-full h-64 md:h-80 border-dashed border-2 border-gray-300 rounded-md flex items-center justify-center">
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={product?.imageUrl}
                  />
                </div>
              </FormControl>
              {errors.file && <FormMessage>{errors.file.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Price</FormLabel>
              <FormControl>
                <div className="flex items-center border bg-gray-100 border-gray-300 rounded-md p-2">
                  <Input
                    type="number"
                    className="bg-gray-100 text-black rounded-md h-12 md:h-14 text-lg md:text-xl p-3 border-none focus:outline-none"
                    {...field}
                  />
                </div>
              </FormControl>
              {errors.price && (
                <FormMessage>{errors.price.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discountPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                Discount Price (Opsional)
              </FormLabel>
              <FormControl>
                <div className="flex items-center border bg-gray-100 border-gray-300 rounded-md p-2">
                  <Input
                    type="number"
                    name="discountPrice"
                    placeholder="Harga diskon"
                    className="bg-gray-100 text-black rounded-md h-12 md:h-14 text-lg md:text-xl p-3 border-none focus:outline-none"
                    {...field}
                  />
                </div>
              </FormControl>
              {errors.discountPrice && (
                <FormMessage>{errors.discountPrice.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Stok</FormLabel>
              <FormControl>
                <div className="flex items-center border bg-gray-100 border-gray-300 rounded-md p-2">
                  <Input
                    type="number"
                    name="stock"
                    placeholder="Jumlah stok"
                    required
                    min="0"
                    className="bg-gray-100 text-black rounded-md h-12 md:h-14 text-lg md:text-xl p-3 border-none focus:outline-none"
                    {...field}
                  />
                </div>
              </FormControl>
              {errors.stock && (
                <FormMessage>{errors.stock.message}</FormMessage>
              )}{" "}
              {/* // Perbaiki kesalahan di sini */}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                Berat (gram)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  name="weight"
                  min="1"
                  placeholder="Masukkan berat dalam gram"
                  className="bg-gray-100 text-black rounded-md h-12 md:h-14 text-lg md:text-xl p-3 border-none focus:outline-none"
                  {...field}
                />
              </FormControl>
              {errors.weight && (
                <FormMessage>{errors.weight.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full md:w-80 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-lg md:text-xl p-4 md:p-6"
          >
            Upload Product
          </Button>
        </div>
      </form>
    </Form>
  );
}
