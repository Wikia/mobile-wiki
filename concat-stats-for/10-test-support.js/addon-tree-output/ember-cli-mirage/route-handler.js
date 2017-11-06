define('ember-cli-mirage/route-handler', ['exports', 'ember', 'ember-cli-mirage/assert', 'ember-cli-mirage/response', 'ember-cli-mirage/route-handlers/function', 'ember-cli-mirage/route-handlers/object', 'ember-cli-mirage/route-handlers/shorthands/get', 'ember-cli-mirage/route-handlers/shorthands/post', 'ember-cli-mirage/route-handlers/shorthands/put', 'ember-cli-mirage/route-handlers/shorthands/delete', 'ember-cli-mirage/route-handlers/shorthands/head'], function (exports, _ember, _emberCliMirageAssert, _emberCliMirageResponse, _emberCliMirageRouteHandlersFunction, _emberCliMirageRouteHandlersObject, _emberCliMirageRouteHandlersShorthandsGet, _emberCliMirageRouteHandlersShorthandsPost, _emberCliMirageRouteHandlersShorthandsPut, _emberCliMirageRouteHandlersShorthandsDelete, _emberCliMirageRouteHandlersShorthandsHead) {
  var _bind = Function.prototype.bind;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Promise = _ember['default'].RSVP.Promise;
  var isBlank = _ember['default'].isBlank;
  var typeOf = _ember['default'].typeOf;

  function isNotBlankResponse(response) {
    return response && !(typeOf(response) === 'object' && Object.keys(response).length === 0) && (Array.isArray(response) || !isBlank(response));
  }

  var DEFAULT_CODES = { get: 200, put: 204, post: 201, 'delete': 204 };

  function createHandler(_ref) {
    var verb = _ref.verb;
    var schema = _ref.schema;
    var serializerOrRegistry = _ref.serializerOrRegistry;
    var path = _ref.path;
    var rawHandler = _ref.rawHandler;
    var options = _ref.options;

    var handler = undefined;
    var args = [schema, serializerOrRegistry, rawHandler, path, options];
    var type = typeOf(rawHandler);

    if (type === 'function') {
      handler = new (_bind.apply(_emberCliMirageRouteHandlersFunction['default'], [null].concat(args)))();
    } else if (type === 'object') {
      handler = new (_bind.apply(_emberCliMirageRouteHandlersObject['default'], [null].concat(args)))();
    } else if (verb === 'get') {
      handler = new (_bind.apply(_emberCliMirageRouteHandlersShorthandsGet['default'], [null].concat(args)))();
    } else if (verb === 'post') {
      handler = new (_bind.apply(_emberCliMirageRouteHandlersShorthandsPost['default'], [null].concat(args)))();
    } else if (verb === 'put' || verb === 'patch') {
      handler = new (_bind.apply(_emberCliMirageRouteHandlersShorthandsPut['default'], [null].concat(args)))();
    } else if (verb === 'delete') {
      handler = new (_bind.apply(_emberCliMirageRouteHandlersShorthandsDelete['default'], [null].concat(args)))();
    } else if (verb === 'head') {
      handler = new (_bind.apply(_emberCliMirageRouteHandlersShorthandsHead['default'], [null].concat(args)))();
    }
    return handler;
  }

  var RouteHandler = (function () {
    function RouteHandler(_ref2) {
      var schema = _ref2.schema;
      var verb = _ref2.verb;
      var rawHandler = _ref2.rawHandler;
      var customizedCode = _ref2.customizedCode;
      var options = _ref2.options;
      var path = _ref2.path;
      var serializerOrRegistry = _ref2.serializerOrRegistry;

      _classCallCheck(this, RouteHandler);

      this.verb = verb;
      this.customizedCode = customizedCode;
      this.serializerOrRegistry = serializerOrRegistry;
      this.handler = createHandler({ verb: verb, schema: schema, path: path, serializerOrRegistry: serializerOrRegistry, rawHandler: rawHandler, options: options });
    }

    _createClass(RouteHandler, [{
      key: 'handle',
      value: function handle(request) {
        var _this = this;

        return new Promise(function (resolve) {
          _this._getMirageResponseForRequest(request).then(function (mirageResponse) {
            _this.serialize(mirageResponse, request).then(function (serializedMirageResponse) {
              resolve(serializedMirageResponse.toRackResponse());
            });
          });
        });
      }
    }, {
      key: '_getMirageResponseForRequest',
      value: function _getMirageResponseForRequest(request) {
        var result = undefined;
        try {
          /*
           We need to do this for the #serialize convenience method. Probably is
           a better way.
          */
          if (this.handler instanceof _emberCliMirageRouteHandlersFunction['default']) {
            this.handler.setRequest(request);
          }

          result = this.handler.handle(request);
        } catch (e) {
          if (e instanceof _emberCliMirageAssert.MirageError) {
            throw e;
          } else {
            var message = typeOf(e) === 'string' ? e : e.message;
            var error = new _emberCliMirageAssert.MirageError('Your ' + request.method + ' handler for the url ' + request.url + ' threw an error: ' + message);

            result = new _emberCliMirageResponse['default'](500, {}, error.message);
          }
        }

        return this._toMirageResponse(result);
      }
    }, {
      key: '_toMirageResponse',
      value: function _toMirageResponse(result) {
        var _this2 = this;

        var mirageResponse = undefined;

        return new Promise(function (resolve) {
          Promise.resolve(result).then(function (response) {
            if (response instanceof _emberCliMirageResponse['default']) {
              mirageResponse = result;
            } else {
              var code = _this2._getCodeForResponse(response);
              mirageResponse = new _emberCliMirageResponse['default'](code, {}, response);
            }
            resolve(mirageResponse);
          });
        });
      }
    }, {
      key: '_getCodeForResponse',
      value: function _getCodeForResponse(response) {
        var code = undefined;
        if (this.customizedCode) {
          code = this.customizedCode;
        } else {
          code = DEFAULT_CODES[this.verb];
          if (code === 204 && isNotBlankResponse(response)) {
            code = 200;
          }
        }
        return code;
      }
    }, {
      key: 'serialize',
      value: function serialize(mirageResponsePromise, request) {
        var _this3 = this;

        return new Promise(function (resolve) {
          Promise.resolve(mirageResponsePromise).then(function (mirageResponse) {
            mirageResponse.data = _this3.serializerOrRegistry.serialize(mirageResponse.data, request);
            resolve(mirageResponse);
          });
        });
      }
    }]);

    return RouteHandler;
  })();

  exports['default'] = RouteHandler;
});