'use strict';

let browsers = [
	'last 2 ChromeAndroid versions',
	'iOS > 8',
	'> 5%'
];

if (process.env.EMBER_ENV === 'test') {
	browsers = [
		'last 1 Chrome versions',
	];
}

if (process.env.EMBER_ENV === 'development') {
	browsers = [
		'last 1 Chrome versions',
	];
}

module.exports = {browsers};
