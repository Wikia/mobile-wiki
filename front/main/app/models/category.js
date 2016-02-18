import Ember from 'ember';

export default Ember.Object.extend({
	name: null,

	init() {
		this._super(...arguments);
		this.collections = {};

		this.namespaces = {
			// FIXME this should come from $wgContentNamespaces
			articles: 0,
			subcategories: 14
		};
	},

	load() {
		let name = this.get('name'),
			url;

		if (!name.indexOf('/wiki/Category:') > -1) {
			name = `Category:${name}`;
		}

		url = getUrlInitalContent(name);

		return Ember.$.ajax({
			url,
			dataType: 'json',
			method: 'get',
		}).then((pageData) => {
			this.set('collections', Ember.get(pageData, 'data.nsData.members.collections'));

			return this;
		});
	},

	loadMore(index, batchToLoad) {
		const url = getUrlBatchContent(this.get('name'), index, batchToLoad);

		return Ember.$.ajax({
			url,
			dataType: 'json',
			method: 'get',
		}).then((pageData) => {
			this.set(
				`collections.${index}.items`,
				pageData.itemsBatch
			);
			this.set(
				`collections.${index}.hasPrev`,
				batchToLoad - 1 > 0
			);
			this.set(
				`collections.${index}.hasNext`,
				Math.ceil(this.get(`collections.${index}.total`) / this.get(`collections.${index}.batchSize`)) > batchToLoad
			);
			this.set(
				`collections.${index}.prevBatch`,
				batchToLoad - 1
			);

			return this;
		});
	}
});

/**
 * @param {string} categoryName
 * @returns {string}
 */
function getUrlInitalContent(categoryName) {
	let query = {
		controller: 'MercuryApi',
		method: 'getPage',
		title: categoryName
	};

	return M.buildUrl({
		path: '/wikia.php',
		query
	});
}

function getUrlBatchContent(categoryName, index, batch) {
	let query = {
		controller: 'WikiaMobile',
		method: 'getCategoryBatch',
		batch,
		category: categoryName,
		format: 'json',
		index
	};

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
