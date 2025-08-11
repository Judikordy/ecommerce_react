import React from 'react'

export default function ForgotPwd() {
  return (
    <div className="flex flex-col py-15 mx-auto items-center">
      <div className="flex flex-col items-center justify-center mb-4">
        <h2 className="text-focus text-2xl font-extrabold">Forgot your password?</h2>
        <p className='text-gray-500 text-sm mt-5'>Your password will be reset by email.</p>
      </div>

      <form className='mt-5 w-full max-w-[220px]'>
        <label className='block text-left text-xs font-bold text-gray-600 mb-2'>
          Enter your email address
        </label>
        <input type="text" className='border border-gray-300 px-2 py-1 rounded text-green w-full' />
        <button type='submit' className='bg-focus text-white py-1 rounded cursor-pointer mt-5 mx-auto px-4 w-full'>Next</button>
        <a className='block text-center text-focus text-xs font-bold mt-4 hover:underline' href="/auth/login">Back to log in</a>
      </form>
    </div>
  )
}
