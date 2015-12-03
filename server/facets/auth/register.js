import BirthdateInput from './BirthdateInput';
import * as authUtils from '../../lib/AuthUtils';
import localSettings from '../../../config/localSettings';
import authLocaleSettings from '../../../config/authLocaleSettings';
import * as authView from './authView';
import deepExtend from 'deep-extend';

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
 * @returns {DefaultRegistrationContext}
 */
function getDefaultRegistrationContext(request, i18n) {
	const lang = i18n.lng();

	return deepExtend(authView.getDefaultContext(request),
		{
			usernameMaxLength: localSettings.helios.usernameMaxLength,
			passwordMaxLength: localSettings.helios.passwordMaxLength,
			langCode: lang,
			defaultBirthdate: '1970-01-01',
			pageParams: {
				termsOfUseLink: `<a href="${authLocaleSettings[lang].urls.termsOfUseLinkUrl}" target="_blank">` +
					`${i18n.t('auth:register.terms-of-use-link-title')}</a>`,
				privacyPolicyLink: `<a href="${authLocaleSettings[lang].urls.privacyPolicyLinkUrl}" target="_blank">` +
					`${i18n.t('auth:register.privacy-policy-link-title')}</a>`
			}
		}
	);
}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {Hapi.Response}
 */
function getFacebookRegistrationPage(request, reply) {
	const i18n = request.server.methods.i18n.getInstance(),
		context = deepExtend(getDefaultRegistrationContext(request, i18n),
			{
				headerText: 'auth:fb-register.register-with-facebook',
				heliosFacebookRegistrationURL: authUtils.getHeliosUrl('/facebook/users'),
				title: 'auth:fb-register.register-with-facebook',
				termsOfUseLink: 'http://www.wikia.com/Terms_of_Use',
				footerCallout: 'auth:common.signin-callout',
				footerHref: authUtils.getSignInUrl(request),
				footerCalloutLink: 'auth:fb-register.footer-callout-link',
				bodyClasses: 'register-fb-page',
				pageType: 'register-fb-page',
				facebookAppId: localSettings.facebook.appId,
				headerSlogan: 'auth:fb-register.facebook-registration-info',
				pageParams: {
					facebookAppId: localSettings.facebook.appId
				}
			}
		);

	if (request.auth.isAuthenticated) {
		return authView.onAuthenticatedRequestReply(request, reply, context);
	}

	return authView.view('register-fb', context, request, reply);
}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {Hapi.Response}
 */
function getEmailRegistrationPage(request, reply) {
	const i18n = request.server.methods.i18n.getInstance(),
		lang = i18n.lng(),
		viewType = authView.getViewType(request),
		birthdateInput = new BirthdateInput(authLocaleSettings[lang].date.endian, lang),
		context = deepExtend(getDefaultRegistrationContext(request, i18n),
			{
				headerText: (viewType === authView.VIEW_TYPE_MOBILE) ?
					'auth:join.sign-up-with-email' :
					'auth:register.desktop-header',
				heliosRegistrationURL: authUtils.getHeliosUrl('/users'),
				heliosFacebookURL: authUtils.getHeliosUrl('/facebook/token'),
				title: (viewType === authView.VIEW_TYPE_MOBILE) ?
					'auth:join.sign-up-with-email' :
					'auth:register.desktop-header',
				termsOfUseLink: `<a href="${authLocaleSettings[lang].urls.termsOfUseLinkUrl}` +
					`" target="_blank">${i18n.t('auth:register.terms-of-use-link-title')}</a>`,
				footerCallout: 'auth:common.signin-callout',
				footerHref: authUtils.getSignInUrl(request),
				footerCalloutLink: 'auth:common.signin-link-text',
				birthdateInputs: birthdateInput.getInputData(),
				bodyClasses: 'register-page',
				pageType: 'register-page',
				usernameMaxLength: localSettings.helios.usernameMaxLength,
				passwordMaxLength: localSettings.helios.passwordMaxLength,
				langCode: lang,
				pageParams: {
					termsOfUseLink: `<a href="${authLocaleSettings[lang].urls.termsOfUseLinkUrl}" target="_blank">` +
						`${i18n.t('auth:register.terms-of-use-link-title')}</a>`,
					privacyPolicyLink: `<a href="${authLocaleSettings[lang].urls.privacyPolicyLinkUrl}" target="_blank">` +
						`${i18n.t('auth:register.privacy-policy-link-title')}</a>`,
					facebookAppId: localSettings.facebook.appId
				}
			}
		);

	if (request.auth.isAuthenticated) {
		return authView.onAuthenticatedRequestReply(request, reply, context);
	}

	return authView.view('register', context, request, reply);
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
