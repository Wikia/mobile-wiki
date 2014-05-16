/// <reference path="../app.ts" />
'use strict';

interface HeadersFromDom {
	level: string;
	name: string;
	id?: string;
}

Wikia.WikiArticleView = Em.View.extend({
	classNames: ['article-body'],
	didInsertElement: function (): void {
		// TODO: Temporary solution for generating Table of Contents
		// Ideally, we wouldn't be doing this as a post-processing step, but rather we would just get a JSON with
		// ToC data from server and render view based on that.
		var headers: HeadersFromDom[] = this.$().find('h1, h2, h3').map(function (i: number, elem: HTMLElement): HeadersFromDom {
			return {
				level: elem.tagName,
				name: elem.textContent,
				id: elem.id
			};
		});
		this.get('controller').send('updateHeaders', headers);
	},
	click: function (event) {
		if (event.target.tagName === 'A') {
			event.preventDefault();

			this.get('controller.target.router').transitionTo('/w/glee/article/' + event.target.pathname.replace('/wiki/', ''));
		}
	}
});
