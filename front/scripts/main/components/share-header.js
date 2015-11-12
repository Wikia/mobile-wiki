import Ember from 'ember';
import HeadroomMixin from '../mixins/headroom';

const ShareHeaderComponent = Ember.Component.extend(
	HeadroomMixin,
	{
		classNames: ['share-header'],
		headroomOptions: {
			classes: {
				initial: 'pinned',
				pinned: 'pinned',
			},
		},
	}
);

export default ShareHeaderComponent;
