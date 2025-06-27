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
import Ride from './pages/Ride'
import Drive from './pages/Drive'
import About from './pages/About'
import Support from './pages/Support'
import UserProfile from './pages/UserProfile'
import UserNotification from './pages/UserNotification'
import RideTracking from './pages/RideTracking'


function App() {
  return (
    <>
      <Routes>
        <Route path='/Home' element={<Home/>}/>
        <Route path='/CaptainSignup' element={<CaptainSignup/>}/>
        <Route path='/Captainlogin' element={<Captainlogin/>}/>
        <Route path='/UserSignup' element={<UserSignup/>}/>
        <Route path='/Userlogin' element={<Userlogin/>}/>
        <Route path='/UserHome' element={<UserHome/>}/>
        <Route path='/CaptainHome' element={<CaptainHome/>}/>
        <Route path='/RideTracking' element={<RideTracking/>}/>
        <Route path='/Ride' element={<Ride/>}/>
        <Route path='/Drive' element={<Drive/>}/>
        <Route path='/UserNotification' element={<UserNotification/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Support' element={<Support/>}/>
        <Route path='/UserProfile' element={<UserProfile/>}/>
      </Routes>
    </>
  )
}

export default App
