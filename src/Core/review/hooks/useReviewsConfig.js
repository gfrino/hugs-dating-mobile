import React, { useContext } from 'react'

export const ReviewsConfigContext = React.createContext({})

export const ReviewsConfigProvider = ({ children, config }) => {
  const value = { config }

  return (
    <ReviewsConfigContext.Provider value={value}>
      {children}
    </ReviewsConfigContext.Provider>
  )
}

export const useReviewsConfig = () => useContext(ReviewsConfigContext)
