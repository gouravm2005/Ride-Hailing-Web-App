## EzRyde - Ride Hailing Web App

A full-stack ride-hailing web app built with the MERN stack. It provides separate views for Users and Captains, supporting ride booking, live ride tracking, real-time notifications management, and payments Integration.

✨ Features

👤 Authentication & Profiles

- Secure JWT-based login & registration for both Users and Captains.
- Profile management and secure logout flow.

🚗 Ride Management

- Users: Select pickup & destination → match with nearest captain → request ride.
- Captains: Accept/reject rides in real time with live DB updates.
- Ride history stored for both users & captains.

 🔔 Real-Time Notifications (Socket.io)

- Instant updates for **ride request, confirmation, start, completion, or cancellation**.
- Notifications appear both as **pop-ups** and inside the dedicated notification panel.

 🗺️ Live Ride Tracking

- Dynamic map view with **pickup, destination, and captain markers**.
- **ETA, distance, and time** automatically updated.
- Real-time captain marker & location updates without affecting pickup/destination points.

 💳 Payment Management

- Seamless payment confirmation at the end of each ride.
- Using the Stripe payment gateway.

📊 Dashboards

- User Dashboard: Past rides with pickup & destination location, date, status & fare.
- Captain Dashboard: Rides accepted/rejected, distance covered, and & Ride history.

📱 Responsive UI
- Modern design with Tailwind CSS for mobile, tablet, and desktop compatibility.

🛠️ Tech Stack

- Frontend: React.js, Tailwind CSS, React Router, Leaflet (for maps)
- Backend: Node.js, Express.js, Socket.io
- Database: MongoDB, MongoDB Atlas
- Auth: JWT (JSON Web Token)
- Payment: Stripe

## Installation & Setup 

### 1. Clone the Repository

```bash
git clone https://github.com/gouravm2005/Ride-Hailing-Web-App.git
cd Ride-Hailing-Web-App
```

### 2. Setup Backend
```bash
cd Backend
npm install
```

#### Create a `.env` file in the `Backend/ folder`:

```bash
PORT=5000
DB_Connect=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_api_key
```

#### Run the backend:
```bash 
npm start
```

### 3. Setup Frontend
```bash
cd Frontend
npm install
```

#### Create a `.env` file in the `Frontend/ folder`:

```bash
VITE_BASE_URL = http://localhost:5000
VITE_SOCKET_URL = http://localhost:5000
VITE_STRIPE_PUBLIC_KEY = your_stripe_public_key
```

#### Run the frontend:
```bash
npm run dev
```

## Running the Application 

- The frontend will run on `http://localhost:5173`  
- The backend will run on `http://localhost:5000`

## 🚀 Future Improvements

- In-app chat or call support between User and Captain  
- Support for additional payment methods (UPI, Wallets, Cash)  
- Ride rating and feedback system  
- Admin dashboard for monitoring rides and captains  

