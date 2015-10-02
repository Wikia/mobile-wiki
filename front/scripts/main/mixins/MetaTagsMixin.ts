/// <reference path="../app.ts" />

'use strict';

/**
 * Route mixin for setting head meta tags on transition into/out of route
 *
 * https://www.npmjs.com/package/ember-cli-meta-tags
 *
 * @example How to set meta tags on a route
 *
 *   App.ExampleRoute = Em.Route.extend(App.MetaTagsMixin, {
 *
 *   	meta(): any {
 *		return {
 *			name: {
 *				robots: 'noindex, follow'
 *			}
 *		};
 *	 }
 */
App.MetaTagsMixin = Em.Mixin.create({

	$head: Em.$('head'),

	setMeta(meta: any): void {
		var $head = this.get('$head'),
			$metaProto = Em.$('<meta></meta>'),
			$newMetaValues: any[] = [],
			selectors: any[] = [],
			keys: any = Object.keys || Em.keys,
			metaTypes = keys(meta);

		// don't set meta if route is no longer active
		if (!this.router.isActive(this.routeName)) {
			return;
		}

		metaTypes.forEach(function(metaType: any) {
			keys(meta[metaType]).map(function(key: any) {
				selectors.push('meta[' + metaType + '="' + key + '"]');
				$newMetaValues.push(
					$metaProto
						.clone()
						.attr(metaType, key)
						.attr('content', meta[metaType][key])
				);
			});
		});

		$head.append($newMetaValues);
		this.set('currentMetaSelectors', selectors);
	},

	clearMeta(): any {
		var $head = this.get('$head'),
			selectors = this.get('currentMetaSelectors');

		if (!selectors) {
			return;
		}

		$head.find(selectors.join(',')).remove();

		return this.set('currentMetaSelectors', null);
	},

	runSetMeta(): void {
		var meta = this.get('meta');

		if (typeof meta === 'function') {
			return this.setMeta(meta.apply(this));
		} else if (typeof meta === 'object') {
			return this.setMeta(meta);
		}
	},

	actions: {
		didTransition(): boolean {
			this._super(arguments);
			Em.run.next(this, this.runSetMeta);

			return true;
		},

		willTransition(): boolean {
			this._super(arguments);
			this.clearMeta();

			return true;
		},

		resetMeta(): boolean {
			this.clearMeta();
			Em.run.next(this, this.runSetMeta);

			return false;
		}
	},
});
