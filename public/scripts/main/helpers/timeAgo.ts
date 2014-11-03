Em.Handlebars.registerBoundHelper('timeAgo', function (unixTimestamp: number) {
	var timeDiff = Math.ceil(new Date().getTime() / 1000) - unixTimestamp;
	// now
	if (timeDiff == 0) {
		return i18n.t('app:now-label');
	}
	// seconds
	if (timeDiff < 60) {
		return i18n.t('app:seconds-ago-label', {count: timeDiff});
	}
	// minutes
	timeDiff = Math.ceil(timeDiff / 60);
	if (timeDiff < 60) {
		return i18n.t('app:minutes-ago-label', {count: timeDiff});
	}
	// hours
	timeDiff = Math.ceil(timeDiff / 60);
	if (timeDiff < 24) {
		return i18n.t('app:hours-ago-label', {count: timeDiff});
	}
	// days
	timeDiff = Math.ceil(timeDiff / 24);
	if (timeDiff < 30) {
		return i18n.t('app:days-ago-label', {count: timeDiff});
	}
	// months
	timeDiff = Math.ceil(timeDiff / 30);
	if (timeDiff < 12) {
		return i18n.t('app:months-ago-label', {count: timeDiff});
	}
	// years
	timeDiff = Math.ceil(timeDiff / 12);
	return i18n.t('app:years-ago-label', {count: timeDiff});
})
