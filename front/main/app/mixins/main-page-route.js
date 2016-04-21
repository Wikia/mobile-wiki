import Ember from 'ember';
import {normalizeToWhitespace} from 'common/utils/string';
import {setTrackContext, trackPageView} from 'common/utils/track';

export default Ember.Mixin.create({
	curatedMainPageData: Ember.inject.service(),
	ns: Ember.computed.oneWay('curatedMainPageData.ns'),
	adsContext: Ember.computed.oneWay('curatedMainPageData.adsContext'),
	mainPageDescription: Ember.computed.oneWay('curatedMainPageData.description'),

	/**
	 * @returns {void}
	 */
	activate() {
		this.controllerFor('application').set('enableShareHeader', true);
	},

	/**
	 * @returns {void}
	 */
	deactivate() {
		this.controllerFor('application').set('enableShareHeader', false);
	},

	/**
	 * @param {*} model
	 * @param {Ember.Transition} transition
	 * @returns {void}
	 */
	afterModel(model, transition) {
		this._super(...arguments);

		const title = model.get('title'),
			mainPageController = this.controllerFor('mainPage');

		let sectionOrCategoryName;

		// WOW!
		// Ember's RouteRecognizer does decodeURI while processing path.
		// We need to do it manually for titles passed using transitionTo, see the MainPageRoute.
		try {
			sectionOrCategoryName = decodeURIComponent(decodeURI(title));
		} catch (error) {
			sectionOrCategoryName = decodeURIComponent(title);
		}

		sectionOrCategoryName = normalizeToWhitespace(sectionOrCategoryName);

		mainPageController.setProperties({
			isRoot: false,
			title: sectionOrCategoryName,
			adsContext: this.get('adsContext'),
			ns: this.get('ns')
		});

		transition.then(() => {
			this.updateTrackingData(model);
		});
	},

	updateTrackingData(model) {
		const uaDimensions = {},
			adsContext = this.get('adsContext'),
			ns = this.get('ns');


		if (adsContext) {
			uaDimensions[3] = Ember.get(adsContext, 'targeting.wikiVertical');
			uaDimensions[14] = Ember.get(adsContext, 'opts.showAds') ? 'yes' : 'no';
		}

		uaDimensions[25] = ns;

		setTrackContext({
			a: model.get('title'),
			n: ns
		});

		trackPageView(uaDimensions);
	},

	/**
	 * @param {*} controller
	 * @param {CuratedContentModel} model
	 * @returns {void}
	 */
	renderTemplate(controller, model) {
		this.render('main-page', {
			controller: 'mainPage',
			model: {
				curatedContent: model
			}
		});
	},

	actions: {
		/**
		 * @param {CuratedContentItem} item
		 * @returns {void}
		 */
		openCuratedContentItem(item) {
			if (item.type === 'section') {
				this.transitionTo('mainPageSection', item.label);
			} else if (item.type === 'category') {
				this.transitionTo('mainPageCategory', item.categoryName);
			} else {
				Ember.Logger.error('Can\'t open curated content item with type other than section or category', item);
			}
		}
	}
});
