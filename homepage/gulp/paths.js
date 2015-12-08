/*
 * Path list for tasks
 */

var path = require('path'),
    basePath = '/',
    baseServer = '/server',
    baseFront = '/front';

module.exports = {
    base: basePath,
    baseFull: path.resolve(basePath),
    baseFullServer: path.resolve(baseServer),
    baseFullFront: path.resolve(baseFront),
    vendor: {
        homepage: {
            src: 'vendor/**/*',
            dest: 'front/vendor'
        }
    },
    locales: {
        homepage: {
            src: 'front/locales/**/*.json',
            dest: basePath + '/front/locales'
        }
    },
    styles: {
        homepage: {
            src: 'front/styles/app.scss',
            watch: 'front/styles/**/*.scss',
            dest: 'front/css',
            partials: '_*.scss',
            compile: '*.scss'
        }
    },
    scripts: {
        homepage: {
            src: 'front/scripts',
            watch: 'front/scripts/**/*.js',
            dest: 'front/js',
            files: '**/*.js',
        },
        auth: {
            src: '../front/scripts/auth',
            watch: '../front/scripts/auth/**/*.ts',
            dest: 'front/js',
            files: '**/*.ts',
            dFiles: '**/*.d.ts'
        },
        util: {
            src: '../front/scripts/mercury/utils',
            watch: '../front/scripts/mercury/utils/**/*.ts',
            dest: 'front/js',
            files: '**/*.ts',
            dFiles: '**/*.d.ts'
        }
    },
    views: {
        homepage: {
            src: 'server/views/**/*.+(hbs|js|html)',
            dest: basePath + '/server/views'
        }
    },
    images: {
        homepage: {
            src: ['front/images/*'],
            dest: basePath + '/front/images'
        }
    },
    nodeModules: {
        homepage: {
            src: 'node_modules',
            dest: basePath + '/node_modules'
        }
    },
    server: {
        homepage: {
            script: 'server/index.js',
            watch: 'server/**/*'
        }
    },
    config: {
        path: 'config/',
        baseFile: 'localSettings.base.js',
        exampleFile: 'localSettings.example.js',
        testFile: 'localSettings.test.js',
        runtimeFile: 'localSettings.js'
    }
};
