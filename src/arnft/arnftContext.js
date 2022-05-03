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

const ARNftProvider = ({ children, video, interpolationFactor, arEnabled }) => {
  const { gl, camera } = useThree()

  const [arnft, setARNft] = useState(null)

  const markersRef = useRef([])
  const arnftRef = useRef()

  const onLoaded = useCallback((msg) => {
    console.log("onLoaded", msg)

    setARNft(arnftRef.current)
  }, [])

  useEffect(() => {
    async function init() {
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
    }

    if (arEnabled) {
      init()
    }
  }, [])

  useEffect(() => {
    if (!arnft) {
      return
    }

    arnft.loadMarkers(markersRef.current)
  }, [arnft])

  const value = useMemo(() => {
    return { arnft, markersRef, arEnabled }
  }, [arnft, markersRef, arEnabled])

  return <ARNftContext.Provider value={value}>{children}</ARNftContext.Provider>
}

const useARNft = () => {
  const arValue = useContext(ARNftContext)
  return useMemo(() => ({ ...arValue }), [arValue])
}

const useNftMarker = (url) => {
  const ref = useRef()

  const { markersRef } = useARNft()

  useEffect(() => {
    const newMarkers = [...markersRef.current, { url, root: ref.current }]
    markersRef.current = newMarkers
  }, [])

  return ref
}

export { ARNftProvider, useARNft, useNftMarker, ARNftContext }
