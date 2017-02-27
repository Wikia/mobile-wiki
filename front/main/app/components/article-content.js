import Ember from 'ember';
import AdsMixin from '../mixins/ads';
import {getRenderComponentFor, queryPlaceholders} from '../utils/render-component';
import {getAttributesForMedia} from '../utils/article-media';
import {track, trackActions} from 'common/utils/track';
import {getGroup} from 'common/modules/abtest';
import FandomPostsModel from '../models/fandom-posts';
import TopLinksModel from '../models/top-links';

const {Component, Logger, $, get, isBlank, observer, on, run} = Ember;

/**
 * HTMLElement
 * @typedef {Object} HTMLElement
 * @property {Function} scrollIntoViewIfNeeded
 */

export default Component.extend(
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
		displayEmptyArticleInfo: true,

		articleContentObserver: on('init', observer('content', function () {
			const content = this.get('content');

			this.destroyChildComponents();

			run.scheduleOnce('afterRender', this, () => {
				// if (!isBlank(content)) {
				// 	this.hackIntoEmberRendering(content);
				//
				// 	this.handleInfoboxes();
				// 	this.replaceInfoboxesWithInfoboxComponents();
				//
				// 	this.renderedComponents = queryPlaceholders(this.$())
				// 		.map(getAttributesForMedia, {
				// 			media: this.get('media'),
				// 			openLightbox: this.get('openLightbox')
				// 		})
				// 		.map(this.renderComponent);
				//
				// 	this.loadIcons();
				// 	this.createTableOfContents();
				// 	this.createContributionButtons();
				// 	this.handleTables();
				// 	this.replaceWikiaWidgetsWithComponents();
				// 	this.handleWikiaWidgetWrappers();
				// 	this.handleJumpLink();
				// 	this.injectPlacementTest();
				// } else if (this.get('displayEmptyArticleInfo')) {
				// 	this.hackIntoEmberRendering(`<p>${i18n.t('article.empty-label')}</p>`);
				// }
				//
				// this.injectAds();
				// this.setupAdsContext(this.get('adsContext'));
			});
		})),

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
			const $anchor = $(event.target).closest('a'),
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
		 * @returns {void}
		 */
		createContributionButtons() {
			if (this.get('contributionEnabled')) {
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

				headers.forEach((header) => {
					this.$(header.element)
						.wrapInner('<div class="section-header-label"></div>')
						.append(this.createArticleContributionComponent(header.section, header.id));
				});
			}
		},

		/**
		 * @returns {void}
		 */
		createTableOfContents() {
			debugger;

			const component = this.createComponentInstance('article-table-of-contents'),
				$firstInfobox = this.$('.portable-infobox').first(),
				componentElement = this.createChildView(component).createElement();

			if ($firstInfobox.length) {
				componentElement.$().insertAfter($firstInfobox);
			} else {
				componentElement.$().prependTo(this.$());
			}

			componentElement.trigger('didInsertElement');
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
					Logger.warn(`Can't create widget with type '${widgetType}'`);
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
		 * Create component instance using container lookup.
		 * @param {String} componentName
		 * @returns {Ember.Component}
		 */
		createComponentInstance(componentName) {
			return this.get('container').lookup(`component:${componentName}`, {
				singleton: false
			});
		},

		/**
		 * TO BE THROWN AWAY AFTER RECIRCULATION_MERCURY_PLACEMENT AB TEST
		 *
		 * @returns {void}
		 */
		injectPlacementTest(group) {
			const experimentName = 'RECIRCULATION_MERCURY_PLACEMENT';
			let view, component, model, location,
				externalLink = false;

			group = group || getGroup(experimentName);

			if (get(Mercury, 'wiki.language.content') !== 'en') {
				return;
			}

			switch (group) {
				/**
				 * To be thrown away after E3
				 */
				case 'SDCC_INCONTENT':
					component = this.createComponentInstance('recirculation/incontent');
					model = FandomPostsModel.create({
						type: 'category',
						moreHref: 'http://fandom.wikia.com/articles/category/events/sdcc-2016'
					});
					location = this.$('h2:nth-of-type(2)').prev();
					externalLink = true;
					break;
				case 'LINKS_INCONTENT':
					component = this.createComponentInstance('recirculation/incontent');
					model = TopLinksModel.create({
						article: this
					});
					location = this.$('h2:nth-of-type(2)').prev();
					break;
				case 'LINKS_FOOTER':
					component = this.createComponentInstance('recirculation/footer');
					model = TopLinksModel.create({
						article: this,
						style: 'landscape'
					});
					location = $('.article-footer');
					break;
				case 'FANDOM_INCONTENT':
					component = this.createComponentInstance('recirculation/incontent');
					model = FandomPostsModel.create({
						thumbSize: 'medium'
					});
					location = this.$('h2:nth-of-type(2)').prev();
					externalLink = true;
					break;
				case 'FANDOM_FOOTER':
				case 'CONTROL':
					component = this.createComponentInstance('recirculation/footer');
					model = FandomPostsModel.create();
					location = $('.article-footer');
					externalLink = true;
					break;
				default:
					break;
			}

			if (component && model && location.length !== 0) {
				view = this.createChildView(component, {
					model,
					experimentName,
					externalLink
				});

				this.renderedComponents.push(view);

				return model.load()
					.then(() => {
						if (!view.isDestroyed && !view.isDestroying) {
							view.createElement();

							location.after(view.$());
							view.trigger('didInsertElement');
							view.trackImpression();
						}

						return view;
					});
			}
		},
	}
);
