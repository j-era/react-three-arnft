import React, { useEffect, useRef } from "react";
import { useARNft } from "../arnftContext";

var NFTMarker = function NFTMarker(_ref) {
  var children = _ref.children,
      url = _ref.url;

  var _useARNft = useARNft(),
      arnft = _useARNft.arnft;

  var ref = useRef();
  useEffect(function () {
    if (!arnft) return;
    arnft.addMarker(url, ref.current);
  }, [arnft, url]);
  return /*#__PURE__*/React.createElement("group", {
    ref: ref,
    visible: false
  }, children);
};

export default NFTMarker;