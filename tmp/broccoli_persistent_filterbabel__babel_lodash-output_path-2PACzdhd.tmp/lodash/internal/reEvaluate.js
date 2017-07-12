define("lodash/internal/reEvaluate", ["exports"], function (exports) {
  /** Used to match template delimiters. */
  var reEvaluate = /<%([\s\S]+?)%>/g;

  exports["default"] = reEvaluate;
});