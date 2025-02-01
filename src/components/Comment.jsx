import React from 'react'
import { HiUserCircle } from "react-icons/hi2";
import { FormComment } from './forms/FormComments';
import { FaInstagram } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { useGetAllComments } from '@/appwrite/queriesAndMutation';

const Comment = () => {
    const { data, isPending } = useGetAllComments()
    console.log("comment", data);
    return (
        <>
            <div className='p-5'>
                <h2 className='font-bold text-3xl lg:text-5xl text-[#bf8347] text-center'>
                    Comment On
                    <span className='ml-2 text-white'> Our Products</span>
                </h2>

                <div className='w-full max-w-6xl h-auto flex flex-col mx-auto p-7'>
                    <h3 className='text-white text-2xl font-bold'>POST A COMMENT</h3>
                    <p className='text-white text-sm my-4 flex flex-row gap-4'>{data?.documents.length}
                        <span>
                            Comments
                        </span>
                    </p>
                    <p className='text-white text-xl'>We are happy to hear from you</p>
                    <div className=' w-full flex flex-col text-white my-10 mb-28'>
                        {data?.documents.map((com, index) => (
                            <div key={index} className='flex flex-row my-10'>
                                <HiUserCircle size={60} />
                                <div className='ml-4' >
                                    <h3 className='font-bold text-2xl'>{com.name}</h3>
                                    <p className='text-[18px] text-gray-400'>{com.caption}</p>
                                </div>
                            </div>

                        ))}
                    </div>
                    <div className='flex flex-col md:flex-row text-white w-full'>
                        <HiUserCircle size={60} />
                        <div className='ml-4 w-full'>
                            <FormComment />
                        </div>
                    </div>
                </div>
            </div>

            {/** Footer */}
            <div className='w-full bg-[#bf8347] p-8 md:p-16'>
                <div className='flex text-white flex-row justify-center gap-4'>
                    <FiPhoneCall className='hover:text-black text-3xl md:text-[40px]' />
                    <a href='https://www.instagram.com/muhmmadrif_/' >
                        <FaInstagram className='hover:text-black text-3xl md:text-[40px]' />
                    </a>
                </div>
                <footer className='text-white py-4'>
                    <div className='container mx-auto w-full text-center'>
                        <div className='flex flex-row w-full justify-center text-xs md:text-2xl gap-8'>
                            <a href='#' className='hover:text-black'>Home</a>
                            <a href='#' className='hover:text-black'>About Us</a>
                            <a href='#' className='hover:text-black'>Our Product</a>
                            <a href='#' className='hover:text-black'>Contact Us</a>
                        </div>
                        <p className=' mt-4 md:mt-7 text-xs md:text-xl'>Created by <span className='font-bold text-black'>Muhammad Arif</span> | © 2024.</p>
                    </div>
                </footer>
            </div>
        </>
    )
}

export default Comment