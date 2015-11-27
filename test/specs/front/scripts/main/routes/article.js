var originalDocumentTitle,
	originalWikiVariables;

moduleFor('route:article', 'ArticleRoute', {
	setup: function () {
		originalDocumentTitle = document.title;
		originalWikiVariables = Mercury.wiki;
	},

	teardown: function () {
		document.title = originalDocumentTitle;
		Mercury.wiki = originalWikiVariables;

		$(document.head).find('link[rel=canonical]').remove();
	}
});

test('sets correct title tag', function () {
	var route = this.subject(),
		model = Em.Object.create({
			cleanTitle: 'Article title'
		});

	Mercury.wiki.htmlTitleTemplate = '$1 - Test';
	route.updateTitleTag(model);
	equal(document.title, 'Article title - Test');

	Mercury.wiki.htmlTitleTemplate = null;
	route.updateTitleTag(model);
	equal(document.title, 'Article title - Wikia');

	delete Mercury.wiki.htmlTitleTemplate;
	route.updateTitleTag(model);
	equal(document.title, 'Article title - Wikia');
});

test('sets correct canonical link without existing element', function () {
	var route = this.subject(),
		model = Em.Object.create({
			url: '/wiki/Kermit'
		}),
		canonicalUrl = '<link rel="canonical" href="http://muppet.wikia.com/wiki/Kermit">';

	Mercury.wiki.basePath = 'http://muppet.wikia.com';
	route.updateCanonicalLinkTag(model);
	equal($(document.head).find('link[rel=canonical]').prop('outerHTML'), canonicalUrl);
});

test('sets correct canonical link with existing element', function () {
	var route = this.subject(),
		model = Em.Object.create({
			url: '/wiki/Yoda'
		}),
		canonicalLinkTag = '<link rel="canonical" href="http://starwars.wikia.com/wiki/Yoda">';

	Mercury.wiki.basePath = 'http://starwars.wikia.com';
	route.updateCanonicalLinkTag(model);
	equal($(document.head).find('link[rel=canonical]').prop('outerHTML'), canonicalLinkTag);
});

test('sets correct description meta tag without existing element', function () {
	var route = this.subject(),
		description = 'Article description',
		descriptionMetaTag = '<meta name="description" content="' + description + '">',
		model = Em.Object.create({
			description: description
		});

	route.updateDescriptionMetaTag(model);
	equal($(document.head).find('meta[name=description]').prop('outerHTML'), descriptionMetaTag);
});

test('sets correct description meta tag with existing element', function () {
	var route = this.subject(),
		description = 'Another article description',
		descriptionMetaTag = '<meta name="description" content="' + description + '">',
		model = Em.Object.create({
			description: description
		});

	route.updateDescriptionMetaTag(model);
	equal($(document.head).find('meta[name=description]').prop('outerHTML'), descriptionMetaTag);
});
