import React, {
  createContext,
  useMemo,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react"
import { useThree } from "@react-three/fiber"
import { ARNft } from "./arnft"

const constraints = {
  audio: false,
  video: {
    facingMode: "environment",
    width: 640,
    height: 480,
  },
}

const ARNftContext = createContext({})

const ARNftProvider = ({ children, video, interpolationFactor }) => {
  const { gl, camera } = useThree()
  const [arnft, setARNft] = useState(null)
  const arnftRef = useRef()

  const onLoaded = useCallback((msg) => {
    console.log("onLoaded", msg)

    setARNft(arnftRef.current)
  }, [])

  useEffect(async () => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    video.current.srcObject = stream
    video.current.onloadedmetadata = async (event) => {
      console.log(event.srcElement.videoWidth)
      console.log(event.srcElement.videoHeight)

      video.current.play()

      gl.domElement.width = event.srcElement.videoWidth
      gl.domElement.height = event.srcElement.videoHeight

      gl.domElement.style.objectFit = "cover"

      camera.updateProjectionMatrix()

      const arnft = new ARNft(
        "../data/camera_para.dat",
        video.current,
        gl,
        camera,
        onLoaded,
        interpolationFactor,
      )

      arnftRef.current = arnft
    }
  }, [])

  const value = useMemo(() => {
    return { arnft: arnft }
  }, [arnft])

  return <ARNftContext.Provider value={value}>{children}</ARNftContext.Provider>
}

const useARNft = () => {
  const arValue = useContext(ARNftContext)
  return useMemo(() => ({ ...arValue }), [arValue])
}

export { ARNftProvider, useARNft, ARNftContext }
