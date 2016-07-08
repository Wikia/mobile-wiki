import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

let testCases = {
	default: [
		'facebook',
		'twitter',
		'reddit',
		'tumblr'
	],
	en: [
		'facebook',
		'twitter',
		'reddit',
		'tumblr'
	],
	ja: [
		'facebook',
		'twitter',
		'google',
		'line'
	],
	'pt-br': [
		'facebook',
		'twitter',
		'reddit',
		'tumblr'
	],
	zh: [
		'facebook',
		'weibo'
	],
	de: [
		'facebook',
		'twitter',
		'tumblr'
	],
	fr: [
		'facebook',
		'twitter'
	],
	es: [
		'facebook',
		'twitter',
		'meneame',
		'tumblr'
	],
	ru: [
		'vkontakte',
		'facebook',
		'odnoklassniki',
		'twitter'
	],
	pl: [
		'facebook',
		'twitter',
		'nk',
		'wykop'
	]
};

moduleForComponent('share-feature', 'Integration | Component | share feature component', {
	unit: true
});

/**
 * Mocks 'getBrowserLanguage' function response with provided language.
 *
 * @param {object} context - current test 'this'
 * @param {string} language
 * @return {void}
 */
function mockLanguageMixinResponse(context, language) {
	context.subject().set('getBrowserLanguage', () => language);
}

/**
 * Assets that links generated in component has social networks in given order.
 *
 * @param {Object} assert
 * @param {string[]} socialNetworks - list of social networks
 * @returns {void}
 */
function assertThatHasSocialIcons(assert, socialNetworks) {
	assert.expect(socialNetworks.length);
	socialNetworks.forEach(function (socialNetwork, index) {
		assert.ok(this.$(`.icon:nth-child(${index + 1})`).hasClass(socialNetwork));
	});
}

Object.keys(testCases).forEach((language) => {
	let socialNetworks = testCases[language];

	test(`when component has language set to ${language} 
		  these social networks should appear ${socialNetworks}`, function (assert) {

		mockLanguageMixinResponse(this, language);

		this.render(hbs`{{share-feature}}`);
		assertThatHasSocialIcons(assert, socialNetworks);
	});
});


