import React, { useEffect, useRef } from "react";
import { useARNft } from "../arnftContext";

var NFTMarker = function NFTMarker(_ref) {
  var children = _ref.children,
      url = _ref.url;
  var markerRoot = useRef();

  var _useARNft = useARNft(),
      arnft = _useARNft.arnft;

  useEffect(function () {
    if (!arnft) return;
    arnft.addMarker(url, markerRoot.current);
  }, [arnft, url]);
  return /*#__PURE__*/React.createElement("group", {
    ref: markerRoot
  }, children);
};

export default NFTMarker;
//# sourceMappingURL=nftMarker.js.map