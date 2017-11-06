define('ember-cli-mirage/route-handlers/shorthands/get', ['exports', 'ember-cli-mirage/assert', 'ember-cli-mirage/route-handlers/shorthands/base', 'ember-cli-mirage', 'ember-cli-mirage/utils/inflector'], function (exports, _emberCliMirageAssert, _emberCliMirageRouteHandlersShorthandsBase, _emberCliMirage, _emberCliMirageUtilsInflector) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var GetShorthandRouteHandler = (function (_BaseShorthandRouteHandler) {
    _inherits(GetShorthandRouteHandler, _BaseShorthandRouteHandler);

    function GetShorthandRouteHandler() {
      _classCallCheck(this, GetShorthandRouteHandler);

      _get(Object.getPrototypeOf(GetShorthandRouteHandler.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(GetShorthandRouteHandler, [{
      key: 'handleStringShorthand',

      /*
        Retrieve a model/collection from the db.
         Examples:
          this.get('/contacts', 'contact');
          this.get('/contacts/:id', 'contact');
      */
      value: function handleStringShorthand(request, modelClass) {
        var modelName = this.shorthand;
        var camelizedModelName = (0, _emberCliMirageUtilsInflector.camelize)(modelName);

        (0, _emberCliMirageAssert['default'])(modelClass, 'The route handler for ' + request.url + ' is trying to access the ' + camelizedModelName + ' model, but that model doesn\'t exist. Create it using \'ember g mirage-model ' + modelName + '\'.');

        var id = this._getIdForRequest(request);
        if (id) {
          var model = modelClass.find(id);
          if (!model) {
            return new _emberCliMirage.Response(404);
          } else {
            return model;
          }
        } else if (this.options.coalesce && request.queryParams && request.queryParams.ids) {
          return modelClass.find(request.queryParams.ids);
        } else {
          return modelClass.all();
        }
      }

      /*
        Retrieve an array of collections from the db.
         Ex: this.get('/home', ['contacts', 'pictures']);
      */
    }, {
      key: 'handleArrayShorthand',
      value: function handleArrayShorthand(request, modelClasses) {
        var keys = this.shorthand;
        var id = this._getIdForRequest(request);

        /*
        If the first key is singular and we have an id param in
        the request, we're dealing with the version of the shorthand
        that has a parent model and several has-many relationships.
        We throw an error, because the serializer is the appropriate
        place for this now.
        */
        (0, _emberCliMirageAssert['default'])(!id || (0, _emberCliMirageUtilsInflector.singularize)(keys[0]) !== keys[0], 'It looks like you\'re using the "Single record with\n      related records" version of the array shorthand, in addition to opting\n      in to the model layer. This shorthand was made when there was no\n      serializer layer. Now that you\'re using models, please ensure your\n      relationships are defined, and create a serializer for the parent\n      model, adding the relationships there.');

        return modelClasses.map(function (modelClass) {
          return modelClass.all();
        });
      }
    }]);

    return GetShorthandRouteHandler;
  })(_emberCliMirageRouteHandlersShorthandsBase['default']);

  exports['default'] = GetShorthandRouteHandler;
});