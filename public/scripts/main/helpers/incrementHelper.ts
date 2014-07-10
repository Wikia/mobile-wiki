/// <reference path="../app.ts" />

Em.Handlebars.registerBoundHelper('increment', function(value: number, incrementBy: number) {
	if (typeof incrementBy !== 'number') {
		incrementBy = 1;
	}
	if (typeof value !== 'number') {
		throw new Error('Incorrect type supplied to increment helper. Please make sure input evaluates to number');
	}
	return value + incrementBy;
});
