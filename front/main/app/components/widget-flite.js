import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['widget-flite'],
	layoutName: 'components/widget-flite',
	data: null,

	scriptTag: Ember.computed('data', function () {
		const src = '//s.flite.com/syndication/combo.js',
			guid = this.get('data.guid'),
			width = this.get('data.width'),
			height = this.get('data.height');

		// make sure globl configuration for this widget is initialized
		this.setUpConfig(guid);

		return Ember.String.htmlSafe(`<script src="${src}" async="async" ` +
			`data-instance="${guid}" data-width="${width}" data-height="${height}"></` +
			'script>');
	}),

	/**
	 * @param {string} guid
	 * @return {void}
	 */
	setUpConfig(guid) {
		window.FLITE = window.FLITE || {};
		window.FLITE.config = window.FLITE.config || {};
		window.FLITE.config[guid] = window.FLITE.config[guid] || {};
		window.FLITE.config[guid].ts = Number(new Date());
	},
});
