define('ember-cli-mirage/utils/extend', ['exports', 'lodash/assign', 'lodash/has'], function (exports, _lodashAssign, _lodashHas) {
  exports['default'] = function (protoProps, staticProps) {
    var parent = this;
    var child = undefined;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && (0, _lodashHas['default'])(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function () {
        return parent.apply(this, arguments);
      };
    }

    // Add static properties to the constructor function, if supplied.

    (0, _lodashAssign['default'])(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function Surrogate() {
      this.constructor = child;
    };

    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) {
      (0, _lodashAssign['default'])(child.prototype, protoProps);
    }
    // if (protoProps) { _assign(child.prototype, protoProps); }

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };
});