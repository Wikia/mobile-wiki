/// <reference path="../app.ts" />
/// <reference path="../models/ArticleModel.ts" />
/// <reference path="../components/MediaComponent.ts" />
/// <reference path="../components/WikiaMapComponent.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />

'use strict';

interface HeadersFromDom {
	level: string;
	name: string;
	id?: string;
}

interface HTMLElement {
	scrollIntoViewIfNeeded: () => void
}

App.ArticleView = Em.View.extend(App.AdsMixin, App.ViewportMixin, App.LanguagesMixin, {
	classNames: ['article-wrapper'],

	editButtonsVisible: Em.computed('controller.model.isMainPage', function (): boolean {
		return !this.get('controller.model.isMainPage') && this.get('isJapaneseWikia');
	}),

	/**
	 * willInsertElement
	 * @description The article view is only inserted once, and then refreshed on new models. Use this hook to bind
	 * events for DOM manipulation
	 */
	willInsertElement: function (): void {
		this.scheduleArticleTransforms();
	},

	willDestroyElement: function (): void {
		this.destroy();
	},

	onModelChange: Em.observer('controller.model.article', function (): void {
		// This check is here because this observer will actually be called for views wherein the state is actually
		// not valid, IE, the view is in the process of preRender
		this.scheduleArticleTransforms();
	}),

	scheduleArticleTransforms: function (): void {
		Em.run.scheduleOnce('afterRender', this, this.articleContentObserver);
	},

	didInsertElement: function () {
		this.get('controller').send('articleRendered');
	},

	articleContentObserver: function (): boolean {

		alert('article render');

		if (this.get('_state') !== 'inDOM') {
		 	return false;
		}

		var model = this.get('controller.model'),
			article = model.get('article'),
			isCuratedMainPage = model.get('isCuratedMainPage');

		if (isCuratedMainPage) {
			this.injectMainPageAds();
			this.setupAdsContext(model.get('adsContext'));
			M.setTrackContext({
				a: model.title,
				n: model.ns
			});

			M.trackPageView(model.get('adsContext.targeting'));

		} else if (article && article.length > 0) {
			if (this.get('editButtonsVisible')) {
				this.setupEditButtons();
			}
			this.loadTableOfContentsData();
			this.handleInfoboxes();
			this.handlePortableInfoboxes();
			this.lazyLoadMedia(model.get('media'));
			this.handleTables();
			this.replaceMapsWithMapComponents();
			this.handlePollDaddy();
			this.injectAds();
			this.setupAdsContext(model.get('adsContext'));

			M.setTrackContext({
				a: model.title,
				n: model.ns
			});

			M.trackPageView(model.get('adsContext.targeting'));
		}

		return true;
	},

	createMediaComponent: function (element: HTMLElement, model: typeof App.ArticleModel) {
		var ref = parseInt(element.dataset.ref, 10),
			media = model.find(ref);

		var component = this.createChildView(App.MediaComponent.newFromMedia(media), {
			ref: ref,
			width: parseInt(element.getAttribute('width'), 10),
			height: parseInt(element.getAttribute('height'), 10),
			imgWidth: element.offsetWidth,
			media: media
		}).createElement();

		return component.$().attr('data-ref', ref);
	},

	lazyLoadMedia: function (model: typeof App.ArticleModel) {
		var lazyImages = this.$('.article-media');

		lazyImages.each((index: number, element: HTMLImageElement) => {
			this.$(element).replaceWith(this.createMediaComponent(element, model));
		});
	},

	modelObserver: Em.observer('controller.model', function (): void {
		var model = this.get('controller.model');

		if (model) {
			var title = model.get('cleanTitle');
			document.title = title + ' - ' + Mercury.wiki.siteName;
		}
	}),

	setupEditButtons: function (): void {
		// TODO: There should be a helper for generating this HTML
		var pencil = '<svg class="icon pencil" role="img"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#pencil"></use></svg>';
		this.$(':header[section]').each((i: Number, item: any): void => {
			var $sectionHeader = this.$(item),
				$pencil = this.$(pencil).appendTo($sectionHeader);
			$pencil.on('click', () => {
				this.get('controller').send('edit', this.get('controller.model.title'), $sectionHeader.attr('section'));
			});
		});
	},

	/**
	 * @desc Generates table of contents data based on h2 elements in the article
	 * TODO: Temporary solution for generating Table of Contents
	 * Ideally, we wouldn't be doing this as a post-processing step, but rather we would just get a JSON with
	 * ToC data from server and render view based on that.
	 */
	loadTableOfContentsData: function () {
		var headers: HeadersFromDom[] = this.$('h2[section]').map((i: number, elem: HTMLElement): HeadersFromDom => {
			if (elem.textContent) {
				return {
					level: elem.tagName,
					name: elem.textContent,
					id: elem.id
				};
			}
		}).toArray();
		this.get('controller').send('updateHeaders', headers);
	},

	replaceMapsWithMapComponents: function () {
		this.$('.wikia-interactive-map-thumbnail').map((i: number, elem: HTMLElement) => {
			this.replaceMapWithMapComponent(elem);
		});
	},

	replaceMapWithMapComponent: function (elem: HTMLElement) {
		var $mapPlaceholder = $(elem),
			$a = $mapPlaceholder.children('a'),
			$img = $a.children('img'),
			mapComponent = this.createChildView(App.WikiaMapComponent.create({
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

	/**
	 * @desc handles expanding long tables, code taken from WikiaMobile
	 */
	handleInfoboxes: function () {
		var shortClass = 'short',
			$infoboxes = $('table[class*="infobox"] tbody'),
			body = window.document.body,
			scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView;

		if ($infoboxes.length) {
			$infoboxes
				.filter(function () {
					return this.rows.length > 6;
				})
				.addClass(shortClass)
				.append('<tr class=infobox-expand><td colspan=2><svg viewBox="0 0 12 7" class="icon"><use xlink:href="#chevron"></use></svg></td></tr>')
				.on('click', function (event) {
					var $target = $(event.target),
						$this = $(this);

					if (!$target.is('a') && $this.toggleClass(shortClass).hasClass(shortClass)) {
						scrollTo.apply($this.find('.infobox-expand')[0]);
					}
				});
		}
	},

	/**
	 * @desc handles expanding portable infoboxes
	 * The minimumHeight took from 9/16 proportions of screen (width * 16 / 9 + 100px). We want to always
	 * show the image AND some other infobox informations to show that this is infobox, not only an ordinary image.
	 * @todo we should figure out if we can somehow merge this method and handleInfoboxes method
	 */
	handlePortableInfoboxes: function (): void {
		var collapsedClass = 'collapsed',
			expandButtonClass = 'portable-infobox-expand-button',
			deviceWidth = this.get('viewportDimensions.width'),
			minimumHeight = Math.floor(deviceWidth * 16 / 9) + 100,
			$infoboxes = this.$('.portable-infobox'),
			body = window.document.body,
			scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView,
			expandButton = `<div class="${expandButtonClass}"><svg viewBox="0 0 12 7" class="icon"><use xlink:href="#chevron"></use></svg></div>`

		if ($infoboxes.length) {
			$infoboxes
				.filter((index: number, element: JQuery) => $(element).outerHeight() > minimumHeight)
				.addClass(collapsedClass)
				.height(minimumHeight)
				.append(expandButton)
				.on('click', function (event: JQueryEventObject) {
					var $target = $(event.target),
						$this = $(this);

					if (!$target.is('a') && $this.toggleClass(collapsedClass).hasClass(collapsedClass)) {
						$this.height(minimumHeight);
						scrollTo.apply($this.find('.' + expandButtonClass)[0]);
					} else {
						$this.height('auto');
					}
				});
		}
	},

	handleTables: function (): void {
		var $tables = this.$('table:not([class*=infobox], .dirbox)').not('table table'),
			wrapper: HTMLDivElement;

		if ($tables.length) {
			wrapper = document.createElement('div');
			wrapper.className = 'article-table';

			$tables
				.wrap(wrapper)
				.css('visibility', 'visible');
		}
	},

	/**
	 * This is a hack to make PollDaddy work (HG-618)
	 * @see http://static.polldaddy.com/p/8791040.js
	 */
	handlePollDaddy: function (): void {
		var $polls = this.$('script[src*=polldaddy]');

		$polls.each((index: number, script: HTMLScriptElement): void => {
			// extract ID from script src
			var idRegEx: RegExp = /(\d+)\.js$/,
				matches: any = script.src.match(idRegEx),
				id: string,
				html: string,
				init: any;

			// something is wrong with poll daddy or UCG.
			if (!matches || !matches[1]) {
				Em.Logger.error('Polldaddy script src url not recognized', script.src);
				return;
			}

			id = matches[1];
			init = window['PDV_go' + id];

			if (typeof init !== 'function') {
				Em.Logger.error('Polldaddy code changed', script.src);
				return;
			}

			// avoid PollDaddy's document.write on subsequent article loads
			if (!this.$('#PDI_container' + id).length) {
				html = '<a name="pd_a_' + id + '" style="display: inline; padding: 0px; margin: 0px;"></a>' +
					'<div class="PDS_Poll" id="PDI_container' + id + '"></div>';
				$(script).after(html);
			}
			init();
		});
	},

	hammerOptions: {
		touchAction: 'auto',
		cssProps: {
			/**
			 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-touch-callout
			 * 'default' displays the callout
			 * 'none' disables the callout
			 * hammer.js sets it to 'none' by default so we have to override
			 */
			touchCallout: 'default'
		}
	},

	gestures: {
		swipeLeft: function (event: JQueryEventObject): void {
			// Track swipe events
			if ($(event.target).parents('.article-table').length) {

				M.track({
					action: M.trackActions.swipe,
					category: 'tables'
				});
			} else if ($(event.target).parents('.article-gallery').length) {
				M.track({
					action: M.trackActions.paginate,
					category: 'gallery',
					label: 'next'
				});
			}
		},

		swipeRight: function (event: JQueryEventObject): void {
			// Track swipe events
			if ($(event.target).parents('.article-gallery').length) {
				M.track({
					action: M.trackActions.paginate,
					category: 'gallery',
					label: 'previous'
				});
			}
		}
	}
});
