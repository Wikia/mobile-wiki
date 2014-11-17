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
		title: null,
		url: null,
		id: null
	},

	currentMediaRef: Em.computed.alias(
		'data.url'
	),

	url: Em.computed.alias(
		'data.url'
	),

	title: Em.computed.alias(
		'data.title'
	),

	header: Em.computed.alias(
		'data.title'
	),

	init: function (): void {
		this._super();
		this.get('data.id') ? this.set('map', this.get('data.id')) : this.set('map', null);
	}.observes('data.id').on('init'),

	/**
	 * sets all properties to their null state
	 */
	reset: function (): void {
		this.setProperties({
			data: {
				title: null,
				url: null
			},
			map: null
		});

		this._super();
	}
});
