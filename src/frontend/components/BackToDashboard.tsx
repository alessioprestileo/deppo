import React from 'react'
import { navigate } from 'gatsby'

export const BackToDashboard: React.FC = () => {
  const handleClick = () => {
    navigate('/protected')
  }

  return (
    <button type="button" onClick={handleClick}>
      Back to dashbooard
    </button>
  )
}
