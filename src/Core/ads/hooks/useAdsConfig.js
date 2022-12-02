import React, { useContext } from 'react'

export const AdsConfigContext = React.createContext({})

export const AdsConfigProvider = ({ children, config }) => {
  const value = { config }

  return (
    <AdsConfigContext.Provider value={value}>
      {children}
    </AdsConfigContext.Provider>
  )
}

export const useAdsConfig = () => useContext(AdsConfigContext)
