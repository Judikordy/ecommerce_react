import React, { useEffect, useState } from 'react'
import ProductCard from '../../Components/ProductCard/ProductCard'
import homePhoto from '../../assets/homePage.avif'
import homePhoto1 from '../../assets/homePhoto1.jpg'
import homePhoto2 from '../../assets/homePhoto2.jpg'
import homeSlider1 from '../../assets/homeSlider1.jpg'
import homeSlider2 from '../../assets/homeSlider2.jpg'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FaOpencart } from "@react-icons/all-files/fa/FaOpencart";
import axios from 'axios'
import Loading from '../../Components/Loading/Loading'
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'

export default function Home() {

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const navigate = useNavigate();


  async function getAllCategories() {
    try {
      setLoadingCategories(true)
      const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/categories')
      setCategories(data.data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }finally{
      setLoadingCategories(false)
    }
  }

  async function getAllProducts() {
    try {
      setLoadingProducts(true)
      const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/products')
      setProducts(data.data)
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally{
      setLoadingProducts(false)
    }
  }


  useEffect(() => {
    getAllCategories()
    getAllProducts()
  }, [])

  if (loadingCategories || loadingProducts) return <Loading />


  return (
    <div className="container max-w-screen-xl mx-auto my-6">
  <div className="flex w-full h-screen">
    <Swiper className='w-[70%] h-full' slidesPerView={1} pagination={{ clickable: true }} modules={[Pagination]}>
      <SwiperSlide>
        <div className='relative w-full h-full'>
        <img src={homePhoto} alt='Slider 1' className="w-full h-[100%] object-cover" />
        <div className='absolute z-10 top-4 left-4 mx-3'>
          <div className='flex w-55 text-3xl font-bold font-primary py-3 bg-white p-4 rounded-full'>
            <FaOpencart className='text-focus mr-3'/>
            <h1 className='text-green'>Fresh Cart</h1>
          </div>
          <p className='text-sm text-white font-semibold max-w-xl mt-4 shadow-inner bg-white/10 p-5 rounded-lg'>Whether you're looking for the freshest produce, pantry staples, or specialty items, FreshCart brings the supermarket to you, redefining the way you shop for groceries.</p>
          <button className='bg-focus text-white py-2 px-5 my-5 rounded-full hover:bg-green-400 transition-all duration-500 cursor-pointer'>Get Started</button>
        </div>
        
        
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <img src={homeSlider1} alt="Slider 2" className="w-full h-[100%] object-cover"/>
      </SwiperSlide>
      <SwiperSlide>
        <img src={homeSlider2} alt="Slider 3" className="w-full h-[100%] object-cover"/>
      </SwiperSlide>
    </Swiper>
    

    <div className="w-[30%] h-full flex flex-col">
      <img src={homePhoto1} className="w-full h-1/2 object-cover" />
      <img src={homePhoto2} className="w-full h-1/2 object-cover" />
    </div>
  </div>

      <div>
        <h2 className='font-bold text-lg mt-10 mb-4 text-green'>Shop now by popular categories</h2>
        <div className="w-full overflow-x-auto">
          <Swiper
            slidesPerView={6}
            navigation
            modules={[Navigation]}
          >
            {categories.map((category) => (
              <SwiperSlide key={category._id} className="text-center">
                <img
                  onClick={() => navigate(`/subcategories/${category._id}`)}
                  src={category.image}
                  alt={category.name}
                  className="w-full h-72 object-cover cursor-pointer"
                />
                <h5 className="py-3 text-sm bg-gray-100 font-bold text-green-700">
                  {category.name}
                </h5>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="container">
        <h2 className='text-sky-950 text-3xl font-bold text-center mt-20'>Shop now by popular products</h2>
        <div className='w-60 mx-auto border-b-4 border-focus mt-3 mb-15'></div>
        <div className="row flex flex-wrap gap-5 justify-center">
          {products.slice(0, 12).map((product) => (
            <div key={product._id} className="col-md-3 border border-gray-100 shadow-lg rounded-md py-5">
              <div className="card" style={{ width: "18rem" }}>
                <img onClick={()=> navigate(`/product/${product._id}`)} src={product.imageCover} className="cursor-pointer" alt={product.title} />
                <div className="card-body p-5">
                  <span className='badge text-bg-primary text-focus font-semibold hover:text-orange-500 transition-all duration-200 cursor-pointer'>{product.title.split(" ").length > 4 ? product.title.split(" ").slice(0, 4).join(" ") + "..." : product.title}</span>
                  <h5 className="card-title mt-1 text-green font-bold">{product.category.name}</h5>
                  <p className="card-text text-sm text-gray-500 mt-1">{product.brand.name}
                    <span className='ml-2 text-gray-500'>|</span>
                    <span className='ml-2 font-semibold text-green-500'>Available</span>
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
