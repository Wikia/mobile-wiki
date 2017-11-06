define('mobile-wiki/models/search', ['exports', 'mobile-wiki/utils/mediawiki-fetch', 'mobile-wiki/utils/url'], function (exports, _mediawikiFetch, _url) {
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

	var service = Ember.inject.service;
	var A = Ember.A;
	var EmberObject = Ember.Object;
	var computed = Ember.computed;
	exports.default = EmberObject.extend({
		batch: 1,
		error: '',
		erroneousQuery: '',
		items: null,
		loading: false,
		query: '',
		totalItems: 0,
		totalBatches: 0,
		wikiVariables: service(),
		logger: service(),

		canLoadMore: computed('batch', 'totalBatches', function () {
			return this.get('batch') < this.get('totalBatches');
		}),

		init: function init() {
			this._super.apply(this, arguments);
			this.set('items', A([]));
		},
		search: function search(query) {
			this.setProperties({
				batch: 1,
				totalItems: 0,
				totalBatches: 0,
				query: query,
				items: A([])
			});

			if (query) {
				return this.fetch(query);
			}
		},
		loadMore: function loadMore() {
			if (this.get('canLoadMore')) {
				this.set('batch', this.get('batch') + 1);

				return this.fetch(this.get('query'));
			}

			return false;
		},
		fetch: function fetch(query) {
			var _this = this;

			this.setProperties({
				error: '',
				loading: true
			});

			return (0, _mediawikiFetch.default)((0, _url.buildUrl)({
				host: this.get('wikiVariables.host'),
				path: '/wikia.php',
				query: {
					controller: 'SearchApi',
					method: 'getList',
					query: query,
					batch: this.get('batch')
				}
			})).then(function (response) {
				if (!response.ok) {
					_this.setProperties({
						error: 'search-error-general',
						erroneousQuery: query,
						loading: false
					});

					if (response.status === 404) {
						_this.set('error', 'search-error-not-found');
					} else {
						_this.get('logger').error('Search request error', response);
					}

					return _this;
				} else {
					return response.json().then(function (data) {
						// update state on success
						return _this.update(data);
					});
				}
			});
		},
		update: function update(state) {
			this.setProperties({
				items: [].concat(_toConsumableArray(this.get('items')), _toConsumableArray(state.items.map(function (item) {
					return {
						title: item.title,
						snippet: item.snippet,
						prefixedTitle: (0, _url.extractEncodedTitle)(item.url)
					};
				}))),
				loading: false,
				totalItems: state.total,
				totalBatches: state.batches
			});

			return this;
		}
	});
});