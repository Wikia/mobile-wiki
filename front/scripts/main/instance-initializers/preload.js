export function initialize (applicationInstance) {
	const $window = $(window),
		/**
		 * prevents fail if transitions are empty
		 */
		loadedTranslations = M.prop('translations') || {},
		/**
		 * loaded language name is the first key of the Mercury.state.translations object
		 */
		loadedLanguage = Object.keys(loadedTranslations)[0] || 'en';

	let debug = M.prop('environment') === 'dev';

	$window.scroll(() => {
		M.prop('scroll.mercury.preload', $window.scrollTop(), true);
	});

	// turn on debugging with querystring ?debug=1
	if (window.location.search.match(/debug=1/)) {
		debug = true;
	}

	applicationInstance.setProperties({
		LOG_ACTIVE_GENERATION: debug,
		LOG_VIEW_LOOKUPS: debug,
		LOG_TRANSITIONS: debug,
		LOG_TRANSITIONS_INTERNAL: debug,
		LOG_RESOLVER: debug,
	});

	i18n.init({
		debug,
		detectLngQS: 'uselang',
		fallbackLng: 'en',
		lng: loadedLanguage,
		lowerCaseLng: true,
		ns: 'main',
		resStore: loadedTranslations,
		useLocalStorage: false
	});

	// FastClick disables the 300ms delay on iOS and some Android devices. It also uses clicks so that
	// elements have access to :hover state
	FastClick.attach(document.body);
}

export default {
	name: 'preload',
	//after: 'optimizely',
	initialize: initialize
}
