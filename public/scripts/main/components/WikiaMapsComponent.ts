/// <reference path="../app.ts" />
'use strict';

App.WikiaMapsComponent = Em.Component.extend({
	tagName: 'div',
	layoutName: 'components/wikia-maps',
	classNames: ['wikia-map'],

	/**
	 * @desc content width used to load smaller thumbnails
	 */
	contentWidth: function (): number {
		return $('.article-content').width();
	}.property(),

});
