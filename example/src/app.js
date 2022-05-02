import React from "react"
import { ARCanvas, NFTMarker } from "react-three-arnft"

const marker = {
  width: 200,
  height: 200,
}

const App = () => {
  return (
    <ARCanvas
      interpolationFactor={1}
      dpr={window.devicePixelRatio}
      onCreated={({ gl }) => {
        gl.setSize(window.innerWidth, window.innerHeight)
      }}
    >
      
      <NFTMarker url={["../data/marker/pinball.fset", "../data/marker/pinball.fset3", "../data/marker/pinball.iset"]}>
        <mesh scale={[marker.width, marker.height, 10]}>
          <boxBufferGeometry args={[1, 1, 1]} />
          <meshNormalMaterial opacity={0.5} transparent={true} />
        </mesh>
      </NFTMarker>
      <NFTMarker url={"../data/marker/gaelle"}>
        <mesh scale={[marker.width, marker.height, 10]}>
          <boxBufferGeometry args={[1, 1, 1]} />
          <meshNormalMaterial opacity={0.5} transparent={true} />
        </mesh>
      </NFTMarker>
      
      <ambientLight />
    </ARCanvas>
  )
}

export default App
