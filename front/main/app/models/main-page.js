import Ember from 'ember';
import ArticleModel from './article';
import CuratedContentModel from './curated-content';

const MainPageModel = ArticleModel.extend({
	curatedContent: null
});

MainPageModel.reopenClass({
	/**
	 * @returns {Ember.RSVP.Promise}
	 */
	find() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const modelPromise = ArticleModel.find({
				basePath: Ember.get(Mercury, 'wiki.basePath'),
				title: Ember.get(Mercury, 'wiki.mainPageTitle'),
				wiki: Ember.get(Mercury, 'wiki.dbName')
			});

			modelPromise
				.then((model) => {
					if (model.isCuratedMainPage && model.mainPageData.curatedContent) {
						model.curatedContent = CuratedContentModel.create({
							type: 'section',
							items: CuratedContentModel.sanitizeItems(model.mainPageData.curatedContent)
						});
					}
					resolve(model);
				})
				.catch(reject);
		});
	}
});

export default MainPageModel;
