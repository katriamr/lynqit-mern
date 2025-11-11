import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import itemRouter from "./routes/item.routes.js"
import shopRouter from "./routes/shop.routes.js"
import orderRouter from "./routes/order.routes.js"
import http from "http"
import { Server } from "socket.io"
import { socketHandler } from "./socket.js"
import logger from "./utils/logger.js"
import errorHandler from "./middlewares/errorHandler.js"
import morgan from "morgan"

const app = express()
const server = http.createServer(app)

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["POST", "GET"]
  }
})

// Attach io instance to app (for use in routes/controllers if needed)
app.set("io", io)

// Middleware setup
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan("combined", { stream: logger.stream }))

// API Routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/shop", shopRouter)
app.use("/api/item", itemRouter)
app.use("/api/order", orderRouter)

// Socket setup
socketHandler(io)

// Global error handler
app.use(errorHandler)

// 404 handler (for unmatched routes)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION 💥 Shutting down...", {
    error: err.name,
    message: err.message,
    stack: err.stack
  })
  server.close(() => process.exit(1))
})

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION 💥 Shutting down...", {
    error: err.name,
    message: err.message,
    stack: err.stack
  })
  process.exit(1)
})

const port = process.env.PORT || 5000

server.listen(port, () => {
  connectDb()
  logger.info(`🚀 Server started on port ${port}`)
})
