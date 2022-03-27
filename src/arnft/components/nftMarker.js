import React from "react"
import { useNftMarker } from "../arnftContext"

const NFTMarker = ({ children, url }) => {
  const ref = useNftMarker(url)

  return (
    <group ref={ref} visible={false}>
      {children}
    </group>
  )
}

export default NFTMarker
