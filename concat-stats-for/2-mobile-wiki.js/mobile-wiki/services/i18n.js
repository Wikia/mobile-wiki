define('mobile-wiki/services/i18n', ['exports', 'mobile-wiki/config/environment', 'npm:i18next'], function (exports, _environment, _npmI18next) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _defineProperty(obj, key, value) {
		if (key in obj) {
			Object.defineProperty(obj, key, {
				value: value,
				enumerable: true,
				configurable: true,
				writable: true
			});
		} else {
			obj[key] = value;
		}

		return obj;
	}

	var Service = Ember.Service,
	    inject = Ember.inject;
	exports.default = Service.extend({
		fastboot: inject.service(),
		logger: inject.service(),
		i18nextInstance: null,

		initialize: function initialize(language) {
			var _this = this;

			var fastboot = this.get('fastboot'),
			    shoebox = fastboot.get('shoebox');

			var translations = {};

			if (fastboot.get('isFastBoot')) {
				var fs = FastBoot.require('fs');

				_environment.default.translationsNamespaces.forEach(function (namespace) {
					[language, language.split('-')[0], 'en'].some(function (lang) {
						var translationPath = 'dist/mobile-wiki/locales/' + lang + '/' + namespace + '.json';

						try {
							// TODO consider using async readFile for performance reasons
							// It's not trivial when we look for up to 3 different languages in every namespace
							translations[namespace] = JSON.parse(fs.readFileSync(translationPath));

							return true;
						} catch (exception) {
							if (lang === 'en') {
								_this.get('logger').error('Translation for default language not found', {
									lang: lang,
									namespace: namespace,
									path: translationPath,
									error: exception.message
								});
							}
						}
					});
				});

				shoebox.put('translations', translations);
			} else {
				translations = shoebox.retrieve('translations');
			}

			var i18nextInstance = _npmI18next.default.createInstance().init({
				fallbackLng: 'en',
				lng: language,
				lowerCaseLng: true,
				defaultNS: 'main',
				interpolation: {
					escapeValue: false,
					prefix: '{',
					suffix: '}'
				},
				resources: _defineProperty({}, language, translations)
			});

			this.set('i18nextInstance', i18nextInstance);
		},
		t: function t() {
			var _get;

			return (_get = this.get('i18nextInstance')).t.apply(_get, arguments);
		}
	});
});