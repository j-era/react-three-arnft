import React, { useEffect, useRef } from "react"
import { useARNft } from "../arnftContext"

const NFTMarker = ({ children, url }) => {
  const markerRoot = useRef()
  const { arnft } = useARNft()

  useEffect(() => {
    if (!arnft) return

    arnft.addMarker(url, markerRoot.current)
  }, [arnft, url])

  return <group ref={markerRoot}>{children}</group>
}

export default NFTMarker
