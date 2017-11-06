define('ember-in-viewport/utils/check-scroll-direction', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = checkScrollDirection;
  var assert = _ember['default'].assert;
  var floor = Math.floor;

  function checkScrollDirection() {
    var lastPosition = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var newPosition = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var sensitivity = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    if (!lastPosition) {
      return 'none';
    }

    assert('sensitivity cannot be 0', sensitivity);

    var top = newPosition.top;
    var left = newPosition.left;
    var lastTop = lastPosition.top;
    var lastLeft = lastPosition.left;

    var delta = {
      top: floor((top - lastTop) / sensitivity) * sensitivity,
      left: floor((left - lastLeft) / sensitivity) * sensitivity
    };

    if (delta.top > 0) {
      return 'down';
    }

    if (delta.top < 0) {
      return 'up';
    }

    if (delta.left > 0) {
      return 'right';
    }

    if (delta.left < 0) {
      return 'left';
    }
  }
});