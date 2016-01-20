module EmPerfSender {
	export interface MetricsReport {
		startTime: number;
		duration: number;
		url: string;
		klass?: string;
		method?: string;
		pattern?: string;
	}

	export interface EmPerfSenderConfig {
		enableAjaxFilter: boolean;
		enableLogging: boolean;
		error?: (message: string) => void;
		log?: (message: string) => void;
		minDuration: number;
		send: (events: any[], metrics: MetricsReport) => void;
		warn?: (message: string) => void;
		subclassPattern: RegExp;
	}

	export var VERSION: string = '1.1.1';
	export var loaded: boolean = false;
	export var enabled: boolean = false;
	export var config: EmPerfSenderConfig = {
		enableAjaxFilter: false,
		enableLogging: true,
		minDuration: 50,
		log: (message) => { console.log(message); },
		send: (events, metrics) => { console.log('Sending (Dry Run)\n============================\n', metrics); },
		warn: (message) => { console.log('warn: ' + message); },
		error: (message) => { console.log('error: ' + message); },
		subclassPattern: new RegExp('<(?:\\(subclass of )?(.*?)\\)?:.*>')
	};

	export var traceStack = [];

	function getLastTraceItem ()  {
		return traceStack[traceStack.length - 1];
	}

	function getRoutePattern (EmberRoute) {
		try {
			var routeName = EmberRoute.get('routeName'),
				segments = EmberRoute.get('router.router.recognizer.names')[routeName].segments,
				listOfSegments = [];

			for (var i = 0; i < segments.length; i++) {
				var segment = null;
				try {
					segment = segments[i].generate();
				} catch (err) {
					segment = ':' + segments[i].name;
				}

				if (segment) {
					listOfSegments.push(segment);
				}
			}
			return '/' + listOfSegments.join('/');
		} catch (err) {
			return '/';
		}
	}

	function traceRouteEvent () {
		var pattern = getRoutePattern(this),
			lastTrace = getLastTraceItem();

		if (lastTrace) {
			lastTrace.klass = this.constructor.toString();
			lastTrace.method = 'routeTransition';
			lastTrace.pattern = pattern;
		} else {
			new Trace(this.constructor.toString(), 'routeTransition', pattern);
		}

		return this._super.apply(this, arguments);
	}

	function ifLoggingEnabled (method, ...args) {
		if (config.enableLogging && typeof config[method] === 'function') {
			return config[method].apply(this, args);
		}
	}

	function wrap (method) {
		var traceItem = getLastTraceItem();

		if (traceItem) {
			if (typeof traceItem.pattern === undefined) {
				traceItem.klass = this.constructor.toString();
			};
			traceItem.method = method;
		} else {
			new Trace(this.constructor.toString(), method);
		}
	}

	function wrapEvent (eventName, callback) {
		if ('function' == typeof callback) {
			return decorate(callback, () => {
				wrap.call(this, eventName);
			});
		} else {
			return callback;
		}
	}

	function decorate (orig, decorator) {
		return function () {
			var ret;
			try {
				ret = decorator.apply(this, arguments);
			} catch (e) {
				throw e;
			}
			return (typeof orig === 'function' ? orig : () => {}).apply(this, arguments);
		}
	}

	function aliasMethodChain ($, method, label, wrapper) {
		var originalMethod  = $[method];
		if ('function' == typeof originalMethod) {
			var methodWithout  = '__' + method + '_without_' + label + '__',
				methodWith  = '__' + method + '_with_' + label + '__';

			$[methodWithout] = originalMethod;
			$[methodWith] = $[method] = wrapper;
		}
		return $;
	}

	function ajaxDecorator () {
		if (getLastTraceItem()) {
			var request = arguments[1] || arguments[0],
				type = request.type || 'GET',
				url = request.url || arguments[0];

			if (typeof request === 'string') {
				request = {};
			}
			var tracer = new AjaxTrace(type, url);

			request.success = decorate(request.success, () => {
				tracer.trace.resume();
				tracer.stop();
			});

			request.error = decorate(request.error, () => {
				tracer.trace.resume();
				tracer.stop();
			});

			request.url = url;
		}
	}

	class BaseTrace {
		pending: boolean;
		startTime: number;
		stopTime: number;
		trace: any;

		stop () {
			if (this.pending) {
				this.stopTime = Date.now();
				this.pending = false;
			} else {
				ifLoggingEnabled('warn', '[BUG] ' + this.constructor['name'] + ': Attempted to stop a component render twice.')
			}
		}

		serialize (time: number = 0, ...additionalParams: string[]): any[] {
			if (this.pending === false) {
				var serialized = [this.constructor['name'],  this.startTime - time, this.stopTime - this.startTime];
				if (additionalParams.length) {
					serialized = serialized.concat(additionalParams);
				}
				return serialized;
			}
		}
	}

	class AjaxTrace extends BaseTrace {
		method: string;
		url: string;

		constructor (method, url) {
			this.method = method;
			this.url = url;
			this.pending = true;
			this.trace = getLastTraceItem();
			if (this.trace) {
				this.trace.events.push(this);
			}
			this.startTime = Date.now();

			super();
		}

		serialize (time: number): any[] {
			return super.serialize(time, this.method, this.url);
		}
	}

	class ComponentRenderTrace extends BaseTrace {
		componentName: string;

		constructor (componentName) {
			this.componentName = componentName;
			this.pending = true;
			this.trace = getLastTraceItem();
			if (this.trace) {
				this.trace.events.push(this);
			}
			this.startTime = Date.now();

			super();
		}

		serialize (time: number): any[] {
			return super.serialize(time, this.componentName);
		}
	}

	class Trace extends BaseTrace {
		duration: number;
		events: Trace[];
		finalized: boolean;
		klass: string;
		method: string;
		pattern: string;
		pending: boolean;
		startTime: number;
		stopTime: number;
		url: string;

		constructor (klass, method, pattern?) {
			if (klass.match('Window')) {
				throw TypeError(klass + ' is not a valid Trace class');
			}
			this.klass = klass;
			this.method = method;
			this.pattern = pattern;
			this.events = [];
			this.finalized = false;
			this.startTime = Date.now();
			traceStack.push(this);
			super();
		}

		serialize (time: number): any[] {
			return super.serialize(time, this.klass, this.method, this.url);
		}

		pause () {
			for (var i = 1; i <= traceStack.length; i++) {
				if (traceStack[traceStack.length - i] === this) {
					traceStack.splice(traceStack.length - i, 1);
				}
			}
		}

		resume () {
			this.pause();
			traceStack.push(this);
		}

		finalize () {
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

			if (this.duration < (config.minDuration || 1)) {
				ifLoggingEnabled('log', 'Dropped: ' + this.klass + '.' + this.method + ' (' + this.pattern + '), took ' +
				this.duration + 'ms. (minDuration is ' + config.minDuration + 'ms)');
				return;
			}

			if (config.enableAjaxFilter === true) {
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

			var metrics: MetricsReport = {
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

			config.send(events, metrics)
		}
	}

	export function initialize (userConfig: EmPerfSenderConfig, Ember = window['Ember'], $ = window['jQuery']) {
		'use strict';

		if (Ember === undefined) {
			throw ReferenceError('EmPerfSender cannot find Ember! Check that you have loaded Ember correctly before EmPerfSender!')
		} else if ($ === undefined) {
			throw ReferenceError('EmPerfSender cannot find jQuery! Make sure you have loaded jQuery before Ember and EmPerfSender!');
		} else {
			config = $.extend(config, userConfig);
			ifLoggingEnabled('log','Initializing EmPerfSender v' + VERSION);

			Ember.Route.reopen({
				beforeModel: traceRouteEvent,
				afterModel: traceRouteEvent,
				enter: traceRouteEvent
				// TODO this currently causes 'TypeError: Cannot set property '_qpDelegate' of undefined'
				//setup: traceRouteEvent
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
				trigger (eventName) {
					var className = this.constructor.toString(),
						isNotEmberClass = (
							'Ember' !== className.substr(0, 5) &&
							// (subclass of Ember...)
							'Ember' !== className.substr(13, 5)
						),
						isEvent = this.constructor.prototype.hasOwnProperty(eventName),
						shouldTrace = isNotEmberClass && isEvent;

					if (shouldTrace) {
						new Trace(this.constructor.toString(), eventName);
					}

					return this._super.apply(this, arguments);
				}
			});

			Ember.ActionHandler.reopen({
				willMergeMixin (props) {
					var eventName,
						nextSuper = this._super(props);

					if (props._actions) {
						for (eventName in props._actions) {
						if (props._actions.hasOwnProperty(eventName)) {
							props._actions[eventName] = wrapEvent.apply(this, [eventName, props._actions[eventName]]);
						}
						}
					} else if (props.events) {
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
				before (eventName, time, container) {
					if (getLastTraceItem()) {
						var parentClass = container.object.match(config.subclassPattern)[1];
						if ('Ember' !== parentClass.substr(0, 5) && 'LinkComponent' !== parentClass) {
							return new ComponentRenderTrace(parentClass);
						}
					}
				},
				after (eventName, time, container, tracer) {
					if (tracer) {
						tracer.stop();
					}
				}
			});

			Ember.run.backburner.options.onEnd = decorate(Ember.run.backburner.options.onEnd, (current, next) => {
				if (!next && traceStack.length) {
					for (var d = 0; d < traceStack.length; d++) {
						traceStack[d].finalize();
					}
				}
			});

			aliasMethodChain($, 'ajax', 'instrumentation', decorate($.ajax, ajaxDecorator));
			loaded = true;
		}
	};
}
