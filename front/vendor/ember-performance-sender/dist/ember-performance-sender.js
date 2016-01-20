var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EmPerfSender;
(function (EmPerfSender) {
    EmPerfSender.VERSION = '1.1.1';
    EmPerfSender.loaded = false;
    EmPerfSender.enabled = false;
    EmPerfSender.config = {
        enableAjaxFilter: false,
        enableLogging: true,
        minDuration: 50,
        log: function (message) { console.log(message); },
        send: function (events, metrics) { console.log('Sending (Dry Run)\n============================\n', metrics); },
        warn: function (message) { console.log('warn: ' + message); },
        error: function (message) { console.log('error: ' + message); },
        subclassPattern: new RegExp('<(?:\\(subclass of )?(.*?)\\)?:.*>')
    };
    EmPerfSender.traceStack = [];
    function getLastTraceItem() {
        return EmPerfSender.traceStack[EmPerfSender.traceStack.length - 1];
    }
    function getRoutePattern(EmberRoute) {
        try {
            var routeName = EmberRoute.get('routeName'), segments = EmberRoute.get('router.router.recognizer.names')[routeName].segments, listOfSegments = [];
            for (var i = 0; i < segments.length; i++) {
                var segment = null;
                try {
                    segment = segments[i].generate();
                }
                catch (err) {
                    segment = ':' + segments[i].name;
                }
                if (segment) {
                    listOfSegments.push(segment);
                }
            }
            return '/' + listOfSegments.join('/');
        }
        catch (err) {
            return '/';
        }
    }
    function traceRouteEvent() {
        var pattern = getRoutePattern(this), lastTrace = getLastTraceItem();
        if (lastTrace) {
            lastTrace.klass = this.constructor.toString();
            lastTrace.method = 'routeTransition';
            lastTrace.pattern = pattern;
        }
        else {
            new Trace(this.constructor.toString(), 'routeTransition', pattern);
        }
        return this._super.apply(this, arguments);
    }
    function ifLoggingEnabled(method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (EmPerfSender.config.enableLogging && typeof EmPerfSender.config[method] === 'function') {
            return EmPerfSender.config[method].apply(this, args);
        }
    }
    function wrap(method) {
        var traceItem = getLastTraceItem();
        if (traceItem) {
            if (typeof traceItem.pattern === undefined) {
                traceItem.klass = this.constructor.toString();
            }
            ;
            traceItem.method = method;
        }
        else {
            new Trace(this.constructor.toString(), method);
        }
    }
    function wrapEvent(eventName, callback) {
        var _this = this;
        if ('function' == typeof callback) {
            return decorate(callback, function () {
                wrap.call(_this, eventName);
            });
        }
        else {
            return callback;
        }
    }
    function decorate(orig, decorator) {
        return function () {
            var ret;
            try {
                ret = decorator.apply(this, arguments);
            }
            catch (e) {
                throw e;
            }
            return (typeof orig === 'function' ? orig : function () { }).apply(this, arguments);
        };
    }
    function aliasMethodChain($, method, label, wrapper) {
        var originalMethod = $[method];
        if ('function' == typeof originalMethod) {
            var methodWithout = '__' + method + '_without_' + label + '__', methodWith = '__' + method + '_with_' + label + '__';
            $[methodWithout] = originalMethod;
            $[methodWith] = $[method] = wrapper;
        }
        return $;
    }
    function ajaxDecorator() {
        if (getLastTraceItem()) {
            var request = arguments[1] || arguments[0], type = request.type || 'GET', url = request.url || arguments[0];
            if (typeof request === 'string') {
                request = {};
            }
            var tracer = new AjaxTrace(type, url);
            request.success = decorate(request.success, function () {
                tracer.trace.resume();
                tracer.stop();
            });
            request.error = decorate(request.error, function () {
                tracer.trace.resume();
                tracer.stop();
            });
            request.url = url;
        }
    }
    var BaseTrace = (function () {
        function BaseTrace() {
        }
        BaseTrace.prototype.stop = function () {
            if (this.pending) {
                this.stopTime = Date.now();
                this.pending = false;
            }
            else {
                ifLoggingEnabled('warn', '[BUG] ' + this.constructor['name'] + ': Attempted to stop a component render twice.');
            }
        };
        BaseTrace.prototype.serialize = function (time) {
            if (time === void 0) { time = 0; }
            var additionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                additionalParams[_i - 1] = arguments[_i];
            }
            if (this.pending === false) {
                var serialized = [this.constructor['name'], this.startTime - time, this.stopTime - this.startTime];
                if (additionalParams.length) {
                    serialized = serialized.concat(additionalParams);
                }
                return serialized;
            }
        };
        return BaseTrace;
    })();
    var AjaxTrace = (function (_super) {
        __extends(AjaxTrace, _super);
        function AjaxTrace(method, url) {
            this.method = method;
            this.url = url;
            this.pending = true;
            this.trace = getLastTraceItem();
            if (this.trace) {
                this.trace.events.push(this);
            }
            this.startTime = Date.now();
            _super.call(this);
        }
        AjaxTrace.prototype.serialize = function (time) {
            return _super.prototype.serialize.call(this, time, this.method, this.url);
        };
        return AjaxTrace;
    })(BaseTrace);
    var ComponentRenderTrace = (function (_super) {
        __extends(ComponentRenderTrace, _super);
        function ComponentRenderTrace(componentName) {
            this.componentName = componentName;
            this.pending = true;
            this.trace = getLastTraceItem();
            if (this.trace) {
                this.trace.events.push(this);
            }
            this.startTime = Date.now();
            _super.call(this);
        }
        ComponentRenderTrace.prototype.serialize = function (time) {
            return _super.prototype.serialize.call(this, time, this.componentName);
        };
        return ComponentRenderTrace;
    })(BaseTrace);
    var Trace = (function (_super) {
        __extends(Trace, _super);
        function Trace(klass, method, pattern) {
            if (klass.match('Window')) {
                throw TypeError(klass + ' is not a valid Trace class');
            }
            this.klass = klass;
            this.method = method;
            this.pattern = pattern;
            this.events = [];
            this.finalized = false;
            this.startTime = Date.now();
            EmPerfSender.traceStack.push(this);
            _super.call(this);
        }
        Trace.prototype.serialize = function (time) {
            return _super.prototype.serialize.call(this, time, this.klass, this.method, this.url);
        };
        Trace.prototype.pause = function () {
            for (var i = 1; i <= EmPerfSender.traceStack.length; i++) {
                if (EmPerfSender.traceStack[EmPerfSender.traceStack.length - i] === this) {
                    EmPerfSender.traceStack.splice(EmPerfSender.traceStack.length - i, 1);
                }
            }
        };
        Trace.prototype.resume = function () {
            this.pause();
            EmPerfSender.traceStack.push(this);
        };
        Trace.prototype.finalize = function () {
            if (this.finalized) {
                ifLoggingEnabled('warn', '[BUG] Attempted to finalize a trace twice.');
                return;
            }
            this.pause();
            for (var i = 0; i < this.events.length; i++) {
                if (this.events[i].pending) {
                    return;
                }
            }
            this.stopTime = Date.now();
            this.finalized = true;
            this.duration = this.stopTime - this.startTime;
            if (this.duration < (EmPerfSender.config.minDuration || 1)) {
                ifLoggingEnabled('log', 'Dropped: ' + this.klass + '.' + this.method + ' (' + this.pattern + '), took ' +
                    this.duration + 'ms. (minDuration is ' + EmPerfSender.config.minDuration + 'ms)');
                return;
            }
            if (EmPerfSender.config.enableAjaxFilter === true) {
                var ajaxRequestToTrace = false;
                for (i = 0; i < this.events.length; i++) {
                    if (this.events[i] instanceof AjaxTrace) {
                        ajaxRequestToTrace = true;
                        break;
                    }
                }
                if (!ajaxRequestToTrace) {
                    ifLoggingEnabled('log', 'Dropped: ' + this.klass + '.' + this.method + ' (' + this.pattern + '), took ' +
                        this.duration + 'ms. (enableAjaxFilter is true)');
                    return;
                }
            }
            ifLoggingEnabled('log', 'Sending: ' + this.klass + '.' + this.method + ' (' + this.pattern + '), took ' + this.duration +
                'ms.');
            this.url = window.location.hash || window.location.pathname;
            var metrics = {
                startTime: this.startTime,
                duration: this.duration,
                url: this.url
            };
            if (this.klass && this.klass.length) {
                metrics.klass = this.klass;
            }
            if (this.method && this.method.length) {
                metrics.method = this.method;
            }
            if (this.pattern && this.pattern.length) {
                metrics.pattern = this.pattern;
            }
            var events = [];
            for (i = 0; i < this.events.length; i++) {
                events.push(this.events[i].serialize(this.startTime));
            }
            EmPerfSender.config.send(events, metrics);
        };
        return Trace;
    })(BaseTrace);
    function initialize(userConfig, Ember, $) {
        'use strict';
        if (Ember === void 0) { Ember = window['Ember']; }
        if ($ === void 0) { $ = window['jQuery']; }
        if (Ember === undefined) {
            throw ReferenceError('EmPerfSender cannot find Ember! Check that you have loaded Ember correctly before EmPerfSender!');
        }
        else if ($ === undefined) {
            throw ReferenceError('EmPerfSender cannot find jQuery! Make sure you have loaded jQuery before Ember and EmPerfSender!');
        }
        else {
            EmPerfSender.config = $.extend(EmPerfSender.config, userConfig);
            ifLoggingEnabled('log', 'Initializing EmPerfSender v' + EmPerfSender.VERSION);
            Ember.Route.reopen({
                beforeModel: traceRouteEvent,
                afterModel: traceRouteEvent,
                enter: traceRouteEvent
            });
            Ember.Component.reopen({
                /**
                 * Triggers a named event for the object. Any additional arguments
                 * will be passed as parameters to the functions that are subscribed to the
                 * event.
                 *
                 * @method trigger
                 * @param {String} eventName The name of the event
                 * @param {Object...} args Optional arguments to pass on
                 */
                trigger: function (eventName) {
                    var className = this.constructor.toString(), isNotEmberClass = ('Ember' !== className.substr(0, 5) &&
                        // (subclass of Ember...)
                        'Ember' !== className.substr(13, 5)), isEvent = this.constructor.prototype.hasOwnProperty(eventName), shouldTrace = isNotEmberClass && isEvent;
                    if (shouldTrace) {
                        new Trace(this.constructor.toString(), eventName);
                    }
                    return this._super.apply(this, arguments);
                }
            });
            Ember.ActionHandler.reopen({
                willMergeMixin: function (props) {
                    var eventName, nextSuper = this._super(props);
                    if (props._actions) {
                        for (eventName in props._actions) {
                            if (props._actions.hasOwnProperty(eventName)) {
                                props._actions[eventName] = wrapEvent.apply(this, [eventName, props._actions[eventName]]);
                            }
                        }
                    }
                    else if (props.events) {
                        for (eventName in props.events) {
                            if (props.events.hasOwnProperty(eventName)) {
                                props.events[eventName] = wrapEvent.apply(this, [eventName, props.events[eventName]]);
                            }
                        }
                    }
                    return nextSuper;
                }
            });
            Ember.subscribe('render.view', {
                before: function (eventName, time, container) {
                    if (getLastTraceItem()) {
                        var parentClass = container.object.match(EmPerfSender.config.subclassPattern)[1];
                        if ('Ember' !== parentClass.substr(0, 5) && 'LinkComponent' !== parentClass) {
                            return new ComponentRenderTrace(parentClass);
                        }
                    }
                },
                after: function (eventName, time, container, tracer) {
                    if (tracer) {
                        tracer.stop();
                    }
                }
            });
            Ember.run.backburner.options.onEnd = decorate(Ember.run.backburner.options.onEnd, function (current, next) {
                if (!next && EmPerfSender.traceStack.length) {
                    for (var d = 0; d < EmPerfSender.traceStack.length; d++) {
                        EmPerfSender.traceStack[d].finalize();
                    }
                }
            });
            aliasMethodChain($, 'ajax', 'instrumentation', decorate($.ajax, ajaxDecorator));
            EmPerfSender.loaded = true;
        }
    }
    EmPerfSender.initialize = initialize;
    ;
})(EmPerfSender || (EmPerfSender = {}));
