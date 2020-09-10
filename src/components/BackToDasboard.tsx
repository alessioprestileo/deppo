import React from 'react'
import { navigate } from 'gatsby'

export const BackToDashbooard = () => {
  const handleClick = () => {
    navigate('/protected')
  }

  return (
    <button type="button" onClick={handleClick}>
      Back to dashbooard
    </button>
  )
}
