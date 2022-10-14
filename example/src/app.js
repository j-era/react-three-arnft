import React from "react"
import { ARCanvas, NFTMarker } from "react-three-arnft"

const App = () => {
  return (
    <ARCanvas
      interpolationFactor={1}
      onCreated={({ gl }) => {
        gl.setSize(window.innerWidth, window.innerHeight)
      }}
    >
      <NFTMarker url={["../data/marker/pinball.fset", "../data/marker/pinball.fset3", "../data/marker/pinball.iset"]}>
        <mesh scale={[200, 200, 10]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshNormalMaterial opacity={0.5} transparent={true} />
        </mesh>
      </NFTMarker>
      <ambientLight />
    </ARCanvas>
  )
}

export default App
