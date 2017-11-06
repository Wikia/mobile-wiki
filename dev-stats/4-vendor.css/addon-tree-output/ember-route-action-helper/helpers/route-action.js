define('ember-route-action-helper/helpers/route-action', ['exports', 'ember-route-action-helper/-private/internals'], function (exports, _internals) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  var emberArray = Ember.A;
  var Helper = Ember.Helper;
  var get = Ember.get;
  var computed = Ember.computed;
  var getOwner = Ember.getOwner;
  var run = Ember.run;
  var runInDebug = Ember.runInDebug;


  function getCurrentHandlerInfos(router) {
    var routerLib = router._routerMicrolib || router.router;

    return routerLib.currentHandlerInfos;
  }

  function getRoutes(router) {
    return emberArray(getCurrentHandlerInfos(router)).mapBy('handler').reverse();
  }

  function getRouteWithAction(router, actionName) {
    var action = void 0;
    var handler = emberArray(getRoutes(router)).find(function (route) {
      var actions = route.actions || route._actions;
      action = actions[actionName];

      return typeof action === 'function';
    });

    return { action: action, handler: handler };
  }

  exports.default = Helper.extend({
    router: computed(function () {
      return getOwner(this).lookup('router:main');
    }).readOnly(),

    compute: function compute(_ref) {
      var _ref2 = _toArray(_ref),
          actionName = _ref2[0],
          params = _ref2.slice(1);

      var router = get(this, 'router');
      (true && !(router) && Ember.assert('[ember-route-action-helper] Unable to lookup router', router));


      runInDebug(function () {
        var _getRouteWithAction = getRouteWithAction(router, actionName),
            handler = _getRouteWithAction.handler;

        (true && !(handler) && Ember.assert('[ember-route-action-helper] Unable to find action ' + actionName, handler));
      });

      var routeAction = function routeAction() {
        var _getRouteWithAction2 = getRouteWithAction(router, actionName),
            action = _getRouteWithAction2.action,
            handler = _getRouteWithAction2.handler;

        for (var _len = arguments.length, invocationArgs = Array(_len), _key = 0; _key < _len; _key++) {
          invocationArgs[_key] = arguments[_key];
        }

        var args = params.concat(invocationArgs);
        return run.join.apply(run, [handler, action].concat(_toConsumableArray(args)));
      };

      routeAction[_internals.ACTION] = true;

      return routeAction;
    }
  });
});