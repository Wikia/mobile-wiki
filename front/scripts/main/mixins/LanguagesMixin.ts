/// <reference path="../app.ts" />
'use strict';

App.LanguagesMixin = Em.Mixin.create({
	isJapaneseBrowser: Ember.computed(function (): boolean {
		var lang = navigator.language || navigator.browserLanguage;
		if (!lang) {
			return this.get('isJapaneseWikia');
		}
		lang = lang.substr(0, 2);
		return lang === 'ja';
	}),

	isJapaneseWikia: Ember.computed(function (): boolean {
		return Em.get(Mercury, 'wiki.language.content') === 'ja';
	})
});
