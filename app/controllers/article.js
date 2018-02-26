import {alias, and, equal, not} from '@ember/object/computed';
import Controller, {inject as controller} from '@ember/controller';
import WikiPageControllerMixin from '../mixins/wiki-page-controller';
import {track, trackActions} from '../utils/track';

export default Controller.extend(WikiPageControllerMixin, {
	application: controller(),
	wikiPage: controller(),

	commentsPage: alias('application.commentsPage'),
	loadExternals: not('application.noExternals'),
	isContLangEn: equal('wikiVariables.language.content', 'en'),
	applicationWrapperVisible: not('application.fullPage'),
	displayRecirculation: and('isContLangEn', 'loadExternals', 'applicationWrapperVisible'),

	actions: {
		/**
		 * @param {string} title
		 * @param {number} sectionIndex
		 * @returns {void}
		 */
		edit(title, sectionIndex) {
			this.transitionToRoute('article-edit', title, sectionIndex);

			track({
				action: trackActions.click,
				category: 'sectioneditor',
				label: 'edit',
				value: sectionIndex
			});
		},

		trackClick(category, label) {
			track({
				action: trackActions.click,
				category,
				label
			});
		}
	}
});
