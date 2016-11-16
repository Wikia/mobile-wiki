import Ember from 'ember';
import HeadTagsDynamicMixin from './head-tags-dynamic';

export default Ember.Mixin.create(
	HeadTagsDynamicMixin,
	{
		buildQueryParamsString(queryParams, newQueryParams = {}, queryParamsToRemove = []) {
			const params = Object.assign({}, queryParams, newQueryParams),
				paramsArray = [];

			queryParamsToRemove.forEach(function (nameToRemove) {
				delete params[nameToRemove];
			});

			Object.keys(params).forEach(function (name) {
				paramsArray.push(`${name}=${params[name]}`);
			});

			return paramsArray.join('&');
		},

		buildUrl(queryParams, newQueryParams = {}, queryParamsToRemove = []) {
			const baseUrl = `${Ember.get(Mercury, 'wiki.basePath')}${window.location.pathname}`,
				queryParamsString = this.buildQueryParamsString(queryParams, newQueryParams, queryParamsToRemove);

			if(queryParamsString) {
				return `${baseUrl}?${queryParamsString}`
			} else {
				return baseUrl;
			}
		},

		setDynamicHeadTags(model, data = {}) {
			const queryParams = this.get('router.router.state.queryParams');

			if(model && model.current && model.current.get('data.postCount')) {
				const totalPosts = model.current.get('data.postCount'),
					currentPage = parseInt(queryParams.page) || 1;

				if(totalPosts > currentPage * 20) {
					data.next = this.buildUrl(queryParams, {page: currentPage+1});
				}

				if (currentPage == 2) {
					data.prev = this.buildUrl(queryParams, {}, ['page']);
				} else if (currentPage > 2) {
					data.prev = this.buildUrl(queryParams, {page: currentPage-1});
				}
			}

			this._super(model, data);
		},
	}
);
