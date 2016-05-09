import Ember from 'ember';
import InfoboxImageCollectionComponent from './infobox-image-collection';
import AdsMixin from '../mixins/ads';
import {getRenderComponentFor, queryPlaceholders} from '../utils/render-component';
import {track, trackActions} from 'common/utils/track';
import {getGroup} from 'common/modules/abtest';

/**
 * HTMLElement
 * @typedef {Object} HTMLElement
 * @property {Function} scrollIntoViewIfNeeded
 */

export default Ember.Component.extend(
	AdsMixin,
	{
		tagName: 'article',
		classNames: ['article-content', 'mw-content'],

		adsContext: null,
		content: null,
		media: null,
		contributionEnabled: null,
		uploadFeatureEnabled: null,
		displayTitle: null,
		headers: null,

		newFromMedia(media) {
			if (media.context === 'infobox' || media.context === 'infobox-hero-image') {
				return this.createComponentInstance('infobox-image-media');
			} else if (Ember.isArray(media)) {
				if (media.some((media) => Boolean(media.link))) {
					return this.createComponentInstance('linked-gallery-media');
				} else {
					return this.createComponentInstance('gallery-media');
				}
			} else if (media.type === 'video') {
				return this.createComponentInstance('video-media');
			} else {
				return this.createComponentInstance('image-media');
			}
		},

		articleContentObserver: Ember.on('init', Ember.observer('content', function () {
			const content = this.get('content');

			this.destroyChildComponents();

			Ember.run.scheduleOnce('afterRender', this, () => {
				if (content) {
					this.hackIntoEmberRendering(content);

					this.handleInfoboxes();
					this.replaceInfoboxesWithInfoboxComponents();

					this.renderedComponents = queryPlaceholders(this.$())
						.map(this.getAttributesForMedia, this)
						.map(this.renderComponent);

					this.loadIcons();
					this.loadTableOfContentsData();
					this.handleTables();
					// TODO: to be removed as a part of https://wikia-inc.atlassian.net/browse/DAT-4186
					this.handleNavigation();
					this.replaceMediaPlaceholdersWithMediaComponents(this.get('media'), 4);
					this.replaceImageCollectionPlaceholdersWithComponents(this.get('media'));
					this.replaceWikiaWidgetsWithComponents();
					this.handleWikiaWidgetWrappers();
					this.handleJumpLink();

					Ember.run.later(this, () => this.replaceMediaPlaceholdersWithMediaComponents(this.get('media')), 0);
				} else {
					this.hackIntoEmberRendering(i18n.t('app.article-empty-label'));
				}

				this.injectAds();
				this.setupAdsContext(this.get('adsContext'));
			});
		})),

		headerObserver: Ember.observer('headers', function () {
			if (this.get('contributionEnabled')) {
				const headers = this.get('headers');
				let $sectionHeader = null,
					$contributionComponent = null;

				headers.forEach((header) => {
					$contributionComponent = this.createArticleContributionComponent(header.section, header.id);
					$sectionHeader = this.$(header.element);
					$sectionHeader.prepend($contributionComponent).addClass('short-header');
					$contributionComponent.wrap('<div class="icon-wrapper"></div>');
				});
			}
		}),

		init() {
			this._super(...arguments);

			this.renderComponent = getRenderComponentFor(this);
			this.renderedComponents = [];
		},

		willDestroyElement() {
			this._super(...arguments);

			this.destroyChildComponents();
		},

		click(event) {
			const $anchor = Ember.$(event.target).closest('a'),
				label = this.getTrackingEventLabel($anchor);

			if (label) {
				track({
					action: trackActions.click,
					category: 'article',
					label
				});
			}
		},

		actions: {
			/**
			 * @param {string} lightboxType
			 * @param {*} lightboxData
			 * @returns {void}
			 */
			openLightbox(lightboxType, lightboxData) {
				this.get('openLightbox')(lightboxType, lightboxData);
			},

			/**
			 * @param {string} title
			 * @param {number} sectionIndex
			 * @returns {void}
			 */
			edit(title, sectionIndex) {
				this.sendAction('edit', title, sectionIndex);
			},

			/**
			 * @param {string} title
			 * @param {number} sectionIndex
			 * @param {*} photoData
			 * @returns {void}
			 */
			addPhoto(title, sectionIndex, photoData) {
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
		hackIntoEmberRendering(content) {
			this.$().html(content);
		},

		/**
		 * Native browser implementation of location hash often gets clobbered by custom rendering,
		 * so ensure it happens here.
		 *
		 * @returns {void}
		 */
		handleJumpLink() {
			if (window.location.hash) {
				window.location.assign(window.location.hash);
			}
		},

		/**
		 * @param {jQuery[]} $element — array of jQuery objects of which context is to be checked
		 * @returns {string}
		 */
		getTrackingEventLabel($element) {
			if ($element && $element.length) {

				// Mind the order -- 'figcaption' check has to be done before '.article-image',
				// as the 'figcaption' is contained in the 'figure' element which has the '.article-image' class.
				if ($element.closest('.portable-infobox').length) {
					return 'portable-infobox-link';
				} else if ($element.closest('.context-link').length) {
					return 'context-link';
				} else if ($element.closest('blockquote').length) {
					return 'blockquote-link';
				} else if ($element.closest('figcaption').length) {
					return 'caption-link';
				} else if ($element.closest('.article-image').length) {
					return 'image-link';
				}

				return 'regular-link';
			}

			return '';
		},

		/**
		 * @param {{context: string, type: string}} attrs
		 * @returns {Object}
		 */
		handleAttrsContext(attrs) {
			/**
			 * Ember has its own context attribute, that is why we have to use different attribute name
			 */
			if (attrs.context) {
				/**
				 * We don't want to show titles below videos in infoboxes.
				 * This check is just a hack.
				 * Perfectly this should be handled somewhere inside infobox-related logic.
				 * For now this solution is enough
				 * - it works the same way as on wikis without SEO friendly images.
				 * It works on wikis without SEO friendly images because there was a bug
				 * - video was treated as an image and we don't show titles below images.
				 */
				if (attrs.context === 'infobox' && attrs.type === 'video') {
					attrs.showTitle = false;
				}

				attrs.mediaContext = attrs.context;
				delete attrs.context;
			}

			return attrs;
		},

		/**
		 * @param {string} name
		 * @param {Object} attrs
		 * @param {Object} element
		 * @returns {{name: string, attrs: Object, element: Object}}
		 */
		getAttributesForMedia({name, attrs, element}) {
			const media = this.get('media.media');

			if (attrs.ref >= 0 && media && media[attrs.ref]) {
				if (name === 'article-media-thumbnail' || name === 'portable-infobox-hero-image') {
					attrs = this.handleAttrsContext(
						Ember.$.extend(attrs, media[attrs.ref])
					);
				} else if (name === 'article-media-gallery' || name === 'article-media-linked-gallery') {
					attrs = Ember.$.extend(attrs, {
						items: media[attrs.ref]
					});
				}
			} else if (name === 'article-media-map-thumbnail') {
				attrs = Ember.$.extend(attrs, {
					openLightbox: this.get('openLightbox')
				});
			} else if (name === 'portable-infobox-image-collection' && attrs.refs && media) {
				const getMediaItemsForCollection = (ref) => Ember.$.extend({
						// We will push new item to media so use its length as index of new gallery element
						ref: media.length
					}, media[ref]),
					collectionItems = attrs.refs.map(getMediaItemsForCollection);

				// Add new gallery to media object
				// @todo - XW-1362 - it's an ugly hack, we should return proper data from API
				media.push(collectionItems);

				attrs = Ember.$.extend(attrs, {
					items: collectionItems
				});
			}

			return {name, attrs, element};
		},

		/**
		 * @returns {void}
		 */
		destroyChildComponents() {
			this.renderedComponents.forEach((renderedComponent) => {
				renderedComponent.destroy();
			});
		},

		/**
		 * Creating components for small icons isn't good solution because of performance overhead
		 * Putting all icons in HTML isn't good solution neither because there are articles with a lot of them
		 * Thus we load them all after the article is rendered
		 *
		 * @returns {void}
		 */
		loadIcons() {
			this.$('.article-media-icon[data-src]').each(function () {
				this.src = this.getAttribute('data-src');
			});
		},

		/**
		 * Instantiate ArticleContributionComponent by looking up the component from container
		 * in order to have dependency injection.
		 *
		 * Read "DEPENDENCY MANAGEMENT IN EMBER.JS" section in
		 * http://guides.emberjs.com/v1.10.0/understanding-ember/dependency-injection-and-service-lookup/
		 *
		 * "Lookup" function defined in
		 * https://github.com/emberjs/ember.js/blob/master/packages/container/lib/container.js
		 *
		 * @param {number} section
		 * @param {string} sectionId
		 * @returns {JQuery}
		 */
		createArticleContributionComponent(section, sectionId) {
			const title = this.get('displayTitle'),
				edit = 'edit',
				addPhoto = 'addPhoto',
				addPhotoIconVisible = this.get('addPhotoIconVisible'),
				editIconVisible = this.get('editIconVisible'),
				editAllowed = this.get('editAllowed'),
				addPhotoAllowed = this.get('addPhotoAllowed'),
				contributionComponent = this.createComponentInstance('article-contribution');

			contributionComponent.setProperties({
				section,
				sectionId,
				title,
				edit,
				addPhoto,
				addPhotoIconVisible,
				editIconVisible,
				editAllowed,
				addPhotoAllowed
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
		loadTableOfContentsData() {
			/**
			 * @param {number} i
			 * @param {HTMLElement} elem
			 * @returns {ArticleSectionHeader}
			 */
			const headers = this.$('h2[section]').map((i, elem) => {
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
		 * @param {ArticleModel} model
		 * @returns {JQuery}
		 */
		createMediaComponent(element, model) {
			const ref = parseInt(element.dataset.ref, 10),
				media = model.find(ref),
				component = this.newFromMedia(media);

			let componentElement;

			component.setProperties({
				ref,
				width: parseInt(element.getAttribute('width'), 10),
				height: parseInt(element.getAttribute('height'), 10),
				imgWidth: element.offsetWidth,
				media
			});

			componentElement = this.createChildView(component).createElement();

			return componentElement.$().attr('data-ref', ref);
		},

		/**
		 * @param {ArticleModel} model
		 * @param {number} [numberToProcess=-1]
		 * @returns {void}
		 */
		replaceMediaPlaceholdersWithMediaComponents(model, numberToProcess = -1) {
			const $mediaPlaceholders = this.$('.article-media:not([data-component])');

			if (numberToProcess < 0 || numberToProcess > $mediaPlaceholders.length) {
				numberToProcess = $mediaPlaceholders.length;
			}

			for (let index = 0; index < numberToProcess; index++) {
				$mediaPlaceholders.eq(index).replaceWith(this.createMediaComponent($mediaPlaceholders[index], model));
			}
		},

		/**
		 * @param {ArticleMedia} model
		 * @returns {void}
		 */
		replaceImageCollectionPlaceholdersWithComponents(model) {
			const $placeholders = this.$('.pi-image-collection:not([data-component])'),
				articleMedia = model.get('media'),
				numberToProcess = $placeholders.length,
				getCollectionMediaFromRefs = (ref) => {
					const image = model.find(ref);

					image.ref = articleMedia.length;
					return image;
				};

			for (let index = 0; index < numberToProcess; index++) {
				const $element = $placeholders.eq(index),
					refs = $element.data('refs')
						.split(',')
						.compact()
						.filter((ref) => ref.length > 0),
					collectionMedia = refs.map(getCollectionMediaFromRefs),
					component = this.createChildView(InfoboxImageCollectionComponent, {
						media: collectionMedia
					}).createElement();

				$element.replaceWith(component.$());

				articleMedia.push(collectionMedia);
			}

			model.set('media', articleMedia);
		},

		/**
		 * @returns {void}
		 */
		replaceInfoboxesWithInfoboxComponents() {
			/**
			 * @param {number} i
			 * @param {Element} elem
			 * @returns {void}
			 */
			this.$('.portable-infobox').map((i, elem) => {
				this.replaceInfoboxWithInfoboxComponent(elem);
			});
		},

		/**
		 * @param {Element} elem
		 * @returns {void}
		 */
		replaceInfoboxWithInfoboxComponent(elem) {
			const infoboxComponent = this.createComponentInstance('portable-infobox'),
				$infoboxPlaceholder = $(elem);

			let infoboxComponentElement;

			infoboxComponent.setProperties({
				infoboxHTML: elem.innerHTML,
				height: $infoboxPlaceholder.outerHeight(),
				pageTitle: this.get('displayTitle'),
			});

			infoboxComponentElement = this.createChildView(infoboxComponent).createElement();

			$infoboxPlaceholder.replaceWith(infoboxComponentElement.$());
			infoboxComponentElement.trigger('didInsertElement');
		},

		/**
		 * @returns {void}
		 */
		replaceWikiaWidgetsWithComponents() {
			/**
			 * @param {number} i
			 * @param {Element} elem
			 * @returns {void}
			 */
			this.$('[data-wikia-widget]').map((i, elem) => {
				this.replaceWikiaWidgetWithComponent(elem);
			});
		},

		/**
		 * @param {Element} elem
		 * @returns {void}
		 */
		replaceWikiaWidgetWithComponent(elem) {
			const $widgetPlaceholder = $(elem),
				widgetData = $widgetPlaceholder.data(),
				widgetType = widgetData.wikiaWidget,
				widgetComponent = this.createWidgetComponent(widgetType, $widgetPlaceholder.data());

			let widgetComponentElement;

			if (widgetComponent) {
				widgetComponentElement = this.createChildView(widgetComponent).createElement();
				$widgetPlaceholder.replaceWith(widgetComponentElement.$());
				widgetComponentElement.trigger('didInsertElement');
			}
		},

		/**
		 * @param {string} widgetType
		 * @param {*} data
		 * @returns {string|null}
		 */
		createWidgetComponent(widgetType, data) {
			let component, componentName;

			switch (widgetType) {
				case 'twitter':
					componentName = 'widget-twitter';
					break;
				case 'vk':
					componentName = 'widget-vk';
					break;
				case 'polldaddy':
					componentName = 'widget-polldaddy';
					break;
				case 'flite':
					componentName = 'widget-flite';
					break;
				default:
					Ember.Logger.warn(`Can't create widget with type '${widgetType}'`);
					return null;
			}

			component = this.createComponentInstance(componentName);
			component.set('data', data);
			return component;
		},

		/**
		 * @returns {void}
		 */
		handleWikiaWidgetWrappers() {
			this.$('script[type="x-wikia-widget"]').each(function () {
				const $this = $(this);

				$this.replaceWith($this.html());
			});
		},

		/**
		 * handles expanding long tables, code taken from WikiaMobile
		 *
		 * @returns {void}
		 */
		handleInfoboxes() {
			const shortClass = 'short',
				$infoboxes = this.$('table[class*="infobox"] tbody'),
				body = window.document.body,
				scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView;

			if ($infoboxes.length) {
				$infoboxes
					.filter(function () {
						return this.rows.length > 6;
					})
					.addClass(shortClass)
					.append(
						`<tr class=infobox-expand><td colspan=2><svg viewBox="0 0 12 7" class="icon">` +
						`<use xlink:href="#chevron"></use></svg></td></tr>`
					)
					.on('click', function (event) {
						const $target = $(event.target),
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
		handleTables() {
			this.$('table:not([class*=infobox], .dirbox, .pi-horizontal-group)')
				.not('table table')
				.each((index, element) => {
					const $element = this.$(element),
						wrapper = `<div class="article-table-wrapper${element.getAttribute('data-portable') ?
							' portable-table-wrappper' : ''}"/>`;

					$element.wrap(wrapper);
				});
		},

		/**
		 * TODO: to be removed as a part of https://wikia-inc.atlassian.net/browse/DAT-4186
		 * by default all nav elements are now hidden in css by display:none;
		 * according to current test group we want to un-hide some of the elements:
		 *  - only navigation elements
		 *  - only navboxes
		 *  - both of them
		 *
		 * @returns {void}
		 */
		handleNavigation() {
			let navABTestGroup = getGroup('MERCURY_NAVIGATION_ELEMENTS'),
				dataTypeSelector;

			// display only navboxes
			if (navABTestGroup === 'NAVIGATION_HIDDEN') {
				dataTypeSelector = '[data-type=navbox]';
			// display only navigation
			} else if (navABTestGroup === 'NAVBOXES_HIDDEN') {
				dataTypeSelector = '[data-type=navigation]';
			// display all of them
			} else if (navABTestGroup === 'BOTH_SHOWN') {
				dataTypeSelector = '[data-type^=nav]';
			}

			if (dataTypeSelector) {
				this.$(dataTypeSelector).each((index, element) => {
					this.$(element).style.display = 'block';
				});
			}
		},

		/**
		 * Create component instance using container lookup.
		 * @param {String} componentName
		 * @returns {Ember.Component}
		 */
		createComponentInstance(componentName) {
			return this.get('container').lookup(`component:${componentName}`, {
				singleton: false
			});
		}
	}
);
