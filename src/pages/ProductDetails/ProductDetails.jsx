import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Loading from '../../Components/Loading/Loading';
import { FaStar } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Pagination, Scrollbar } from 'swiper/modules';

export default function ProductDetails() {

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(false)
    const {id} = useParams()

    async function getSpecificProduct(){
        setLoading(true);
        try {
            const {data} = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
            setProduct(data.data)
            
        } catch (error) {
            console.error('Error fetching products:', error);
            
        } finally{
            setLoading(false)
        }
        
    }

    useEffect(()=>{
        getSpecificProduct();
    },[id])

    if(loading){
        return <Loading/>
    }

  return (
    loading ? (
        <Loading/>
    ) : !product ? (
        <p className="text-center text-gray-500 mt-5">Product not found</p>
    ) : (
        <div className="container mx-auto flex">
        <div className="w-1/2">
            <Swiper
                className='w-full h-full mb-4'
                slidesPerView={1}
                spaceBetween={20}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                modules={[Pagination, Scrollbar]}
            >
            {product.images.map((img, index)=>(
                <SwiperSlide key={index}>
                    <img src={img} alt={product.title} className="w-full max-h-[520px] object-contain mt-10 rounded-lg"/>
                </SwiperSlide>
            ))}
               
            </Swiper>
            </div>

            <div className='w-1/2 my-10'>
                <h2 className='font-bold text-3xl mb-1 text-green'>{product.title}</h2>
                <h5 className="text-focus font-bold text-sm mt-1">{product.category.name}</h5>
                <p className="text-gray-500 mt-1 text-sm">{product.brand.name}
                    <span className='ml-2 text-gray-500'>|</span>
                    <span className='ml-2 font-semibold text-green-500'>{product.quantity > 0 ? "Available" : "Sold Out"}</span>
                </p>
                <div className='rating flex gap-2 items-center mt-1'>
                    <span className='text-star size-4'><FaStar /></span>
                    <span className='text-green font-normal'>{product.ratingsAverage}</span>
                </div>
                <div className='w-full'>
                    <p className='text-slate-500 my-4 ml-1'>{product.description}</p>

                </div>
                <div className='flex justify-between'>
                    <p className="flex items-center text-focus font-semibold">EGP {product.price}</p>
                    
                </div>
    </div>
    </div>

    )
    
  )
}
