import React from "react"
import { ARCanvas, NFTMarker } from "react-three-arnft"

const marker = {
  width: 200,
  height: 220,
}

const App = () => {
  return (
    <ARCanvas
      interpolationFactor={24}
      dpr={window.devicePixelRatio}
      onCreated={({ gl }) => {
        gl.setSize(window.innerWidth, window.innerHeight)
      }}
    >
      <NFTMarker url={"data/marker/pinball"}>
        <group position={[marker.width * 0.5, marker.height * 0.5, 0]}>
          <mesh scale={[marker.width, marker.height, 10]}>
            <boxBufferGeometry args={[1, 1, 1]} />
            <meshNormalMaterial opacity={0.5} transparent={true} />
          </mesh>
        </group>
      </NFTMarker>
      <ambientLight />
    </ARCanvas>
  )
}

export default App
