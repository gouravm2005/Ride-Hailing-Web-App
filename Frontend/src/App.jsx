import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'
import CaptainSignup from './pages/CaptainSignup'
import Captainlogin from './pages/Captainlogin'
import UserSignup from './pages/UserSignup'
import Userlogin from './pages/Userlogin'
import Home from './pages/Home'
import UserHome from './pages/UserHome'
import CaptainHome from './pages/CaptainHome'
import UserRides from './pages/UserRides'
import CaptainRides from './pages/CaptainRides'
import About from './pages/About'
import Support from './pages/Support'
// import UserProfile from './pages/UserProfile'
import UserNotification from './pages/UserNotification'
import CaptainNotification from './pages/CaptainNotification'
import NotificationsPage from './components/NotificationsPage'
import RideTracking from './pages/RideTracking'
import MapComponent from './components/MapComponent'
import UserPrivateRoute from './components/UserPrivateRoute'
import CaptainPrivateRoute from './components/CaptainPrivateRoute'

import SocketProvider from './components/SocketProvider';
import NotificationPopup from './components/NotificationPopup';
import ProtectedRoute from './components/ProtectedRoute';
import Payment from './pages/Payment';
import UserLayout from './pages/UserLayout';
import CaptainLayout from './pages/CaptainLayout';


function App() {
  return (
    <SocketProvider>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<Home/>}/>
        <Route path='/Home' element={<Home/>}/>
        <Route path='/CaptainSignup' element={<CaptainSignup/>}/>
        <Route path='/Captainlogin' element={<Captainlogin/>}/>
        <Route path='/UserSignup' element={<UserSignup/>}/>
        <Route path='/Userlogin' element={<Userlogin/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Support' element={<Support/>}/>
        <Route path='/MapComponent' element={<MapComponent/>}/>
        <Route path='/NotificationsPage' element={<NotificationsPage />} />
        <Route path='/Payment' element={<Payment/>}/>

        {/* User routes with layout */}
        <Route element={<UserLayout />}>
          <Route path='/UserHome' element={<UserPrivateRoute><UserHome /></UserPrivateRoute>} />
          <Route path='/UserRides' element={<UserRides/>} />
          <Route path='/UserNotification' element={<UserNotification/>} />
          <Route path='/RideTracking' element={<RideTracking/>} />
        </Route>

        {/* Captain routes with layout */}
        <Route element={<CaptainLayout />}>
          <Route path='/CaptainHome' element={<CaptainPrivateRoute><CaptainHome /></CaptainPrivateRoute>} />
          <Route path='/CaptainRides' element={<CaptainRides/>} />
          <Route path='/CaptainNotification' element={<CaptainNotification/>} />
        </Route>
      </Routes>
    </SocketProvider>
  );
}

export default App
