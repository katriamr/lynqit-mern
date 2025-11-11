import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
function CartPage() {
    const navigate = useNavigate()
    const { cartItems, totalAmount } = useSelector(state => state.user)
    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white flex justify-center p-6 fade-in'>
            <div className='w-full max-w-2xl'>
                <div className='flex items-center gap-4 mb-8'>
                    <button className='p-2 hover:bg-gray-100 rounded-full transition-colors' onClick={() => navigate("/")}>
                        <IoIosArrowRoundBack size={28} className='text-indigo-600' />
                    </button>
                    <h1 className='text-3xl font-bold text-gray-800'>Your Cart</h1>
                </div>
                {cartItems?.length == 0 ? (
                    <div className='text-center py-16'>
                        <div className='text-6xl mb-4'>🛒</div>
                        <p className='text-gray-500 text-xl mb-2'>Your cart is empty</p>
                        <p className='text-gray-400 text-lg'>Add some fashion items to get started!</p>
                        <button className='btn-primary mt-6' onClick={() => navigate("/")}>Continue Shopping</button>
                    </div>
                ) : (<>
                    <div className='space-y-4 mb-8'>
                        {cartItems?.map((item, index) => (
                            <CartItemCard data={item} key={index} />
                        ))}
                    </div>
                    <div className='bg-white p-6 rounded-2xl shadow-xl border border-gray-100'>

                        <h2 className='text-xl font-bold text-gray-800 mb-4'>Order Summary</h2>
                        <div className='space-y-3 mb-6'>
                            <div className='flex justify-between text-gray-600'>
                                <span>Subtotal ({cartItems.length} items)</span>
                                <span className='font-medium'>₹{totalAmount}</span>
                            </div>
                            <div className='flex justify-between text-gray-600'>
                                <span>Delivery Fee</span>
                                <span className='font-medium'>{totalAmount > 500 ? 'Free' : '₹40'}</span>
                            </div>
                            <hr className='border-gray-200' />
                            <div className='flex justify-between text-xl font-bold text-gray-800'>
                                <span>Total</span>
                                <span className='text-indigo-600'>₹{totalAmount + (totalAmount > 500 ? 0 : 40)}</span>
                            </div>
                        </div>
                        <button className='btn-primary w-full' onClick={()=>navigate("/checkout")}>Proceed to Checkout</button>
                    </div>
                </>
                )}
            </div>
        </div>
    )
}

export default CartPage
