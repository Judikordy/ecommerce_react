import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Loading from '../../Components/Loading/Loading'

function getUserIdFromToken() {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decodedPayload = JSON.parse(atob(normalizedPayload))
    return decodedPayload.id
  } catch (error) {
    return null
  }
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  async function getOrders() {
    const userId = getUserIdFromToken()
    if (!userId) {
      setLoading(false)
      toast.error('Could not read your account id')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`)
      setOrders(data || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  if (loading) return <Loading />

  return (
    <div className='container mx-auto px-4 py-8'>
      <h2 className='text-focus text-3xl font-bold text-center'>My Orders</h2>
      <div className='w-40 mx-auto border-b-4 border-focus mt-3 mb-8'></div>

      {orders.length === 0 ? (
        <div className='bg-light rounded-lg py-12 text-center'>
          <p className='text-green font-semibold text-xl'>You do not have any orders yet</p>
        </div>
      ) : (
        <div className='space-y-5'>
          {orders.map((order) => (
            <div key={order.id} className='border border-gray-100 shadow-md rounded-md p-5'>
              <div className='flex flex-wrap justify-between gap-3 border-b border-gray-100 pb-4 mb-4'>
                <div>
                  <h3 className='text-green font-bold'>Order #{order.id}</h3>
                  <p className='text-gray-500 text-sm'>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className='text-right'>
                  <p className='text-focus font-bold'>EGP {order.totalOrderPrice}</p>
                  <p className='text-sm text-gray-500'>{order.paymentMethodType}</p>
                </div>
              </div>

              <div className='grid gap-4'>
                {order.cartItems.map((item) => (
                  <div key={item._id} className='flex gap-4 items-center'>
                    <img src={item.product.imageCover} alt={item.product.title} className='w-20 h-20 object-contain' />
                    <div className='flex-1'>
                      <h4 className='text-focus font-semibold'>{item.product.title}</h4>
                      <p className='text-gray-500 text-sm'>Qty: {item.count}</p>
                    </div>
                    <p className='text-green font-semibold'>EGP {item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
