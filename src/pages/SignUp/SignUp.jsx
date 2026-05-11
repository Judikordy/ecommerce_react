import React, { useState } from 'react'
import { useFormik } from 'formik'
import { object, string, ref } from 'yup'
import axios from 'axios'
import { UserRound, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function SignUp() {

  const [showPwd, setShowPwd] = useState(false)

  function toggleIcon() {
    setShowPwd(!showPwd)
  }

  const passwordRegex = /^[A-Z][a-z0-9]{5,}$/
  const phoneRegex = /^01[0125][0-9]{8}$/
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const validationSchema = object({
    name:string('*Username must be string').required('*Name is a required field').min(3,'*Username must be minimum 3 characters').max(20,'*Username must be maximum 20 characters.'),
    email: string('*Email must be string').required('*Email is a required field').email('*Email must be valid'),
    password: string().required('*Password is a required field').matches(passwordRegex, '*Password must start with a capital letter followed by 5 or more characters'),
    rePassword: string().required('*rePassword is a required field').matches(passwordRegex).oneOf([ref('password')],'*Both password fields must match'),
    phone: string().required('*Phone is a required field').matches(phoneRegex,'*Phone must be an egyptian number')
  })

  async function sendDataToSignUp(values) {

    const loadingToast = toast.loading('loading...')

    setErrorMsg('')

    try {
      const options = {
      url: 'https://ecommerce.routemisr.com/api/v1/auth/signup',
      method: 'POST',
      data: values
    }

    const { data } = await axios.request(options)
    console.log(data)
    toast.success('Account registered successfully!')
    
    setTimeout(()=>{
      navigate('/auth/login')
    },2000)

    } catch (error) {

      setErrorMsg(error.response.data.message)
      toast.error('Account already exists')
      
    }finally{
      toast.dismiss(loadingToast)
    }
    
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: ""
      
    },
    onSubmit: sendDataToSignUp,
    validationSchema,
  })

  return (
    <div className="flex flex-col items-center py-10 mx-auto">
      <div className="flex items-center justify-center mb-4">
        <UserRound className="text-focus size-9 mr-2" />
        <h1 className="text-focus text-3xl font-bold">Register Now</h1>
      </div>


      {errorMsg && <h3 className='text-red-500 my-5'>{errorMsg}</h3>}
      <form className='w-full max-w-lg' onSubmit={formik.handleSubmit}>
        <div className="flex flex-col">
          <input
            name='name'
            placeholder="Enter Your Name"
            className="border border-gray-300 px-2 py-1 my-3.5 rounded text-gray-400"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.errors.name && formik.touched.name && <p className='text-red-600 font-bold text-sm'>{formik.errors.name}</p>}

          <input
            name='email'
            placeholder="Enter Your Email"
            className="border border-gray-300 px-2 py-1 my-3.5 rounded text-gray-400"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.errors.email && formik.touched.email && <p className='text-red-600 font-bold text-sm'>{formik.errors.email}</p>}

          <input
            name='phone'
            placeholder="Enter Your Phone"
            className="border border-gray-300 px-2 py-1 my-3.5 rounded text-gray-400"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.errors.phone && formik.touched.phone && <p className='text-red-600 font-bold text-sm'>{formik.errors.phone}</p>}

          <div className="relative my-3.5">
            <input
              type={showPwd ? 'text' : 'password'}
              name='password'
              placeholder="Enter Your Password"
              className="border border-gray-300 px-2 py-1 rounded text-gray-400 w-full pr-10"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400" onClick={toggleIcon}>
              {showPwd ? <Eye size={15} /> : <EyeOff size={15} />}
            </div>
          </div>

          {formik.errors.password && formik.touched.password && <p className='text-red-600 font-bold text-sm'>{formik.errors.password}</p>}

          <input
            type='password'
            name='rePassword'
            placeholder="Enter Your Re-Password"
            className="border border-gray-300 px-2 py-1 my-3.5 rounded text-gray-400"
            value={formik.values.rePassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.errors.rePassword && formik.touched.rePassword && <p className='text-red-600 font-bold text-sm'>{formik.errors.rePassword}</p>}


          <button type='submit' className='bg-focus text-white py-2 rounded mt-5 cursor-pointer'>
            Sign Up
          </button>

          <a className='text-focus text-sm mx-auto hover:underline mt-5' href="/auth/login">
            Already have an account?
          </a>
        </div>
      </form>
    </div>
  )
}
