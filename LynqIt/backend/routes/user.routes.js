import express from "express"
import { getCurrentUser, updateUserLocation, updateUser, deactivateUser } from "../controllers/user.controllers.js"
import isAuth from "../middlewares/isAuth.js"


const userRouter=express.Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.post('/update-location',isAuth,updateUserLocation)
userRouter.put('/update',isAuth,updateUser)
userRouter.delete('/deactivate',isAuth,deactivateUser)
export default userRouter
