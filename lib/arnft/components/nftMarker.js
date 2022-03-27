import React from "react";
import { useNftMarker } from "../arnftContext";

var NFTMarker = function NFTMarker(_ref) {
  var children = _ref.children,
      url = _ref.url;
  var ref = useNftMarker(url);
  return /*#__PURE__*/React.createElement("group", {
    ref: ref,
    visible: false
  }, children);
};

export default NFTMarker;