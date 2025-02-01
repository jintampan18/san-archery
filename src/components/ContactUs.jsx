import React from 'react'
import { Button } from './ui/button'
import { FormContact } from './forms/FormContact'

const ContactUs = () => {
    return (
        <div id='contact' className='w-full flex flex-col items-center my-10 md:my-20'>
            <h2 className='font-bold text-[#bf8347] text-3xl lg:text-5xl my-10'>
                Contact
                <span className='ml-2 text-white'>
                    Us
                </span>
            </h2>

            <div className='w-full max-w-6xl h-auto bg-slate-600 flex flex-col lg:flex-row'>
                <div className='w-full lg:w-1/2 h-64 lg:h-auto'>
                    <a 
                        href="https://www.google.com/maps?q=-6.3613945,106.7218594" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.252213242077!2d106.7218594!3d-6.3613945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69e58af59cefbf%3A0xd06cc9017954e535!2sSAN-archery!5e0!3m2!1sid!2sid!4v1716223855684!5m2!1sid!2sid"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                        ></iframe>
                </a>
                </div>
                <div className='w-full lg:w-1/2 bg-[#212121]'>
                    <div className='p-7'>
                        <h2 className='text-2xl text-white font-bold my-10 text-center'>
                            Masukan data diri anda untuk mengirim pesan
                        </h2>
                        <FormContact />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactUs