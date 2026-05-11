import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaEye, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa'
import { FaCartShopping } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'

const WISHLIST_STORAGE_KEY = 'wishlistProductIds'

function getStoredWishlistIds() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY)) || []
  } catch (error) {
    return []
  }
}

function saveLikedProduct(productId) {
  const ids = getStoredWishlistIds()
  const nextIds = ids.includes(productId) ? ids : [...ids, productId]
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(nextIds))
  window.dispatchEvent(new Event('wishlistChanged'))
}

export default function ProductCard({ product, available = true }) {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [isLiked, setIsLiked] = useState(() => getStoredWishlistIds().includes(product._id))

  async function addToCart(event) {
    event.stopPropagation()

    try {
      await axios.post('https://ecommerce.routemisr.com/api/v1/cart', { productId: product._id }, {
        headers: { token },
      })
      toast.success('Added to cart')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add to cart')
    }
  }

  async function addToWishlist(event) {
    event.stopPropagation()

    try {
      await axios.post('https://ecommerce.routemisr.com/api/v1/wishlist', { productId: product._id }, {
        headers: { token },
      })
      saveLikedProduct(product._id)
      setIsLiked(true)
      toast.success('Added to wishlist')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add to wishlist')
    }
  }

  function showDetails(event) {
    event.stopPropagation()
    navigate(`/product/${product._id}`)
  }

  React.useEffect(() => {
    function syncLikedState() {
      setIsLiked(getStoredWishlistIds().includes(product._id))
    }

    syncLikedState()
    window.addEventListener('wishlistChanged', syncLikedState)
    window.addEventListener('focus', syncLikedState)

    return () => {
      window.removeEventListener('wishlistChanged', syncLikedState)
      window.removeEventListener('focus', syncLikedState)
    }
  }, [product._id])

  return (
    <div className="col-md-3 border border-gray-100 shadow-lg rounded-md py-5 group">
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        className="card cursor-pointer relative overflow-hidden"
        style={{ width: "18rem" }}
      >
        <div className='relative'>
          <img src={product.imageCover} alt={product.title} className='w-full h-72 object-contain' />
          <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3'>
            <button
              onClick={addToCart}
              className='size-10 rounded-full bg-focus text-white flex items-center justify-center hover:bg-green hover:scale-110 transition-all duration-200 cursor-pointer'
              title='Add to cart'
              aria-label='Add to cart'
            >
              <FaCartShopping />
            </button>
            <button
              onClick={addToWishlist}
              className={`size-10 rounded-full bg-white border flex items-center justify-center hover:scale-110 transition-all duration-200 cursor-pointer ${isLiked ? 'text-red-500 border-red-500' : 'text-focus border-focus hover:bg-focus hover:text-white'}`}
              title='Add to wishlist'
              aria-label='Add to wishlist'
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
            </button>
            <button
              onClick={showDetails}
              className='size-10 rounded-full bg-white text-green border border-green flex items-center justify-center hover:bg-green hover:text-white hover:scale-110 transition-all duration-200 cursor-pointer'
              title='View details'
              aria-label='View details'
            >
              <FaEye />
            </button>
          </div>
        </div>
        <div className="card-body p-5">
          <span className='badge text-bg-primary text-focus font-semibold hover:text-orange-500 transition-all duration-200 cursor-pointer'>
            {product.title.split(" ").length > 4 ? product.title.split(" ").slice(0, 4).join(" ") + "..." : product.title}
          </span>
          <h5 className="card-title mt-1 text-green font-bold">{product.category.name}</h5>
          <p className="card-text text-sm text-gray-500 mt-1">{product.brand.name}
            <span className='ml-2 text-gray-500'>|</span>
            <span className='ml-2 font-semibold text-green-500'>{available ? "Available" : "Sold Out"}</span>
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
  )
}
