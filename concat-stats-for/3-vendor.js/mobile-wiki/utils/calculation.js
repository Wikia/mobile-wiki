define("mobile-wiki/utils/calculation", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = containerSize;
  /**
   * Library with generic calculation functions
   */

  /**
   * @typedef {Object} ContainerSize
   * @property {number} width
   * @property {number} height
   */

  /**
   * Calculate container size based on max dimensions and aspect ratio of the content
   *
   * @param {number} maxWidth
   * @param {number} maxHeight
   * @param {number} contentWidth
   * @param {number} contentHeight
   * @returns {ContainerSize}
   */
  function containerSize(maxWidth, maxHeight, contentWidth, contentHeight) {
    var targetSize = {
      width: 0,
      height: 0
    };

    if (maxWidth < maxHeight) {
      targetSize.width = maxWidth;
      targetSize.height = Math.min(maxHeight, Math.floor(maxWidth * contentHeight / contentWidth));
    } else {
      targetSize.width = Math.min(maxWidth, Math.floor(maxHeight * contentWidth / contentHeight));
      targetSize.height = maxHeight;
    }

    return targetSize;
  }
});