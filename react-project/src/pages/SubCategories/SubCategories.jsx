import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../Components/Loading/Loading';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import { isCategoryAvailable } from '../Categories/Categories';
import notFound from '../../assets/notFound.png'

export default function SubCategories() {
    const [products, setProducts] = useState([])
    const [loading, setIsLoading] = useState(true)
    const { id } = useParams();
    const navigate = useNavigate()

    async function getSpecificCategory(){
      setIsLoading(true)
      try {
        const {data} = await axios.get(`https://ecommerce.routemisr.com/api/v1/products?category=${id}`)
        setProducts(data.data)

      } catch (error) {
      console.error('Error fetching products:', error);
        
      }finally{
        setIsLoading(false)
      }
    }

    useEffect(()=>{
      getSpecificCategory();
    },[id])


    const handleBackArr = () =>{
      navigate(-1)
    }

    if(loading)
      return <Loading/>

  return (
    <div className="container mx-auto">

    <div className='container'>
      <div>
        <button onClick={handleBackArr} className='flex-shrink-0 text-white mt-5 self-start cursor-pointer size-[35px] rounded-full bg-focus flex justify-center items-center duration-300 hover:-translate-x-1 hover:scale-105'><FaArrowLeft/></button>
      </div>
      {products.length === 0 && (
        <div className='flex justify-center items-center'>
          <img src={notFound}/>
        </div>
      )}
      <div className="row flex flex-wrap gap-5 justify-start ml-5 mt-5">

      {products.map((product)=>(
        <div key={product._id} className="col-md-3 border border-gray-100 shadow-lg rounded-md py-5">
          <div className="card" style={{ width: "18rem" }}>
            <img src={product.imageCover} alt={product.title} />
            <div className="card-body p-5">
              <span className='badge text-bg-primary text-focus font-semibold hover:text-orange-500 transition-all duration-200 cursor-pointer'>{product.title.split(" ").length > 4 ? product.title.split(" ").slice(0, 4).join(" ") + "..." : product.title}</span>
              <h5 className="card-title mt-1 text-green font-bold">{product.category.name}</h5>
              <p className="card-text text-sm text-gray-500 mt-1">{product.brand.name}
                <span className='ml-2 text-gray-500'>|</span>
                <span className='ml-2 font-semibold text-green-500'>{isCategoryAvailable ? "Available" : "SoldOut"}</span>
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
  </div>
</div>

  )
}
