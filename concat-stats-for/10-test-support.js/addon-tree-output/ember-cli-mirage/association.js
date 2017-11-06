define("ember-cli-mirage/association", ["exports"], function (exports) {
  var association = function association() {
    for (var _len = arguments.length, traitsAndOverrides = Array(_len), _key = 0; _key < _len; _key++) {
      traitsAndOverrides[_key] = arguments[_key];
    }

    var __isAssociation__ = true;
    return {
      __isAssociation__: __isAssociation__,
      traitsAndOverrides: traitsAndOverrides
    };
  };

  exports["default"] = association;
});