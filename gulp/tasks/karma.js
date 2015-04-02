var gulp = require('gulp'),
	karma = require('gulp-karma'),
	gutil = require('gulp-util'),
	paths = require('../paths');

// NOTE: fixtures task only gets run once, so need to restart karma if you change fixtures
gulp.task('karma', ['fixtures'], function () {
	return gulp.src([
		paths.vendor.dest + '/fastclick/lib/fastclick.js',
		paths.vendor.dest + '/sinonjs/sinon.js',
		paths.vendor.dest + '/sinon-qunit/lib/sinon-qunit.js',
		paths.vendor.dest + '/jquery/dist/jquery.js',
		paths.vendor.dest + '/ember/ember.debug.js',
		paths.vendor.dest + '/i18next/i18next.js',
		paths.vendor.dest + '/vignette/dist/vignette.js',
		paths.templates.dest + '/main.js',
		paths.scripts.front.dest + '/baseline.js',
		paths.scripts.front.dest + '/mercury.js',
		paths.scripts.front.dest + '/main.js',
		// qunit helpers must not be included in general components package
		'front/vendor/ember-qunit/ember-qunit.js',
		'test/fixtures/test-fixtures.js',
		'test/helpers/**/*.js',
		// TODO fix these tests and remove this line, see CONCF-413
		'!test/specs/front/scripts/main/helpers/*.js',
		'test/specs/front/**/*.js',
		'test/integration/front/**/*.js'
	])
	.pipe(karma({
		configFile: 'test/karma.conf.js',
		action: gutil.env.action === 'watch' ? gutil.env.action : 'run'
	}))
	.on('error', function (error) {
		throw new Error(error);
	});

});
