import { createContext, useEffect, useState } from "react";
import toast from 'react-hot-toast'
import axios from 'axios'



export let authContext = createContext(null)

export default function AuthContextProvider({children}) {

    let [token,setToken] = useState(localStorage.getItem('token'))

    async function verifyToken(){

    try {
      let {data} = await axios.get('https://ecommerce.routemisr.com/api/v1/auth/verifyToken',{
        headers:{
        token: localStorage.getItem('token')
      },
      }
    )
    console.log(data)
    } catch (err) {
      console.log(err)
      const er = toast.error(err.response.data.message)
      setToken(null)
      localStorage.removeItem('token')
    }finally{
      toast.dismiss('err')
    }
  }

  useEffect(()=>{
    verifyToken();
  },[])

    return (

    <authContext.Provider value={{token,setToken}}>
        {children}
    </authContext.Provider>

)
}
