import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IoSearchOutline, IoArrowUndoOutline } from "react-icons/io5";
import { FaStar, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Loading from '../../Components/Loading/Loading'
import sortImage from '../../assets/sortImage.png'
import { isCategoryAvailable } from '../Categories/Categories';
import { useNavigate } from 'react-router-dom';

export default function Products() {

  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  const itemsPerPage = 10;
  const numberOfPages =  Math.ceil(products.length / itemsPerPage);

  function handleNextPage(){
    setCurrentPage(prev => prev + 1)
    
  }

  function handlePrevPage(){
    setCurrentPage(prev => prev - 1)
  }

  function handlePage1(){
    setCurrentPage(1)
  }

  async function getAllProducts(){

    try {
      setLoading(true)
      let {data} = await axios.get('https://ecommerce.routemisr.com/api/v1/products')
      setProducts(data.data)
      
    } catch (err) {
      console.error('Error fetching products:', err)

    } finally{
      setLoading(false)
    }

  }

  const handleBackArr = () =>
    navigate(-1);

  useEffect(()=>{
    getAllProducts();
  },[])

  if (loading)
    return <Loading/>

  return (
    <div className='container mx-auto'>
      <div className='flex bg-light w-full rounded-b-3xl justify-center mx-auto '>
        <div>
          <button onClick={handleBackArr} className='flex-shrink-0 text-white mt-10 ml-5 self-start cursor-pointer size-[35px] rounded-full bg-focus flex justify-center items-center duration-300 hover:-translate-x-1 hover:scale-105'><FaArrowLeft/></button>
        </div>
        <div className='relative flex mx-auto justify-center bg-white w-full max-w-60 border border-gray-300 rounded-full mt-10 mb-3'>
          
          <input type="text" placeholder='Search' className='text-gray-400 text-sm w-full pl-3 focus:outline-green/25 rounded-full py-1.5'/>
          <div className='text-gray-400 absolute right-3 top-1.5'>
            {<IoSearchOutline />}
          </div>
        </div>
        
        <img className='size-8 cursor-pointer bg-light mr-5 mt-10' src={sortImage} alt="" />
      </div>
      <div className="container">
        
        <div className="row flex flex-wrap gap-5 justify-start ml-5 ">
          {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).sort((a,b)=> a.price - b.price).map((product)=>(
          <div key={product._id} className="col-md-3 border border-gray-100 shadow-lg rounded-md py-5">
            <div className="card" style={{ width: "18rem" }}>
              <img src={product.imageCover} alt={product.title} />
              <div className="card-body p-5">
                <span className='badge text-bg-primary text-focus font-semibold hover:text-orange-500 transition-all duration-200 cursor-pointer'>{product.title.split(" ").length > 4 ? product.title.split(" ").slice(0, 4).join(" ") + "..." : product.title}</span>
                <h5 className="card-title mt-1 text-green font-bold">{product.category.name}</h5>
                <p className="card-text text-sm text-gray-500 mt-1">{product.brand.name}
                  <span className='ml-2 text-gray-500'>|</span>
                  <span className='ml-2 font-semibold text-green-500'>{isCategoryAvailable ? "Available" : "Sold Out"}</span>
                </p>
                          
              </div>
          <div className='flex justify-between mt-2'>
            <p className="flex items-center text-focus font-semibold ml-5">EGP {product.price}</p>
              <div className='rating flex gap-2 items-center mr-5'>
                <span className='text-star size-4'><FaStar /></span>
                <span className='text-green font-normal'>{product.ratingsAverage}</span>
              </div>
          </div>
        </div>
      </div>
      ))}
      </div>

      
      <div className='relative flex justify-center mt-15'>
        <div className='flex items-center gap-4'>
        {currentPage > 2 && currentPage <= numberOfPages && (
          <div className='text-focus flex cursor-pointer' onClick={handlePage1}>
            <IoArrowUndoOutline className='cursor-pointer mr-2 mt-1'/>
            <button className='cursor-pointer'>Go to Page 1</button>
          </div>
          )}

          {currentPage > 1 && (
            <button className='border border-focus text-focus px-4 py-2.5 rounded hover:bg-focus hover:text-white transition-all duration-300' onClick={handlePrevPage}>
              <FaArrowLeft />
            </button>

          )}

          {currentPage < numberOfPages && (
            <button className='bg-focus text-white px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-green-600 transition-all duration-300' onClick={handleNextPage}>
              Next Page 
              <FaArrowRight />
            </button>

          )}
          <p className='text-sm text-green-700'>Page {currentPage} of {numberOfPages}</p>
        </div>
      </div>
        
      </div>
      
    </div>
  )
}
