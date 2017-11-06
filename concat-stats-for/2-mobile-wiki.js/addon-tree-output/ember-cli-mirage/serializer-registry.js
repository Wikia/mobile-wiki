define('ember-cli-mirage/serializer-registry', ['exports', 'ember-cli-mirage/orm/model', 'ember-cli-mirage/orm/collection', 'ember-cli-mirage/serializer', 'ember-cli-mirage/serializers/json-api-serializer', 'ember-cli-mirage/utils/inflector', 'ember-cli-mirage/assert', 'lodash/assign'], function (exports, _emberCliMirageOrmModel, _emberCliMirageOrmCollection, _emberCliMirageSerializer, _emberCliMirageSerializersJsonApiSerializer, _emberCliMirageUtilsInflector, _emberCliMirageAssert, _lodashAssign) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var SerializerRegistry = (function () {
    function SerializerRegistry(schema) {
      var serializerMap = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      _classCallCheck(this, SerializerRegistry);

      this.schema = schema;
      this._serializerMap = serializerMap;
    }

    _createClass(SerializerRegistry, [{
      key: 'normalize',
      value: function normalize(payload, modelName) {
        return this.serializerFor(modelName).normalize(payload);
      }
    }, {
      key: 'serialize',
      value: function serialize(response, request) {
        var _this = this;

        this.request = request;

        if (this._isModelOrCollection(response)) {
          var serializer = this.serializerFor(response.modelName);

          return serializer.serialize(response, request);
        } else if (Array.isArray(response) && response.filter(this._isCollection).length) {
          return response.reduce(function (json, collection) {
            var serializer = _this.serializerFor(collection.modelName);

            if (serializer.embed) {
              json[(0, _emberCliMirageUtilsInflector.pluralize)(collection.modelName)] = serializer.serialize(collection, request);
            } else {
              json = (0, _lodashAssign['default'])(json, serializer.serialize(collection, request));
            }

            return json;
          }, {});
        } else {
          return response;
        }
      }
    }, {
      key: 'serializerFor',
      value: function serializerFor(type) {
        var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var _ref$explicit = _ref.explicit;
        var explicit = _ref$explicit === undefined ? false : _ref$explicit;

        var SerializerForResponse = this._serializerMap && this._serializerMap[(0, _emberCliMirageUtilsInflector.camelize)(type)];

        if (explicit) {
          (0, _emberCliMirageAssert['default'])(!!SerializerForResponse, 'You passed in ' + type + ' as an explicit serializer type but that serializer doesn\'t exist. Try running `ember g mirage-serializer ' + type + '`.');
        } else {
          SerializerForResponse = SerializerForResponse || this._serializerMap.application || _emberCliMirageSerializer['default'];

          (0, _emberCliMirageAssert['default'])(!SerializerForResponse || SerializerForResponse.prototype.embed || SerializerForResponse.prototype.root || new SerializerForResponse() instanceof _emberCliMirageSerializersJsonApiSerializer['default'], 'You cannot have a serializer that sideloads (embed: false) and disables the root (root: false).');
        }

        return new SerializerForResponse(this, type, this.request);
      }
    }, {
      key: '_isModel',
      value: function _isModel(object) {
        return object instanceof _emberCliMirageOrmModel['default'];
      }
    }, {
      key: '_isCollection',
      value: function _isCollection(object) {
        return object instanceof _emberCliMirageOrmCollection['default'];
      }
    }, {
      key: '_isModelOrCollection',
      value: function _isModelOrCollection(object) {
        return this._isModel(object) || this._isCollection(object);
      }
    }, {
      key: 'registerSerializers',
      value: function registerSerializers(newSerializerMaps) {
        var currentSerializerMap = this._serializerMap || {};
        this._serializerMap = (0, _lodashAssign['default'])(currentSerializerMap, newSerializerMaps);
      }
    }]);

    return SerializerRegistry;
  })();

  exports['default'] = SerializerRegistry;
});