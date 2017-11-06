define('ember-cli-mirage/orm/associations/belongs-to', ['exports', 'ember-cli-mirage/orm/associations/association', 'lodash/assign', 'ember-cli-mirage/utils/inflector', 'ember-cli-mirage/utils/normalize-name', 'ember-cli-mirage/assert'], function (exports, _emberCliMirageOrmAssociationsAssociation, _lodashAssign, _emberCliMirageUtilsInflector, _emberCliMirageUtilsNormalizeName, _emberCliMirageAssert) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  /**
   * The belongsTo association adds a fk to the owner of the association
   *
   * @class BelongsTo
   * @extends Association
   * @constructor
   * @public
   */

  var BelongsTo = (function (_Association) {
    _inherits(BelongsTo, _Association);

    function BelongsTo() {
      _classCallCheck(this, BelongsTo);

      _get(Object.getPrototypeOf(BelongsTo.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(BelongsTo, [{
      key: 'getForeignKeyArray',

      /**
       * @method getForeignKeyArray
       * @return {Array} Array of camelized name of the model owning the association
       * and foreign key for the association
       * @public
       */
      value: function getForeignKeyArray() {
        return [(0, _emberCliMirageUtilsInflector.camelize)(this.ownerModelName), this.getForeignKey()];
      }

      /**
       * @method getForeignKey
       * @return {String} Foreign key for the association
       * @public
       */
    }, {
      key: 'getForeignKey',
      value: function getForeignKey() {
        return (0, _emberCliMirageUtilsInflector.camelize)(this.key) + 'Id';
      }

      /**
       * Registers belongs-to association defined by given key on given model,
       * defines getters / setters for associated parent and associated parent's id,
       * adds methods for creating unsaved parent record and creating a saved one
       *
       * @method addMethodsToModelClass
       * @param {Function} ModelClass
       * @param {String} key the named key for the association
       * @public
       */
    }, {
      key: 'addMethodsToModelClass',
      value: function addMethodsToModelClass(ModelClass, key) {
        var modelPrototype = ModelClass.prototype;
        var association = this;
        var foreignKey = this.getForeignKey();
        var associationHash = _defineProperty({}, key, this);

        modelPrototype.belongsToAssociations = (0, _lodashAssign['default'])(modelPrototype.belongsToAssociations, associationHash);

        // Add to target's dependent associations array
        this.schema.addDependentAssociation(this, this.modelName);

        // TODO: look how this is used. Are these necessary, seems like they could be gotten from the above?
        // Or we could use a single data structure to store this information?
        modelPrototype.associationKeys.push(key);
        modelPrototype.associationIdKeys.push(foreignKey);

        Object.defineProperty(modelPrototype, foreignKey, {

          /*
            object.parentId
              - returns the associated parent's id
          */
          get: function get() {
            this._tempAssociations = this._tempAssociations || {};
            var tempParent = this._tempAssociations[key];
            var id = undefined;

            if (tempParent === null) {
              id = null;
            } else {

              if (association.isPolymorphic) {
                if (tempParent) {
                  id = { id: tempParent.id, type: tempParent.modelName };
                } else {
                  id = this.attrs[foreignKey];
                }
              } else {
                if (tempParent) {
                  id = tempParent.id;
                } else {
                  id = this.attrs[foreignKey];
                }
              }
            }

            return id;
          },

          /*
            object.parentId = (parentId)
              - sets the associated parent via id
          */
          set: function set(id) {
            var tempParent = undefined;

            if (id === null) {
              tempParent = null;
            } else if (id !== undefined) {
              if (association.isPolymorphic) {
                (0, _emberCliMirageAssert['default'])(typeof id === 'object', 'You\'re setting an ID on the polymorphic association \'' + association.key + '\' but you didn\'t pass in an object. Polymorphic IDs need to be in the form { type, id }.');
                tempParent = association.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(id.type)].find(id.id);
              } else {
                tempParent = association.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(association.modelName)].find(id);
                (0, _emberCliMirageAssert['default'])(tempParent, 'Couldn\'t find ' + association.modelName + ' with id = ' + id);
              }
            }

            this[key] = tempParent;
          }
        });

        Object.defineProperty(modelPrototype, key, {
          /*
            object.parent
              - returns the associated parent
          */
          get: function get() {
            this._tempAssociations = this._tempAssociations || {};

            var tempParent = this._tempAssociations[key];
            var foreignKeyId = this[foreignKey];
            var model = null;

            if (tempParent) {
              model = tempParent;
            } else if (foreignKeyId !== null) {
              if (association.isPolymorphic) {
                model = association.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(foreignKeyId.type)].find(foreignKeyId.id);
              } else {
                model = association.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(association.modelName)].find(foreignKeyId);
              }
            }

            return model;
          },

          /*
            object.parent = (parentModel)
              - sets the associated parent via model
             I want to jot some notes about hasInverseFor. There used to be an
            association.inverse() check, but adding polymorphic associations
            complicated this. `comment.commentable`, you can't easily check for an
            inverse since `comments: hasMany()` could be on any model.
             Instead of making it very complex and looking for an inverse on the
            association in isoaltion, it was much simpler to ask the model being
            passed in if it had an inverse for the setting model and with its
            association.
          */
          set: function set(model) {
            this._tempAssociations = this._tempAssociations || {};
            this._tempAssociations[key] = model;

            if (model && model.hasInverseFor(association)) {
              var inverse = model.inverseFor(association);

              model.associate(this, inverse);
            }
          }
        });

        /*
          object.newParent
            - creates a new unsaved associated parent
           TODO: document polymorphic
        */
        modelPrototype['new' + (0, _emberCliMirageUtilsInflector.capitalize)(key)] = function () {
          var modelName = undefined,
              attrs = undefined;

          if (association.isPolymorphic) {
            modelName = arguments[0];
            attrs = arguments[1];
          } else {
            modelName = association.modelName;
            attrs = arguments[0];
          }

          var parent = association.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(modelName)]['new'](attrs);

          this[key] = parent;

          return parent;
        };

        /*
          object.createParent
            - creates a new saved associated parent, and immediately persists both models
           TODO: document polymorphic
        */
        modelPrototype['create' + (0, _emberCliMirageUtilsInflector.capitalize)(key)] = function () {
          var modelName = undefined,
              attrs = undefined;
          if (association.isPolymorphic) {
            modelName = arguments[0];
            attrs = arguments[1];
          } else {
            modelName = association.modelName;
            attrs = arguments[0];
          }

          var parent = association.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(modelName)].create(attrs);

          this[key] = parent;
          this.save();

          return parent;
        };
      }

      /**
       *
       *
       * @public
      */
    }, {
      key: 'disassociateAllDependentsFromTarget',
      value: function disassociateAllDependentsFromTarget(model) {
        var _this = this;

        var owner = this.ownerModelName;
        var fk = undefined;

        if (this.isPolymorphic) {
          fk = { type: model.modelName, id: model.id };
        } else {
          fk = model.id;
        }

        var dependents = this.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(owner)].where(_defineProperty({}, this.getForeignKey(), fk));

        dependents.models.forEach(function (dependent) {
          dependent.disassociate(model, _this);
          dependent.save();
        });
      }
    }]);

    return BelongsTo;
  })(_emberCliMirageOrmAssociationsAssociation['default']);

  exports['default'] = BelongsTo;
});