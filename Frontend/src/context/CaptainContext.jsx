import React,{createContext, useState} from 'react'

export const CaptainDataContext = createContext();

export const CaptainContext = ({children}) => {
 const [captain, setCaptain] = useState(null)
 const [isLoading, setisLoading] = useState(false)
 const [error, seterror] = useState(null)

 const updateCaptain = (captainData) => {
  setCaptain(captainData);
 }

 const value = {
  captain,
  setCaptain,
  isLoading,
  setisLoading,
  error,
  seterror,
  updateCaptain
 }

 return (
  <CaptainDataContext.Provider value={value}>
   {children}
  </CaptainDataContext.Provider>
 )
}

