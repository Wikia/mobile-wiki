import hbs from 'htmlbars-inline-precompile';
import {test, moduleForComponent} from 'ember-qunit';

let defaultLanguage = navigator.language;

let testCases = {
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
	integration: true
});

/**
 * Sets navigator language.
 *
 * @param {string} language
 * @returns {void}
 */
function changeLanguageTo(language) {
	window.navigator.__defineGetter__('language', () => language);
}

/**
 * Assets that links generated in component has social networks in given order.
 *
 * @param {Object} assert
 * @param {string[]} socialNetworks - list of social networks
 * @returns {void}
 */
function assertThatHasSocialIcons(assert, socialNetworks) {
	socialNetworks.forEach(function (socialNetwork, index) {
		assert.ok(this.$(`.icon:nth-child(${index + 1})`).hasClass(socialNetwork));
	});
}


test(`when component has no language set
	  social networks should appear ${testCases.en}`, function (assert) {
	let socialNetworks = testCases['en'];

	changeLanguageTo(null);

	assert.expect(socialNetworks.length);
	this.render(hbs`{{share-feature}}`);
	assertThatHasSocialIcons(assert, socialNetworks);

	changeLanguageTo(defaultLanguage);
});

Object.keys(testCases).forEach((language) => {
	let socialNetworks = testCases[language];

	test(`when component has language set to ${language} 
		  social networks should appear ${socialNetworks}`, function (assert) {
		changeLanguageTo(language);

		assert.expect(socialNetworks.length);
		this.render(hbs`{{share-feature}}`);
		assertThatHasSocialIcons(assert, socialNetworks);

		changeLanguageTo(defaultLanguage);
	});
});


