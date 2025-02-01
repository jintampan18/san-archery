import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import { useCreateComment } from "@/appwrite/queriesAndMutation"

const formSchema = z.object({
    name: z.string().min(2).max(50),
    caption: z.string()
})

export function FormComment({ comment }) {
    const { mutateAsync: createComment } = useCreateComment()


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            caption: "",
        },
    })


    async function onSubmit(values) {
        const newComment = await createComment(values)
        if (!newComment) {
            toast({
                message: "Failed to create comment"
            })
        }
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xl">Comment as :</FormLabel>
                            <FormControl>
                                <Input
                                    className=" w-[50%] lg:w-[10%] rounded-none text-[18px] custom-input no-focus-border"
                                    placeholder="Name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea className="custom-textarea rounded-none text-[18px]" placeholder="Enter Comment" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex">
                    <Button type="submit">Publish</Button>
                </div>
            </form>
        </Form>
    )
}