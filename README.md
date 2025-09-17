## EzRyde - Ride Hailing Web App

A full-stack ride-hailing web app built with the MERN stack. It provides separate views for Users and Captains, supporting ride booking, live ride tracking, real-time notifications management, and payments Integration.

✨ Features

👤 Authentication & Profiles

- Secure JWT-based login & registration for both Users and Captains.
- Profile management and secure logout flow.

🚗 Ride Management

- Users: Select pickup & destination → match with nearest captain → request ride.
- Captains: Accept/reject rides in real time with live updates.
- Ride history stored for both users & captains.

📊 Dashboards

- User Dashboard: Past rides with pickup & destination location, date, status & fare.
- Captain Dashboard: Rides accepted/rejected, distance covered, and earnings summary & Ride history.

📱 Responsive UI
- Modern design with Tailwind CSS for mobile, tablet, and desktop compatibility.

🛠️ Tech Stack

- Frontend: React.js, Tailwind CSS, React Router, Leaflet (for maps)
- Backend: Node.js, Express.js, Socket.io
- Database: MongoDB, MongoDB Atlas
- Auth: JWT (JSON Web Token)
