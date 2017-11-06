define('ember-cli-mirage/db', ['exports', 'ember-cli-mirage/db-collection', 'ember-cli-mirage/identity-manager', 'ember-cli-mirage/utils/inflector'], function (exports, _emberCliMirageDbCollection, _emberCliMirageIdentityManager, _emberCliMirageUtilsInflector) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  /**
   * The db, an identity map.
   * @class Db
   * @constructor
   * @public
   */

  var Db = (function () {
    function Db(initialData, identityManagers) {
      _classCallCheck(this, Db);

      this._collections = [];

      this.registerIdentityManagers(identityManagers);

      if (initialData) {
        this.loadData(initialData);
      }
    }

    /**
     * @method loadData
     * @param data
     * @public
     */

    _createClass(Db, [{
      key: 'loadData',
      value: function loadData(data) {
        for (var key in data) {
          this.createCollection(key, data[key]);
        }
      }

      /**
       * @method dump
       * @public
       */
    }, {
      key: 'dump',
      value: function dump() {
        return this._collections.reduce(function (data, collection) {
          data[collection.name] = collection.all();

          return data;
        }, {});
      }

      /**
       * @method createCollection
       * @param name
       * @param initialData
       * @public
       */
    }, {
      key: 'createCollection',
      value: function createCollection(name, initialData) {
        var _this = this;

        if (!this[name]) {
          (function () {
            var IdentityManager = _this.identityManagerFor(name);
            var newCollection = new _emberCliMirageDbCollection['default'](name, initialData, IdentityManager);

            Object.defineProperty(_this, name, {
              get: function get() {
                var recordsCopy = newCollection.all();

                ['insert', 'find', 'findBy', 'where', 'update', 'remove', 'firstOrCreate'].forEach(function (method) {
                  recordsCopy[method] = function () {
                    return newCollection[method].apply(newCollection, arguments);
                  };
                });

                return recordsCopy;
              }
            });

            _this._collections.push(newCollection);
          })();
        } else if (initialData) {
          this[name].insert(initialData);
        }

        return this;
      }

      /**
       * @method createCollections
       * @param ...collections
       * @public
       */
    }, {
      key: 'createCollections',
      value: function createCollections() {
        var _this2 = this;

        for (var _len = arguments.length, collections = Array(_len), _key = 0; _key < _len; _key++) {
          collections[_key] = arguments[_key];
        }

        collections.forEach(function (c) {
          return _this2.createCollection(c);
        });
      }

      /**
       * @method emptyData
       * @public
       */
    }, {
      key: 'emptyData',
      value: function emptyData() {
        this._collections.forEach(function (c) {
          return c.remove();
        });
      }

      /**
       * @method identityManagerFor
       * @param name
       * @public
       */
    }, {
      key: 'identityManagerFor',
      value: function identityManagerFor(name) {
        return this._identityManagers[(0, _emberCliMirageUtilsInflector.singularize)(name)] || this._identityManagers.application || _emberCliMirageIdentityManager['default'];
      }

      /**
       * @method registerIdentityManagers
       * @public
       */
    }, {
      key: 'registerIdentityManagers',
      value: function registerIdentityManagers(identityManagers) {
        this._identityManagers = identityManagers || {};
      }
    }]);

    return Db;
  })();

  exports['default'] = Db;
});