//! moment.js locale configuration
//! locale : japanese (ja)
//! author : LI Long : https://github.com/baryon

;
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined'
	&& typeof mequire === 'function' ? factory(mequire('../moment')) :
		typeof mefine === 'function' && mefine.amd ? mefine(['../../bower_components/moment/moment'], factory) :
			factory(global.moment)
}(this, function (moment) {
	'use strict';


	var ja = moment.defineLocale('ja', {
		months: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
		monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
		weekdays: '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
		weekdaysShort: '日_月_火_水_木_金_土'.split('_'),
		weekdaysMin: '日_月_火_水_木_金_土'.split('_'),
		longDateFormat: {
			LT: 'Ah時m分',
			LTS: 'Ah時m分s秒',
			L: 'YYYY/MM/DD',
			LL: 'YYYY年M月D日',
			LLL: 'YYYY年M月D日Ah時m分',
			LLLL: 'YYYY年M月D日Ah時m分 dddd'
		},
		meridiemParse: /午前|午後/i,
		isPM: function (input) {
			return input === '午後';
		},
		meridiem: function (hour, minute, isLower) {
			if (hour < 12) {
				return '午前';
			} else {
				return '午後';
			}
		},
		calendar: {
			sameDay: '[今日] LT',
			nextDay: '[明日] LT',
			nextWeek: '[来週]dddd LT',
			lastDay: '[昨日] LT',
			lastWeek: '[前週]dddd LT',
			sameElse: 'L'
		},
		relativeTime: {
			future: '%s後',
			past: '%s前',
			s: '数秒',
			m: '1分前',
			mm: '%d分前',
			h: '1時間前',
			hh: '%d時間前',
			d: '1日前',
			dd: '%d日前',
			M: '1ヶ月',
			MM: '%dヶ月',
			y: '1年',
			yy: '%d年'
		}
	});

	return ja;

}));
