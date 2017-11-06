define('mobile-wiki/components/widget-flite', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component;
	exports.default = Component.extend({
		classNames: ['widget-flite'],
		layoutName: 'components/widget-flite',
		data: null,

		didInsertElement: function didInsertElement() {
			this._super.apply(this, arguments);
			this.$().html(this.getScriptTag());
		},
		getScriptTag: function getScriptTag() {
			var src = '//s.flite.com/syndication/combo.js',
			    guid = this.get('data.guid'),
			    width = this.get('data.width'),
			    height = this.get('data.height');

			// make sure globl configuration for this widget is initialized
			this.setUpConfig(guid);

			return '<script src="' + src + '" async="async" ' + ('data-instance="' + guid + '" data-width="' + width + '" data-height="' + height + '"></') + 'script>';
		},


		/**
   * @param {string} guid
   * @return {void}
   */
		setUpConfig: function setUpConfig(guid) {
			window.FLITE = window.FLITE || {};
			window.FLITE.config = window.FLITE.config || {};
			window.FLITE.config[guid] = window.FLITE.config[guid] || {};
			window.FLITE.config[guid].ts = Number(new Date());
		}
	});
});