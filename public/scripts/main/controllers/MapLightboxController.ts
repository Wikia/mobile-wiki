/// <reference path="./LightboxController.ts" />
/// <reference path="../models/MapModel.ts" />

App.MapLightboxController = App.LightboxController.extend({
	needs: 'article',
	model: Em.computed.oneWay(
		'controllers.article.model.map'
	),

	data: {
		mapTitle: null,
		mapUrl: null,
		text: 'diana'
	},

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
	 * sets all properties to their null state
	 */
	reset: function (): void {
		this.setProperties({
			data: {
				mapTitle: null,
				mapUrl: null
			},
			file: null
		});

		this._super();
	}
});