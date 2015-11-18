import App from '../app';
import Thumbnailer from '../../mercury/modules/Thumbnailer';

App.CommunityBadgeComponent = Ember.Component.extend({
	classNames: ['community-badge'],
	squareDimension: 125,

	badgeImages: {
		24357: '/front/images/community-badge-adventure-time.png',
		8390: '/front/images/community-badge-cocktails.png',
		3035: '/front/images/community-badge-fallout.png',
		119235: '/front/images/community-badge-hawaii-five-o.png',
		35171: '/front/images/community-badge-hunger-games.png',
		203914: '/front/images/community-badge-one-direction.png',
		147: '/front/images/community-badge-star-wars.png',
		750: '/front/images/community-badge-star-wars.png',
		916: '/front/images/community-badge-star-wars.png',
		1473: '/front/images/community-badge-star-wars.png',
		1530: '/front/images/community-badge-star-wars.png',
		1707: '/front/images/community-badge-star-wars.png',
		3786: '/front/images/community-badge-star-wars.png',
		5931: '/front/images/community-badge-star-wars.png',
		280741: '/front/images/community-badge-star-wars.png',
		13346: '/front/images/community-badge-walking-dead.png'
	},

	wikiImageUrl: Ember.computed('squareDimension', function () {
		const imageUrl = this.get('badgeImages')[Ember.get(Mercury, 'wiki.id')];

		if (Ember.isEmpty(imageUrl)) {
			return '';
		}

		return Thumbnailer.getThumbURL(
			imageUrl,
			{
				mode: Thumbnailer.mode.topCrop,
				width: this.get('squareDimension'),
				height: this.get('squareDimension'),
			}
		);
	}),

	wikiName: Ember.getWithDefault(Mercury, 'wiki.siteName', 'Wikia'),
});

export default App.CommunityBadgeComponent;
