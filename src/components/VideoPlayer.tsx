import React from 'react'
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy'

export const VideoPlayer: React.FC<ReactPlayerProps> = (props) => (
  <ReactPlayer {...props} />
)
