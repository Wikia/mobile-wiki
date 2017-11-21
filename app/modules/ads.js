export default (window && window.Mercury && window.Mercury.Modules) ? window.Mercury.Modules.Ads : {
	getInstance: () => ({
		onTransition: () => {}
	}),
};
