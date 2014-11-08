/// <reference path="./LightboxController.ts" />

App.MapLightboxController = App.LightboxController.extend({
	needs: 'article',
	model: Em.computed.oneWay(
		'controllers.article.model.map'
	),

	data: {
		mapTitle: null,
		mapUrl: null
	},

	currentMediaRef: Em.computed.alias(
		'data.mapUrl'
	),

	mapUrl: Em.computed.alias(
		'data.mapUrl'
	),

	mapTitle: Em.computed.alias(
		'data.mapTitle'
	),

	init: function (): void {
		this._super();
	},

	/**
	 * returns header for currentMap
	 *
	 * @return string
	 */
	header: function (): string {
		return this.get('mapTitle');
	}.property('mapTitle'),

	/**
	 * returns footer for currentMap
	 *
	 * @return string
	 */
	footer: function (): string {
		return this.get('mapTitle');
	}.property('mapTitle'),


	/**
	 * sets all properties to their null state
	 */
	reset: function (): void {
		this.setProperties({
			data: {
				mapTitle: null,
				mapUrl: null
			}
		});

		this._super();
	}
});