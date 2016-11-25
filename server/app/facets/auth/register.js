import BirthdateInput from './birthdate-input';
import * as authUtils from '../../lib/auth-utils';
import {PageRequestHelper} from '../../lib/mediawiki-page';
import Logger from '../../lib/logger';
import settings from '../../../config/settings';
import authLocaleSettings from '../../../config/authLocaleSettings';
import * as authView from './auth-view';
import deepExtend from 'deep-extend';
import {parse} from 'url';

/**
 * @typedef {Object} RegisterViewContext
 * @extends AuthViewContext
 * @property {InputData[]} birthdateInputs
 * @property {string} [headerText]
 * @property {string} [heliosRegistrationURL]
 * @property {*} [i18nContext]
 * @property {string} [termsOfUseLink]
 * @property {string} heliosFacebookURL
 */

/**
 * @typedef {Object} RegisterFBViewContext
 * @extends AuthViewContext
 * @property {InputData[]} birthdateInputs
 * @property {string} defaultBirthdate
 * @property {string} headerSlogan
 * @property {string} [headerText]
 * @property {string} [heliosRegistrationURL]
 * @property {*} [i18nContext]
 * @property {string} [termsOfUseLink]
 */

/**
 * @typedef {Object} DefaultRegistrationContext
 * @property {number} usernameMaxLength
 * @property {number} passwordMaxLength
 * @property {string} langCode
 * @property {string} defaultBirthdate
 * @property {*} pageParams
 */

/**
 * @param {Hapi.Request} request
 * @param {*} i18n
 * @returns {Promise}
 */
function getDefaultRegistrationContext(request, i18n) {
	const lang = authUtils.getLanguageWithDefault(i18n),
		defaultContext = authView.getDefaultContext(request),
		wikiDomain = parse(defaultContext.exitTo).host || request.headers.host,
		mediaWikiPageHelper = new PageRequestHelper({wikiDomain}),
		context = deepExtend(defaultContext, {
			usernameMaxLength: settings.userRegistationService.usernameMaxLength,
			passwordMaxLength: settings.userRegistationService.passwordMaxLength,
			langCode: lang,
			defaultBirthdate: '1970-01-01',
			pageParams: {
				termsOfUseLink: `<a href="${authLocaleSettings[lang].urls.termsOfUseLinkUrl}" target="_blank">` +
				`${i18n.t('auth:register.terms-of-use-link-title')}</a>`,
				privacyPolicyLink: `<a href="${authLocaleSettings[lang].urls.privacyPolicyLinkUrl}" target="_blank">` +
				`${i18n.t('auth:register.privacy-policy-link-title')}</a>`
			},
			// default wikiId (for www wikia) when redirect query param not provided
			entryPointWikiId: 80433
		}
	);

	return mediaWikiPageHelper.getWikiVariables()
		.then((wikiVariables) => {
			context.entryPointWikiId = wikiVariables.id;
			return context;
		})
		/**
		 * @param {MWException} error
		 * @returns {void}
		 */
		.catch((error) => {
			Logger.error(error, 'Can\'t fetch wikiVariables');
			return context;
		});
}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
function getFacebookRegistrationPage(request, reply) {
	const i18n = request.server.methods.i18n.getInstance();

	getDefaultRegistrationContext(request, i18n).then((defaultContext) => {
		const context = deepExtend(defaultContext,
			{
				headerText: 'auth:fb-register.register-with-facebook',
				heliosFacebookRegistrationURL: authUtils.getUserRegistrationUrl('/facebook/users'),
				title: 'auth:fb-register.register-with-facebook',
				termsOfUseLink: 'http://www.wikia.com/Terms_of_Use',
				headerCallout: 'auth:common.signin-callout',
				headerHref: authUtils.getSignInUrl(request),
				headerCalloutLink: 'auth:fb-register.callout-link',
				bodyClasses: 'register-fb-page',
				pageType: 'register-fb-page',
				facebookAppId: settings.facebook.appId,
				headerSlogan: 'auth:fb-register.facebook-registration-info',
				pageParams: {
					facebookAppId: settings.facebook.appId
				}
			}
		);

		if (request.auth.isAuthenticated) {
			return authView.onAuthenticatedRequestReply(request, reply, context);
		}

		return authView.view('register-fb', context, request, reply);
	});
}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
function getEmailRegistrationPage(request, reply) {
	const i18n = request.server.methods.i18n.getInstance(),
		lang = authUtils.getLanguageWithDefault(i18n),
		viewType = authView.getViewType(request),
		birthdateInput = new BirthdateInput(authLocaleSettings[lang].date.endian, lang),
		emailRegistrationContext = {
			headerText: (viewType === authView.VIEW_TYPE_MOBILE) ?
				'auth:join.sign-up-with-email' :
				'auth:register.desktop-header',
			heliosRegistrationURL: authUtils.getUserRegistrationUrl('/users'),
			heliosFacebookURL: authUtils.getHeliosUrl('/facebook/token'),
			title: (viewType === authView.VIEW_TYPE_MOBILE) ?
				'auth:join.sign-up-with-email' :
				'auth:register.desktop-header',
			termsOfUseLink: `<a href="${authLocaleSettings[lang].urls.termsOfUseLinkUrl}` +
			`" target="_blank">${i18n.t('auth:register.terms-of-use-link-title')}</a>`,
			headerCallout: 'auth:common.signin-callout',
			headerHref: authUtils.getSignInUrl(request),
			headerCalloutLink: 'auth:common.signin-link-text',
			birthdateInputs: birthdateInput.getInputData(),
			bodyClasses: 'register-page',
			pageType: 'register-page',
			usernameMaxLength: settings.helios.usernameMaxLength,
			passwordMaxLength: settings.helios.passwordMaxLength,
			langCode: lang,
			pageParams: {
				termsOfUseLink: `<a href="${authLocaleSettings[lang].urls.termsOfUseLinkUrl}" target="_blank">` +
				`${i18n.t('auth:register.terms-of-use-link-title')}</a>`,
				privacyPolicyLink: `<a href="${authLocaleSettings[lang].urls.privacyPolicyLinkUrl}" target="_blank">` +
				`${i18n.t('auth:register.privacy-policy-link-title')}</a>`,
				facebookAppId: settings.facebook.appId
			}
		};

	getDefaultRegistrationContext(request, i18n).then((defaultContext) => {
		const context = deepExtend(defaultContext, emailRegistrationContext);

		if (request.auth.isAuthenticated) {
			return authView.onAuthenticatedRequestReply(request, reply, context);
		}

		return authView.view('register', context, request, reply);
	});
}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function get(request, reply) {
	if (request.query.method === 'facebook') {
		getFacebookRegistrationPage(request, reply);
	} else {
		getEmailRegistrationPage(request, reply);
	}
}
