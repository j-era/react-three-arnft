import "core-js/modules/es.object.keys.js";
import "core-js/modules/es.array.index-of.js";
import "core-js/modules/es.symbol.js";
import "core-js/modules/es.object.assign.js";
import "core-js/modules/es.function.bind.js";
var _excluded = ["arEnabled", "interpolationFactor", "children"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-pascal-case */

import { Canvas } from "@react-three/fiber";
import React, { useRef } from "react";
import { ARNftProvider } from "../arnftContext";
var ARCanvas = function ARCanvas(_ref) {
  var _ref$arEnabled = _ref.arEnabled,
    arEnabled = _ref$arEnabled === void 0 ? true : _ref$arEnabled,
    _ref$interpolationFac = _ref.interpolationFactor,
    interpolationFactor = _ref$interpolationFac === void 0 ? 1 : _ref$interpolationFac,
    children = _ref.children,
    props = _objectWithoutProperties(_ref, _excluded);
  var ref = useRef();
  return /*#__PURE__*/React.createElement(React.Fragment, null, arEnabled && /*#__PURE__*/React.createElement("video", {
    id: "ar-video",
    style: {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      objectFit: "cover"
    },
    ref: ref,
    loop: true,
    autoPlay: true,
    muted: true,
    playsInline: true
  }), /*#__PURE__*/React.createElement(Canvas, _extends({
    camera: arEnabled ? {
      position: [0, 0, 0]
    } : props.camera
  }, props), /*#__PURE__*/React.createElement(ARNftProvider, {
    video: ref,
    interpolationFactor: interpolationFactor,
    arEnabled: arEnabled
  }, children)));
};
export default /*#__PURE__*/React.memo(ARCanvas);