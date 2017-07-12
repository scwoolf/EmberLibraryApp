define("lodash/internal/reInterpolate", ["exports"], function (exports) {
  /** Used to match template delimiters. */
  var reInterpolate = /<%=([\s\S]+?)%>/g;

  exports["default"] = reInterpolate;
});