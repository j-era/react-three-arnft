import "core-js/modules/es.array.slice.js";
export function isMobile() {
  return /Android|mobile|iPad|iPhone/i.test(navigator.userAgent);
}
export var setMatrix = function setMatrix(matrix, value) {
  var array = [];

  for (var key in value) {
    array[key] = value[key];
  }

  if (typeof matrix.elements.set === "function") {
    matrix.elements.set(array);
  } else {
    matrix.elements = [].slice.call(array);
  }
};