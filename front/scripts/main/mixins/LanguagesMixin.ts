/// <reference path="../app.ts" />
'use strict';

App.LanguagesMixin = Em.Mixin.create({
	isJapaneseBrowser: Em.computed(function (): boolean {
		var lang = navigator.language || navigator.browserLanguage;
		if (!lang) {
			return this.get('isJapaneseWikia');
		}
		lang = lang.substr(0, 2);
		return lang === 'ja';
	}),

	isJapaneseWikia: Em.computed(function (): boolean {
		return Em.get(Mercury, 'wiki.language.content') === 'ja';
	}),

	browserLanguage: Em.computed(function (): string {
		var lang = navigator.browserLanguage || navigator.browserLanguage;
		if (!lang) {
			return 'en';
		}else{
			lang= lang.dasherize();
			if(lang!='pt-br'){
				lang = lang.split('-')[0];
			}
			return lang;
		}
	}),

	getLanguage(): string {
		if (Em.get('currentUser', 'isAuthenticated')){
			return Em.get('currentUser', 'language');
		}else{
			return this.browserLanguage;
		}
	}

});
