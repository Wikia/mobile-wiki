
import HeadroomMixin from '../mixins/headroom';
import App from '../app';

export default App.ShareHeaderComponent = Ember.Component.extend(
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
