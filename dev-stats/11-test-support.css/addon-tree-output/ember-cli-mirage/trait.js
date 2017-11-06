define("ember-cli-mirage/trait", ["exports"], function (exports) {
  var trait = function trait(extension) {
    var __isTrait__ = true;
    return {
      extension: extension,
      __isTrait__: __isTrait__
    };
  };

  exports["default"] = trait;
});