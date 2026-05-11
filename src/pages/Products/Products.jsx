import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IoSearchOutline, IoArrowUndoOutline } from "react-icons/io5";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Loading from '../../Components/Loading/Loading'
import sortImage from '../../assets/sortImage.png'
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../Components/ProductCard/ProductCard';

export default function Products() {

  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('price')
  const [sortDirection, setSortDirection] = useState('asc')
  const navigate = useNavigate()
  const itemsPerPage = 10;

  function getSortValue(product) {
    const sortValues = {
      price: product.price,
      category: product.category.name,
      brand: product.brand.name,
      rating: product.ratingsAverage,
      title: product.title,
    }

    return sortValues[sortBy]
  }

  const filteredProducts = products
    .filter((product) => {
      const term = searchTerm.trim().toLowerCase()
      return (
        product.title.toLowerCase().includes(term) ||
        product.category.name.toLowerCase().includes(term) ||
        product.brand.name.toLowerCase().includes(term)
      )
    })
    .sort((a,b)=> {
      const firstValue = getSortValue(a)
      const secondValue = getSortValue(b)

      if (typeof firstValue === 'number' && typeof secondValue === 'number') {
        return sortDirection === 'asc' ? firstValue - secondValue : secondValue - firstValue
      }

      const result = String(firstValue).localeCompare(String(secondValue))
      return sortDirection === 'asc' ? result : -result
    })
  const numberOfPages =  Math.ceil(filteredProducts.length / itemsPerPage);

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
      <div className='flex bg-light w-full rounded-b-3xl items-start justify-between gap-4 px-6 mx-auto'>
        <div className='pt-10'>
          <button onClick={handleBackArr} className='flex-shrink-0 text-white cursor-pointer size-[35px] rounded-full bg-focus flex justify-center items-center duration-300 hover:-translate-x-1 hover:scale-105'><FaArrowLeft/></button>
        </div>
        <div className='flex flex-wrap items-center justify-center gap-3 mt-10 mb-3'>
          <div className='relative flex justify-center bg-white w-full min-w-60 border border-gray-300 rounded-full'>
            <input
              type="text"
              placeholder='Search'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className='text-gray-400 text-sm w-full pl-3 pr-9 focus:outline-green/25 rounded-full py-1.5'
            />
            <div className='text-gray-400 absolute right-3 top-1.5'>
              {<IoSearchOutline />}
            </div>
          </div>
          <div className='flex items-center gap-2 bg-white border border-gray-300 rounded-full px-3 py-1.5'>
            <img className='size-5' src={sortImage} alt="Sort" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setCurrentPage(1)
              }}
              className='bg-transparent text-sm text-green font-semibold focus:outline-none cursor-pointer'
              aria-label='Sort products by'
            >
              <option value='price'>Price</option>
              <option value='category'>Category</option>
              <option value='brand'>Brand</option>
              <option value='rating'>Rating</option>
              <option value='title'>Name</option>
            </select>
            <select
              value={sortDirection}
              onChange={(e) => {
                setSortDirection(e.target.value)
                setCurrentPage(1)
              }}
              className='bg-transparent text-sm text-green font-semibold focus:outline-none cursor-pointer'
              aria-label='Sort direction'
            >
              <option value='asc'>Asc</option>
              <option value='desc'>Desc</option>
            </select>
          </div>
        </div>
        <div className='w-[35px] pt-10'></div>
      </div>
      <div className="container mx-auto px-4">
        
        <div className="row flex flex-wrap gap-5 justify-center mt-5">
          {filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product)=>(
          <ProductCard key={product._id} product={product} />
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
