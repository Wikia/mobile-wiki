define('ember-cli-mirage/route-handlers/shorthands/delete', ['exports', 'ember-cli-mirage/assert', 'ember-cli-mirage/route-handlers/shorthands/base', 'ember-cli-mirage/utils/inflector'], function (exports, _emberCliMirageAssert, _emberCliMirageRouteHandlersShorthandsBase, _emberCliMirageUtilsInflector) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var DeleteShorthandRouteHandler = (function (_BaseShorthandRouteHandler) {
    _inherits(DeleteShorthandRouteHandler, _BaseShorthandRouteHandler);

    function DeleteShorthandRouteHandler() {
      _classCallCheck(this, DeleteShorthandRouteHandler);

      _get(Object.getPrototypeOf(DeleteShorthandRouteHandler.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(DeleteShorthandRouteHandler, [{
      key: 'handleStringShorthand',

      /*
        Remove the model from the db of type *camelizedModelName*.
         This would remove the user with id :id:
          Ex: this.del('/contacts/:id', 'user');
      */
      value: function handleStringShorthand(request, modelClass) {
        var modelName = this.shorthand;
        var camelizedModelName = (0, _emberCliMirageUtilsInflector.camelize)(modelName);
        (0, _emberCliMirageAssert['default'])(modelClass, 'The route handler for ' + request.url + ' is trying to access the ' + camelizedModelName + ' model, but that model doesn\'t exist. Create it using \'ember g mirage-model ' + modelName + '\'.');

        var id = this._getIdForRequest(request);
        return modelClass.find(id).destroy();
      }

      /*
        Remove the model and child related models from the db.
         This would remove the contact with id `:id`, as well
        as this contact's addresses and phone numbers.
          Ex: this.del('/contacts/:id', ['contact', 'addresses', 'numbers');
      */
    }, {
      key: 'handleArrayShorthand',
      value: function handleArrayShorthand(request, modelClasses) {
        var id = this._getIdForRequest(request);

        var parent = modelClasses[0].find(id);
        var childTypes = modelClasses.slice(1).map(function (modelClass) {
          return (0, _emberCliMirageUtilsInflector.pluralize)(modelClass.camelizedModelName);
        });

        // Delete related children
        childTypes.forEach(function (type) {
          return parent[type].destroy();
        });
        parent.destroy();
      }
    }]);

    return DeleteShorthandRouteHandler;
  })(_emberCliMirageRouteHandlersShorthandsBase['default']);

  exports['default'] = DeleteShorthandRouteHandler;
});