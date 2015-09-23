/// <reference path="../app.ts" />

'use strict';

/**
 * Route mixin for setting head meta tags on transition into/out of route
 *
 * https://www.npmjs.com/package/ember-cli-meta-tags
 *
 * @example How to set meta tags on a route
 *   ExampleRoute = Ember.Route.extend RouteMetaMixin,
 *     meta: ->
 *       return
 *         meta_property_name1: meta_value1
 *         meta_property_name2: meta_value2
 */
App.MetaTagsMixin = Em.Mixin.create({

	setMeta(meta: any): any {
		var $head: any, $metaProto: any, $newMetaValues: any, selectors: any, metaTypes: any;
		var keys: any = Object.keys || Em.keys;

		// don't set meta if route is no longer active
		if (!this._routeMetaIsActiveRoute()) {
			return;
		}

		$head = this._routeMetaGetHead();
		$metaProto = Em.$('<meta></meta>');
		$newMetaValues = [];
		selectors = [];
		metaTypes = keys(meta);
		metaTypes.forEach(function(meta_type: any) {
			keys(meta[meta_type]).map(function(key: any) {
				selectors.push('meta[' + meta_type + '="' + key + '"]');
				$newMetaValues.push($metaProto.clone().attr(meta_type, key)
					.attr('content', meta[meta_type][key]));
			});
		});
		$head.append($newMetaValues);
		this.set('currentMetaSelectors', selectors);
	},

	clearMeta(): any {
		var $head: any, selectors: any;
		selectors = this.get('currentMetaSelectors');
		if (!selectors) {
			return;
		}
		$head = this._routeMetaGetHead();
		$head.find(selectors.join(',')).remove();
		return this.set('currentMetaSelectors', null);
	},

	_runSetMeta(): any {
		var meta = this.get('meta');
		if (typeof meta === 'function') {
			return this.setMeta(meta.apply(this));
		}else if (typeof meta === 'object') {
			return this.setMeta(meta);
		}
	},

	actions: {
		didTransition(): boolean {
			this._super.apply(this, arguments);
			Em.run.next(this, this._runSetMeta);
			return true; // bubble
		},
		willTransition(/* transition */): any {
			this._super.apply(this, arguments);
			this.clearMeta();
			return true; // bubble
		},
		resetMeta(): boolean {
			this.clearMeta();
			Em.run.next(this, this._runSetMeta);
			return false; // don't bubble, handled here
		}
	},

	_routeMetaGetHead(): any {
		return Em.$('head');
	},

	_routeMetaIsActiveRoute(): any {
		return this.router.isActive(this.routeName);
	}
});
