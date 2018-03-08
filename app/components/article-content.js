import {inject as service} from '@ember/service';
import {reads, and} from '@ember/object/computed';
import Component from '@ember/component';
import {isBlank} from '@ember/utils';
import {observer} from '@ember/object';
import {on} from '@ember/object/evented';
import {run} from '@ember/runloop';
import AdsMixin from '../mixins/ads';
import {getRenderComponentFor, queryPlaceholders} from '../utils/render-component';
import getAttributesForMedia from '../utils/article-media';
import {track, trackActions} from '../utils/track';
import toArray from '../utils/toArray';

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
		wikiVariables: service(),

		tagName: 'article',
		classNames: ['article-content', 'mw-content'],
		attributeBindings: ['lang', 'dir'],
		adsContext: null,
		content: null,
		contributionEnabled: null,
		displayEmptyArticleInfo: true,
		displayTitle: null,
		isPreview: false,
		media: null,

		lang: reads('wikiVariables.language.content'),
		dir: reads('wikiVariables.language.contentDir'),
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
					this.hackIntoEmberRendering(rawContent);

					this.handleInfoboxes();
					this.replaceInfoboxesWithInfoboxComponents();

					this.renderDataComponents(this.element);

					this.loadIcons();
					this.createContributionButtons();
					this.handleTables();
					this.replaceWikiaWidgetsWithComponents();

					this.handleWikiaWidgetWrappers();
					this.handleJumpLink();
					this.handleCollapsibleSections();
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
			this.handleCiteRefs(event);
			this.handleCiteNotes(event);

			const anchor = event.target.closest('a'),
				label = this.getTrackingEventLabel(anchor);

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
			this.element.innerHTML = content;
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
		 * @param {Element} element
		 * @returns {string}
		 */
		getTrackingEventLabel(element) {
			if (element) {
				// Mind the order -- 'figcaption' check has to be done before '.article-image',
				// as the 'figcaption' is contained in the 'figure' element which has the '.article-image' class.
				if (element.closest('.portable-infobox')) {
					return 'portable-infobox-link';
				} else if (element.closest('.context-link')) {
					return 'context-link';
				} else if (element.closest('blockquote')) {
					return 'blockquote-link';
				} else if (element.closest('figcaption')) {
					return 'caption-link';
				} else if (element.closest('.article-image')) {
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
			toArray(this.element.querySelectorAll('.article-media-icon[data-src]')).forEach((element) => {
				element.src = element.getAttribute('data-src');
			});
		},

		/**
		 * @param {Node} placeholder
		 * @param {number} section
		 * @param {string} sectionId
		 * @returns {void}
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
				const headers = toArray(
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
			toArray(this.element.querySelectorAll('.portable-infobox')).map((element) => {
				this.renderedComponents.push(
					this.renderComponent({
						name: 'portable-infobox',
						attrs: {
							infoboxHTML: element.innerHTML,
							height: element.offsetHeight,
							pageTitle: this.get('displayTitle'),
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
			toArray(this.element.querySelectorAll('[data-wikia-widget]')).map((element) => {
				this.replaceWikiaWidgetWithComponent(element);
			});
		},

		/**
		 * @param {Element} element
		 * @returns {void}
		 */
		replaceWikiaWidgetWithComponent(element) {
			const widgetData = element.dataset,
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
			toArray(this.element.querySelectorAll('script[type="x-wikia-widget"]')).forEach((element) => {
				element.outerHTML = element.innerHTML;
			});
		},

		/**
		 * handles expanding long tables, code taken from WikiaMobile
		 *
		 * @returns {void}
		 */
		handleInfoboxes() {
			const shortClass = 'short',
				infoboxes = this.element.querySelectorAll('table[class*="infobox"] tbody'),
				body = window.document.body,
				scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView;

			if (infoboxes.length) {
				toArray(infoboxes)
					.filter((element) => element.rows.length > 6)
					.forEach((element) => {
						element.classList.add(shortClass);
						element.insertAdjacentHTML('beforeend',
							`<tr class=infobox-expand><td colspan=2><svg viewBox="0 0 12 7" class="icon">` +
							`<use xlink:href="#chevron"></use></svg></td></tr>`);

						element.addEventListener('click', (event) => {
							const target = event.target;

							if (!target.matches('a') && element.classList.toggle(shortClass)) {
								scrollTo.apply(element.querySelector('.infobox-expand'));
							}
						});
					});
			}
		},

		/**
		 * Opens a parent section of passed element if it's closed
		 *
		 * @returns {void}
		 */
		openSection(element) {
			if (element) {
				const section = element.closest('section[id*="section"]');
				if (section) {
					const header = section.previousElementSibling;
					if (header) {
						header.classList.add('open-section');
					}
				}
			}
		},

		/**
		 * Handles opening sections when click event occurs on CiteNote
		 *
		 * @returns {void}
		 */
		handleCiteNotes({target}) {
			if (target.nodeName === 'A') {
				if (target.hash.search('#cite_ref-') === 0) {
					const citeNote = this.element.querySelector(target.hash);
					this.openSection(citeNote);
				}
			}
		},

		/**
		 * Handles opening sections when click event occurs on CiteRef
		 *
		 * @returns {void}
		 */
		handleCiteRefs({target}) {
			if (target.nodeName === 'A') {
				if (target.hash.search('#cite_note-') === 0) {
					const referenceListItem = this.element.querySelector(target.hash);
					this.openSection(referenceListItem);
				}
			}
		},

		/**
		 * @returns {void}
		 */
		handleTables() {
			const tables = this.element.querySelectorAll('table');

			toArray(tables)
				.filter((table) => !table.matches('table table, [class*=infobox], .dirbox, .pi-horizontal-group'))
				.forEach((element) => {
					const originalHTML = element.innerHTML;

					element.innerHTML = `<div class="article-table-wrapper${element.getAttribute('data-portable') ?
						' portable-table-wrappper' : ''}"/>${originalHTML}</div>`;
				});
		},

		handleCollapsibleSectionHeaderClick(event) {
			const header = event.currentTarget,
				section = header.nextElementSibling;
			let visible = 'false';


			if (header.classList.toggle('open-section')) {
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
			toArray(this.element.querySelectorAll('h2[section]'))
				.forEach((header) => header.addEventListener('click', this.handleCollapsibleSectionHeaderClick.bind(this)));
		}
	}
);
