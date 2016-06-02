import Ember from 'ember';
import request from 'ember-ajax/request';
import {isNotFoundError, isBadRequestError} from 'ember-ajax/errors';

const {Object, computed, A, Logger} = Ember;

export default Object.extend({
	batch: 1,
	error: '',
	erroneousQuery: '',
	items: A([]),
	loading: false,
	query: '',
	totalItems: 0,
	totalBatches: 0,

	canLoadMore: computed('batch', 'totalBatches', function () {
		return this.get('batch') < this.get('totalBatches');
	}),

	search(query) {
		this.setProperties({
			batch: 1,
			totalItems: 0,
			totalBatches: 0,
			query,
			items: A([])
		});

		return query && this.fetch(query);
	},

	loadMore() {
		if (this.get('canLoadMore')) {
			this.set('batch', this.get('batch') + 1);

			return this.fetch(this.get('query'));
		}
	},

	fetch(query) {
		this.setProperties({
			error: '',
			loading: true
		});
		return request(M.buildUrl({path: '/api/v1/Search/List'}), {
			data: {
				query,
				batch: this.get('batch')
			}
		}).then((data) => {
			// update state on success
			return this.update(data);
		}, (error) => {
			this.setProperties({
				error: 'search-error-general',
				erroneousQuery: query,
				loading: false
			});

			if (isNotFoundError(error)) {
				this.set('error', 'search-error-not-found');
			} else if (isBadRequestError(error)) {
				// this shouldn't happen
				Logger.error('Search bad request', query);
			} else {
				Logger.error('Search error', error);
			}
		});
	},

	update(state) {
		this.setProperties({
			items: [
				...this.get('items'),
				...state.items.map((item) => {
					return {
						title: item.title,
						snippet: item.snippet,
						href: item.url.replace(/^http:\/\/[^\/]+(\/wiki)?\//i, '')
					};
				})
			],
			loading: false,
			totalItems: state.total,
			totalBatches: state.batches,
		});

		return this.get('items');
	}
});
