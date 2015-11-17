
import HeadroomMixin from '../mixins/headroom';
import App from '../app';

App.ShareHeaderComponent = Ember.Component.extend(
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

export default App.ShareHeaderComponent;
