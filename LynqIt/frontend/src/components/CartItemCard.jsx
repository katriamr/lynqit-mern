import React from 'react'
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/userSlice';
function CartItemCard({data}) {
    const dispatch=useDispatch()
    const handleIncrease=(id,currentQty)=>{
       dispatch(updateQuantity({id,quantity:currentQty+1}))
    }
      const handleDecrease=(id,currentQty)=>{
        if(currentQty>1){
  dispatch(updateQuantity({id,quantity:currentQty-1}))
        }

    }
  return (
    <div className='flex items-center justify-between bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200'>
      <div className='flex items-center gap-4 flex-1'>
        <img src={data.image} alt="" className='w-20 h-20 object-cover rounded-xl border border-gray-200'/>
    <div className='flex-1'>
      <h1 className='font-bold text-gray-800 text-lg mb-1'>{data.name}</h1>
      {data.brand && <p className='text-sm text-gray-500 mb-1'>Brand: <span className='font-medium'>{data.brand}</span></p>}
      {data.size && <p className='text-sm text-gray-500 mb-1'>Size: <span className='font-medium'>{Array.isArray(data.size) ? data.size.join(', ') : data.size}</span></p>}
      {data.color && <p className='text-sm text-gray-500 mb-2'>Color: <span className='font-medium'>{data.color}</span></p>}
      <div className='flex items-center gap-4'>
        <p className='text-sm text-gray-500'>₹{data.price} × {data.quantity}</p>
        <p className="font-bold text-indigo-600 text-lg">₹{data.price*data.quantity}</p>
      </div>
    </div>
      </div>
      <div className='flex items-center gap-3'>
        <div className='flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50'>
          <button className='px-3 py-2 hover:bg-gray-200 transition-colors' onClick={()=>handleDecrease(data.id,data.quantity)}>
          <FaMinus size={14} className='text-gray-600'/>
          </button>
          <span className='px-4 py-2 font-semibold text-gray-800 min-w-[40px] text-center'>{data.quantity}</span>
          <button className='px-3 py-2 hover:bg-gray-200 transition-colors'  onClick={()=>handleIncrease(data.id,data.quantity)}>
          <FaPlus size={14} className='text-gray-600'/>
          </button>
        </div>
        <button className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
 onClick={()=>dispatch(removeCartItem(data.id))}>
<CiTrash size={20}/>
        </button>
      </div>
    </div>
  )
}

export default CartItemCard
