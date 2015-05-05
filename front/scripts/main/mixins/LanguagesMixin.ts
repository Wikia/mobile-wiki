/// <reference path="../app.ts" />
'use strict';

App.LanguagesMixin = Em.Mixin.create({
	isJapanese: Ember.computed(function (): boolean {
		var lang = navigator.language || navigator.browserLanguage;
		if (lang) {
			lang = lang.substr(0, 2);
		} else {
			lang = this.get('language.content');
		}
		return lang === 'ja';
	})
});
