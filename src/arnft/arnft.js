/* eslint-disable camelcase */
import { isMobile, setMatrix } from "./utils"

const workerScript = "./js/arnft.worker.js"

export class ARNft {
  constructor(
    cameraParamUrl,
    video,
    renderer,
    camera,
    onLoaded,
    interpolationFactor,
  ) {
    this.inputWidth = video.videoWidth
    this.inputHeight = video.videoHeight

    this.cameraParamUrl = cameraParamUrl
    this.video = video
    this.renderer = renderer
    this.camera = camera
    this.onLoaded = onLoaded

    this.camera.matrixAutoUpdate = false

    this.markers = []

    this.canvasProcess = document.createElement("canvas")
    this.contextProcess = this.canvasProcess.getContext("2d")

    this.initRenderer()

    this.worker = new Worker(workerScript)
    this.worker.onmessage = (e) => this.onWorkerMessage(e)
    this.worker.postMessage({
      type: "load",
      pw: this.pw,
      ph: this.ph,
      cameraParamUrl: this.cameraParamUrl,
      interpolationFactor: interpolationFactor,
    })
  }

  initRenderer() {
    const pScale = 320 / Math.max(this.inputWidth, (this.inputHeight / 3) * 4)
    const sScale = isMobile() ? window.outerWidth / this.inputWidth : 1

    const sw = this.inputWidth * sScale
    const sh = this.inputHeight * sScale

    this.w = this.inputWidth * pScale
    this.h = this.inputHeight * pScale

    this.pw = Math.max(this.w, (this.h / 3) * 4)
    this.ph = Math.max(this.h, (this.w / 4) * 3)

    this.ox = (this.pw - this.w) / 2
    this.oy = (this.ph - this.h) / 2

    this.canvasProcess.style.clientWidth = this.pw + "px"
    this.canvasProcess.style.clientHeight = this.ph + "px"
    this.canvasProcess.width = this.pw
    this.canvasProcess.height = this.ph

    console.log(
      "processCanvas:",
      this.canvasProcess.width,
      this.canvasProcess.height,
    )

    this.renderer.setSize(sw, sh, false) // false -> do not update css styles
  }

  loadMarkers(markers) {
    markers.forEach((marker) => (marker.root.matrixAutoUpdate = false))

    this.markers = markers
    this.worker.postMessage({
      type: "loadMarkers",
      markers: markers.map((marker) => marker.url),
    })
  }

  process() {
    this.contextProcess.fillStyle = "black"
    this.contextProcess.fillRect(0, 0, this.pw, this.ph)
    this.contextProcess.drawImage(
      this.video,
      0,
      0,
      this.inputWidth,
      this.inputHeight,
      this.ox,
      this.oy,
      this.w,
      this.h,
    )

    const imageData = this.contextProcess.getImageData(0, 0, this.pw, this.ph)
    this.worker.postMessage({ type: "process", imagedata: imageData }, [
      imageData.data.buffer,
    ])
  }

  onWorkerMessage(e) {
    const msg = e.data
    switch (msg.type) {
      case "loaded": {
        const proj = JSON.parse(msg.proj)
        const ratioW = this.pw / this.w
        const ratioH = this.ph / this.h
        const f = 2000.0
        const n = 0.1

        proj[0] *= ratioW
        proj[5] *= ratioH
        proj[10] = -(f / (f - n))
        proj[14] = -((f * n) / (f - n))

        setMatrix(this.camera.projectionMatrix, proj)

        this.onLoaded(msg)
        break
      }
      case "markersLoaded": {
        if (msg.end === true) {
          console.log(msg)
        }
        this.process()
        break
      }
      case "markerInfos": {
        this.onMarkerInfos(msg.markers)
        break
      }
      case "found": {
        console.log("found", msg)
        this.onFound(msg)
        break
      }
      case "lost": {
        console.log("lost", msg)
        this.onLost(msg)
        break
      }
      case "processNext": {
        this.process()
        break
      }
    }
  }

  onMarkerInfos(markerInfos) {
    console.log("markerInfos", markerInfos)
    markerInfos.forEach((markerInfo) => {
      this.markers[markerInfo.id].root.children[0].position.x =
        ((markerInfo.width / markerInfo.dpi) * 2.54 * 10) / 2.0
      this.markers[markerInfo.id].root.children[0].position.y =
        ((markerInfo.height / markerInfo.dpi) * 2.54 * 10) / 2.0
    })
  }

  onFound(msg) {
    const matrix = JSON.parse(msg.matrixGL_RH)
    const index = JSON.parse(msg.index)

    setMatrix(this.markers[index].root.matrix, matrix)

    this.markers.forEach((marker, i) => {
      marker.root.visible = i === index
    })
  }

  onLost(msg) {
    this.markers.forEach((marker) => {
      marker.root.visible = false
    })
  }
}
