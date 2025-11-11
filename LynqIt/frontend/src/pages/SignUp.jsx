import React from 'react';
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from "react-spinners";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { clearMyShopData } from '../redux/ownerSlice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signupSchema } from '../validation/auth.schema';
import { useFormError } from '../hooks/useFormError';
function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { handleError } = useFormError();

    const { register, handleSubmit, formState: { errors }, setError, setValue, watch } = useForm({
        resolver: yupResolver(signupSchema),
        defaultValues: {
            role: 'user'
        }
    });

    const role = watch('role');

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, data, {
                withCredentials: true
            });
            dispatch(setUserData(result.data));
            setLoading(false);
            navigate('/');
        } catch (error) {
            handleError(error);
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        const mobile = watch('mobile');
        if (!mobile) {
            setError('mobile', {
                type: 'manual',
                message: 'Mobile number is required for Google sign up'
            });
            return;
        }

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                fullName: result.user.displayName,
                email: result.user.email,
                role,
                mobile
            }, { withCredentials: true });
            
            dispatch(setUserData(data));
            navigate('/');
        } catch (error) {
            handleError(error);
        }
    };
    return (
        <div className='min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50'>
            <div className='bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-gray-100 fade-in'>
                <h1 className='text-4xl font-bold mb-3 gradient-text text-center'>LynQt</h1>
                <p className='text-gray-600 mb-8 text-center'>Join us to explore the latest fashion trends</p>

                {/* fullName */}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Full Name */}
                    <div className='mb-6'>
                        <label htmlFor="name" className='block text-gray-700 font-semibold mb-2'>Full Name</label>
                        <input 
                            type="text" 
                            className={`input-modern w-full ${errors.name ? 'border-red-500' : ''}`}
                            placeholder='Enter your full name'
                            {...register('name')}
                        />
                        {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className='mb-6'>
                        <label htmlFor="email" className='block text-gray-700 font-semibold mb-2'>Email Address</label>
                        <input 
                            type="email" 
                            className={`input-modern w-full ${errors.email ? 'border-red-500' : ''}`}
                            placeholder='Enter your email'
                            {...register('email')}
                        />
                        {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
                    </div>

                    {/* Mobile */}
                    <div className='mb-6'>
                        <label htmlFor="mobile" className='block text-gray-700 font-semibold mb-2'>Mobile Number</label>
                        <input 
                            type="tel" 
                            className={`input-modern w-full ${errors.mobile ? 'border-red-500' : ''}`}
                            placeholder='Enter your mobile number'
                            {...register('mobile')}
                        />
                        {errors.mobile && <p className='text-red-500 text-sm mt-1'>{errors.mobile.message}</p>}
                    </div>

                    {/* Password */}
                    <div className='mb-6'>
                        <label htmlFor="password" className='block text-gray-700 font-semibold mb-2'>Password</label>
                        <div className='relative'>
                            <input 
                                type={showPassword ? "text" : "password"}
                                className={`input-modern w-full pr-12 ${errors.password ? 'border-red-500' : ''}`}
                                placeholder='Create a password'
                                {...register('password')}
                            />
                            <button
                                type="button"
                                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </button>
                        </div>
                        {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
                    </div>

                    {/* Role */}
                    <div className='mb-8'>
                        <label className='block text-gray-700 font-semibold mb-3'>I want to join as</label>
                        <div className='grid grid-cols-3 gap-3'>
                            {["user", "owner", "delivery"].map((r) => (
                                <button
                                    type="button"
                                    key={r}
                                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                        role === r
                                            ? 'bg-indigo-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                    onClick={() => setValue('role', r)}
                                >
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                            ))}
                        </div>
                        {errors.role && <p className='text-red-500 text-sm mt-1'>{errors.role.message}</p>}
                    </div>

                    <button 
                        type="submit"
                        className='btn-primary w-full mb-4'
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={20} color='white'/> : "Create Account"}
                    </button>
                </form>
            

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
            <p className='text-center mt-8 text-gray-600'>Already have an account? <span className='text-indigo-600 font-semibold cursor-pointer hover:text-indigo-700 transition-colors' onClick={()=>navigate("/signin")}>Sign In</span></p>
            </div>
        </div>
    )
}

export default SignUp
