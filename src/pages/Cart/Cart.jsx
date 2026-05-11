import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Loading from '../../Components/Loading/Loading'

export default function Cart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [checkingOut, setCheckingOut] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    details: '',
    phone: '',
    city: '',
  })
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  async function getCart() {
    setLoading(true)
    try {
      const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/cart', {
        headers: { token },
      })
      setCart(data.data)
    } catch (error) {
      setCart(null)
      toast.error(error.response?.data?.message || 'Could not load cart')
    } finally {
      setLoading(false)
    }
  }

  async function updateCount(productId, count) {
    if (count < 1) return removeItem(productId)

    setUpdatingId(productId)
    try {
      const { data } = await axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, { count }, {
        headers: { token },
      })
      setCart(data.data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update quantity')
    } finally {
      setUpdatingId(null)
    }
  }

  async function removeItem(productId) {
    setUpdatingId(productId)
    try {
      const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
        headers: { token },
      })
      setCart(data.data)
      toast.success('Removed from cart')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove item')
    } finally {
      setUpdatingId(null)
    }
  }

  async function clearCart() {
    try {
      await axios.delete('https://ecommerce.routemisr.com/api/v1/cart', {
        headers: { token },
      })
      setCart(null)
      toast.success('Cart cleared')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not clear cart')
    }
  }

  async function checkoutWithVisa() {
    if (!shippingAddress.details || !shippingAddress.phone || !shippingAddress.city) {
      toast.error('Please complete the shipping address first')
      return
    }

    setCheckingOut(true)
    try {
      const returnUrl = `${window.location.origin}/allorders`
      const { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cart._id}?url=${returnUrl}`,
        { shippingAddress },
        { headers: { token } }
      )

      if (data.session?.url) {
        window.location.href = data.session.url
      } else {
        toast.error('Could not open payment page')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not start Visa checkout')
    } finally {
      setCheckingOut(false)
    }
  }

  useEffect(() => {
    getCart()
  }, [])

  if (loading) return <Loading />

  const products = cart?.products || []

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-wrap items-center justify-between gap-4 mb-8'>
        <div>
          <h2 className='text-focus text-3xl font-bold'>Shopping Cart</h2>
          <p className='text-gray-500 mt-1'>{products.length} item{products.length === 1 ? '' : 's'} in your cart</p>
        </div>
        {products.length > 0 && (
          <button onClick={clearCart} className='border border-red-300 text-red-500 px-4 py-2 rounded hover:bg-red-50 transition-all duration-200 cursor-pointer'>
            Clear Cart
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className='bg-light rounded-lg py-12 text-center'>
          <p className='text-green font-semibold text-xl'>Your cart is empty</p>
          <button onClick={() => navigate('/products')} className='bg-focus text-white px-5 py-2 rounded mt-5 hover:bg-green transition-all duration-200 cursor-pointer'>
            Shop Products
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6'>
          <div className='space-y-4'>
            {products.map((item) => (
              <div key={item.product._id} className='border border-gray-100 shadow-md rounded-md p-4 flex flex-wrap sm:flex-nowrap gap-4 items-center'>
                <img
                  onClick={() => navigate(`/product/${item.product._id}`)}
                  src={item.product.imageCover}
                  alt={item.product.title}
                  className='w-28 h-28 object-contain cursor-pointer'
                />
                <div className='flex-1 min-w-56'>
                  <h3 onClick={() => navigate(`/product/${item.product._id}`)} className='text-focus font-semibold cursor-pointer hover:text-orange-500'>
                    {item.product.title}
                  </h3>
                  <p className='text-green font-bold mt-1'>{item.product.category.name}</p>
                  <p className='text-gray-500 text-sm'>{item.product.brand.name}</p>
                  <p className='text-focus font-semibold mt-2'>EGP {item.price}</p>
                </div>
                <div className='flex items-center gap-3'>
                  <button disabled={updatingId === item.product._id} onClick={() => updateCount(item.product._id, item.count - 1)} className='size-8 rounded-full border border-gray-300 flex justify-center items-center hover:border-focus disabled:opacity-50 cursor-pointer'>
                    <FaMinus />
                  </button>
                  <span className='font-bold text-green w-6 text-center'>{item.count}</span>
                  <button disabled={updatingId === item.product._id} onClick={() => updateCount(item.product._id, item.count + 1)} className='size-8 rounded-full border border-gray-300 flex justify-center items-center hover:border-focus disabled:opacity-50 cursor-pointer'>
                    <FaPlus />
                  </button>
                </div>
                <button disabled={updatingId === item.product._id} onClick={() => removeItem(item.product._id)} className='text-red-500 hover:bg-red-50 p-3 rounded disabled:opacity-50 cursor-pointer'>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className='border border-gray-100 shadow-md rounded-md p-5 h-fit'>
            <h3 className='text-green text-xl font-bold mb-4'>Order Summary</h3>
            <div className='flex justify-between text-gray-500 mb-3'>
              <span>Subtotal</span>
              <span>EGP {cart.totalCartPrice}</span>
            </div>
            <div className='flex justify-between text-gray-500 mb-5'>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className='flex justify-between border-t border-gray-200 pt-4 text-focus font-bold text-lg'>
              <span>Total</span>
              <span>EGP {cart.totalCartPrice}</span>
            </div>

            <div className='mt-5 space-y-3'>
              <input
                type='text'
                placeholder='Address details'
                value={shippingAddress.details}
                onChange={(e) => setShippingAddress({ ...shippingAddress, details: e.target.value })}
                className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-green/25'
              />
              <input
                type='tel'
                placeholder='Phone'
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-green/25'
              />
              <input
                type='text'
                placeholder='City'
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-green/25'
              />
            </div>

            <button
              onClick={checkoutWithVisa}
              disabled={checkingOut}
              className='w-full bg-focus text-white rounded py-3 mt-5 hover:bg-green transition-all duration-200 disabled:opacity-60 cursor-pointer'
            >
              {checkingOut ? 'Opening Payment...' : 'Checkout With Visa'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
