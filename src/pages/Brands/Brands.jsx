import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loading from '../../Components/Loading/Loading'
import { useNavigate, useParams } from 'react-router-dom'

export default function Brands() {


  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState([])
  const [count, setCount] = useState(30)
  const { id } = useParams();
  const navigate = useNavigate()

  function handleShowMore(){
    setCount(prev => prev + 10)
    
  }

  function handleShowLess(){
    setCount(prev => prev - 10)
  }

  async function isBrandAvailable(id){
    try {
      const {data} = await axios.get(`https://ecommerce.routemisr.com/api/v1/products?brand[in]=${id}`)
      return data.results > 0;
      
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      return false;
    }
  }

  async function getAllBrands(){

    setLoading(true)
    try {
      const {data} = await axios.get('https://ecommerce.routemisr.com/api/v1/brands')
      const brands = data.data

      const availableBrands = await Promise.all(
        brands.map(async (brand)=>{
          const available = await isBrandAvailable(brand._id);
          return{
            id: brand._id,
            name: brand.name,
            image: brand.image,
            available
          }
        })
      )
      return availableBrands;

    } catch (error) {
      console.error(error?.response?.data?.message || error.message);
      return [];
      
    } finally{
      setLoading(false)
    }

  }

  useEffect(()=>{
    getAllBrands().then((data)=>{
      setBrands(data)
    });
  },[])

  if(loading)
    return <Loading/>

  return (
    <div className='max-w-screen-xl mx-auto'>
      <div className='relative mt-2 py-4 pb-10'>
        <div>
          <h2 className='text-focus text-center text-lg font-semibold mt-2 py-2 mb-2 w-[95%] border-y border-gray-200'>
          Shop by Brand
        </h2>
        </div>
        
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4'>
          {brands.slice(0, count).map((brand)=>(
            <div key={brand.id}>
              <img onClick={() => navigate(`/brand/${brand.id}`)} src={brand.image} className='size-36 bg-white rounded-full shadow-md p-2 cursor-pointer object-contain hover:scale-[1.2] hover:-translate-y-8 duration-500'/>
            </div>
          ))}
        </div>
        {count < brands.length && (
          <div className='flex justify-center'>
            <button onClick={handleShowMore} className='bg-focus rounded cursor-pointer text-white py-2 px-6 text-sm mt-20 font-semibold'>
              Show More
            </button>
        </div>
        )}

        {count === brands.length && (
          <div className='flex justify-center'>
            <button onClick={handleShowLess} className='bg-focus rounded cursor-pointer text-white py-2 px-6 text-sm mt-20 font-semibold'>
              Show Less
            </button>
          </div>
        )}
        
      </div>
      </div>
  )
}
