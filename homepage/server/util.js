/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 * @author Gautam Bajaj <gbajaj@wikia-inc.com>
 */

var Promise = require('bluebird'),
	fs = require('fs'),
	path = require('path'),
	deepExtend = require('deep-extend'),
	Auth = require('./auth'),
	auth = new Auth(),
	localSettings = require('../config/localSettings').localSettings,
	strings;

exports.readJsonConfigSync = function (filename) {
	try {
		var f = path.resolve(__dirname, filename),
			data = fs.readFileSync(f, 'utf8');

		return JSON.parse(data);
	}
	catch (e) {
		console.log(e);
		return null;
	}
};

exports.getUserLocale = function (/*request*/) {
	// TODO: Parse accept-language and login state to set locale
	return 'ja';
};

exports.getLoginState = function (request) {
	var accessToken = (request.state) ? request.state.access_token : null; // jshint ignore:line

	if (accessToken && typeof(accessToken) !== 'undefined') {
		return auth.info(accessToken);
	} else {
		return new Promise.Promise(function (resolve, reject) {
			reject({
				error: 'not_logged_in',
				error_description: 'User is not logged in' // jshint ignore:line
			});
		});
	}
};

exports.getLoginUrl = function () {
	return localSettings.loginUrl;
};

exports.getSignupUrl = function () {
	return localSettings.signupUrl;
};

exports.getJaCommunityUrl = function () {
	return localSettings.jaCommunityUrl;
};

exports.getJaUniversityUrl = function () {
	return localSettings.jaUniversityUrl;
};

exports.getStartWikiaUrl = function () {
	return localSettings.startWikiaUrl;
};

// todo: look up this data in user session first
exports.renderWithGlobalData = function (request, reply, data, view) {
	function renderView(loggedIn, userName, avatarUrl) {
		var combinedData = deepExtend(data, {
			loggedIn: loggedIn,
			userName: userName,
			loginUrl: localSettings.loginUrl,
			signupUrl: localSettings.signupUrl,
			avatarUrl: avatarUrl,
			prod: (process.env.WIKIA_ENVIRONMENT === 'prod') ||
				  (process.env.WIKIA_ENVIRONMENT === 'preview') ||
				  (process.env.WIKIA_ENVIRONMENT === 'sandbox'),
			year: new Date().getFullYear(),
		});

		reply.view(view, combinedData);
	}

	var userId,
		userName,
		avatarUrl,
		defaultAvatarUrl = '/vendor/wikia-style-guide/gh-pages/assets/images/icons/icon_avatar.svg',
		defaultLoggedInAvatarUrl = '/extensions/wikia/GlobalNavigation/images/signin_icon.svg';

	if (!strings) {
		strings = this.readJsonConfigSync('static/strings.json'); // TODO: Integrate with I18N, see INT-214
	}

	data = deepExtend(data, strings);

	this.getLoginState(request).then(function (data) {
		request.log('info', 'Got valid access token (user id: ' + data.userId + ')');  // jshint ignore:line
		userId = data.userId; // jshint ignore:line

		return auth.getUserName(userId);
	}).then(function (data) {
		userName = data.value;
		request.log('info', 'Retrieved user name for logged in user: ' + userName);

		return auth.getUserAvatar(userId);
	}).then(function (data) {
		avatarUrl = data.value || defaultLoggedInAvatarUrl;
		request.log('info', 'Retrieved avatar url for logged in user: ' + avatarUrl);

		renderView(true, userName, avatarUrl);
	}).catch(function (error) {
		if (error.error !== 'not_logged_in') {
			request.log('info', 'Access token for user is invalid');
		}

		reply.unstate('access_token');
		renderView(false, defaultAvatarUrl);
	});
};
