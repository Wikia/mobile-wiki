import Ember from 'ember';

export default Ember.Object.extend({
	init() {
		this._super(...arguments);
		this.articles = {};
		this.subcategories = {};

		this.namespaces = {
			// FIXME this should come from $wgContentNamespaces
			articles: 0,
			subcategories: 14
		};
	},

	load() {
		const name = this.get('name'),
			articlesPromise = this.get('ajax').request(getUrl(name, this.namespaces.articles)),
			subcategoriesPromise = this.get('ajax').request(getUrl(name, this.namespaces.subcategories));

		return Ember.RSVP.hashSettled({
			articlesPromise,
			subcategoriesPromise
		}).then((hash) => {
			const articles = hash.articlesPromise,
				subcategories = hash.subcategoriesPromise;

			if (articles.state === 'fulfilled') {
				this.set('articles', {
					items: articles.value.items,
					offset: articles.value.offset
				});
			}

			if (subcategories.state === 'fulfilled') {
				this.set('subcategories', {
					items: subcategories.value.items,
					offset: subcategories.value.offset
				});
			}

			this.set('name', name);

			return this;
		});
	},

	loadMore(type, offset) {
		const namespace = this.namespaces[type];

		return this.get('ajax')
			.request(getUrl(this.get('name'), namespace, offset))
			.then((data) => {
				assertItemsWereFetched(data);

				this[type].items.pushObjects(data.items);
				Ember.set(this, `${type}.offset`, data.offset);

				return this;
			});
	}
});

/**
 * @param {string} categoryName
 * @param {number} namespace
 * @param {string|null=} offset
 * @returns {string}
 */
function getUrl(categoryName, namespace, offset = null) {
	let query = {
		controller: 'ArticlesApi',
		method: 'getList',
		expand: 'true',
		abstract: 0,
		category: categoryName,
		limit: 24,
		namespaces: namespace
	};

	if (offset) {
		query.offset = offset;
	}

	return M.buildUrl({
		path: '/wikia.php',
		query
	});
}

/**
 * @param {Object} data
 * @throws {Error}
 */
function assertItemsWereFetched(data) {
	if (!Ember.isArray(data.items)) {
		throw new Error('No category members were fetched');
	}
}
