define('ember-in-viewport/utils/is-in-viewport', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = isInViewport;

  var assign = _ember['default'].assign || _ember['default'].merge;

  var defaultTolerance = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  };

  function isInViewport() {
    var boundingClientRect = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var height = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var width = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    var tolerance = arguments.length <= 3 || arguments[3] === undefined ? defaultTolerance : arguments[3];
    var top = boundingClientRect.top;
    var left = boundingClientRect.left;
    var bottom = boundingClientRect.bottom;
    var right = boundingClientRect.right;

    var tolerances = assign(assign({}, defaultTolerance), tolerance);
    var topTolerance = tolerances.top;
    var leftTolerance = tolerances.left;
    var bottomTolerance = tolerances.bottom;
    var rightTolerance = tolerances.right;

    return top + topTolerance >= 0 && left + leftTolerance >= 0 && Math.round(bottom) - bottomTolerance <= Math.round(height) && Math.round(right) - rightTolerance <= Math.round(width);
  }
});