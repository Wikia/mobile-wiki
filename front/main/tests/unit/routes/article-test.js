import Ember from 'ember';
import {test, moduleFor} from 'ember-qunit';

let originalDocumentTitle,
	originalWikiVariables;

moduleFor('route:article', 'Integration | Route | article', {
	beforeEach() {
		originalDocumentTitle = document.title;
		originalWikiVariables = Mercury.wiki;
	},

	afterEach() {
		document.title = originalDocumentTitle;
		Mercury.wiki = originalWikiVariables;

		$(document.head).find('link[rel=canonical]').remove();
	}
});

test('sets correct title tag', function (assert) {
	const route = this.subject(),
		model = Ember.Object.create({
			cleanTitle: 'Article title'
		});

	Mercury.wiki.htmlTitleTemplate = '$1 - Test';
	route.updateTitleTag(model);
	assert.equal(document.title, 'Article title - Test');

	Mercury.wiki.htmlTitleTemplate = null;
	route.updateTitleTag(model);
	assert.equal(document.title, 'Article title - Wikia');

	delete Mercury.wiki.htmlTitleTemplate;
	route.updateTitleTag(model);
	assert.equal(document.title, 'Article title - Wikia');
});

test('sets correct canonical link without existing element', function (assert) {
	const route = this.subject(),
		model = Ember.Object.create({
			url: '/wiki/Kermit'
		}),
		canonicalUrl = '<link rel="canonical" href="http://muppet.wikia.com/wiki/Kermit">';

	Mercury.wiki.basePath = 'http://muppet.wikia.com';
	route.updateCanonicalLinkTag(model);

	assert.equal($(document.head).find('link[rel=canonical]').prop('outerHTML'), canonicalUrl);
});

test('sets correct canonical link with existing element', function (assert) {
	const route = this.subject(),
		model = Ember.Object.create({
			url: '/wiki/Yoda'
		}),
		canonicalLinkTag = '<link rel="canonical" href="http://starwars.wikia.com/wiki/Yoda">';

	Mercury.wiki.basePath = 'http://starwars.wikia.com';
	route.updateCanonicalLinkTag(model);
	assert.equal($(document.head).find('link[rel=canonical]').prop('outerHTML'), canonicalLinkTag);
});

test('sets correct description meta tag without existing element', function (assert) {
	const route = this.subject(),
		description = 'Article description',
		descriptionMetaTag = `<meta name="description" content="${description}">`,
		model = Ember.Object.create({
			description
		});

	route.updateDescriptionMetaTag(model);
	assert.equal($(document.head).find('meta[name=description]').prop('outerHTML'), descriptionMetaTag);
});

test('sets correct description meta tag with existing element', function (assert) {
	const route = this.subject(),
		description = 'Another article description',
		descriptionMetaTag = `<meta name="description" content="${description}">`,
		model = Ember.Object.create({
			description
		});

	route.updateDescriptionMetaTag(model);
	assert.equal($(document.head).find('meta[name=description]').prop('outerHTML'), descriptionMetaTag);
});
