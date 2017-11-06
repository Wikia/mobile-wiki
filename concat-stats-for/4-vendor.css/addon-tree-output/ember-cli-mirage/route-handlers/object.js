define("ember-cli-mirage/route-handlers/object", ["exports"], function (exports) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var ObjectRouteHandler = (function () {
    function ObjectRouteHandler(schema, serializerOrRegistry, object) {
      _classCallCheck(this, ObjectRouteHandler);

      this.schema = schema;
      this.serializerOrRegistry = serializerOrRegistry;
      this.object = object;
    }

    _createClass(ObjectRouteHandler, [{
      key: "handle",
      value: function handle() /* request */{
        return this.object;
      }
    }]);

    return ObjectRouteHandler;
  })();

  exports["default"] = ObjectRouteHandler;
});