import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../Components/Loading/Loading';
import { FaArrowLeft } from 'react-icons/fa';
import notFound from '../../assets/notFound.png'
import ProductCard from '../../Components/ProductCard/ProductCard';

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

    <div className='container mx-auto px-4'>
      <div className='pt-5'>
        <button onClick={handleBackArr} className='flex-shrink-0 text-white self-start cursor-pointer size-[35px] rounded-full bg-focus flex justify-center items-center duration-300 hover:-translate-x-1 hover:scale-105'><FaArrowLeft/></button>
      </div>
      {products.length === 0 && (
        <div className='flex justify-center items-center'>
          <img src={notFound}/>
        </div>
      )}
      <div className="row flex flex-wrap gap-5 justify-center mt-5">

      {products.map((product)=>(
        <ProductCard key={product._id} product={product} />
      ))}
      
    </div>
  </div>
</div>

  )
}
