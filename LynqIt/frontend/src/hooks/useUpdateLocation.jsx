import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import {  setCurrentAddress, setCurrentCity, setCurrentState, setUserData } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useUpdateLocation() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)

    useEffect(()=>{
if(userData?.role === 'deliveryBoy') return // Delivery boys use socket updates instead

const updateLocation=async (lat,lon) => {
    try {
        const result=await axios.post(`${serverUrl}/api/user/update-location`,{lat,lon},{withCredentials:true})
        console.log(result.data)
    } catch (error) {
        console.error('Location update error:', error)
    }
}

if(navigator.geolocation) {
    navigator.geolocation.watchPosition((pos)=>{
        updateLocation(pos.coords.latitude,pos.coords.longitude)
    }, (error)=>{
        console.error('Geolocation error:', error)
    }, {
        enableHighAccuracy:true,
        timeout: 10000,
        maximumAge: 30000
    })
}
    },[userData])
}

export default useUpdateLocation
