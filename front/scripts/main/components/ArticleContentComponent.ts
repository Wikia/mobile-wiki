/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../mixins/AdsMixin.ts" />
/// <reference path="../mixins/PollDaddyMixin.ts" />

'use strict';

/**
 * HTMLElement
 * @typedef {Object} HTMLElement
 * @property {Function} scrollIntoViewIfNeeded
 */

interface HTMLElement {
	scrollIntoViewIfNeeded: () => void
}

App.ArticleContentComponent = Em.Component.extend(
	App.AdsMixin,
	App.PollDaddyMixin,
	{
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
					this.replaceImageCollectionPlaceholdersWithComponents(this.get('media'));
					this.replaceWikiaWidgetsWithComponents();
					this.handleWikiaWidgetWrappers();
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

		headerObserver: Em.observer('headers', function(): void {
			if (this.get('contributionFeatureEnabled')) {
				var headers = this.get('headers'),
					$sectionHeader: JQuery = null,
					$contributionComponent: JQuery = null;

				headers.forEach((header: ArticleSectionHeader): void => {
					$contributionComponent = this.createArticleContributionComponent(header.section, header.id);
					$sectionHeader = this.$(header.element);
					$sectionHeader.prepend($contributionComponent).addClass('short-header');
					$contributionComponent.wrap('<div class="icon-wrapper"></div>');
				});
			}
		}),

		actions: {
			/**
			 * @param {string} lightboxType
			 * @param {*} lightboxData
			 * @returns {void}
			 */
			openLightbox(lightboxType: string, lightboxData: any): void {
				this.sendAction('openLightbox', lightboxType, lightboxData);
			},

			/**
			 * @param {string} title
			 * @param {number} sectionIndex
			 * @returns {void}
			 */
			edit(title: string, sectionIndex: number): void {
				this.sendAction('edit', title, sectionIndex);
			},

			/**
			 * @param {string} title
			 * @param {number} sectionIndex
			 * @param {*} photoData
			 * @returns {void}
			 */
			addPhoto(title: string, sectionIndex: number, photoData: any): void {
				this.sendAction('addPhoto', title, sectionIndex, photoData);
			},
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
		 * @param {string} content - HTML containing whole article
		 * @returns {void}
		 */
		hackIntoEmberRendering(content: string): void {
			this.$().html(content);
		},

		/**
		 * Native browser implementation of location hash often gets clobbered by custom rendering,
		 * so ensure it happens here.
		 *
		 * @returns {void}
		 */
		handleJumpLink(): void {
			if (window.location.hash) {
				window.location.assign(window.location.hash);
			}
		},

		/**
		* Instantiate ArticleContributionComponent by looking up the component from container in order to have dependency injection.
		* Read "DEPENDENCY MANAGEMENT IN EMBER.JS" section in http://guides.emberjs.com/v1.10.0/understanding-ember/dependency-injection-and-service-lookup/
		* "Lookup" function defined in https://github.com/emberjs/ember.js/blob/master/packages/container/lib/container.js
		*/
		/**
		* @param {number} section
		* @param {string} sectionId
		* @returns {JQuery}
		*/
		createArticleContributionComponent: function(section: number, sectionId: string): JQuery {
			var title = this.get('cleanTitle'),
			    edit = 'edit',
			    addPhoto = 'addPhoto',
			    addPhotoIconEnabled = this.get('addPhotoIconEnabled'),
			    editIconEnabled = this.get('editIconEnabled'),
			    isEditAllowed = this.get('isEditAllowed'),
			    contributionComponent = this.get('container').lookup('component:article-contribution', { singleton: false });

			contributionComponent.setProperties({
				section,
				sectionId,
				title,
				edit,
				addPhoto,
				addPhotoIconEnabled,
				editIconEnabled,
				isEditAllowed
			});
			return this.createChildView(contributionComponent).createElement().$();
		},

		/**
		 * Generates table of contents data based on h2 elements in the article
		 * TODO: Temporary solution for generating Table of Contents
		 * Ideally, we wouldn't be doing this as a post-processing step, but rather we would just get a JSON with
		 * ToC data from server and render view based on that.
		 *
		 * @returns {void}
		 */
		loadTableOfContentsData(): void {
			var headers = this.$('h2[section]').map((i: number, elem: HTMLElement): ArticleSectionHeader => {
					if (elem.textContent) {
						return {
							element: elem,
							level: elem.tagName,
							name: elem.textContent,
							id: elem.id,
							section: elem.getAttribute('section'),
						};
					}
				}).toArray();

			this.set('headers', headers);
			this.sendAction('updateHeaders', headers);
		},

		/**
		 * @param {HTMLElement} element
		 * @param {App.ArticleModel} model
		 * @returns {JQuery}
		 */
		createMediaComponent(element: HTMLElement, model: typeof App.ArticleModel): JQuery {
			var ref = parseInt(element.dataset.ref, 10),
				media = model.find(ref),
				component = this.createChildView(App.MediaComponent.newFromMedia(media), {
					ref: ref,
					width: parseInt(element.getAttribute('width'), 10),
					height: parseInt(element.getAttribute('height'), 10),
					imgWidth: element.offsetWidth,
					media: media,
				}).createElement();

			return component.$().attr('data-ref', ref);
		},

		/**
		 * @param {App.ArticleModel} model
		 * @param {number} [numberToProcess=-1]
		 * @returns {void}
		 */
		replaceMediaPlaceholdersWithMediaComponents(
			model: typeof App.ArticleModel,
			numberToProcess: number = -1
		): void {
			var $mediaPlaceholders = this.$('.article-media'),
				index: number;

			if (numberToProcess < 0 || numberToProcess > $mediaPlaceholders.length) {
				numberToProcess = $mediaPlaceholders.length;
			}

			for (index = 0; index < numberToProcess; index++) {
				$mediaPlaceholders.eq(index).replaceWith(this.createMediaComponent($mediaPlaceholders[index], model));
			}
		},

		replaceImageCollectionPlaceholdersWithComponents(model: typeof App.ArticleMedia): void {
			var $placeholders = this.$('.pi-image-collection'),
				articleMedia = model.get('media'),
				index: number,
				numberToProcess: number = $placeholders.length;

			for (index = 0; index < numberToProcess; index ++) {
				var $element = $placeholders.eq(index),
					collectionMedia: typeof App.ArticleMedia[] = [],
					refs = $element.data('refs')
						.split(',')
						.compact()
						.filter((ref: any): boolean => ref.length > 0);

				refs.forEach((ref: number): void => {
					var image = model.find(ref);
					image.ref = articleMedia.length;
					collectionMedia.push(image);
				});

				articleMedia.push(collectionMedia);

				var component = this.createChildView(App.InfoboxImageCollectionComponent, {
					media: collectionMedia
				}).createElement();

				$element.replaceWith(component.$());
			}

			model.set('media', articleMedia);
		},

		/**
		 * @returns {void}
		 */
		replaceMapsWithMapComponents(): void {
			this.$('.wikia-interactive-map-thumbnail').map((i: number, elem: HTMLElement): void => {
				this.replaceMapWithMapComponent(elem);
			});
		},

		/**
		 * @param {HTMLElement} elem
		 * @returns {void}
		 */
		replaceMapWithMapComponent(elem: HTMLElement): void {
			var $mapPlaceholder = $(elem),
				$a = $mapPlaceholder.children('a'),
				$img = $a.children('img'),
				mapComponent = this.createChildView(App.WikiaMapComponent.create({
					url: $a.data('map-url'),
					imageSrc: $img.data('src'),
					id: $a.data('map-id'),
					title: $a.data('map-title'),
					click: 'openLightbox',
				}));

			mapComponent.createElement();
			$mapPlaceholder.replaceWith(mapComponent.$());
			//TODO: do it in the nice way
			mapComponent.trigger('didInsertElement');
		},

		/**
		 * @returns {void}
		 */
		replaceInfoboxesWithInfoboxComponents(): void {
			this.$('.portable-infobox').map((i: number, elem: HTMLElement): void => {
				this.replaceInfoboxWithInfoboxComponent(elem);
			});
		},

		/**
		 * @param {HTMLElement} elem
		 * @returns {void}
		 */
		replaceInfoboxWithInfoboxComponent(elem: HTMLElement): void {
			var $infoboxPlaceholder = $(elem),
				infoboxComponent: typeof App.PortableInfoboxComponent;

			infoboxComponent = this.createChildView(App.PortableInfoboxComponent.create({
				infoboxHTML: elem.innerHTML,
				height: $infoboxPlaceholder.outerHeight(),
			}));

			infoboxComponent.createElement();
			$infoboxPlaceholder.replaceWith(infoboxComponent.$());
			//TODO: do it in the nice way
			infoboxComponent.trigger('didInsertElement');
		},

		/**
		 * @returns {void}
		 */
		replaceWikiaWidgetsWithComponents(): void {
			this.$('[data-wikia-widget]').map((i: number, elem: HTMLElement): void => {
				this.replaceWikiaWidgetWithComponent(elem);
			});
		},

		/**
		 * @param {HTMLElement} elem
		 * @returns {void}
		 */
		replaceWikiaWidgetWithComponent(elem: HTMLElement): void {
			var $widgetPlaceholder = $(elem),
				widgetData = $widgetPlaceholder.data(),
				widgetType = widgetData.wikiaWidget,
				componentName = this.getWidgetComponentName(widgetType),
				component: any;

			if (componentName) {
				component = this.createChildView(App[componentName].create({
					data: $widgetPlaceholder.data()
				}));
				component.createElement();
				$widgetPlaceholder.replaceWith(component.$());
				component.trigger('didInsertElement');
			}
		},

		/**
		 * @param {string} widgetType
		 * @returns {string}
		 */
		getWidgetComponentName(widgetType: string): string {
			var componentNames = {
					twitter: 'WidgetTwitterComponent',
					vk: 'WidgetVKComponent',
					polldaddy: 'WidgetPolldaddyComponent',
					flite: 'WidgetFliteComponent',
				};

			if (componentNames.hasOwnProperty(widgetType) && Em.typeOf(App[componentNames[widgetType]]) === 'class') {
				return componentNames[widgetType];
			} else {
				Em.Logger.warn(`Can't create widget with type '${widgetType}'`);
				return null;
			}
		},

		/**
		 * @returns {void}
		 */
		handleWikiaWidgetWrappers(): void {
			this.$('script[type="x-wikia-widget"]').each(function (): void {
				var $this = $(this);
				$this.replaceWith($this.html());
			});
		},

		/**
		 * handles expanding long tables, code taken from WikiaMobile
		 *
		 * @returns {void}
		 */
		handleInfoboxes(): void {
			var shortClass = 'short',
				$infoboxes = this.$('table[class*="infobox"] tbody'),
				body = window.document.body,
				scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView;

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

		/**
		 * @returns {void}
		 */
		handleTables(): void {
			this.$('table:not([class*=infobox], .dirbox)')
				.not('table table')
				.css('visibility', 'visible')
				.wrap('<div class="article-table-wrapper"/>');
		},
	}
);
