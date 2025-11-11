import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { setMyOrders, updateOrderStatus, updateRealtimeOrderStatus } from '../redux/userSlice';


function MyOrders() {
  const { userData, myOrders,socket} = useSelector(state => state.user)
  const navigate = useNavigate()
const dispatch=useDispatch()

  // Separate orders into past and pending
  const { pastOrders, pendingOrders } = useMemo(() => {
    const past = []
    const pending = []

    myOrders?.forEach(order => {
      // Check if any shopOrder is completed (delivered or cancelled)
      const hasCompletedShopOrder = order.shopOrders?.some(shopOrder =>
        shopOrder.status === 'delivered' || shopOrder.status === 'cancelled'
      )

      if (hasCompletedShopOrder) {
        past.push(order)
      } else {
        pending.push(order)
      }
    })

    return { pastOrders: past, pendingOrders: pending }
  }, [myOrders])

  useEffect(()=>{
socket?.on('newOrder',(data)=>{
if(data.shopOrders[0]?.owner._id==userData._id){
dispatch(setMyOrders([data,...myOrders]))
}
})

socket?.on('update-status',({orderId,shopId,status,userId})=>{
if(userId==userData._id){
  dispatch(updateRealtimeOrderStatus({orderId,shopId,status}))
}
})

return ()=>{
  socket?.off('newOrder')
  socket?.off('update-status')
}
  },[socket])



  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4">
      <div className='w-full max-w-[800px] p-4'>

        <div className='flex items-center gap-[20px] mb-6 '>
          <div className=' z-[10] ' onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
          </div>
          <h1 className='text-2xl font-bold  text-start'>My Orders</h1>
        </div>

        {/* Pending Orders Section */}
        {pendingOrders.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-gray-700'>Pending Orders</h2>
            <div className='space-y-6'>
              {pendingOrders.map((order,index)=>(
                userData.role=="user" ?
                (
                  <UserOrderCard data={order} key={index}/>
                )
                :
                userData.role=="owner"? (
                  <OwnerOrderCard data={order} key={index}/>
                )
                :
                userData.role=="deliveryBoy"? (
                  <UserOrderCard data={order} key={index}/>
                )
                :
                null
              ))}
            </div>
          </div>
        )}

        {/* Past Orders Section */}
        {pastOrders.length > 0 && (
          <div>
            <h2 className='text-xl font-semibold mb-4 text-gray-700'>Past Orders</h2>
            <div className='space-y-6'>
              {pastOrders.map((order,index)=>(
                userData.role=="user" ?
                (
                  <UserOrderCard data={order} key={index}/>
                )
                :
                userData.role=="owner"? (
                  <OwnerOrderCard data={order} key={index}/>
                )
                :
                userData.role=="deliveryBoy"? (
                  <UserOrderCard data={order} key={index}/>
                )
                :
                null
              ))}
            </div>
          </div>
        )}

        {/* No orders message */}
        {myOrders?.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
