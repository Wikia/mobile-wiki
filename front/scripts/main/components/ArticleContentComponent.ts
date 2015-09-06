/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../mixins/AdsMixin.ts" />
/// <reference path="../mixins/PollDaddyMixin.ts" />

'use strict';

interface HTMLElement {
	scrollIntoViewIfNeeded: () => void
}

App.ArticleContentComponent = Em.Component.extend(App.AdsMixin, App.PollDaddyMixin, {
	tagName: 'article',
	classNames: ['article-content', 'mw-content'],

	adsContext: null,
	content: null,
	media: null,
	contributionFeatureEnabled: null,
	uploadFeatureEnabled: null,
	cleanTitle: null,
	headers: null,

	articleContentObserver: Em.observer('content', function (): void {
		var content = this.get('content');

		Em.run.scheduleOnce('afterRender', this, (): void => {
			if (content) {
				this.hackIntoEmberRendering(content);
				this.loadTableOfContentsData();
				this.handleTables();
				this.handleInfoboxes();
				this.replaceInfoboxesWithInfoboxComponents();
				this.replaceMapsWithMapComponents();
				this.replaceMediaPlaceholdersWithMediaComponents(this.get('media'), 4);
				this.handlePollDaddy();
				this.handleJumpLink();

				Em.run.later(this, (): void => this.replaceMediaPlaceholdersWithMediaComponents(this.get('media')), 0);
			} else {
				this.hackIntoEmberRendering(i18n.t('app.article-empty-label'));
			}

			this.injectAds();
			this.setupAdsContext(this.get('adsContext'));
		});
	}).on('init'),

	actions: {
		openLightbox: function (lightboxType: string, lightboxData: any): void {
			this.sendAction('openLightbox', lightboxType, lightboxData);
		},

		edit: function (title: string, sectionIndex: number): void {
			this.sendAction('edit', title, sectionIndex);
		},

		addPhoto: function (title: string, sectionIndex: number, photoData: any): void {
			this.sendAction('addPhoto', title, sectionIndex, photoData);
		}
	},

	/**
	 * This is due to the fact that we send whole article
	 * as an HTML and then we have to modify it in the DOM
	 *
	 * Ember+Glimmer are not fan of this as they would like to have
	 * full control over the DOM and rendering
	 *
	 * In perfect world articles would come as Handlebars templates
	 * so Ember+Glimmer could handle all the rendering
	 *
	 * @param {string} content HTML containing whole article
	 */
	hackIntoEmberRendering(content: string): void {
		this.$().html(content);
	},

	/**
	 * Native browser implementation of location hash often gets clobbered by custom rendering,
	 * so ensure it happens here.
	 */
	handleJumpLink(): void {
		if (window.location.hash) {
			window.location.assign(window.location.hash);
		}
	},

	createArticleContributionComponent: function(section: number): JQuery {
		var article = this.get('content'),
			title = this.get('cleanTitle'),
			component = this.createChildView(App.ArticleContributionComponent.create({
				section: section,
				title: title,
				edit: 'edit',
				addPhoto: 'addPhoto',
				uploadFeatureEnabled: this.get('uploadFeatureEnabled')
			}));
		return component.createElement().$();
	},

	/**
	 * @desc Generates table of contents data based on h2 elements in the article
	 * TODO: Temporary solution for generating Table of Contents
	 * Ideally, we wouldn't be doing this as a post-processing step, but rather we would just get a JSON with
	 * ToC data from server and render view based on that.
	 */
	loadTableOfContentsData: function (): void {
		var headers: ArticleSectionHeader[] = this.$('h2[section]').map(
			(i: number, elem: HTMLElement): ArticleSectionHeader => {
				if (elem.textContent) {
					return {
						element: elem,
						level: elem.tagName,
						name: elem.textContent,
						id: elem.id,
						section: elem.getAttribute('section')
					};
				}
			}).toArray();

		this.set('headers', headers);
		this.sendAction('updateHeaders', headers);
	},

	headerObserver: Em.observer('headers', function(): void {
		if (this.get('contributionFeatureEnabled')) {
			var headers = this.get('headers'),
			    $sectionHeader: JQuery = null,
			    $contributionComponent: JQuery = null;

			headers.forEach((header: ArticleSectionHeader): void => {
				$contributionComponent = this.createArticleContributionComponent(header.section);
				$sectionHeader = this.$(header.element);
				$sectionHeader.prepend($contributionComponent).addClass('short-header');
				$contributionComponent.wrap('<div class="icon-wrapper"></div>');
			});
		}
	}),

	createMediaComponent: function (element: HTMLElement, model: typeof App.ArticleModel): JQuery {
		var ref = parseInt(element.dataset.ref, 10),
			media = model.find(ref),
			isInfoboxHeroImage = $(element).closest('.pi-hero').length > 0;

		var component = this.createChildView(App.MediaComponent.newFromMedia(media, isInfoboxHeroImage), {
			ref: ref,
			width: parseInt(element.getAttribute('width'), 10),
			height: parseInt(element.getAttribute('height'), 10),
			imgWidth: element.offsetWidth,
			media: media
		}).createElement();

		return component.$().attr('data-ref', ref);
	},

	replaceMediaPlaceholdersWithMediaComponents: function (model: typeof App.ArticleModel, numberToProcess: number = -1): void {
		var $mediaPlaceholders = this.$('.article-media'),
			index: number;

		if (numberToProcess < 0 || numberToProcess > $mediaPlaceholders.length) {
			numberToProcess = $mediaPlaceholders.length;
		}

		for (index = 0; index < numberToProcess; index++) {
		    $mediaPlaceholders.eq(index).replaceWith(this.createMediaComponent($mediaPlaceholders[index], model));
		}
	},

	replaceMapsWithMapComponents: function (): void {
		this.$('.wikia-interactive-map-thumbnail').map((i: number, elem: HTMLElement): void => {
			this.replaceMapWithMapComponent(elem);
		});
	},

	replaceMapWithMapComponent: function (elem: HTMLElement): void {
		var $mapPlaceholder = $(elem),
			$a = $mapPlaceholder.children('a'),
			$img = $a.children('img'),
			mapComponent: typeof App.WikiaMapComponent = this.createChildView(App.WikiaMapComponent.create({
				url: $a.data('map-url'),
				imageSrc: $img.data('src'),
				id: $a.data('map-id'),
				title: $a.data('map-title'),
				click: 'openLightbox'
			}));

		mapComponent.createElement();
		$mapPlaceholder.replaceWith(mapComponent.$());
		//TODO: do it in the nice way
		mapComponent.trigger('didInsertElement');
	},

	replaceInfoboxesWithInfoboxComponents: function (): void {
		this.$('.portable-infobox').map((i: number, elem: HTMLElement): void => {
			this.replaceInfoboxWithInfoboxComponent(elem);
		});
	},

	replaceInfoboxWithInfoboxComponent: function (elem: HTMLElement): void {
		var $infoboxPlaceholder = $(elem),
			infoboxComponent: typeof App.PortableInfoboxComponent;

		infoboxComponent = this.createChildView(App.PortableInfoboxComponent.create({
			infoboxHTML: elem.innerHTML,
			height: $infoboxPlaceholder.outerHeight()
		}));

		infoboxComponent.createElement();
		$infoboxPlaceholder.replaceWith(infoboxComponent.$());
		//TODO: do it in the nice way
		infoboxComponent.trigger('didInsertElement');
	},

	/**
	 * @desc handles expanding long tables, code taken from WikiaMobile
	 */
	handleInfoboxes: function (): void {
		var shortClass = 'short',
			$infoboxes = this.$('table[class*="infobox"] tbody'),
			body: HTMLElement = window.document.body,
			scrollTo: Function = body.scrollIntoViewIfNeeded || body.scrollIntoView;

		if ($infoboxes.length) {
			$infoboxes
				.filter(function (): boolean {
					return this.rows.length > 6;
				})
				.addClass(shortClass)
				.append('<tr class=infobox-expand><td colspan=2><svg viewBox="0 0 12 7" class="icon"><use xlink:href="#chevron"></use></svg></td></tr>')
				.on('click', function (event: JQueryEventObject): void {
					var $target = $(event.target),
						$this = $(this);

					if (!$target.is('a') && $this.toggleClass(shortClass).hasClass(shortClass)) {
						scrollTo.apply($this.find('.infobox-expand')[0]);
					}
				});
		}
	},

	handleTables: function (): void {
		this.$('table:not([class*=infobox], .dirbox)')
			.not('table table')
			.css('visibility', 'visible')
			.wrap('<div class="article-table-wrapper"/>');
	}
});
