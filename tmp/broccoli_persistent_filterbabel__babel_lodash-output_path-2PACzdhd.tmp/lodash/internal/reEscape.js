define("lodash/internal/reEscape", ["exports"], function (exports) {
  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g;

  exports["default"] = reEscape;
});