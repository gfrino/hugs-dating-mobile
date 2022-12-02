import React, { useContext } from 'react'

export const ProfileAuthContext = React.createContext({})

export const ProfileAuthProvider = ({ children, authManager }) => {
  return (
    <ProfileAuthContext.Provider value={authManager}>
      {children}
    </ProfileAuthContext.Provider>
  )
}

export const useProfileAuth = () => useContext(ProfileAuthContext)
