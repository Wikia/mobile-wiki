define('ember-cli-mirage/route-handlers/function', ['exports', 'ember-cli-mirage/route-handlers/base'], function (exports, _emberCliMirageRouteHandlersBase) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var FunctionRouteHandler = (function (_BaseRouteHandler) {
    _inherits(FunctionRouteHandler, _BaseRouteHandler);

    function FunctionRouteHandler(schema, serializerOrRegistry, userFunction, path) {
      _classCallCheck(this, FunctionRouteHandler);

      _get(Object.getPrototypeOf(FunctionRouteHandler.prototype), 'constructor', this).call(this);
      this.schema = schema;
      this.serializerOrRegistry = serializerOrRegistry;
      this.userFunction = userFunction;
      this.path = path;
    }

    _createClass(FunctionRouteHandler, [{
      key: 'handle',
      value: function handle(request) {
        return this.userFunction(this.schema, request);
      }
    }, {
      key: 'setRequest',
      value: function setRequest(request) {
        this.request = request;
      }
    }, {
      key: 'serialize',
      value: function serialize(response, serializerType) {
        var serializer = undefined;

        if (serializerType) {
          serializer = this.serializerOrRegistry.serializerFor(serializerType, { explicit: true });
        } else {
          serializer = this.serializerOrRegistry;
        }

        return serializer.serialize(response, this.request);
      }
    }, {
      key: 'normalizedRequestAttrs',
      value: function normalizedRequestAttrs() {
        var path = this.path;
        var request = this.request;
        var requestHeaders = this.request.requestHeaders;

        var modelName = this.getModelClassFromPath(path);

        if (/x-www-form-urlencoded/.test(requestHeaders['Content-Type'])) {
          return this._getAttrsForFormRequest(request);
        } else {
          return this._getAttrsForRequest(request, modelName);
        }
      }
    }]);

    return FunctionRouteHandler;
  })(_emberCliMirageRouteHandlersBase['default']);

  exports['default'] = FunctionRouteHandler;
});