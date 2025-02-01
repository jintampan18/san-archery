import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProduct } from '../forms/AddProduct';
import { useAuth } from '../../context/AuthContext';

const TambahProduct = () => {
    const { isLoggedIn, email } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("userEmail");
        if (!storedEmail) {
            navigate('/sign-in'); // Arahkan ke halaman login jika tidak ada session
        }
    }, [navigate]);

    return (
        <div>
            {isLoggedIn && email ? (
                <FormProduct action="Create" />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default TambahProduct;