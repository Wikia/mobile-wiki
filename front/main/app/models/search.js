import Ember from 'ember';
import request from 'ember-ajax/request';

const {Object, computed, A} = Ember;

export default Object.extend({
	query: '',
	batch: 1,

	totalItems: 0,
	totalBatches: 0,
	items: A([]),

	canLoadMore: computed('batch', 'totalBatches', function() {
		return this.get('batch') <= this.get('totalBatches');
	}),

	search(query) {
		this.set('batch', 1);
		this.set('query', query);
		this.set('items', A([]));

		this.call(query);
	},

	loadMore() {
		if (this.get('canLoadMore')) {
			this.set('batch', this.get('batch') + 1);

			this.call(this.get('query'));
		}
	},

	call(query, batch) {
		return request(M.buildUrl({path: '/api/v1/Search/List'}), {
			data: {
				query: query,
				batch: this.get('batch')
			}
		}).then((data) => {
			// update state on success
			return this.update(data);
		});
	},

	update(state) {
		this.set('totalItems', state.total);
		this.set('totalBatches', state.batches);
		this.set('items', [
			...this.get('items'),
			...state.items.map((item) => {
				return {
					title: item.title,
					snippet: item.snippet,
					//TODO: write unit tests
					href: item.url.replace(/^http:\/\/[^\/]+(\/wiki)?\//i, '')
				};
			})
		]);
	}
});
