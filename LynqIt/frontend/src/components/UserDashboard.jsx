import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import Carousel from './Carousel'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';

function UserDashboard() {
  const {currentCity,shopInMyCity,itemsInMyCity,searchItems}=useSelector(state=>state.user)
  const cateScrollRef=useRef()
  const shopScrollRef=useRef()
  const navigate=useNavigate()
  const [showLeftCateButton,setShowLeftCateButton]=useState(false)
  const [showRightCateButton,setShowRightCateButton]=useState(false)
   const [showLeftShopButton,setShowLeftShopButton]=useState(false)
  const [showRightShopButton,setShowRightShopButton]=useState(false)
  const [updatedItemsList,setUpdatedItemsList]=useState([])

const handleFilterByCategory=(category)=>{
if(category=="All"){
  setUpdatedItemsList(itemsInMyCity)
}else{
  const filteredList=itemsInMyCity?.filter(i=>i.category===category)
  setUpdatedItemsList(filteredList)
}

}

useEffect(()=>{
setUpdatedItemsList(itemsInMyCity)
},[itemsInMyCity])


  const updateButton=(ref,setLeftButton,setRightButton)=>{
const element=ref.current
if(element){
setLeftButton(element.scrollLeft>0)
setRightButton(element.scrollLeft+element.clientWidth<element.scrollWidth)

}
  }
  const scrollHandler=(ref,direction)=>{
    if(ref.current){
      ref.current.scrollBy({
        left:direction=="left"?-200:200,
        behavior:"smooth"
      })
    }
  }




  useEffect(()=>{
    if(cateScrollRef.current){
      updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton)
      updateButton(shopScrollRef,setShowLeftShopButton,setShowRightShopButton)
      cateScrollRef.current.addEventListener('scroll',()=>{
        updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton)
      })
      shopScrollRef.current.addEventListener('scroll',()=>{
         updateButton(shopScrollRef,setShowLeftShopButton,setShowRightShopButton)
      })
     
    }

    return ()=>{cateScrollRef?.current?.removeEventListener("scroll",()=>{
        updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton)
      })
         shopScrollRef?.current?.removeEventListener("scroll",()=>{
        updateButton(shopScrollRef,setShowLeftShopButton,setShowRightShopButton)
      })}

  },[categories])


  return (
    <div className='w-screen min-h-screen flex flex-col gap-8 items-center bg-gradient-to-br from-gray-50 to-white overflow-y-auto fade-in'>
      <Nav />
      <Carousel />

      {searchItems && searchItems.length>0 && (
        <div className='w-full max-w-7xl flex flex-col gap-6 items-start p-6 bg-white shadow-xl rounded-3xl mt-4 border border-gray-100 mx-4'>
<h1 className='text-gray-900 text-3xl font-bold border-b border-gray-200 pb-3 font-poppins'>
  Search Results
</h1>
<div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
  {searchItems.map((item)=>(
  <ProductCard data={item} key={item._id}/>
  ))}
</div>
        </div>
      )}

      <div className="w-full max-w-7xl flex flex-col gap-8 items-start px-6">

  <h1 className='text-gray-800 text-4xl font-bold gradient-text font-poppins'>Discover Trends</h1>
        <div className='w-full relative'>
          {showLeftCateButton &&  <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-white text-indigo-600 p-3 rounded-full shadow-lg hover:bg-indigo-50 z-10 border border-gray-200' onClick={()=>scrollHandler(cateScrollRef,"left")}><FaCircleChevronLeft />
          </button>}
         

          <div className='w-full flex overflow-x-auto gap-6 pb-4 scrollbar-hide' ref={cateScrollRef}>
            {categories.map((cate, index) => (
              <CategoryCard name={cate.category} image={cate.image} key={index} onClick={()=>handleFilterByCategory(cate.category)}/>
            ))}
          </div>
          {showRightCateButton &&  <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-white text-indigo-600 p-3 rounded-full shadow-lg hover:bg-indigo-50 z-10 border border-gray-200' onClick={()=>scrollHandler(cateScrollRef,"right")}>
<FaCircleChevronRight />
          </button>}
         
        </div>
      </div>

      <div className='w-full max-w-7xl flex flex-col gap-8 items-start px-6'>
 <h1 className='text-gray-800 text-4xl font-bold font-poppins'>Top Shops Near <span className='gradient-text'>{currentCity}</span></h1>
 <div className='w-full relative'>
          {showLeftShopButton &&  <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-white text-indigo-600 p-3 rounded-full shadow-lg hover:bg-indigo-50 z-10 border border-gray-200' onClick={()=>scrollHandler(shopScrollRef,"left")}><FaCircleChevronLeft />
          </button>}
         

          <div className='w-full flex overflow-x-auto gap-6 pb-4 scrollbar-hide' ref={shopScrollRef}>
            {shopInMyCity?.map((shop, index) => (
              <CategoryCard name={shop.name} image={shop.image} key={index} onClick={()=>navigate(`/shop/${shop._id}`)}/>
            ))}
          </div>
          {showRightShopButton &&  <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-white text-indigo-600 p-3 rounded-full shadow-lg hover:bg-indigo-50 z-10 border border-gray-200' onClick={()=>scrollHandler(shopScrollRef,"right")}>
<FaCircleChevronRight />
          </button>}
         
        </div>
      </div>

      <div className='w-full max-w-7xl flex flex-col gap-8 items-start px-6 pb-8'>
  <h1 className='text-gray-800 text-4xl font-bold font-poppins'>
   Trending Items
  </h1>

<div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
{updatedItemsList?.map((item,index)=>(
  <ProductCard key={index} data={item}/>
))}
</div>


      </div>


    </div>
  )
}

export default UserDashboard
