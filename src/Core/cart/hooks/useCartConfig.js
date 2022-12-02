import React, { useContext } from 'react'

export const CartConfigContext = React.createContext({})

export const CartConfigProvider = ({ children, config }) => {
  const value = { config }

  return (
    <CartConfigContext.Provider value={value}>
      {children}
    </CartConfigContext.Provider>
  )
}

export const useCartConfig = () => useContext(CartConfigContext)
