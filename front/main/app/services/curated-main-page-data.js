import Ember from 'ember';

const {Service, computed} = Ember;

export default Service.extend({
	adsContext: computed({
		get() {
			return M.prop('mainPageData.adsContext');
		},
		set(_, value) {
			return value;
		}
	}),

	ns: computed({
		get() {
			return M.prop('mainPageData.details.ns');
		},
		set(_, value) {
			return value;
		}
	}),

	description: computed({
		get() {
			return M.prop('mainPageData.details.description');
		},
		set(_, value) {
			return value;
		}
	}),

	/**
	 * mainPageData.details.id is set on sections and categories
	 * articleId is set on MainPage
	 * currently we need to support both cases
	 * ideally there would be only one way to get this data
	 */
	id: computed({
		get() {
			return M.prop('mainPageData.details.id') || M.prop('articleId');
		},
		set(_, value) {
			return value;
		}
	})
});
