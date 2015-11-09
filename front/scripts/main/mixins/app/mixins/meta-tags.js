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

	/**
	 * @param {*} meta
	 * @returns {void}
	 */
	setMeta(meta) {
		const $head = this.get('$head'),
			$metaProto = Em.$('<meta/>'),
			$newMetaValues = [],
			selectors = [],
			keys = Object.keys || Em.keys,
			metaTypes = keys(meta);

		// don't set meta if route is no longer active
		if (!this.router.isActive(this.routeName)) {
			return;
		}

		metaTypes.forEach((metaType) => {
			keys(meta[metaType]).map((key) => {
				selectors.push(`meta[${metaType}="${key}"]`);
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

	/**
	 * @returns {*}
	 */
	clearMeta() {
		const $head = this.get('$head'),
			selectors = this.get('currentMetaSelectors');

		if (!selectors) {
			return null;
		}

		$head.find(selectors.join(',')).remove();

		return this.set('currentMetaSelectors', null);
	},

	/**
	 * @returns {Object}
	 */
	runSetMeta() {
		const meta = this.get('meta');

		if (typeof meta === 'function') {
			return this.setMeta(meta.apply(this));
		} else if (typeof meta === 'object') {
			return this.setMeta(meta);
		}
	},

	actions: {
		/**
		 * @returns {boolean}
		 */
		didTransition() {
			this._super(arguments);
			Em.run.next(this, this.runSetMeta);

			return true;
		},

		/**
		 * @returns {boolean}
		 */
		willTransition() {
			this._super(arguments);
			this.clearMeta();

			return true;
		},

		/**
		 * @returns {boolean}
		 */
		resetMeta() {
			this.clearMeta();
			Em.run.next(this, this.runSetMeta);

			return false;
		}
	},
});
