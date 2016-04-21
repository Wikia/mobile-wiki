import Ember from 'ember';

export default Ember.Mixin.create({
	headData: Ember.inject.service(),

	/**
	 * @returns {void}
	 */
	init() {
		this._super(...arguments);

		this.setStaticHeadTags();
		this.removeStaticServerTags();
	},

	/**
	 * This function removes all head tags with data-server-head-tags-static attribute to avoid having duplicates.
	 * This function should be removed when fastboot will be introduced.
	 *
	 * @returns {void}
	 */
	removeStaticServerTags() {
		const headData = this.get('headData');

		if (!headData.get('staticServerTagsRemoved')) {
			// We want to run this afterRender in order to be sure that
			// meta tags in head are updated by setStaticHeadTags method
			Ember.run.schedule('afterRender', () => {
				Ember.$('[data-server-head-tags-static]').remove();
				headData.set('staticServerTagsRemoved', true);
			});
		}
	},

	/**
	 * This function sets static head tags defined in templates/head.hbs
	 * This is for head tags which are set only once
	 *
	 * @returns {void}
	 */
	setStaticHeadTags() {
		const wikiVariables = Ember.get(Mercury, 'wiki'),
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
			optimizelyScript: M.prop('optimizelyScript')
		});
	}
});
