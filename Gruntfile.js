module.exports = function(grunt) {
	grunt.initConfig({
		// configure grunt plugins here

		/*
		 * Clean directories of stale files
		 */
		clean: {
			// Enable 'no-write' for a dry run of clean, outputs to debug, but does not actually clean
			// 'no-write': true,
			dev: ['.tmp/public/**'],
			build: ['www']
		},

		/*
		 * Task to copy files from development directories to 'tmp' for dev and 'www' for prod
		 */
		copy: {
			dev: {
				encoding: 'utf-8',
				mode: true,
				files: [{
					expand: true,
					cwd: './public',
					src: ['**/*.!(scss)'],
					dest: '.tmp/public'
				}]
			},
			build: {
				encoding: 'utf-8',
				mode: true,
				files: [{
					expand: true,
					cwd: './tmp/public',
					src: ['**/*'],
					dest: 'www'
				}]
			}
		},

		/*
		 * Compile SASS files using libsass
		 */
		sass: {
			dev: {
				files: {
					'.tmp/public/styles/app.css': 'public/styles/app.scss'
				},
				options: {
					includePaths: ['./public/styles'],
					outputStyle: 'expanded',
					sourceComments: 'map'
				}
			},
			sourceMap: {
				options: {
					sourceComments: 'map',
					// currently doesn't work https://github.com/sindresorhus/grunt-sass/issues/57
					// sourceMap: 'source-map.css.map'
				},
				files: {
					'.tmp/public/source-map.css': 'public/styles/app.scss'
				}
			}
		},
		/*
		 * Watch task to rerun tasks on file change
		 */
		watch: {
			assets: {
				files: [
					'**/*'
				],
				tasks: ['compileAssets'],
				options: {
					cwd: './public'
				}
			}
		}

	});

	// load plugins that provide tasks
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('compileAssets', [
		// first clean the directory
		'clean:dev',
		// compile assets
		'sass:dev',
	]);

	grunt.registerTask('default', [
		'compileAssets',
		// copy to tmp folder
		'copy:dev',
		// watch task for dev
		'watch:assets'
	]);

	grunt.registerTask('build', [
		'sass',
		'clean',
		'copy',
	]);
};
