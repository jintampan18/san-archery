import React, { useContext, useState } from 'react'
import NavBar from '../components/NavBar'
import Header from '../components/Header'
import AboutUs from '../components/AboutUs'
import ProductPackage from '../components/ProductPackage'
import BuyProduct from '../components/BuyProduct'
import ContactUs from '../components/ContactUs'
import Comment from '@/components/Comment'

const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
};

const LandingPage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    return (
        <div className='w-[439px] md:w-full'>
            <div className='fixed top-0 z-50 w-full'>
                <NavBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
            </div>
            <div className='absolute bg-black top-[99%] md:top-[926px] lg:top-[900px] md:w-full z-30'>
                <AboutUs />
                <ProductPackage />
                <BuyProduct searchTerm={searchTerm} />
                <ContactUs />
                <Comment />
            </div>
            <div className='animate fixed left-14 top-[40%] w-[290px] md:top-[45%] md:left-32 md:w-[380px] lg:w-[780px] z-20 drop-shadow-lg'>
                <div className='flex gap-3 w-full font-bold text-xl md:text-5xl lg:text-[7em] md:flex-col md:gap-5'>
                    <h2 className='text-white flex'>PASSION FOR</h2>
                    <h2 className='text-[#bf8347]'>PERFORMANCE</h2>
                </div>
                <p className='lg:text-3xl text-white'>
                    Our products are designed to help archers achieve their goals and elevate their performance.
                </p>
                <button className='w-28 h-10 lg:w-40 lg:h-14 mt-5 bg-[#bf8347] hover:bg-[#ab6826] text-white rounded-lg' onClick={() => scrollToSection('products')}>shop now</button>
            </div>
            <Header />
            <div className='relative w-full h-24 bg-black opacity-50 inset-0 blur-md -top-24 z-40 '></div>
        </div>
    )
}

export default LandingPage