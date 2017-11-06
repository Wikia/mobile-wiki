define('ember-cli-mirage/server', ['exports', 'ember-cli-mirage/utils/inflector', 'ember-cli-mirage/utils/normalize-name', 'ember-cli-mirage/ember-data', 'ember-cli-mirage/utils/ember-data', 'ember', 'ember-cli-mirage/utils/is-association', 'pretender', 'ember-cli-mirage/db', 'ember-cli-mirage/orm/schema', 'ember-cli-mirage/assert', 'ember-cli-mirage/serializer-registry', 'ember-cli-mirage/route-handler', 'lodash/pick', 'lodash/assign', 'lodash/find', 'lodash/isPlainObject', 'lodash/isInteger'], function (exports, _emberCliMirageUtilsInflector, _emberCliMirageUtilsNormalizeName, _emberCliMirageEmberData, _emberCliMirageUtilsEmberData, _ember, _emberCliMirageUtilsIsAssociation, _pretender, _emberCliMirageDb, _emberCliMirageOrmSchema, _emberCliMirageAssert, _emberCliMirageSerializerRegistry, _emberCliMirageRouteHandler, _lodashPick, _lodashAssign, _lodashFind, _lodashIsPlainObject, _lodashIsInteger) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Promise = _ember['default'].RSVP.Promise;

  /**
   * Creates a new Pretender instance.
   *
   * @method createPretender
   * @param {Server} server
   * @return {Object} A new Pretender instance.
   * @public
   */
  function createPretender(server) {
    return new _pretender['default'](function () {
      this.passthroughRequest = function (verb, path, request) {
        if (server.shouldLog()) {
          console.log('Passthrough request: ' + verb.toUpperCase() + ' ' + request.url);
        }
      };

      this.handledRequest = function (verb, path, request) {
        if (server.shouldLog()) {
          console.log('Mirage: [' + request.status + '] ' + verb.toUpperCase() + ' ' + request.url);
          var responseText = request.responseText;

          var loggedResponse = undefined;

          try {
            loggedResponse = JSON.parse(responseText);
          } catch (e) {
            loggedResponse = responseText;
          }

          console.log(loggedResponse);
        }
      };

      this.unhandledRequest = function (verb, path) {
        path = decodeURI(path);
        (0, _emberCliMirageAssert['default'])('Your Ember app tried to ' + verb + ' \'' + path + '\',\n         but there was no route defined to handle this request.\n         Define a route that matches this path in your\n         mirage/config.js file. Did you forget to add your namespace?');
      };
    });
  }

  var defaultRouteOptions = {
    coalesce: false,
    timing: undefined
  };

  var defaultPassthroughs = ['http://localhost:0/chromecheckurl', // mobile chrome
  'http://localhost:30820/socket.io' // electron
  ];
  exports.defaultPassthroughs = defaultPassthroughs;

  /**
   * Determine if the object contains a valid option.
   *
   * @method isOption
   * @param {Object} option An object with one option value pair.
   * @return {Boolean} True if option is a valid option, false otherwise.
   * @private
   */
  function isOption(option) {
    if (!option || typeof option !== 'object') {
      return false;
    }

    var allOptions = Object.keys(defaultRouteOptions);
    var optionKeys = Object.keys(option);
    for (var i = 0; i < optionKeys.length; i++) {
      var key = optionKeys[i];
      if (allOptions.indexOf(key) > -1) {
        return true;
      }
    }
    return false;
  }

  /**
   * Extract arguments for a route.
   *
   * @method extractRouteArguments
   * @param {Array} args Of the form [options], [object, code], [function, code]
   * [shorthand, options], [shorthand, code, options]
   * @return {Array} [handler (i.e. the function, object or shorthand), code,
   * options].
   * @private
   */
  function extractRouteArguments(args) {
    var _args$splice = args.splice(-1);

    var _args$splice2 = _slicedToArray(_args$splice, 1);

    var lastArg = _args$splice2[0];

    if (isOption(lastArg)) {
      lastArg = (0, _lodashAssign['default'])({}, defaultRouteOptions, lastArg);
    } else {
      args.push(lastArg);
      lastArg = defaultRouteOptions;
    }
    var t = 2 - args.length;
    while (t-- > 0) {
      args.push(undefined);
    }
    args.push(lastArg);
    return args;
  }

  /**
   *
   *
   * @class Server
   * @public
   */

  var Server = (function () {

    /**
     * Build the new server object.
     *
     * @constructor
     * @public
     */

    function Server() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Server);

      this.config(options);
    }

    _createClass(Server, [{
      key: 'config',
      value: function config() {
        var _config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var didOverrideConfig = _config.environment && this.environment && this.environment !== _config.environment;
        (0, _emberCliMirageAssert['default'])(!didOverrideConfig, 'You cannot modify Mirage\'s environment once the server is created');
        this.environment = _config.environment || 'development';

        this.options = _config;

        this.timing = this.timing || _config.timing || 400;
        this.namespace = this.namespace || _config.namespace || '';
        this.urlPrefix = this.urlPrefix || _config.urlPrefix || '';

        this._defineRouteHandlerHelpers();

        // Merge models from autogenerated Ember Data models with user defined models
        if (_emberCliMirageUtilsEmberData.hasEmberData && _config.discoverEmberDataModels) {
          var models = {};
          (0, _lodashAssign['default'])(models, (0, _emberCliMirageEmberData.getModels)(), _config.models || {});
          _config.models = models;
        }

        if (this.db) {
          this.db.registerIdentityManagers(_config.identityManagers);
        } else {
          this.db = new _emberCliMirageDb['default'](undefined, _config.identityManagers);
        }

        if (this.schema) {
          this.schema.registerModels(_config.models);
          this.serializerOrRegistry.registerSerializers(_config.serializers || {});
        } else {
          this.schema = new _emberCliMirageOrmSchema['default'](this.db, _config.models);
          this.serializerOrRegistry = new _emberCliMirageSerializerRegistry['default'](this.schema, _config.serializers);
        }

        var hasFactories = this._hasModulesOfType(_config, 'factories');
        var hasDefaultScenario = _config.scenarios && _config.scenarios.hasOwnProperty('default');

        this.pretender = this.pretender || createPretender(this);

        if (_config.baseConfig) {
          this.loadConfig(_config.baseConfig);
        }

        if (this.isTest()) {
          if (_config.testConfig) {
            this.loadConfig(_config.testConfig);
          }

          window.server = this; // TODO: Better way to inject server into test env
        }

        if (this.isTest() && hasFactories) {
          this.loadFactories(_config.factories);
        } else if (!this.isTest() && hasDefaultScenario) {
          this.loadFactories(_config.factories);
          _config.scenarios['default'](this);
        } else {
          this.loadFixtures();
        }

        if (_config.useDefaultPassthroughs) {
          this._configureDefaultPassthroughs();
        }
      }

      /**
       * Determines if the current environment is the testing environment.
       *
       * @method isTest
       * @return {Boolean} True if the environment is 'test', false otherwise.
       * @public
       */
    }, {
      key: 'isTest',
      value: function isTest() {
        return this.environment === 'test';
      }

      /**
       * Determines if the server should log.
       *
       * @method shouldLog
       * @return The value of this.logging if defined, or false if in the testing environment,
       * true otherwise.
       * @public
       */
    }, {
      key: 'shouldLog',
      value: function shouldLog() {
        return typeof this.logging !== 'undefined' ? this.logging : !this.isTest();
      }

      /**
       * Load the configuration given, setting timing to 0 if in the test
       * environment.
       *
       * @method loadConfig
       * @param {Object} config The configuration to load.
       * @public
       */
    }, {
      key: 'loadConfig',
      value: function loadConfig(config) {
        config.call(this);
        this.timing = this.isTest() ? 0 : this.timing || 0;
      }

      /**
       * Whitelist requests to the specified paths and allow them to pass through
       * your Mirage server to the actual network layer.
       *
       * @method passthrough
       * @param {String} [...paths] Any numer of paths to whitelist
       * @param {Array} options Unused
       * @public
       */
    }, {
      key: 'passthrough',
      value: function passthrough() {
        var _this = this;

        for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
          paths[_key] = arguments[_key];
        }

        var verbs = ['get', 'post', 'put', 'delete', 'patch'];
        var lastArg = paths[paths.length - 1];

        if (paths.length === 0) {
          // paths = ['http://localhost:7357'];
          paths = ['/**', '/'];
        } else if (Array.isArray(lastArg)) {
          verbs = paths.pop();
        }

        verbs.forEach(function (verb) {
          paths.forEach(function (path) {
            var fullPath = _this._getFullPath(path);
            _this.pretender[verb](fullPath, _this.pretender.passthrough);
          });
        });
      }

      /**
       * Load the all or only the specified fixtures into Mirage's database.
       *
       * @method loadFixtures
       * @param {String} [...args] The name of the fixture to load.
       * @public
       */
    }, {
      key: 'loadFixtures',
      value: function loadFixtures() {
        var fixtures = this.options.fixtures;

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        if (args.length) {
          var camelizedArgs = args.map(_emberCliMirageUtilsInflector.camelize);
          fixtures = _lodashPick['default'].apply(undefined, [fixtures].concat(_toConsumableArray(camelizedArgs)));
        }

        this.db.loadData(fixtures);
      }

      /*
        Factory methods
      */

      /**
       * Load factories into Mirage's database.
       *
       * @method loadFactories
       * @param {Object} factoryMap
       * @public
       */
    }, {
      key: 'loadFactories',
      value: function loadFactories() {
        var _this2 = this;

        var factoryMap = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        // Store a reference to the factories
        var currentFactoryMap = this._factoryMap || {};
        this._factoryMap = (0, _lodashAssign['default'])(currentFactoryMap, factoryMap);

        // Create a collection for each factory
        Object.keys(factoryMap).forEach(function (type) {
          var collectionName = (0, _emberCliMirageUtilsNormalizeName.toCollectionName)(type);
          _this2.db.createCollection(collectionName);
        });
      }

      /**
       * Get the factory for a given type.
       *
       * @method factoryFor
       * @param {String} type
       * @private
       */
    }, {
      key: 'factoryFor',
      value: function factoryFor(type) {
        var camelizedType = (0, _emberCliMirageUtilsInflector.camelize)(type);

        if (this._factoryMap && this._factoryMap[camelizedType]) {
          return this._factoryMap[camelizedType];
        }
      }
    }, {
      key: 'build',
      value: function build(type) {
        for (var _len3 = arguments.length, traitsAndOverrides = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          traitsAndOverrides[_key3 - 1] = arguments[_key3];
        }

        var traits = traitsAndOverrides.filter(function (arg) {
          return arg && typeof arg === 'string';
        });
        var overrides = (0, _lodashFind['default'])(traitsAndOverrides, function (arg) {
          return (0, _lodashIsPlainObject['default'])(arg);
        });
        var camelizedType = (0, _emberCliMirageUtilsInflector.camelize)(type);

        // Store sequence for factory type as instance variable
        this.factorySequences = this.factorySequences || {};
        this.factorySequences[camelizedType] = this.factorySequences[camelizedType] + 1 || 0;

        var OriginalFactory = this.factoryFor(type);
        if (OriginalFactory) {
          OriginalFactory = OriginalFactory.extend({});
          var attrs = OriginalFactory.attrs || {};
          this._validateTraits(traits, OriginalFactory, type);
          var mergedExtensions = this._mergeExtensions(attrs, traits, overrides);
          this._mapAssociationsFromAttributes(type, attrs);
          this._mapAssociationsFromAttributes(type, mergedExtensions);

          var Factory = OriginalFactory.extend(mergedExtensions);
          var factory = new Factory();

          var sequence = this.factorySequences[camelizedType];
          return factory.build(sequence);
        } else {
          return overrides;
        }
      }
    }, {
      key: 'buildList',
      value: function buildList(type, amount) {
        (0, _emberCliMirageAssert['default'])((0, _lodashIsInteger['default'])(amount), 'second argument has to be an integer, you passed: ' + typeof amount);

        var list = [];

        for (var _len4 = arguments.length, traitsAndOverrides = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
          traitsAndOverrides[_key4 - 2] = arguments[_key4];
        }

        for (var i = 0; i < amount; i++) {
          list.push(this.build.apply(this, [type].concat(traitsAndOverrides)));
        }

        return list;
      }
    }, {
      key: 'create',
      value: function create(type) {
        var _this3 = this;

        for (var _len5 = arguments.length, options = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
          options[_key5 - 1] = arguments[_key5];
        }

        // When there is a Model defined, we should return an instance
        // of it instead of returning the bare attributes.
        var traits = options.filter(function (arg) {
          return arg && typeof arg === 'string';
        });
        var overrides = (0, _lodashFind['default'])(options, function (arg) {
          return (0, _lodashIsPlainObject['default'])(arg);
        });
        var collectionFromCreateList = (0, _lodashFind['default'])(options, function (arg) {
          return arg && Array.isArray(arg);
        });

        var attrs = this.build.apply(this, [type].concat(_toConsumableArray(traits), [overrides]));
        var modelOrRecord = undefined;

        if (this.schema && this.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(type)]) {
          var modelClass = this.schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(type)];

          modelOrRecord = modelClass.create(attrs);
        } else {
          var collection = undefined,
              collectionName = undefined;

          if (collectionFromCreateList) {
            collection = collectionFromCreateList;
          } else {
            collectionName = this.schema ? (0, _emberCliMirageUtilsNormalizeName.toCollectionName)(type) : (0, _emberCliMirageUtilsInflector.pluralize)(type);
            collection = this.db[collectionName];
          }

          (0, _emberCliMirageAssert['default'])(collection, 'You called server.create(' + type + ') but no model or factory was found. Try `ember g mirage-model ' + type + '`.');
          modelOrRecord = collection.insert(attrs);
        }

        var OriginalFactory = this.factoryFor(type);
        if (OriginalFactory) {
          OriginalFactory.extractAfterCreateCallbacks({ traits: traits }).forEach(function (afterCreate) {
            afterCreate(modelOrRecord, _this3);
          });
        }

        return modelOrRecord;
      }
    }, {
      key: 'createList',
      value: function createList(type, amount) {
        (0, _emberCliMirageAssert['default'])((0, _lodashIsInteger['default'])(amount), 'second argument has to be an integer, you passed: ' + typeof amount);

        var list = [];
        var collectionName = this.schema ? (0, _emberCliMirageUtilsNormalizeName.toCollectionName)(type) : (0, _emberCliMirageUtilsInflector.pluralize)(type);
        var collection = this.db[collectionName];

        for (var _len6 = arguments.length, traitsAndOverrides = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
          traitsAndOverrides[_key6 - 2] = arguments[_key6];
        }

        for (var i = 0; i < amount; i++) {
          list.push(this.create.apply(this, [type].concat(traitsAndOverrides, [collection])));
        }

        return list;
      }
    }, {
      key: 'shutdown',
      value: function shutdown() {
        this.pretender.shutdown();
        if (this.environment === 'test') {
          window.server = undefined;
        }
      }
    }, {
      key: 'resource',
      value: function resource(resourceName) {
        var _this4 = this;

        var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var only = _ref.only;
        var except = _ref.except;
        var path = _ref.path;

        path = path || '/' + resourceName;
        only = only || [];
        except = except || [];

        if (only.length > 0 && except.length > 0) {
          throw 'cannot use both :only and :except options';
        }

        var actionsMethodsAndsPathsMappings = {
          index: { methods: ['get'], path: '' + path },
          show: { methods: ['get'], path: path + '/:id' },
          create: { methods: ['post'], path: '' + path },
          update: { methods: ['put', 'patch'], path: path + '/:id' },
          'delete': { methods: ['del'], path: path + '/:id' }
        };

        var allActions = Object.keys(actionsMethodsAndsPathsMappings);
        var actions = only.length > 0 && only || except.length > 0 && allActions.filter(function (action) {
          return except.indexOf(action) === -1;
        }) || allActions;

        actions.forEach(function (action) {
          var methodsWithPath = actionsMethodsAndsPathsMappings[action];

          methodsWithPath.methods.forEach(function (method) {
            return path === resourceName ? _this4[method](methodsWithPath.path) : _this4[method](methodsWithPath.path, resourceName);
          });
        });
      }

      /**
       *
       * @private
       */
    }, {
      key: '_defineRouteHandlerHelpers',
      value: function _defineRouteHandlerHelpers() {
        var _this5 = this;

        [['get'], ['post'], ['put'], ['delete', 'del'], ['patch'], ['head']].forEach(function (_ref2) {
          var _ref22 = _slicedToArray(_ref2, 2);

          var verb = _ref22[0];
          var alias = _ref22[1];

          _this5[verb] = function (path) {
            for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
              args[_key7 - 1] = arguments[_key7];
            }

            var _extractRouteArguments = extractRouteArguments(args);

            var _extractRouteArguments2 = _slicedToArray(_extractRouteArguments, 3);

            var rawHandler = _extractRouteArguments2[0];
            var customizedCode = _extractRouteArguments2[1];
            var options = _extractRouteArguments2[2];

            _this5._registerRouteHandler(verb, path, rawHandler, customizedCode, options);
          };

          if (alias) {
            _this5[alias] = _this5[verb];
          }
        });
      }
    }, {
      key: '_serialize',
      value: function _serialize(body) {
        if (typeof body === 'string') {
          return body;
        } else if (body) {
          return JSON.stringify(body);
        } else {
          return '{"error": "not found"}';
        }
      }
    }, {
      key: '_registerRouteHandler',
      value: function _registerRouteHandler(verb, path, rawHandler, customizedCode, options) {
        var _this6 = this;

        var routeHandler = new _emberCliMirageRouteHandler['default']({
          schema: this.schema,
          verb: verb, rawHandler: rawHandler, customizedCode: customizedCode, options: options, path: path,
          serializerOrRegistry: this.serializerOrRegistry
        });

        var fullPath = this._getFullPath(path);
        var timing = options.timing !== undefined ? options.timing : function () {
          return _this6.timing;
        };

        this.pretender[verb](fullPath, function (request) {
          return new Promise(function (resolve) {
            Promise.resolve(routeHandler.handle(request)).then(function (mirageResponse) {
              var _mirageResponse = _slicedToArray(mirageResponse, 3);

              var code = _mirageResponse[0];
              var headers = _mirageResponse[1];
              var response = _mirageResponse[2];

              resolve([code, headers, _this6._serialize(response)]);
            });
          });
        }, timing);
      }

      /**
       *
       * @private
       */
    }, {
      key: '_hasModulesOfType',
      value: function _hasModulesOfType(modules, type) {
        var modulesOfType = modules[type];
        return modulesOfType ? Object.keys(modulesOfType).length > 0 : false;
      }

      /**
       * Builds a full path for Pretender to monitor based on the `path` and
       * configured options (`urlPrefix` and `namespace`).
       *
       * @private
       */
    }, {
      key: '_getFullPath',
      value: function _getFullPath(path) {
        path = path[0] === '/' ? path.slice(1) : path;
        var fullPath = '';
        var urlPrefix = this.urlPrefix ? this.urlPrefix.trim() : '';
        var namespace = '';

        // if there is a urlPrefix and a namespace
        if (this.urlPrefix && this.namespace) {
          if (this.namespace[0] === '/' && this.namespace[this.namespace.length - 1] === '/') {
            namespace = this.namespace.substring(0, this.namespace.length - 1).substring(1);
          }

          if (this.namespace[0] === '/' && this.namespace[this.namespace.length - 1] !== '/') {
            namespace = this.namespace.substring(1);
          }

          if (this.namespace[0] !== '/' && this.namespace[this.namespace.length - 1] === '/') {
            namespace = this.namespace.substring(0, this.namespace.length - 1);
          }

          if (this.namespace[0] !== '/' && this.namespace[this.namespace.length - 1] !== '/') {
            namespace = this.namespace;
          }
        }

        // if there is a namespace and no urlPrefix
        if (this.namespace && !this.urlPrefix) {
          if (this.namespace[0] === '/' && this.namespace[this.namespace.length - 1] === '/') {
            namespace = this.namespace.substring(0, this.namespace.length - 1);
          }

          if (this.namespace[0] === '/' && this.namespace[this.namespace.length - 1] !== '/') {
            namespace = this.namespace;
          }

          if (this.namespace[0] !== '/' && this.namespace[this.namespace.length - 1] === '/') {
            var namespaceSub = this.namespace.substring(0, this.namespace.length - 1);
            namespace = '/' + namespaceSub;
          }

          if (this.namespace[0] !== '/' && this.namespace[this.namespace.length - 1] !== '/') {
            namespace = '/' + this.namespace;
          }
        }

        // if no namespace
        if (!this.namespace) {
          namespace = '';
        }

        // check to see if path is a FQDN. if so, ignore any urlPrefix/namespace that was set
        if (/^https?:\/\//.test(path)) {
          fullPath += path;
        } else {
          // otherwise, if there is a urlPrefix, use that as the beginning of the path
          if (urlPrefix.length) {
            fullPath += urlPrefix[urlPrefix.length - 1] === '/' ? urlPrefix : urlPrefix + '/';
          }

          // add the namespace to the path
          fullPath += namespace;

          // add a trailing slash to the path if it doesn't already contain one
          if (fullPath[fullPath.length - 1] !== '/') {
            fullPath += '/';
          }

          // finally add the configured path
          fullPath += path;

          // if we're making a same-origin request, ensure a / is prepended and
          // dedup any double slashes
          if (!/^https?:\/\//.test(fullPath)) {
            fullPath = '/' + fullPath;
            fullPath = fullPath.replace(/\/+/g, '/');
          }
        }

        return fullPath;
      }

      /**
       *
       * @private
       */
    }, {
      key: '_configureDefaultPassthroughs',
      value: function _configureDefaultPassthroughs() {
        var _this7 = this;

        defaultPassthroughs.forEach(function (passthroughUrl) {
          _this7.passthrough(passthroughUrl);
        });
      }

      /**
       *
       * @private
       */
    }, {
      key: '_validateTraits',
      value: function _validateTraits(traits, factory, type) {
        traits.forEach(function (traitName) {
          if (!factory.isTrait(traitName)) {
            throw new Error('\'' + traitName + '\' trait is not registered in \'' + type + '\' factory');
          }
        });
      }

      /**
       *
       * @private
       */
    }, {
      key: '_mergeExtensions',
      value: function _mergeExtensions(attrs, traits, overrides) {
        var allExtensions = traits.map(function (traitName) {
          return attrs[traitName].extension;
        });
        allExtensions.push(overrides || {});
        return allExtensions.reduce(function (accum, extension) {
          return (0, _lodashAssign['default'])(accum, extension);
        }, {});
      }

      /**
       *
       * @private
       */
    }, {
      key: '_mapAssociationsFromAttributes',
      value: function _mapAssociationsFromAttributes(modelType, attributes) {
        var _this8 = this;

        Object.keys(attributes || {}).filter(function (attr) {
          return (0, _emberCliMirageUtilsIsAssociation['default'])(attributes[attr]);
        }).forEach(function (attr) {
          var association = attributes[attr];
          var associationName = _this8._fetchAssociationNameFromModel(modelType, attr);
          var foreignKey = (0, _emberCliMirageUtilsInflector.camelize)(attr) + 'Id';
          attributes[foreignKey] = _this8.create.apply(_this8, [associationName].concat(_toConsumableArray(association.traitsAndOverrides))).id;
          delete attributes[attr];
        });
      }

      /**
       *
       * @private
       */
    }, {
      key: '_fetchAssociationNameFromModel',
      value: function _fetchAssociationNameFromModel(modelType, associationAttribute) {
        var model = this.schema.modelFor(modelType);
        if (!model) {
          throw new Error('Model not registered: ' + modelType);
        }

        var association = model['class'].findBelongsToAssociation(associationAttribute);
        if (!association) {
          throw new Error('You\'re using the `association` factory helper on the \'' + associationAttribute + '\' attribute of your ' + modelType + ' factory, but that attribute is not a `belongsTo` association. Read the Factories docs for more information: http://www.ember-cli-mirage.com/docs/v0.2.x/factories/#factories-and-relationships');
        }
        return (0, _emberCliMirageUtilsInflector.camelize)(association.modelName);
      }
    }]);

    return Server;
  })();

  exports['default'] = Server;
});
/* eslint no-console: 0 */