import React, { useState, useEffect } from 'react'
import { getAllProducts, updateProductStock } from '../appwrite/api'; // Pastikan impor updateProductStock
import Loader from './ui/Loader'
import { MdOutlineViewInAr } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa6";
import rupiah from '@/utils/rupiahFormater';

const BuyProduct = ({ searchTerm, addToCart }) => {
    const [products, setProducts] = useState([]);
    const [isPending, setIsPending] = useState(true);
    const [orderedProduct, setOrderedProduct] = useState(() => {
        const saved = localStorage.getItem('orderedProduct');
        return saved ? JSON.parse(saved) : [];
    });
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsPending(true);
            const result = await getAllProducts(searchTerm);
            setProducts(result.documents);
            setIsPending(false);
        };

        fetchProducts();
    }, [searchTerm]);

    

    useEffect(() => {
        const handleStorageChange = () => {
            const cartList = JSON.parse(localStorage.getItem('orderedProduct')) || [];
            setOrderedProduct(cartList);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('orderedProductUpdated', handleStorageChange); // Tambahkan event listener ini
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('orderedProductUpdated', handleStorageChange); // Hapus event listener ini
        };
    }, []);

    const handleAddToCart = (product) => {
        if (product.stock <= 0) {
            Swal.fire({
                title: "Stock Habis",
                text: `Produk "${product.name}" sedang tidak tersedia.`,
                icon: "error",
            });
            return; // Exit the function if stock is 0
        }
    
        setOrderedProduct((prevOrderedProduct) => {
            const isProductInCart = prevOrderedProduct.some(item => item.imageUrl === product.imageUrl);
            if (isProductInCart) {
                return prevOrderedProduct; // If the product is already in the cart, do not add it again
            }
    
            const updatedOrderedProduct = [{ ...product, quantity: 1 }, ...prevOrderedProduct];
            localStorage.setItem('orderedProduct', JSON.stringify(updatedOrderedProduct));
            window.dispatchEvent(new CustomEvent('orderedProductUpdated'));
            return updatedOrderedProduct;
        });
    };

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
    }

    const closePopup = () => {
        setSelectedProduct(null);
    }

    if (isPending) {
        return <Loader />
    }

    return (
        <div id='products' className=' w-full p-5'>
            <h2 className=' font-bold text-3xl lg:text-5xl text-[#bf8347] text-center'>
                Buy
                <span className=' ml-2 text-white'>Products</span>
            </h2>

            <div className=' justify-center gap-8 w-full flex md:flex-row flex-row flex-wrap my-10'>
                {products.map((list, index) => (
                    <div key={index} className='border cursor-pointer hover:bg-zinc-700 w-[400px] md:w-[560px] p-4 flex justify-center'>
                        <div className='flex flex-col md:w-[600px] '>
                            <div className='flex flex-row mx-auto my-4'>
                                <div
                                    className={`w-20 h-20 border border-white p-[12px] rounded-full ${
                                        list.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                    }`}
                                    onClick={() => handleAddToCart(list)}
                                >
                                    <FaCartPlus
                                    size={57}
                                    className={`text-white ${list.stock <= 0 ? 'opacity-50' : 'hover:text-[#bf8347]'}`}
                                />
                                </div>
                                <div className='view w-20 h-20 border ml-4 border-white p-[12px] rounded-full' onClick={() => handleViewProduct(list)}>
                                    <MdOutlineViewInAr size={57} className='text-white hover:text-[#bf8347]' />
                                </div>
                            </div>
                            <div className='w-full flex flex-col items-center justify-center text-white'>
                                <img src={list.imageUrl} alt={list.name} className=' size-[400px] w-[450px]' />
                                <h2 className='font-bold text-5xl my-4'>{list.name}</h2>
                                <div className="flex flex-col items-center">
                                    {/* Harga diskon diberikan margin lebih besar untuk jarak yang lebih nyaman */}
                                    {list.discountPrice > 0 && (
                                        <p className='text-red-500 font-extrabold text-2xl mt-2'> {/* `mt-2` memberikan jarak lebih longgar */}
                                            <span className='line-through'>{rupiah(list.discountPrice)}</span>
                                        </p>
                                    )}
                                </div>
                                <p className='font-bold text-2xl'>{rupiah(list.price)}</p>
                                <p className='text-lg mb-4 mt-6'>Stok: {list.stock}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedProduct && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-8 rounded-lg w-[80%] max-w-[800px] h-[80%] max-h-[600px]'>
                        <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className='w-72 h-72 mb-4' />
                        <h2 className='text-5xl font-bold mb-4'>{selectedProduct.name}</h2>
                        <p className='text-xl font-bold mb-4'>{selectedProduct.description}</p>
                        <p className='text-lg mb-4'>{rupiah(selectedProduct.price)}</p>
                        <button className='absolute  md:right-[640px] md:top-[220px] right-[60px] top-[170px]  text-3xl' onClick={closePopup}>X</button>
                        <button className='bg-[#bf8347] text-white p-2 rounded' onClick={() => handleAddToCart(selectedProduct)}>Add to Cart</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BuyProduct