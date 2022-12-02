import React, { useContext } from 'react'

export const VendorConfigContext = React.createContext({})

export const VendorConfigProvider = ({ children, config }) => {
  const value = { config }

  return (
    <VendorConfigContext.Provider value={value}>
      {children}
    </VendorConfigContext.Provider>
  )
}

export const useVendorConfig = () => useContext(VendorConfigContext)
