import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Layout from './pages/Layout/Layout'
import Home from './pages/Home/Home'
import Products from './pages/Products/Products'
import Categories from './pages/Categories/Categories'
import Brands from './pages/Brands/Brands'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import Cart from './pages/Cart/Cart'
import Orders from './pages/Orders/Orders'
import { Toaster } from 'react-hot-toast'
import ForgotPwd from './pages/ForgotPwd'
import ProtectedRoutes from './pages/ProtectedRoutes/ProtectedRoutes'
import AuthContextProvider from './Context/AuthContext'
import LoginProtected from './pages/ProtectedRoutes/LoginProtected'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import SubCategories from './pages/SubCategories/SubCategories'
import BrandProducts from './pages/BrandProducts/BrandProducts'
import ProductDetails from './pages/ProductDetails/ProductDetails'

function App() {

  let routes = createBrowserRouter([
    {
      path:'/',element:<Layout/>,children:[
        {index:true,element:<ProtectedRoutes><Home/></ProtectedRoutes>},
        {path:'/products',element:<ProtectedRoutes><Products/></ProtectedRoutes>},
        {path:'/categories',element:<ProtectedRoutes><Categories/></ProtectedRoutes>},
        {path:'/brands',element:<ProtectedRoutes><Brands/></ProtectedRoutes>},
        {path:'/allorders',element:<ProtectedRoutes><Orders/></ProtectedRoutes>},
        {path:'/cart',element:<ProtectedRoutes><Cart/></ProtectedRoutes>},
        {path:'/auth/login',element:<LoginProtected><Login/></LoginProtected>},
        {path:'/auth/register',element:<LoginProtected><SignUp/></LoginProtected>},
        {path:'/auth/forgotPassword',element:<ForgotPwd/>},
        {path:'/subcategories/:id',element:<ProtectedRoutes><SubCategories/></ProtectedRoutes>},
        {path:'/brand/:id',element:<ProtectedRoutes><BrandProducts/></ProtectedRoutes>},
        {path:'/product/:id',element:<ProtectedRoutes><ProductDetails/></ProtectedRoutes>}
      ]
    }
  ])

  return (
    <>

      <AuthContextProvider>
        <RouterProvider router={routes}/>
      <Toaster toastOptions={{
        position:'top-right',
        style: {
          fontFamily: "Winky Rough",
          marginTop:'50px',
          padding: '20px 20px',
          minWidth: '100px',
          fontSize: '20px'
        }
      }}/>
      </AuthContextProvider>
      
    </>
  )
}

export default App
