import Ember from 'ember';

export default Ember.Service.extend({
	routing: Ember.inject.service('-routing'),

	queryParams: Ember.computed.alias('routing.router.router.state.queryParams'),

	firstPageUrl() {
		return this.buildPageUrl(this.get('queryParams'), 1);
	},

	nextPageUrl(totalPosts) {
		const queryParams = this.get('queryParams'),
			currentPage = parseInt(queryParams.page, 10) || 1;

		if (totalPosts > currentPage * 20) {
			return this.buildPageUrl(queryParams, currentPage + 1);
		}
	},

	prevPageUrl() {
		const queryParams = this.get('queryParams'),
			currentPage = parseInt(queryParams.page, 10) || 1;

		return this.buildPageUrl(queryParams, currentPage - 1);
	},

	buildPageUrl(queryParams, page = 1) {
		if (page === 1) {
			return this.buildUrl(queryParams, {}, ['page']); // removes 'page' parameter
		} else {
			return this.buildUrl(queryParams, {page});
		}
	},

	buildQueryParamsString(queryParams, newQueryParams = {}, queryParamsToRemove = []) {
		const params = Object.assign({}, queryParams, newQueryParams),
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

		if (queryParamsString) {
			return `${baseUrl}?${queryParamsString}`;
		} else {
			return baseUrl;
		}
	},

});
