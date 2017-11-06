define('moment/index', ['exports', 'moment/lib'], function (exports, _lib) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  function compare(a, b) {
    if (_lib.default.isMoment(a) && _lib.default.isMoment(b)) {
      if (a.isBefore(b)) {
        return -1;
      } else if (a.isSame(b)) {
        return 0;
      } else {
        return 1;
      }
    }

    throw new Error('Arguments provided to `compare` are not moment objects');
  }

  _lib.default.prototype.compare = compare;
  _lib.default.compare = compare;

  _lib.default.prototype.clone = function clone() {
    return (0, _lib.default)(this);
  };

  exports.default = _lib.default;
});