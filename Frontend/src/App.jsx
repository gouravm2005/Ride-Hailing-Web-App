import React from 'react'
import {Routes, Route} from 'react-router-dom'
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
import RideTracking from './pages/RideTracking'
import MapComponent from './components/MapComponent'
import PrivateRoute from './components/PrivateRoute'


function App() {
  return (
    <>
      <Routes>
        <Route path='/Home' element={<Home/>}/>
        <Route path='/CaptainSignup' element={<CaptainSignup/>}/>
        <Route path='/Captainlogin' element={<Captainlogin/>}/>
        <Route path='/UserSignup' element={<UserSignup/>}/>
        <Route path='/Userlogin' element={<Userlogin/>}/>
      <Route path='/UserHome' element={<PrivateRoute> <UserHome/></PrivateRoute>}/>
      <Route path='/CaptainHome' element={<PrivateRoute> <CaptainHome/></PrivateRoute>}/>
        <Route path='/RideTracking' element={<RideTracking/>}/>
        <Route path='/UserRides' element={<UserRides/>}/>
        <Route path='/CaptainRides' element={<CaptainRides/>}/>
        <Route path='/UserNotification' element={<UserNotification/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Support' element={<Support/>}/>
        {/* <Route path='/UserProfile' element={<PrivateRoute><UserProfile/></PrivateRoute>}/> */}
        <Route path='/MapComponent' element={<MapComponent/>}/>
      </Routes>
    </>
  )
}

export default App
