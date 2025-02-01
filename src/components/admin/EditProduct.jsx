import React, { useEffect } from 'react'
import { FormProduct } from '../forms/AddProduct'
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductById } from '@/appwrite/queriesAndMutation';
import { useAuth } from '@/context/AuthContext';

const EditProduct = () => {
    const { id } = useParams();
    const { data: product, isPending, error } = useGetProductById(id || '');



    if (isPending) return <div className='flex justify-center items-center h-screen'>Loading...</div>;
    if (error) return <div className='flex justify-center items-center h-screen'>Error: {error.message}</div>;

    return (
        <div>
            {product ? (
                <FormProduct action="Update" product={product} />
            ) : (
                <div className='flex justify-center items-center h-screen'>Product not found</div>
            )}
        </div>
    )
}

export default EditProduct