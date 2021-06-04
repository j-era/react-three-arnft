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
    case "add": {
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
  console.log("Loading marker at: ", msg.marker)
  console.log("Loading camera at: ", msg.camera_para)
  console.log("Setting interpolation factor to: ", msg.interpolationFactor)

  try {
    arController = await ARToolkitNFT.ARControllerNFT.initWithDimensions(
      msg.pw,
      msg.ph,
      msg.camera_para,
    )

    arController.addEventListener("getNFTMarker", function (e) {
      currentMarkerResult = {
        type: "found",
        data: e.data,
      }
    })

    arController.addEventListener("lostNFTMarker", function (e) {
      currentMarkerResult = {
        type: "lost",
        data: e.data,
      }
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
      postMessage({ type: "endLoading", end: true })
    })
    .catch(function (err) {
      console.error("Error in loading marker on Worker", err)
    })
}

function process() {
  currentMarkerResult = null

  if (arController && arController.process) {
    arController.process(nextImageData)
  }

  if (currentMarkerResult) {
    const worldMatrix = currentMarkerResult.data.matrixGL_RH

    for (let i = 0; i < worldMatrix.length; i++) {
      currentMatrix.delta[i] = worldMatrix[i] - currentMatrix.interpolated[i]
      currentMatrix.interpolated[i] =
        currentMatrix.interpolated[i] +
        currentMatrix.delta[i] / interpolationFactor
    }

    postMessage({
      type: currentMarkerResult.type,
      index: currentMarkerResult.data.index,
      matrixGL_RH: JSON.stringify(currentMatrix.interpolated),
    })
  } else {
    postMessage({ type: "not found" })
  }

  nextImageData = null
}
