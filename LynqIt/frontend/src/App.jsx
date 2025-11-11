import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ErrorBoundary from './components/ErrorBoundary'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetCity from './hooks/useGetCity'
import useGetMyshop from './hooks/useGetMyShop'
import CreateEditShop from './pages/CreateEditShop'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import useGetShopByCity from './hooks/useGetShopByCity'
import useGetItemsByCity from './hooks/useGetItemsByCity'
import CartPage from './pages/CartPage'
import CheckOut from './pages/CheckOut'
import OrderPlaced from './pages/OrderPlaced'
import MyOrders from './pages/MyOrders'
import useGetMyOrders from './hooks/useGetMyOrders'
import useUpdateLocation from './hooks/useUpdateLocation'
import TrackOrderPage from './pages/TrackOrderPage'
import Shop from './pages/Shop'
import Profile from './pages/Profile'
import { io } from 'socket.io-client'
import { setSocket, setTheme } from './redux/userSlice'
import Footer from './components/Footer'
import Nav from './components/Nav'

export const serverUrl="http://localhost:8000"
function App() {
    const {userData, theme}=useSelector(state=>state.user)
    const dispatch=useDispatch()
  useGetCurrentUser()
useUpdateLocation()
  useGetCity()
  useGetMyshop()
  useGetShopByCity()
  useGetItemsByCity()
  useGetMyOrders()

  useEffect(()=>{
const socketInstance=io(serverUrl,{withCredentials:true})
dispatch(setSocket(socketInstance))
socketInstance.on('connect',()=>{
if(userData){
  socketInstance.emit('identity',{userId:userData._id})
}
})
return ()=>{
  socketInstance.disconnect()
}
  },[userData?._id])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    dispatch(setTheme(savedTheme))
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dispatch])

  return (
    <ErrorBoundary>
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-dark-primary' : ''}`}>
        {userData && <Nav />}
        <Routes>
          <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
          <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
          <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>}/>
          <Route path='/' element={userData?<Home/>:<Navigate to={"/signin"}/>}/>
          <Route path='/create-edit-shop' element={userData?<CreateEditShop/>:<Navigate to={"/signin"}/>}/>
          <Route path='/add-item' element={userData?<AddItem/>:<Navigate to={"/signin"}/>}/>
          <Route path='/edit-item/:itemId' element={userData?<EditItem/>:<Navigate to={"/signin"}/>}/>
          <Route path='/cart' element={userData?<CartPage/>:<Navigate to={"/signin"}/>}/>
          <Route path='/checkout' element={userData?<CheckOut/>:<Navigate to={"/signin"}/>}/>
          <Route path='/order-placed' element={userData?<OrderPlaced/>:<Navigate to={"/signin"}/>}/>
          <Route path='/my-orders' element={userData?<MyOrders/>:<Navigate to={"/signin"}/>}/>
          <Route path='/track-order/:orderId' element={userData?<TrackOrderPage/>:<Navigate to={"/signin"}/>}/>
          <Route path='/shop/:shopId' element={userData?<Shop/>:<Navigate to={"/signin"}/>}/>
          <Route path='/profile' element={userData?<Profile/>:<Navigate to={"/signin"}/>}/>
        </Routes>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme}
        />
      </div>
    </ErrorBoundary>
  )
}

export default App
