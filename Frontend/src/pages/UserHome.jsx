import {React,useState, useRef, useEffect} from "react";
import { Link } from "react-router-dom";
import Navbar2 from "../components/Navbar2"
import RideType from "../components/RideType"
import Location from "../components/Location"
import gsap from 'gsap'
import {useGSAP} from '@gsap/react'
import AvailableRide from "../components/AvailableRide";
import CaptainDetail from "../components/CaptainDetail";

const main = () => {
 const [pickup, setpickup] = useState('')
 const [destination, setdestination] = useState('')
 const [Data, setData] = useState('')
 const [panelOpen, setpanelOpen] = useState(false)
 const [panelClosed, setpanelClosed] = useState(false)
 const [FormFilled, setFormFilled] = useState(false)
 const [panelStep, setPanelStep] = useState('suggestions'); 
 const panelRef = useRef(null)

 const submitHandler = (e) => {
  e.preventDefault()
  setData({
   pickup:pickup,
   destination:destination
  })
 }

 useGSAP(function(){
  if (panelOpen) {
     gsap.to(panelRef.current,{
     height:'66%'
  })
 }
 else{
  gsap.to(panelRef.current,{
  height:'0%'
  })
 }
 },[panelOpen])

  useEffect(() => {
    // Check if both fields are filled
    if (pickup.trim() !== '' && destination.trim() !== '') {
      setFormFilled(true);
      setPanelStep('RideType')
    } else {
      setFormFilled(false);
      setPanelStep(true)
    }
  }, [pickup, destination]);

 return(
 <div className=' h-screen w-screen relative overflow-auto'>
  <Navbar2/>
  <div className='h-full w-full'>
  <div className="h-[80%] w-full md:w-1/2 md:h-[80%] md:absolute md:right-40 md:top-28 bg-cover bg-center bg-no-repeat bg-[url('https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif')]"></div>
  <div className={`w-full h-[35%] p-4 bg-white flex flex-col gap-4 absolute bottom-0 md:top-36 md:w-[30%] md:h-[50%] md:pl-20 md:mt-20 ${
            panelOpen
              ? "top-4 z-1 h-[32%] md:w-full md:h-[28%] md:top-3"
              : "bottom-0 md:top-36 md:pl-20 md:mt-20"
          }`}>
   {panelOpen && (
              <div className="absolute top-0 ">
                <svg onClick={()=>{setpanelOpen(false)}} xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="#3B82F6" color="#3B82F6">
<path d="M8.2929 17.7071C8.68342 18.0976 9.31659 18.0976 9.70711 17.7071C10.0976 17.3166 10.0976 16.6834 9.7071 16.2929L6.41419 13L20 13C20.5523 13 21 12.5523 21 12C21 11.4477 20.5523 11 20 11L6.41423 11L9.70707 7.7071C10.0976 7.31657 10.0976 6.68341 9.70706 6.29289C9.31653 5.90237 8.68337 5.90237 8.29285 6.2929L3.29823 11.2876C3.27977 11.3058 3.26202 11.3247 3.24501 11.3442C3.17745 11.4219 3.12387 11.5074 3.08425 11.5976C3.03045 11.7199 3.00042 11.855 3 11.997L3 12C3 12.0031 3.00001 12.0062 3.00004 12.0093C3.00118 12.135 3.02554 12.2553 3.06904 12.3659C3.11782 12.4902 3.19243 12.6067 3.2929 12.7071L8.2929 17.7071Z" fill="#3B82F6"></path>
</svg>
              </div>
            )}
   <h3 className='w-full h-15 pt-5 text-4xl md:text-6xl font-medium text-blue-400 pb-6'>Find a trip</h3>
   <form className='relative' onSubmit={submitHandler}>
   <div className='h-16 w-1 bg-black absolute top-7 left-5 md:top-7 md:left-5'></div>
   <input onClick={(e)=>{setpanelOpen(true)}} className='w-full h-12 rounded-md bg-gray-200 mb-5 pl-10' value={pickup} onChange={(e)=>{setpickup(e.target.value)}} type="text" placeholder="Add a Pickup location" />
   <input onClick={(e)=>{setpanelOpen(true)}} className='w-full h-12 rounded-md bg-gray-200 pl-10' value={destination} onChange={(e)=>{setdestination(e.target.value)}} type="text" placeholder="Add destination location" />
  <button onClick={(e)=>{setpanelOpen(true)}} className="w-1/3 h-12 shadow-sm mt-4 rounded-md text-lg font-medium text-white bg-blue-500">See Rides</button>
   </form>
  </div>

  <div ref={panelRef} className='absolute h-[0%] w-full bottom-0 z-0 '>
  {panelOpen && !FormFilled && <Location />}
  {/* {panelOpen && FormFilled && <RideType />} */}
  {panelStep === 'suggestions' && <Location />}
  {panelStep === 'RideType' && <RideType onSelectRide={() => setPanelStep('availableRide')} />}
  {panelStep === 'availableRide' && <AvailableRide onSelectCaptain={() => setPanelStep('captainDetail')} />}
  {panelStep === 'captainDetail' && <CaptainDetail />}
  </div>

  </div>
 </div>
 )
}

export default main;