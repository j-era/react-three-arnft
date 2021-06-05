import "core-js/modules/es.object.define-property.js";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable camelcase */
import { isMobile, setMatrix } from "./utils";
var workerScript = "./js/arnft.worker.js";
export var ARNft = /*#__PURE__*/function () {
  function ARNft(cameraParaUrl, video, renderer, camera, onLoaded, interpolationFactor) {
    var _this = this;

    _classCallCheck(this, ARNft);

    this.inputWidth = video.videoWidth;
    this.inputHeight = video.videoHeight;
    this.cameraParaUrl = cameraParaUrl;
    this.video = video;
    this.renderer = renderer;
    this.camera = camera;
    this.onLoaded = onLoaded;
    this.camera.matrixAutoUpdate = false;
    this.markerRoots = [];
    this.canvasProcess = document.createElement("canvas");
    this.contextProcess = this.canvasProcess.getContext("2d");
    this.initRenderer();
    this.worker = new Worker(workerScript);

    this.worker.onmessage = function (e) {
      return _this.onWorkerMessage(e);
    };

    this.worker.postMessage({
      type: "load",
      pw: this.pw,
      ph: this.ph,
      camera_para: this.cameraParaUrl,
      interpolationFactor: interpolationFactor
    });
  }

  _createClass(ARNft, [{
    key: "initRenderer",
    value: function initRenderer() {
      var pScale = 320 / Math.max(this.inputWidth, this.inputHeight / 3 * 4);
      var sScale = isMobile() ? window.outerWidth / this.inputWidth : 1;
      var sw = this.inputWidth * sScale;
      var sh = this.inputHeight * sScale;
      this.w = this.inputWidth * pScale;
      this.h = this.inputHeight * pScale;
      this.pw = Math.max(this.w, this.h / 3 * 4);
      this.ph = Math.max(this.h, this.w / 4 * 3);
      this.ox = (this.pw - this.w) / 2;
      this.oy = (this.ph - this.h) / 2;
      this.canvasProcess.style.clientWidth = this.pw + "px";
      this.canvasProcess.style.clientHeight = this.ph + "px";
      this.canvasProcess.width = this.pw;
      this.canvasProcess.height = this.ph;
      console.log("processCanvas:", this.canvasProcess.width, this.canvasProcess.height);
      this.renderer.setSize(sw, sh, false); // false -> do not update css styles
    }
  }, {
    key: "addMarker",
    value: function addMarker(url, root) {
      root.matrixAutoUpdate = false;
      this.markerRoots.push(root);
      this.worker.postMessage({
        type: "add",
        marker: "../" + url
      });
    }
  }, {
    key: "process",
    value: function process() {
      this.contextProcess.fillStyle = "black";
      this.contextProcess.fillRect(0, 0, this.pw, this.ph);
      this.contextProcess.drawImage(this.video, 0, 0, this.inputWidth, this.inputHeight, this.ox, this.oy, this.w, this.h);
      var imageData = this.contextProcess.getImageData(0, 0, this.pw, this.ph);
      this.worker.postMessage({
        type: "process",
        imagedata: imageData
      }, [imageData.data.buffer]);
    }
  }, {
    key: "onWorkerMessage",
    value: function onWorkerMessage(e) {
      var msg = e.data;

      switch (msg.type) {
        case "loaded":
          {
            var proj = JSON.parse(msg.proj);
            var ratioW = this.pw / this.w;
            var ratioH = this.ph / this.h;
            var f = 2000.0;
            var n = 0.1;
            proj[0] *= ratioW;
            proj[5] *= ratioH;
            proj[10] = -(f / (f - n));
            proj[14] = -(f * n / (f - n));
            setMatrix(this.camera.projectionMatrix, proj);
            this.onLoaded(msg);
            break;
          }

        case "endLoading":
          {
            if (msg.end === true) {
              console.log(msg);
            }

            break;
          }

        case "found":
          {
            console.log("found", msg);
            this.onFound(msg);
            break;
          }

        case "lost":
          {
            console.log("lost", msg);
            this.onLost(msg);
            break;
          }
      }

      this.process();
    }
  }, {
    key: "onFound",
    value: function onFound(msg) {
      var index = msg.index,
          matrixGL_RH = msg.matrixGL_RH;
      var markerRoot = this.markerRoots[index];
      var matrix = JSON.parse(matrixGL_RH);
      markerRoot.visible = true;
      setMatrix(markerRoot.matrix, matrix);
    }
  }, {
    key: "onLost",
    value: function onLost(msg) {
      var index = msg.index;
      var markerRoot = this.markerRoots[index];
      markerRoot.visible = false;
    }
  }]);

  return ARNft;
}();