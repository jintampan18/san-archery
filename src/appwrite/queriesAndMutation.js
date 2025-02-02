import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { createComment, createProduct, deleteProduct, findUser, getAllComments, getAllCustomer, getAllPackage, getAllProducts, getAllProductsAdmin, getOrderByCustomerId, getProductById, updateOrder, updateProduct, updateCustomerNoResi, updateProductStatus, updateCustomer } from "./api";

export const useGetAllPackage = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_PACKAGE],
        queryFn: getAllPackage
    });
};

export const useGetAllProducts = () => {
    console.log("haloo");
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_PRODUCTS],
        queryFn: getAllProducts
    });
};

export const useGetAllComments = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_COMMENTS],
        queryFn: getAllComments
    });
};

export const useCreateComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (comment) => createComment(comment),
        onSuccess: () => {
            queryClient.invalidateQueries([QUERY_KEYS.GET_ALL_COMMENTS]);
        }
    });
};


export const useGetAllCustomer = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_CUSTOMER],
        queryFn: getAllCustomer
    });
};

export const useGetOrderById = (id) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ORDER_BY_ID, id],
        queryFn: () => getOrderByCustomerId(id),
        enabled: !!id,
    });
};

export const useGetAllProductsAdmin = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_PRODUCTS],
        queryFn: getAllProductsAdmin
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product) => createProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries([QUERY_KEYS.GET_ALL_PRODUCTS]);
        }
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product) => updateProduct(product),
        onSuccess: (data) => {
            queryClient.invalidateQueries([QUERY_KEYS.GET_PRODUCT_BY_ID, data.$id]);
        }
    });
};

export const useUpdateCustomerNoResi = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (customer) => updateCustomerNoResi(customer),
        onSuccess: (data) => {
            queryClient.invalidateQueries([QUERY_KEYS.GET_CUSTOMER_BY_ID, data.$id]);
        }
    });
};

export const useUpdateProductStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product) => updateProductStatus(product),
        onSuccess: (data) => {
            queryClient.invalidateQueries([QUERY_KEYS.GET_PRODUCT_BY_ID, data.$id]);
        }
    });
};

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (customer) => updateCustomer(customer),
        // onSuccess: (data) => {
        //     queryClient.invalidateQueries([QUERY_KEYS.GET_C, data.$id]);
        // }
    });
};

export const useGetProductById = (id) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PRODUCT_BY_ID, id],
        queryFn: () => getProductById(id),
        enabled: !!id,
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId) => deleteProduct(productId),
        onSuccess: () => {
            queryClient.invalidateQueries([QUERY_KEYS.GET_ALL_PRODUCTS]);
        }
    });
};

export const useFindUserByEmail = (email) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_EMAIL, email],
        queryFn: () => findUser(email),
        enabled: !!email,
    });
};

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, status }) => updateOrder(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries([QUERY_KEYS.GET_ALL_ORDERS]);
        }
    });
};