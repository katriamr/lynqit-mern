import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { IoLocationSharp } from "react-icons/io5";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css"
import { setAddress, setLocation } from '../redux/mapSlice';
import { MdDeliveryDining } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import axios from 'axios';
import { FaMobileScreenButton } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { addMyOrder, setTotalAmount } from '../redux/userSlice';
function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap()
    map.setView([location.lat, location.lon], 16, { animate: true })
  }
  return null

}

function CheckOut() {
  const { location, address } = useSelector(state => state.map)
    const { cartItems ,totalAmount,userData} = useSelector(state => state.user)
  const [addressInput, setAddressInput] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const navigate=useNavigate()
  const dispatch = useDispatch()
  const apiKey = import.meta.env.VITE_GEOAPIKEY
  const deliveryFee=totalAmount>500?0:40
  const AmountWithDeliveryFee=totalAmount+deliveryFee




  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng
    dispatch(setLocation({ lat, lon: lng }))
    getAddressByLatLng(lat, lng)
  }
  const getCurrentLocation = () => {
      const latitude=userData.location.coordinates[1]
      const longitude=userData.location.coordinates[0]
      dispatch(setLocation({ lat: latitude, lon: longitude }))
      getAddressByLatLng(latitude, longitude)


  }

  const getAddressByLatLng = async (lat, lng) => {
    try {

      const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`)
      dispatch(setAddress(result?.data?.results[0].address_line2))
    } catch (error) {
      console.log(error)
    }
  }

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`)
      const { lat, lon } = result.data.features[0].properties
      dispatch(setLocation({ lat, lon }))
    } catch (error) {
      console.log(error)
    }
  }

  const handlePlaceOrder=async () => {
    try {
      const result=await axios.post(`${serverUrl}/api/order/place-order`,{
        paymentMethod,
        deliveryAddress:{
          text:addressInput,
          latitude:location.lat,
          longitude:location.lon
        },
        totalAmount:AmountWithDeliveryFee,
        cartItems
      },{withCredentials:true})

      if(paymentMethod=="cod"){
      dispatch(addMyOrder(result.data))
      navigate("/order-placed")
      }else{
        const orderId=result.data.orderId
        const razorOrder=result.data.razorOrder
          openRazorpayWindow(orderId,razorOrder)
       }

    } catch (error) {
      console.log(error)
    }
  }

const openRazorpayWindow=(orderId,razorOrder)=>{

  const options={
 key:import.meta.env.VITE_RAZORPAY_KEY_ID,
 amount:razorOrder.amount,
 currency:'INR',
 name:"LynQt",
 description:"Fashion Delivery Website",
 order_id:razorOrder.id,
 handler:async function (response) {
  try {
    const result=await axios.post(`${serverUrl}/api/order/verify-payment`,{
      razorpay_payment_id:response.razorpay_payment_id,
      orderId
    },{withCredentials:true})
        dispatch(addMyOrder(result.data))
      navigate("/order-placed")
  } catch (error) {
    console.log(error)
  }
 }
  }

  const rzp=new window.Razorpay(options)
  rzp.open()


}


  useEffect(() => {
    setAddressInput(address)
  }, [address])
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6 fade-in'>
      <div className=' absolute top-6 left-6 z-20' onClick={() => navigate("/cart")}>
        <IoIosArrowRoundBack size={35} className='text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors' />
      </div>
      <div className='w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 space-y-8 border border-gray-100'>
        <h1 className='text-4xl font-bold text-gray-800 text-center gradient-text'>Checkout</h1>

        <section>
          <h2 className='text-2xl font-semibold mb-4 flex items-center gap-3 text-gray-800'><IoLocationSharp className='text-indigo-600' /> Delivery Location</h2>
          <div className='flex gap-3 mb-4'>
            <input type="text" className='input-modern flex-1' placeholder='Enter your delivery address...' value={addressInput} onChange={(e) => setAddressInput(e.target.value)} />
            <button className='btn-secondary px-4 py-2' onClick={getLatLngByAddress}><IoSearchOutline size={20} /></button>
            <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors' onClick={getCurrentLocation}><TbCurrentLocation size={20} /></button>
          </div>
          <div className='rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg'>
            <div className='h-80 w-full'>
              <MapContainer
                className="w-full h-full"
                center={[location?.lat, location?.lon]}
                zoom={16}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker position={[location?.lat, location?.lon]} draggable eventHandlers={{ dragend: onDragEnd }} />
              </MapContainer>
            </div>
          </div>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-6 text-gray-800'>Payment Method</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className={`flex items-center gap-4 rounded-2xl border-2 p-6 text-left transition-all duration-200 cursor-pointer ${paymentMethod === "cod" ? "border-indigo-600 bg-indigo-50 shadow-lg" : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`} onClick={() => setPaymentMethod("cod")}>

              <span className='inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100'>
                <MdDeliveryDining className='text-green-600 text-2xl' />
              </span>
              <div >
                <p className='font-bold text-gray-800 text-lg'>Cash on Delivery</p>
                <p className='text-sm text-gray-600'>Pay when your fashion arrives</p>
              </div>

            </div>
            <div className={`flex items-center gap-4 rounded-2xl border-2 p-6 text-left transition-all duration-200 cursor-pointer ${paymentMethod === "online" ? "border-indigo-600 bg-indigo-50 shadow-lg" : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`} onClick={() => setPaymentMethod("online")}>

              <span className='inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100'>
                <FaMobileScreenButton className='text-blue-600 text-2xl' />
              </span>
              <span className='inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100'>
                <FaCreditCard className='text-purple-600 text-2xl' />
              </span>
              <div>
                <p className='font-bold text-gray-800 text-lg'>Online Payment</p>
                <p className='text-sm text-gray-600'>UPI / Credit / Debit Card</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-6 text-gray-800'>Order Summary</h2>
<div className='rounded-2xl border-2 border-gray-200 bg-gray-50 p-6 space-y-4'>
{cartItems.map((item,index)=>(
  <div key={index} className='flex justify-between items-center text-gray-700'>
<span className='font-medium'>{item.name} × {item.quantity}</span>
<span className='font-semibold'>₹{item.price*item.quantity}</span>
  </div>

))}
 <hr className='border-gray-300 my-4'/>
<div className='flex justify-between font-semibold text-gray-800 text-lg'>
  <span>Subtotal</span>
  <span>₹{totalAmount}</span>
</div>
<div className='flex justify-between text-gray-700'>
  <span>Delivery Fee</span>
  <span className='font-medium'>{deliveryFee==0?"Free":"₹40"}</span>
</div>
<div className='flex justify-between text-2xl font-bold text-indigo-600 pt-4 border-t border-gray-300'>
    <span>Total</span>
  <span>₹{AmountWithDeliveryFee}</span>
</div>
</div>
        </section>
        <button className='btn-primary w-full text-lg py-4' onClick={handlePlaceOrder}> {paymentMethod=="cod"?"Place Order":"Pay & Place Order"}</button>

      </div>
    </div>
  )
}

export default CheckOut
