import Ember from 'ember';

/**
 * Window
 * @typedef {Object} Window
 * @property {*} Ponto
 */

export default Ember.Mixin.create({
	/**
	 * Internet Explorer 11 has problems with catching focus
	 * when user clicks on an input which is rendered inside an iframe.
	 * This mixin triggers function in mediawiki app
	 * which sets focus on iframe after component with this mixin is inserted.
	 * Function is triggered only when Mercury is loaded inside an iframe - Ponto is defined
	 *
	 * @returns {void}
	 */
	didInsertElement() {
		const ponto = window.Ponto;

		if (ponto && typeof ponto.invoke === 'function') {
			ponto.invoke(
				'curatedContentTool.pontoBridge',
				'setFocus',
				{},
				Ember.K,
				(err) => {
					Ember.Logger.error('Ponto error:', err);

					this.controllerFor('application').addAlert({
						message: i18n.t('app.curated-content-error-other'),
						type: 'alert'
					});
				},
				true
			);
		}
	},
});
