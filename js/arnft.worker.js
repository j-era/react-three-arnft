/* eslint-disable no-undef */
importScripts("./ARToolkitNFT.js")

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
    case "addMarker": {
      addMarker(msg)
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

function addMarker(msg) {
  arController
    .loadNFTMarker(msg.marker)
    .then(function (nft) {
      arController.trackNFTMarkerId(nft.id)
      console.log("loadNFTMarker -> ", nft.id)
      console.log("nftMarker struct: ", nft)
      postMessage({ type: "markerAdded", end: true })
    })
    .catch(function (err) {
      console.error("Error in loading marker on Worker", err)
    })
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
