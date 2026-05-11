import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCartShopping, FaHeartCrack, FaTrash } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import Loading from '../../Components/Loading/Loading'

const WISHLIST_STORAGE_KEY = 'wishlistProductIds'

function saveWishlistIds(products) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(products.map((product) => product._id)))
  window.dispatchEvent(new Event('wishlistChanged'))
}

export default function Wishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  async function getWishlist() {
    setLoading(true)
    try {
      const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/wishlist', {
        headers: { token },
      })
      const wishlistItems = data.data || []
      setItems(wishlistItems)
      saveWishlistIds(wishlistItems)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load wishlist')
    } finally {
      setLoading(false)
    }
  }

  async function removeFromWishlist(productId) {
    try {
      await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
        headers: { token },
      })
      setItems((prev) => {
        const nextItems = prev.filter((item) => item._id !== productId)
        saveWishlistIds(nextItems)
        return nextItems
      })
      toast.success('Removed from wishlist')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove item')
    }
  }

  async function addToCart(productId) {
    try {
      await axios.post('https://ecommerce.routemisr.com/api/v1/cart', { productId }, {
        headers: { token },
      })
      toast.success('Added to cart')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add to cart')
    }
  }

  useEffect(() => {
    getWishlist()
  }, [])

  if (loading) return <Loading />

  const totalWishlistPrice = items.reduce((total, product) => total + product.price, 0)

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-wrap items-center justify-between gap-4 mb-8'>
        <div>
          <h2 className='text-focus text-3xl font-bold'>Wishlist</h2>
          <p className='text-gray-500 mt-1'>{items.length} item{items.length === 1 ? '' : 's'} in your wishlist</p>
        </div>
        {items.length > 0 && (
          <button onClick={() => navigate('/products')} className='border border-focus text-focus px-4 py-2 rounded hover:bg-focus hover:text-white transition-all duration-200 cursor-pointer'>
            Keep Shopping
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className='bg-light rounded-lg py-12 text-center'>
          <FaHeartCrack className='mx-auto text-focus size-12 mb-4' />
          <p className='text-green font-semibold text-xl'>Your wishlist is empty</p>
          <button onClick={() => navigate('/products')} className='bg-focus text-white px-5 py-2 rounded mt-5 hover:bg-green transition-all duration-200 cursor-pointer'>
            Shop Products
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6'>
          <div className='space-y-4'>
            {items.map((product) => (
              <div key={product._id} className='border border-gray-100 shadow-md rounded-md p-4 flex flex-wrap sm:flex-nowrap gap-4 items-center'>
                <img
                  onClick={() => navigate(`/product/${product._id}`)}
                  src={product.imageCover}
                  alt={product.title}
                  className='w-28 h-28 object-contain cursor-pointer'
                />
                <div className='flex-1 min-w-56'>
                  <h3 onClick={() => navigate(`/product/${product._id}`)} className='text-focus font-semibold cursor-pointer hover:text-orange-500'>
                    {product.title}
                  </h3>
                  <p className='text-green font-bold mt-1'>{product.category?.name}</p>
                  <p className='text-gray-500 text-sm'>{product.brand?.name}</p>
                  <p className='text-focus font-semibold mt-2'>EGP {product.price}</p>
                </div>
                <button onClick={() => addToCart(product._id)} className='bg-focus text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-green transition-all duration-200 cursor-pointer'>
                  <FaCartShopping /> Cart
                </button>
                <button onClick={() => removeFromWishlist(product._id)} className='text-red-500 hover:bg-red-50 p-3 rounded cursor-pointer'>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className='border border-gray-100 shadow-md rounded-md p-5 h-fit'>
            <h3 className='text-green text-xl font-bold mb-4'>Wishlist Summary</h3>
            <div className='flex justify-between text-gray-500 mb-3'>
              <span>Saved Items</span>
              <span>{items.length}</span>
            </div>
            <div className='flex justify-between text-gray-500 mb-5'>
              <span>Estimated Value</span>
              <span>EGP {totalWishlistPrice}</span>
            </div>
            <div className='border-t border-gray-200 pt-4 text-gray-500 text-sm'>
              Move items to your cart when you are ready to checkout.
            </div>
            <button onClick={() => navigate('/products')} className='w-full bg-focus text-white rounded py-3 mt-5 hover:bg-green transition-all duration-200 cursor-pointer'>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
