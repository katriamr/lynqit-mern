import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { FaStore } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaUtensils } from "react-icons/fa";
import ProductCard from '../components/ProductCard';
import { FaArrowLeft } from "react-icons/fa";
function Shop() {
    const {shopId}=useParams()
    const [items,setItems]=useState([])
    const [shop,setShop]=useState([])
    const navigate=useNavigate()
    const handleShop=async () => {
        try {
           const result=await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`,{withCredentials:true})
           setShop(result.data.shop)
           setItems(result.data.items)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
handleShop()
    },[shopId])
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white'>
        <button className='absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/90 hover:bg-white text-indigo-600 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200' onClick={()=>navigate("/")}>
        <FaArrowLeft />
<span className='font-medium'>Back</span>
        </button>
      {shop && <div className='relative w-full h-72 md:h-80 lg:h-96'>
          <img src={shop.image} alt="" className='w-full h-full object-cover'/>
          <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 flex flex-col justify-center items-center text-center px-6'>
          <FaStore className='text-white text-5xl mb-4 drop-shadow-lg'/>
          <h1 className='text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl mb-2'>{shop.name}</h1>
          <div className='flex items-center gap-3'>
          <FaLocationDot size={24} color='white'/>
             <p className='text-xl font-medium text-gray-100 drop-shadow-lg'>{shop.address}</p>
             </div>
          </div>

        </div>}

<div className='max-w-7xl mx-auto px-6 py-12'>
<h2 className='flex items-center justify-center gap-4 text-4xl font-bold mb-12 text-gray-800'>
  <FaStore className='text-indigo-600' />
  Our Collection
</h2>

{items.length>0?(
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
        {items.map((item)=>(
            <ProductCard data={item} key={item._id}/>
        ))}
    </div>
):<div className='text-center py-16'>
  <FaStore className='text-gray-400 text-6xl mx-auto mb-4' />
  <p className='text-gray-500 text-xl'>No items available at the moment</p>
  <p className='text-gray-400 text-lg mt-2'>Check back later for new arrivals!</p>
</div>}
</div>



    </div>
  )
}

export default Shop
