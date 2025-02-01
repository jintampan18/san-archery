import React from 'react'
import { useGetAllPackage } from '../appwrite/queriesAndMutation';
import Loader from './ui/Loader';
import formatToIDR from '@/utils/idrFormater';

const ProductPackage = () => {
    const { data, isPending } = useGetAllPackage()

    const url = "https://cloud.appwrite.io/v1/storage/buckets/668e772f002a1bd7095d/files/668e7757000a1bf76777/view?project=668e68b20025521cefb1&mode=admin"

    const firstHalf = data ? data.documents.slice(0, 4) : [];
    const secondHalf = data ? data.documents.slice(4) : [];

    if (isPending || !data) {
        return <Loader />
    }

    return (
        <div className='w-full text-white flex flex-col items-center my-10'>
            <div className='w-11/12 md:w-3/4 lg:w-2/3 my-8 md:my-10 text-center'>
                <h2 className='font-bold text-[#bf8347] text-3xl lg:text-5xl'>
                    Key
                    <span className='ml-2 text-white'>
                        Word Products
                    </span>
                </h2>
                <p className="text-white text-sm mt-4 md:mt-10">
                    Bow, Recurve, Arrow, Quiver, Finger Tab, Compound, Chest Guard, Arm Guard, Vanes, Point.
                </p>
            </div>
            <div className="flex flex-wrap justify-center w-full px-4 md:px-0">
                {firstHalf.map((pack, index) => (
                    <div key={index} className="product-card p-4 m-2 rounded-lg flex flex-col items-center justify-center bg-black">
                        <img src={url} alt={pack.name} className="w-16 h-16 lg:w-72 lg:h-72 rounded-full mb-4" />
                        <h2 className="text-lg font-bold">{pack.name}</h2>
                        <p className="text-sm">{formatToIDR(pack.price)}</p>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap justify-center w-full px-4 md:px-0 mt-8">
                {secondHalf.map((pack, index) => (
                    <div key={index} className="product-card p-4 m-2 rounded-lg flex flex-col items-center justify-center bg-black">
                        <img src={pack.imageUrl} alt={pack.name} className="w-16 h-16 lg:w-72 lg:h-72 rounded-full mb-4" />
                        <h2 className="text-lg font-bold">{pack.name}</h2>
                        <p className="text-sm">{formatToIDR(pack.price)}</p>
                    </div>
                ))}
            </div>


        </div>
    )
}

export default ProductPackage