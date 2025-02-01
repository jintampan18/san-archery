import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { FiUser, FiPhone } from "react-icons/fi";
import { MdOutlineMail } from "react-icons/md";
import { TbMessageCircle } from "react-icons/tb";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"

const formSchema = z.object({
    username: z.string().min(2).max(50),
    email: z.string().email(),
    phoneNumber: z.string()
        .min(10, "Nomor harus minimal 10 digit")
        .max(15, "Nomor tidak boleh lebih dari 15 digit")
        .regex(/^[0-9]+$/, "Nomor hanya boleh berisi angka"), // ✅ Validasi angka saja
    pesan: z.string().min(5).max(500),
});


export function FormContact() {
    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            phoneNumber: "",
            pesan: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values) {
        const { username, email, phoneNumber, pesan } = values;
    
        // Format nomor telepon (gantilah dengan nomor WhatsApp tujuan)
        const whatsappNumber = "628123456789"; // Ganti dengan nomor WA yang valid tanpa "+" dan "0" di awal
    
        // Encode pesan agar sesuai dengan format URL
        const message = `Halo, saya ${username}. Email: ${email}. Nomor HP: ${phoneNumber}. Pesan: ${pesan}`;
        const encodedMessage = encodeURIComponent(message);
    
        // Buat URL WhatsApp
        const whatsappURL = `https://wa.me/${6285814070430}?text=${encodedMessage}`;
    
        // Redirect ke WhatsApp
        window.open(whatsappURL, "_blank");

        form.reset({
            username: "",
            email: "",
            phoneNumber: "",
            pesan: "",
        });
    }
    

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex items-center border bg-black border-gray-300 rounded p-2">
                                    <FiUser className="mx-2 text-white" size={40} />
                                    <Input
                                        className="bg-black text-white  no-focus-border rounded-none h-12 md:h-24 text-lg md:text-4xl border-none focus:outline-none focus:border-none"
                                        placeholder="Nama"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex items-center border bg-black border-gray-300 rounded p-2">
                                    <MdOutlineMail className="mx-2 text-white" size={40} />
                                    <Input
                                        className="bg-black text-white no-focus-border rounded-none h-12 md:h-24 text-lg md:text-4xl border-none focus:outline-none focus:border-none"
                                        placeholder="Email"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex items-center border bg-black border-gray-300 rounded p-2">
                                    <FiPhone className="mx-2 text-white" size={40} />
                                    <Input
                                        className="bg-black text-white rounded-none no-focus-border h-12 md:h-24 text-lg md:text-4xl border-none focus:outline-none focus:border-none"
                                        placeholder="Phone Number"
                                        {...field}
                                        type="text"
                                        inputMode="numeric" // ✅ Optimalkan keyboard di mobile
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/\D/g, ""); // ✅ Hapus non-angka
                                        }}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pesan"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex items-center border bg-black border-gray-300 rounded p-2">
                                    <TbMessageCircle className="mx-2 text-white" size={40} />
                                    <Textarea
                                        className="bg-black text-white rounded-none h-24 md:h-44 text-lg md:text-4xl focus:outline-none no-focus-border border-none focus py-4 md:py-14"
                                        placeholder="Pesan" {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-center">
                    <Button type="submit" className="w-full md:w-80 bg-[#666666] rounded-none text-lg md:text-4xl p-4 md:p-9">Kirim Pesan</Button>
                </div>
            </form>
        </Form>
    )
}