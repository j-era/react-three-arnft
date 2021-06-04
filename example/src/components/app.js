import React from "react"
import { ARCanvas, NFTMarker } from "react-three-arnft"

const marker = {
  width: 220 * 0.79931640625,
  height: 220,
}

function Scene({ preview }) {
  const position = !preview
    ? [marker.width * 0.5, marker.height * 0.5, 0]
    : [0, 0, -300]

  return (
    <group position={position}>
      <mesh scale={[marker.width, marker.height, 1]}>
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshNormalMaterial opacity={0.2} transparent={true} />
      </mesh>
    </group>
  )
}

const App = ({ preview }) => {
  return (
    <ARCanvas
      arEnabled={!preview}
      gl={{ antialias: true, powerPreference: "default" }}
      dpr={window.devicePixelRatio}
      onCreated={({ gl, scene }) => {
        gl.physicallyCorrectLights = true
        gl.setSize(window.innerWidth, window.innerHeight)
      }}
    >
      <NFTMarker url={"data/marker/pinball"}>
        <Scene preview={preview} />
      </NFTMarker>
      <ambientLight />
      <pointLight position={[10, 10, 0]} intensity={10.0} />
    </ARCanvas>
  )
}

export default App
