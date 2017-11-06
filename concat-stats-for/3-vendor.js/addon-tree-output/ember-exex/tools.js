define('ember-exex/tools', ['exports'], function (exports) {
  var replaceParams = function replaceParams(string, params) {
    return string.replace(/{([^}]*)}/g, function (match, key) {
      return params[key];
    });
  };

  exports.replaceParams = replaceParams;
  var merge = function merge(o, defaults) {
    if (o && defaults && typeof defaults === 'object') {
      if (!o) {
        o = {};
      }

      for (var p in defaults) {
        if (defaults.hasOwnProperty(p)) {
          if (typeof o[p] === 'undefined') {
            o[p] = defaults[p];
          }
        }
      }
    }
    return o;
  };

  exports.merge = merge;
  var renameFunction = function renameFunction(name, fn) {
    return new Function("return function (call) { return function " + name + " () { return call(this, arguments) }; };")()(Function.apply.bind(fn));
  };

  exports.renameFunction = renameFunction;
  var renameClass = function renameClass(Klazz, name) {
    var Renamed = renameFunction(name, Klazz);

    Renamed.prototype = Object.create(Klazz.prototype);
    Renamed.prototype.constructor = Renamed;
    Renamed.prototype.superclass = Klazz.prototype.superclass;

    return Renamed;
  };
  exports.renameClass = renameClass;
});