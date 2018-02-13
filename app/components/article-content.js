import {inject as service} from '@ember/service';
import {reads} from '@ember/object/computed';
import Component from '@ember/component';
import $ from 'jquery';
import {isBlank} from '@ember/utils';
import {observer} from '@ember/object';
import {on} from '@ember/object/evented';
import {run} from '@ember/runloop';
import AdsMixin from '../mixins/ads';
import {getRenderComponentFor, queryPlaceholders} from '../utils/render-component';
import getAttributesForMedia from '../utils/article-media';
import {track, trackActions} from '../utils/track';

/**
 * HTMLElement
 * @typedef {Object} HTMLElement
 * @property {Function} scrollIntoViewIfNeeded
 */

export default Component.extend(
	AdsMixin,
	{
		fastboot: service(),
		i18n: service(),
		logger: service(),

		tagName: 'article',
		classNames: ['article-content', 'mw-content'],
		adsContext: null,
		content: null,
		contributionEnabled: null,
		displayEmptyArticleInfo: true,
		displayTitle: null,
		isPreview: false,
		media: null,

		isFastBoot: reads('fastboot.isFastBoot'),

		/* eslint ember/no-on-calls-in-components:0 */
		articleContentObserver: on('didInsertElement', observer('content', function () {
			// Our hacks don't work in FastBoot, so we just inject raw HTML in the template
			if (this.get('isFastBoot')) {
				return;
			}

			this.destroyChildComponents();

			run.scheduleOnce('afterRender', this, () => {
				const rawContent = this.get('content');

				if (!isBlank(rawContent)) {
					// this.hackIntoEmberRendering(rawContent);

					// this.handleInfoboxes();
					// this.replaceInfoboxesWithInfoboxComponents();
                    //
					// this.renderDataComponents(this.element);

					this.loadIcons();
					//this.createContributionButtons();
					// this.handleTables();
					// this.replaceWikiaWidgetsWithComponents();

					//this.handleWikiaWidgetWrappers();
					this.handleJumpLink();
					// this.handleCollapsibleSections();
				} else if (this.get('displayEmptyArticleInfo')) {
					this.hackIntoEmberRendering(`<p>${this.get('i18n').t('article.empty-label')}</p>`);
				}

				if (!this.get('isPreview')) {
					this.setupAdsContext(this.get('adsContext'));
					this.get('ads.module').onReady(() => {
						this.injectAds();
					});
				}
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

			this.renderedComponents.length = 0;
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
		 * @param {Node} placeholder
		 * @param {number} section
		 * @param {string} sectionId
		 * @returns {JQuery}
		 */
		renderArticleContributionComponent(placeholder, section, sectionId) {
			this.renderedComponents.push(
				this.renderComponent({
					name: 'article-contribution',
					attrs: {
						section,
						sectionId,
						title: this.get('displayTitle'),
						edit: this.get('edit'),
						editIconVisible: this.get('editIconVisible'),
						editAllowed: this.get('editAllowed'),
					},
					element: placeholder
				})
			);
		},

		/**
		 * @returns {void}
		 */
		createContributionButtons() {
			if (this.get('contributionEnabled')) {
				const headers = Array.prototype.slice.call(
					this.element.querySelectorAll('h2[section]')
				).map((element) => {
					if (element.textContent) {
						return {
							element,
							level: element.tagName,
							name: element.textContent,
							id: element.id,
							section: element.getAttribute('section'),
						};
					}
				});

				headers.forEach((header) => {
					if (header) {
						const placeholder = document.createElement('div'),
							sectionHeaderLabel = header.element.querySelector('.section-header-label');

						if (sectionHeaderLabel) {
							sectionHeaderLabel.appendChild(placeholder);
							this.renderArticleContributionComponent(placeholder, header.section, header.id);
						}
					}
				});
			}
		},

		/**
		 * @returns {void}
		 */
		replaceInfoboxesWithInfoboxComponents() {
			/**
			 * @param {number} i
			 * @param {Element} element
			 * @returns {void}
			 */
			this.$('.portable-infobox').map((i, element) => {
				this.renderedComponents.push(
					this.renderComponent({
						name: 'portable-infobox',
						attrs: {
							infoboxHTML: element.innerHTML,
							height: $(element).outerHeight(),
							pageTitle: this.get('displayTitle'),
							smallHeroImage: this.get('featuredVideo') && this.get('heroImage'),
							openLightbox: this.get('openLightbox')
						},
						element
					})
				);
			});
		},

		renderDataComponents(element) {
			this.renderedComponents = this.renderedComponents.concat(
				queryPlaceholders(element)
					.map(getAttributesForMedia, {
						media: this.get('media'),
						openLightbox: this.get('openLightbox')
					})
					.map(this.renderComponent)
			);
		},

		/**
		 * @returns {void}
		 */
		replaceWikiaWidgetsWithComponents() {
			/**
			 * @param {number} i
			 * @param {Element} element
			 * @returns {void}
			 */
			this.$('[data-wikia-widget]').map((i, element) => {
				this.replaceWikiaWidgetWithComponent(element);
			});
		},

		/**
		 * @param {Element} element
		 * @returns {void}
		 */
		replaceWikiaWidgetWithComponent(element) {
			const widgetData = $(element).data(),
				widgetType = widgetData.wikiaWidget,
				componentName = this.getWidgetComponentName(widgetType);

			if (componentName) {
				this.renderedComponents.push(
					this.renderComponent({
						name: componentName,
						attrs: {
							data: widgetData
						},
						element
					})
				);
			}
		},

		/**
		 * @param {string} widgetType
		 * @returns {string|null}
		 */
		getWidgetComponentName(widgetType) {
			let componentName;

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
				case 'apester':
					componentName = 'widget-apester';
					break;
				case 'playbuzz':
					componentName = 'widget-playbuzz';
					break;
				default:
					this.get('logger').warn(`Can't create widget with type '${widgetType}'`);
					return null;
			}

			return componentName;
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

		handleCollapsibleSectionHeaderClick(event) {
			const header = event.currentTarget,
				section = header.nextElementSibling;
			let visible = 'false';

			if (header.classList.contains('open-section')) {
				header.classList.remove('open-section');
			} else {
				header.classList.add('open-section');
				visible = 'true';

				if (!header.hasAttribute('data-rendered')) {
					this.renderDataComponents(section);
					header.setAttribute('data-rendered', '');
				}
			}

			section.setAttribute('aria-pressed', visible);
			section.setAttribute('aria-expanded', visible);
		},

		handleCollapsibleSections() {
			Array.prototype.slice.call(this.element.querySelectorAll('h2[section]'))
				.forEach((header) => header.addEventListener('click', this.handleCollapsibleSectionHeaderClick.bind(this)));
		}
	}
);
