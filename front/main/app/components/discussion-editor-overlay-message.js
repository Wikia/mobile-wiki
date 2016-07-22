import DiscussionPostCardBaseComponent from './discussion-post-card-base';
import {track, trackActions} from '../utils/discussion-tracker';
import wrapMeHelper from '../helpers/wrap-me';

export default DiscussionPostCardBaseComponent.extend({
	classNames: ['editor-overlay-message'],

	guidelinesLink: wrapMeHelper.compute([
		i18n.t('main.guidelines-link-title', {ns: 'discussion'})
	], {
		tagName: 'a',
		className: 'guidelines-opener',
	}),

	click(event) {
		// user hits the link inside the message-text - the whole message comes from i18n
		if (event.target.classList.contains('guidelines-opener')) {
			track(trackActions.EditorCalloutGuidelinesLinkTapped);
			this.get('gotoGuidelines')();
		}
	},

	actions: {
		close() {
			this.get('close')();
			track(trackActions.EditorCalloutMessageClose);
		},
	}
});
