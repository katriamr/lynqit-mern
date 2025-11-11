import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { setMyShopData, clearMyShopData } from '../redux/ownerSlice'

function useGetMyshop() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
  useEffect(()=>{
  const fetchShop=async () => {
    try {
           const result=await axios.get(`${serverUrl}/api/shop/get-my`,{withCredentials:true})
            dispatch(setMyShopData(result.data))

    } catch (error) {
        console.log(error)
        // Clear shop data on error to prevent stale data
        dispatch(clearMyShopData())
    }
}
if(userData && userData.role === 'owner'){
    fetchShop()
} else {
    // Clear shop data if user is not an owner
    dispatch(clearMyShopData())
}

  },[userData])
}

export default useGetMyshop
