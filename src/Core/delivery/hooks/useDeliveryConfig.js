import React, { useContext } from 'react'

export const DeliveryConfigContext = React.createContext({})

export const DeliveryConfigProvider = ({ children, config }) => {
  const value = { config }

  return (
    <DeliveryConfigContext.Provider value={value}>
      {children}
    </DeliveryConfigContext.Provider>
  )
}

export const useDeliverConfig = () => useContext(DeliveryConfigContext)
