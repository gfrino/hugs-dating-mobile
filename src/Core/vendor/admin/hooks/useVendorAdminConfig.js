import React, { useContext } from 'react'

export const VendorAdminConfigContext = React.createContext({})

export const VendorAdminConfigProvider = ({ children, config }) => {
  const value = {
    config: config,
  }

  return (
    <VendorAdminConfigContext.Provider value={value}>
      {children}
    </VendorAdminConfigContext.Provider>
  )
}

export const useVendorAdminConfig = () => useContext(VendorAdminConfigContext)
