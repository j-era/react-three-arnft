import React, { useEffect, useRef } from "react"
import { useARNft } from "../arnftContext"

const NFTMarker = ({ children, url }) => {
  const { arnft } = useARNft()
  const ref = useRef()

  useEffect(() => {
    if (!arnft) return

    arnft.addMarker(url, ref.current)
  }, [arnft, url])

  return (
    <group ref={ref} visible={false}>
      {children}
    </group>
  )
}

export default NFTMarker
