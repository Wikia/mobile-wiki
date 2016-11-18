import Ember from 'ember';

export default Ember.Service.extend({
	routing: Ember.inject.service('-routing'),

	queryParams: Ember.computed.alias('routing.router.router.state.queryParams'),

	currentPage: Ember.computed(function () {
		return parseInt(this.get('queryParams').page, 10) || 1;
	}),

	getFirstPageUrl() {
		return this.buildPageUrl(this.get('queryParams'), 1);
	},

	getNextPageUrl(totalPosts) {
		const queryParams = this.get('queryParams'),
			currentPage = this.get('currentPage');

		if (totalPosts > currentPage * 20) {
			return this.buildPageUrl(queryParams, currentPage + 1);
		}
	},

	getPrevPageUrl() {
		const queryParams = this.get('queryParams'),
			currentPage = this.get('currentPage');

		return this.buildPageUrl(queryParams, currentPage - 1);
	},

	buildPageUrl(queryParams, page = 1) {
		let newQueryParams, queryParamsToRemove;

		if (page === 1) {
			newQueryParams = {};
			queryParamsToRemove = ['page'];
		} else {
			newQueryParams = {page};
		}

		return this.buildUrl(queryParams, newQueryParams, queryParamsToRemove);
	},

	buildQueryParamsString(queryParams, newQueryParams = {}, queryParamsToRemove = []) {
		const params = Ember.$.extend({}, queryParams, newQueryParams),
			paramsArray = [];
		
		queryParamsToRemove.forEach(nameToRemove => {
			delete params[nameToRemove];
		});

		Object.keys(params).forEach(name => {
			paramsArray.push(`${name}=${params[name]}`);
		});

		return paramsArray.join('&');
	},

	buildUrl(queryParams, newQueryParams = {}, queryParamsToRemove = []) {
		const baseUrl = `${Ember.get(Mercury, 'wiki.basePath')}${window.location.pathname}`,
			queryParamsString = this.buildQueryParamsString(queryParams, newQueryParams, queryParamsToRemove);

		return queryParamsString ? `${baseUrl}?${queryParamsString}` : baseUrl;
	},

});
