import React from "react"
import { useNftMarker } from "../arnftContext"

const NFTMarker = ({ children, url }) => {
  const ref = useNftMarker(url)

  return (
    <group ref={ref} visible={false}>
      <group name="center">{children}</group>
    </group>
  )
}

export default NFTMarker
