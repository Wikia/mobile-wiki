/// <reference path="./LightboxController.ts" />

App.MapLightboxController = App.LightboxController.extend({
	needs: 'article',

	model: Em.computed.oneWay(
		'controllers.article.model.map'
	),

	map: Em.computed.alias(
		'controllers.article.map'
	),

	data: {
		mapTitle: null,
		mapUrl: null,
		mapId: null
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

	header: Em.computed.alias(
		'data.mapTitle'
	),

	init: function (): void {
		this._super();
		this.get('data.mapId') ? this.set('map', this.get('data.mapId')) : this.set('map', null);
	}.observes('data.mapId').on('init'),

	/**
	 * sets all properties to their null state
	 */
	reset: function (): void {
		this.setProperties({
			data: {
				mapTitle: null,
				mapUrl: null
			},
			map: null
		});

		this._super();
	}
});
