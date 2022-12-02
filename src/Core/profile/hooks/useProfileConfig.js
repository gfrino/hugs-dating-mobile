import React, { useContext } from 'react'

export const ProfileConfigContext = React.createContext({})

export const ProfileConfigProvider = ({ children, config }) => {
  const value = {
    config: config,
  }

  return (
    <ProfileConfigContext.Provider value={value}>
      {children}
    </ProfileConfigContext.Provider>
  )
}

export const useProfileConfig = () => useContext(ProfileConfigContext)
