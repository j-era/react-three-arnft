/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-pascal-case */

import { Canvas } from "@react-three/fiber"
import React, { useRef } from "react"
import { ARNftProvider } from "../arnftContext"

const ARCanvas = ({
  arEnabled = true,
  interpolationFactor = 1,
  children,
  ...props
}) => {
  const ref = useRef()

  return (
    <>
      {arEnabled && (
        <video
          id="ar-video"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            objectFit: "cover",
          }}
          ref={ref}
          loop
          autoPlay
          muted
          playsInline
        ></video>
      )}
      <Canvas
        camera={arEnabled ? { position: [0, 0, 0] } : props.camera}
        {...props}
      >
        {arEnabled ? (
          <ARNftProvider video={ref} interpolationFactor={interpolationFactor}>
            {children}
          </ARNftProvider>
        ) : (
          children
        )}
      </Canvas>
    </>
  )
}

export default React.memo(ARCanvas)
