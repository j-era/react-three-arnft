/* eslint-disable no-undef */

const browser = (function () {
  const test = function (regexp) {
    return regexp.test(navigator.userAgent)
  }
  switch (true) {
    case test(/edg/i):
      return "Microsoft Edge"
    case test(/trident/i):
      return "Microsoft Internet Explorer"
    case test(/firefox|fxios/i):
      return "Mozilla Firefox"
    case test(/opr\//i):
      return "Opera"
    case test(/ucbrowser/i):
      return "UC Browser"
    case test(/samsungbrowser/i):
      return "Samsung Browser"
    case test(/chrome|chromium|crios/i):
      return "Google Chrome"
    case test(/safari/i):
      return "Apple Safari"
    default:
      return "Other"
  }
})()

if (browser === "Apple Safari") {
  importScripts("./ARToolkitNFT.js")
} else {
  importScripts("./ARToolkitNFT_simd.js")
}

let arController = null
let currentMarkerResult = null
let nextImageData = null
let interpolationFactor = 1

const currentMatrix = {
  delta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  interpolated: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}

self.onmessage = function (e) {
  const msg = e.data
  switch (msg.type) {
    case "load": {
      load(msg)
      return
    }
    case "loadMarkers": {
      loadMarkers(msg.markers)
      return
    }
    case "process": {
      nextImageData = msg.imagedata
      process()
    }
  }
}

async function load(msg) {
  console.log("Loading camera at: ", msg.cameraParamUrl)
  console.log("Setting interpolation factor to: ", msg.interpolationFactor)

  try {
    arController = await ARToolkitNFT.ARControllerNFT.initWithDimensions(
      msg.pw,
      msg.ph,
      msg.cameraParamUrl,
    )

    arController.addEventListener("getNFTMarker", function (e) {
      currentMarkerResult = e.data
    })

    interpolationFactor = msg.interpolationFactor

    postMessage({
      type: "loaded",
      proj: JSON.stringify(arController.getCameraMatrix()),
    })
  } catch (error) {
    console.error(error)
  }
}

function loadMarkers(markers) {
  arController.loadNFTMarkers(
    markers,
    function (ids) {
      const markers = ids.map((id, index) => {
        arController.trackNFTMarkerId(id)
        return arController.getNFTData(arController.id, index)
      })

      postMessage({
        type: "markerInfos",
        markers,
      })

      console.log("loadNFTMarkers -> ", ids)

      postMessage({ type: "markersLoaded", end: true })
    },
    function (err) {
      console.error("Error in loading marker on Worker", err)
    },
  )
}

function process() {
  if (arController && arController.process) {
    arController.process(nextImageData)
  }

  if (currentMarkerResult) {
    const matrix = currentMarkerResult.matrixGL_RH

    for (let i = 0; i < matrix.length; i++) {
      currentMatrix.delta[i] = matrix[i] - currentMatrix.interpolated[i]
      currentMatrix.interpolated[i] =
        currentMatrix.interpolated[i] +
        currentMatrix.delta[i] / interpolationFactor
    }

    postMessage({
      type: "found",
      index: JSON.stringify(currentMarkerResult.index),
      matrixGL_RH: JSON.stringify(currentMatrix.interpolated),
    })
  } else {
    postMessage({
      type: "lost",
    })
  }

  currentMarkerResult = null

  postMessage({ type: "processNext" })
}
