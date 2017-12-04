//! moment.js locale configuration
//! locale : french (fr)
//! author : John Fischer : https://github.com/jfroffice

;
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined'
	&& typeof mequire === 'function' ? factory(mequire('../moment')) :
		typeof mefine === 'function' && mefine.amd ? mefine(['../../node_modules/moment/moment'], factory) :
			factory(global.moment)
}(this, function (moment) {
	'use strict';


	var fr = moment.defineLocale('fr', {
		months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
		monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
		weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
		weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
		weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
		longDateFormat: {
			LT: 'HH:mm',
			LTS: 'HH:mm:ss',
			L: 'DD/MM/YYYY',
			LL: 'D MMMM YYYY',
			LLL: 'D MMMM YYYY HH:mm',
			LLLL: 'dddd D MMMM YYYY HH:mm'
		},
		calendar: {
			sameDay: '[Aujourd\'hui à] LT',
			nextDay: '[Demain à] LT',
			nextWeek: 'dddd [à] LT',
			lastDay: '[Hier à] LT',
			lastWeek: 'dddd [dernier à] LT',
			sameElse: 'L'
		},
		relativeTime: {
			future: 'dans %s',
			past: 'il y a %s',
			s: 'quelques secondes',
			m: '1min',
			mm: '%dmin',
			h: '1h',
			hh: '%dh',
			d: '1j',
			dd: '%dj',
			M: '1mois',
			MM: '%dmois',
			y: '1an',
			yy: '%dans'
		},
		ordinalParse: /\d{1,2}(er|)/,
		ordinal: function (number) {
			return number + (number === 1 ? 'er' : '');
		},
		week: {
			dow: 1, // Monday is the first day of the week.
			doy: 4  // The week that contains Jan 4th is the first week of the year.
		}
	});

	return fr;

}));
