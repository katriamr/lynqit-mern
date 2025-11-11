import express from "express"
import { googleAuth, resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp } from "../controllers/auth.controllers.js"
import { signupValidation, signinValidation, forgotPasswordValidation, resetPasswordValidation } from "../utils/validation/auth.validation.js"
import validate from "../utils/validation/validate.js"

const authRouter = express.Router()

authRouter.post("/signup", validate(signupValidation), signUp)
authRouter.post("/signin", validate(signinValidation), signIn)
authRouter.get("/signout", signOut)
authRouter.post("/send-otp", validate(forgotPasswordValidation), sendOtp)
authRouter.post("/verify-otp", verifyOtp)
authRouter.post("/reset-password", validate(resetPasswordValidation), resetPassword)
authRouter.post("/google-auth", googleAuth)

export default authRouter