import React, { useContext, useState } from 'react'
import { UserRound, Eye, EyeOff } from 'lucide-react'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { authContext } from '../../Context/AuthContext'

export default function Login() {

  const [showPwd, setShowPwd] = useState(false)
  const passwordRegex = /^[A-Z][a-z0-9]{5,}$/
  const [errorMsg, setErrorMessage] = useState('')

  const navigate = useNavigate()

  let {setToken} = useContext(authContext)

  const validationSchema = object({
    email: string('*Email must be string').required('*Email is a required field').email('*Email must be valid'),
    password: string().required('*Password is a required field').matches(passwordRegex, '*Password must start with a capital letter followed by 5 or more characters')
  })
  
  const formik = useFormik({
    initialValues:{
      email:'',
      password:''
    },
    onSubmit: sendDataToLogin,
    validationSchema
  })

  async function sendDataToLogin(values){
    
    const loadingToast = toast.loading('Waiting...')
    setErrorMessage('')

    try {
      const options = {
      url:"https://ecommerce.routemisr.com/api/v1/auth/signin",
      method:'POST',
      data:values
    }

    const {data} = await axios.request(options)
    localStorage.setItem('token',data.token)
    setToken(data.token)

    toast.success('Logged in successfully!')

    setTimeout(()=>{
      navigate('/')
    },2000)

    } catch (error) {
      setErrorMessage(error.response.data.message)
      
    }finally{
      toast.dismiss(loadingToast)
    }
    
  }


  const createNewAccBtn = ()=>{
    navigate('/auth/register')
  }


  function toggleIcon(){
    setShowPwd(!showPwd)
  }

  const logout = ()=>{
    localStorage.removeItem('token')
    setToken(null)
  }

  return (

    <div className="flex flex-col items-center py-10 mx-auto">

      <div className="flex items-center justify-center mb-4">
        <UserRound className="text-focus size-9 mr-2" />
        <h1 className="text-focus text-3xl font-bold">Login</h1>
      </div>

      {errorMsg && <h3 className='text-red-600 font-bold text-sm'>{errorMsg}</h3>}
      <form className='w-full max-w-lg' onSubmit={formik.handleSubmit}>
        <div className="flex flex-col">
          <input className="border border-gray-300 px-2 py-1 my-3.5 rounded text-gray-400" 
          name='email' 
          type="text" 
          placeholder='Enter Your Email'
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          />

          {formik.errors.email && formik.touched.email && <p className='text-red-600 font-bold text-sm'>{formik.errors.email}</p>}
          
          
          <div className="relative my-3.5">
            <input className="border border-gray-300 px-2 py-1 rounded text-gray-400 w-full pr-10" 
            name='password' 
            type={showPwd ? 'text' : 'password'} 
            placeholder='Enter Your Password'
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400" onClick={toggleIcon}>
              {showPwd ? <Eye size={15}/> : <EyeOff size={15}/>}
            </div>
          </div>

          {formik.errors.password && formik.touched.password && <p className='text-red-600 font-bold text-sm mt-3.5'>{formik.errors.password}</p>}

          <button type='submit' className='bg-focus text-white py-2 rounded mt-5 cursor-pointer'>Log In</button>
          <a className='text-focus text-sm mx-auto py-3' href="/auth/forgotPassword">Forgot your password?</a>

          <button onClick={createNewAccBtn} type='submit' className='bg-focus text-white py-2 rounded cursor-pointer text-sm mx-auto px-4'>Create New Account</button>

        </div>
        
      </form>

    </div>
    
  )
}
