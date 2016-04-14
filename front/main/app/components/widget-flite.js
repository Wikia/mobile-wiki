import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['widget-flite'],
	layoutName: 'components/widget-flite',
	data: null,

	scriptTag: Em.computed('data', function () {
		const src = '//s.flite.com/syndication/combo.js',
			guid = this.get('data.guid'),
			width = this.get('data.width'),
			height = this.get('data.height');

		return `<script src="${src}" async="async" ` +
			`data-instance="${guid}" data-width="${width}" data-height="${height}"></` +
			'script>';
	}),

	/**
	 * @return {void}
	 */
	willInsertElement() {
		this.setUpConfig();
	},

	/**
	 * @return {void}
	 */
	setUpConfig() {
		const guid = this.get('data.guid');

		window.FLITE = window.FLITE || {};
		window.FLITE.config = window.FLITE.config || {};
		window.FLITE.config[guid] = window.FLITE.config[guid] || {};
		window.FLITE.config[guid].ts = (+ new Date());
	},
});
