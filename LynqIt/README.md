LynQt - Multi-Vendor Ecommerce Platform

A modern ecommerce platform connecting customers, shop owners, and delivery personnel with real-time tracking, secure payments, and role-based access.

🚀 Overview

Users can browse shops, order items, and track deliveries live.

Owners manage their shops, products, and orders.

Delivery boys receive nearby delivery requests and update progress in real time.

✨ Key Features

🔐 Multi-Role Authentication (User / Owner / Delivery) via JWT & Firebase

🗺️ Live Location & Tracking using Leaflet + Geolocation API

⚡ Real-Time Communication with Socket.io

💳 Online Payments through Razorpay (with COD option)

☁️ Cloudinary Uploads for product/shop images

📬 Email & OTP Verification for security and delivery confirmation

📊 Owner Dashboard with order analytics

📱 Responsive UI built with React & Tailwind

🧩 Tech Stack

Frontend: React 19, Redux Toolkit, Tailwind CSS, React Router, Axios, Socket.io Client, Leaflet
Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, Socket.io, Razorpay, Cloudinary, Nodemailer
Others: Firebase Auth, Docker, Nginx, Winston

🛠️ Setup
Backend
cd backend
npm install
npm run dev


Add .env with MongoDB, JWT, Razorpay, Cloudinary, and Email credentials.

Frontend
cd frontend
npm install
npm run dev


Add .env with Firebase API keys.

🔗 Core APIs

Auth: /api/auth/signup, /signin, /google-auth

Users: /api/user/current, /update-location

Shops: /api/shop/create-edit, /by-city/:city

Items: /api/item/add-item, /by-city/:city

Orders: /api/order/place-order, /update-status, /mark-as-delivered

📡 Real-Time & Map Integration

Socket.io powers live delivery tracking and order updates.

React-Leaflet shows real-time locations, routes, and delivery status.

🔒 Security

JWT tokens with HTTP-only cookies

bcrypt password hashing

Joi & Yup validation

Role-based access control

Encrypted API communications

📜 License

Open-source under the ISC License.