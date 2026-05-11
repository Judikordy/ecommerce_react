import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
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
  const [wishlistCount, setWishlistCount] = useState(0)

  const toggleMobileMenu = ()=>{
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  let {token,setToken} = useContext(authContext)

  async function getWishlistCount(){
    if(!token){
      setWishlistCount(0)
      return
    }

    try {
      const {data} = await axios.get('https://ecommerce.routemisr.com/api/v1/wishlist',{
        headers:{
          token
        }
      })
      setWishlistCount(data.count || data.data?.length || 0)
    } catch (error) {
      setWishlistCount(0)
    }
  }

  useEffect(()=>{
    getWishlistCount()

    window.addEventListener('focus', getWishlistCount)
    return ()=> window.removeEventListener('focus', getWishlistCount)
  },[token])


  const logout = ()=>{
    localStorage.removeItem('token')
    setWishlistCount(0)
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
                    <NavLink to='/wishlist' aria-label='Wishlist' onClick={getWishlistCount}>
                      {wishlistCount > 0 ? (
                        <FaHeart className='size-5 text-focus shake-on-hover cursor-pointer'/>
                      ) : (
                        <FaRegHeart className='size-5 text-focus hover:text-focus shake-on-hover cursor-pointer'/>
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/cart' aria-label='Cart'>
                      <FaCartShopping className='text-green size-6 hover:text-green-900 duration-150 cursor-pointer'/>
                    </NavLink>
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
