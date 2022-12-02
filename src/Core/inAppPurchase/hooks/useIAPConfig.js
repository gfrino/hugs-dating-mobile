import React, { useContext } from 'react'

export const IAPConfigContext = React.createContext({})

export const IAPConfigProvider = ({ children, config }) => {
  const value = { config }

  return (
    <IAPConfigContext.Provider value={value}>
      {children}
    </IAPConfigContext.Provider>
  )
}

export const useIAPConfig = () => useContext(IAPConfigContext)
