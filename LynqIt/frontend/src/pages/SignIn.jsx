import React from 'react'
import { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { clearMyShopData } from '../redux/ownerSlice';
function SignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const navigate=useNavigate()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [err,setErr]=useState("")
    const [loading,setLoading]=useState(false)
    const dispatch=useDispatch()
     const handleSignIn=async () => {
        setLoading(true)
        try {
            const result=await axios.post(`${serverUrl}/api/auth/signin`,{
                email,password
            },{withCredentials:true})
           dispatch(setUserData(result.data))
            setErr("")
            setLoading(false)
        } catch (error) {
           setErr(error?.response?.data?.message)
           setLoading(false)
        }
     }
     const handleGoogleAuth=async () => {
             const provider=new GoogleAuthProvider()
             const result=await signInWithPopup(auth,provider)
       try {
         const {data}=await axios.post(`${serverUrl}/api/auth/google-auth`,{
             email:result.user.email,
         },{withCredentials:true})
         dispatch(setUserData(data))
       } catch (error) {
         console.log(error)
       }
          }
    return (
        <div className='min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50'>
            <div className='bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-gray-100 fade-in'>
                <h1 className='text-4xl font-bold mb-3 gradient-text text-center'>LynQt</h1>
                <p className='text-gray-600 mb-8 text-center'>Welcome back! Sign in to discover amazing fashion</p>

              
                {/* email */}

                <div className='mb-6'>
                    <label htmlFor="email" className='block text-gray-700 font-semibold mb-2'>Email Address</label>
                    <input type="email" className='input-modern w-full' placeholder='Enter your email' onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                </div>
                {/* password*/}

                <div className='mb-6'>
                    <label htmlFor="password" className='block text-gray-700 font-semibold mb-2'>Password</label>
                    <div className='relative'>
                        <input type={`${showPassword ? "text" : "password"}`} className='input-modern w-full pr-12' placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} value={password} required/>

                        <button className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors' onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
                    </div>
                </div>
                <div className='text-right mb-6 cursor-pointer text-indigo-600 font-semibold hover:text-indigo-700 transition-colors' onClick={()=>navigate("/forgot-password")}>
                  Forgot Password?
                </div>
              

            <button className='btn-primary w-full mb-4' onClick={handleSignIn} disabled={loading}>
                {loading?<ClipLoader size={20} color='white'/>:"Sign In"}
            </button>
      {err && <p className='text-red-500 text-center mb-4 bg-red-50 p-3 rounded-lg'>*{err}</p>}

            <div className='relative mb-6'>
                <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-300'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                    <span className='px-2 bg-white text-gray-500'>Or continue with</span>
                </div>
            </div>

            <button className='w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300' onClick={handleGoogleAuth}>
<FcGoogle size={24}/>
<span className='font-medium'>Continue with Google</span>
            </button>
            <p className='text-center mt-8 text-gray-600'>New to LynQt? <span className='text-indigo-600 font-semibold cursor-pointer hover:text-indigo-700 transition-colors' onClick={()=>navigate("/signup")}>Create Account</span></p>
            </div>
        </div>
    )
}

export default SignIn
