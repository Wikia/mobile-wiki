import Ember from 'ember';
import M from '../mmm';

export default Ember.Mixin.create({
	headData: Ember.inject.service(),

	/**
	 * @returns {void}
	 */
	afterModel() {
		this._super(...arguments);

		this.setStaticHeadTags();
	},

	/**
	 * This function sets static head tags defined in templates/head.hbs
	 * This is for head tags which are set only once
	 *
	 * @returns {void}
	 */
	setStaticHeadTags() {
		const wikiVariables = this.modelFor('application'),
			verticalColors = {
				comics: '#ff5400',
				games: '#94d11f',
				books: '#ff7f26',
				movies: '#09d3bf',
				lifestyle: '#ffd000',
				music: '#c819ad',
				tv: '#00b7e0'
			};

		this.get('headData').setProperties({
			favicon: wikiVariables.favicon,
			themeColor: verticalColors[wikiVariables.vertical],
			gaUrl: M.prop('gaUrl'),
			qualarooScript: M.prop('qualarooScript'),
			optimizelyScript: M.prop('optimizelyScript'),
			isRtl: wikiVariables.language && wikiVariables.language.contentDir === 'rtl'
		});
	}
});
