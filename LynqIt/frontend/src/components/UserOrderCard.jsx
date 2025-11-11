import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateRealtimeOrderStatus } from '../redux/userSlice'
import { serverUrl } from '../App'

function UserOrderCard({ data }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [selectedRating, setSelectedRating] = useState({})//itemId:rating
    const [isCancelling, setIsCancelling] = useState(false)

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })

    }

    const handleRating = async (itemId, rating) => {
        try {
            const result = await axios.post(`${serverUrl}/api/item/rating`, { itemId, rating }, { withCredentials: true })
            setSelectedRating(prev => ({
                ...prev, [itemId]: rating
            }))
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancelOrder = async (shopId) => {
        if (!confirm('Are you sure you want to cancel this order?')) return

        setIsCancelling(true)
        try {
            const response = await axios.post(`${serverUrl}/api/order/cancel-order/${data._id}/${shopId}`, {}, { withCredentials: true })
            if (response.status === 200) {
                // Update local state
                dispatch(updateRealtimeOrderStatus({
                    orderId: data._id,
                    shopId: shopId,
                    status: 'cancelled'
                }))
                alert('Order cancelled successfully')
            }
        } catch (error) {
            console.error('Cancel order error:', error)
            alert(error.response?.data?.message || 'Failed to cancel order')
        } finally {
            setIsCancelling(false)
        }
    }


    return (
        <div className='bg-white rounded-lg shadow p-4 space-y-4'>
            <div className='flex justify-between border-b pb-2'>
                <div>
                    <p className='font-semibold'>
                        order #{data._id.slice(-6)}
                    </p>
                    <p className='text-sm text-gray-500'>
                        Date: {formatDate(data.createdAt)}
                    </p>
                </div>
                <div className='text-right'>
                    {data.paymentMethod == "cod" ? <p className='text-sm text-gray-500'>{data.paymentMethod?.toUpperCase()}</p> : <p className='text-sm text-gray-500 font-semibold'>Payment: {data.payment ? "true" : "false"}</p>}

                    <p className='font-medium text-blue-600'>{data.shopOrders?.[0].status}</p>
                </div>
            </div>

            {data.shopOrders.map((shopOrder, index) => (
                <div className="border rounded-lg p-3 bg-[#fffaf7] space-y-3" key={index}>
                    <p>{shopOrder.shop.name}</p>

                    <div className='flex space-x-4 overflow-x-auto pb-2'>
                        {shopOrder.shopOrderItems.map((item, index) => (
                            <div key={index} className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white">
                                <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded' />
                                <p className='text-sm font-semibold mt-1'>{item.name}</p>
                                {item.item.brand && <p className='text-xs text-gray-500'>Brand: {item.item.brand}</p>}
                                {item.item.size && <p className='text-xs text-gray-500'>Size: {Array.isArray(item.item.size) ? item.item.size.join(', ') : item.item.size}</p>}
                                {item.item.color && <p className='text-xs text-gray-500'>Color: {item.item.color}</p>}
                                <p className='text-xs text-gray-500'>Qty: {item.quantity} x ₹{item.price}</p>

                                {shopOrder.status == "delivered" && <div className='flex space-x-1 mt-2'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button className={`text-lg ${selectedRating[item.item._id] >= star ? 'text-yellow-400' : 'text-gray-400'}`} onClick={() => handleRating(item.item._id,star)}>★</button>
                                    ))}
                                </div>}



                            </div>
                        ))}
                    </div>
                    <div className='flex justify-between items-center border-t pt-2'>
                        <p className='font-semibold'>Subtotal: {shopOrder.subtotal}</p>
                        <span className='text-sm font-medium text-blue-600'>{shopOrder.status}</span>
                    </div>
                </div>
            ))}

            <div className='flex justify-between items-center border-t pt-2'>
                <p className='font-semibold'>Total: ₹{data.totalAmount}</p>
                <div className='flex gap-2'>
                    {/* Show cancel button only for pending/preparing orders */}
                    {data.shopOrders.some(shopOrder => ['pending', 'preparing'].includes(shopOrder.status)) && (
                        <button
                            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50'
                            onClick={() => handleCancelOrder(data.shopOrders[0].shop._id)}
                            disabled={isCancelling}
                        >
                            {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                    )}
                    <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm' onClick={() => navigate(`/track-order/${data._id}`)}>Track Order</button>
                </div>
            </div>



        </div>
    )
}

export default UserOrderCard
