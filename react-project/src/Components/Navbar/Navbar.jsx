import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaCartShopping } from "react-icons/fa6";
import { authContext } from '../../Context/AuthContext';
import { FaOpencart } from "@react-icons/all-files/fa/FaOpencart";
import { FaLinkedinIn } from "@react-icons/all-files/fa/FaLinkedinIn";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

export default function Navbar() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = ()=>{
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  let {token,setToken} = useContext(authContext)


  const logout = ()=>{
    localStorage.removeItem('token')
    setToken(null)
  }


  return (
    <div className='bg-light py-3'>
        <div className="container flex mx-auto items-center">
          <FaOpencart className='text-focus size-9 mx-5'/>
            <h1 className='font-primary text-3xl text-green font-bold'>FreshCart</h1>
            {token ? (
              <ul className='flex gap-5 text-green mx-auto'>
                <li className="hover:text-green-400 transition-all duration-300 ">
                <NavLink className='focus:text-focus focus:font-extrabold' to="/">Home</NavLink>
                </li>
                  
                <li className="hover:text-green-400 transition-all duration-300">
                  <NavLink className='focus:text-focus focus:font-extrabold' to='/products'>
                  Products
                </NavLink>
                </li>
                <li className="hover:text-green-400 transition-all duration-300">
                  <NavLink className='focus:text-focus focus:font-extrabold' to='/categories'>
                  Categories
                </NavLink>
                </li>
                <li className="hover:text-green-400 transition-all duration-300">
                  <NavLink className='focus:text-focus focus:font-extrabold' to='/brands'>
                  Brands
                </NavLink>
                </li>
                <li className="hover:text-green-400 transition-all duration-300">
                  <NavLink className='focus:text-focus focus:font-extrabold' to='/allorders'>
                  Orders
                </NavLink>
                </li>
            </ul>
            ) : null }
            <ul className='gap-5 flex text-green mx-auto'>
              

              <div className='flex items-center gap-3'>
              
                {token ? (
                  <>
                  <li>
                    <FaRegHeart className='size-5 hover:text-focus shake-on-hover cursor-pointer'/>
                  </li>
                  <li>
                    <FaCartShopping className='text-green size-6 hover:text-green-900 duration-150 cursor-pointer'/>
                  </li>
                  
                  </>
                
              ) : null}
                <FaFacebook className='text-facebook hover:-translate-y-1 transition-transform duration-200 cursor-pointer'/>
                <FaInstagram className='text-instagram hover:-translate-y-1 transition-transform duration-200 cursor-pointer'/>
                <FaXTwitter className=' hover:-translate-y-1 transition-transform duration-200 cursor-pointer'/>

                <FaLinkedinIn className='bg-linkedin text-white text-sm pt-1 size-4 hover:-translate-y-1 transition-transform duration-200 cursor-pointer'/>
              </div>

                {!token ? (
                  <>
                  <li>
                  <NavLink className='focus:text-focus focus:font-extrabold' to='/auth/login'>
                  Login
                </NavLink>
                </li>
                <li>
                  <NavLink className='focus:text-focus focus:font-extrabold' to='/auth/register'>
                  Sign Up
                </NavLink>
                </li>
                  </>
                ) : <li className='text-lg cursor-pointer' onClick={logout}>
                  <span className='focus:text-focus focus:font-extrabold'>
                  Logout
                </span>
                </li>}

            </ul>

            <div className='btn lg:hidden' onClick={toggleMobileMenu}>

            </div>
        </div>
    </div>
  )
}
