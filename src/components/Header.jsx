import React from 'react'
import headerImage from '../assets/img/header.jpg';

const Header = () => {
    return (
        <header id='home' className='relative w-full h-screen bg-cover bg-center' style={{ backgroundImage: `url(${headerImage})` }}>
        </header>
    )
}

export default Header