import React from 'react'
import Amazon from '../../assets/amazonPay.png'
import American from '../../assets/americanExpress.png'
import MasterCard from '../../assets/masterCard.webp'
import PayPal from '../../assets/PayPal.png'
import Apple from '../../assets/appStore.png'
import Google from '../../assets/googlePlay.png'

export default function Footer() {
  return (
      <div className='relative min-h-screen'>
        <footer className="bg-light py-10 px-5 absolute bottom-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-green font-bold text-2xl mb-2">Get the FreshCart App</h1>
        <p className="mb-4 text-gray-600">We will send you a link, open it on your phone to download the app</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <input
            className="bg-white text-gray-400 rounded-md py-2 px-3 w-full max-w-5xl border border-slate-300 focus:outline-none"
            type="text"
            placeholder="Email..."
          />
          <button className="bg-focus text-white rounded py-2 px-6 hover:bg-green-600 transition">
            Share App Link
          </button>
        </div>

        <div className="border-y border-gray-200 py-6 flex flex-col md:flex-row justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="text-green-700 font-semibold">Payment Partners</h3>
            <img className="w-14" src={Amazon} alt="Amazon" />
            <img className="w-14" src={American} alt="American Express" />
            <img className="w-14" src={MasterCard} alt="MasterCard" />
            <img className="w-14" src={PayPal} alt="PayPal" />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <h3 className="text-green-700 font-semibold">Get deliveries with FreshCart</h3>
            <img className="w-24" src={Apple} alt="App Store" />
            <img className="w-24" src={Google} alt="Google Play" />
          </div>
        </div>
      </div>
    </footer>
      </div>
    
  )
}
