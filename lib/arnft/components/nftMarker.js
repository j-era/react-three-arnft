import React from "react";
import { useARNft, useNftMarker } from "../arnftContext";
var NFTMarker = function NFTMarker(_ref) {
  var children = _ref.children,
    url = _ref.url;
  var _useARNft = useARNft(),
    arEnabled = _useARNft.arEnabled;
  var ref = useNftMarker(url);
  return /*#__PURE__*/React.createElement("group", {
    ref: ref,
    visible: !arEnabled
  }, /*#__PURE__*/React.createElement("group", {
    name: "center"
  }, children));
};
export default NFTMarker;