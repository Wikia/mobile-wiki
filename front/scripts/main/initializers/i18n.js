/**
 * @returns {void}
 */
export function initialize() {
	const
		/**
		 * prevents fail if transitions are empty
		 */
		loadedTranslations = M.prop('translations') || {},
		/**
		 * loaded language name is the first key of the Mercury.state.translations object
		 */
		loadedLanguage = Object.keys(loadedTranslations)[0] || 'en';

	i18n.init({
		detectLngQS: 'uselang',
		fallbackLng: 'en',
		lng: loadedLanguage,
		lowerCaseLng: true,
		ns: 'main',
		resStore: loadedTranslations,
		useLocalStorage: false
	});
}


export default {
	name: 'i18n',
	initialize
};
