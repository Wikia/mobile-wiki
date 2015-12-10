import App from '../app';
import Thumbnailer from '../../mercury/modules/Thumbnailer';

export default App.CommunityBadgeComponent = Ember.Component.extend({
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
		13346: '/front/images/community-badge-walking-dead.png',
		558247: '/front/images/community-badge-clash-clans.jpg',
		2714: '/front/images/community-badge-smash-bros.jpg',
		3124: '/front/images/community-badge-ben-10.jpg',
		4541: '/front/images/community-badge-gta.jpg',
		1706: '/front/images/community-badge-elder-scrolls.jpg',
		74: '/front/images/community-badge-pokemon.jpg',
		544934: '/front/images/community-badge-warframe.jpg',
		841905: '/front/images/community-badge-brave-frontier.jpg',
		1081: '/front/images/community-badge-one-piece.jpg',
		410: '/front/images/community-badge-yu-gi-oh.jpg',
		949: '/front/images/community-badge-mortal-kombat.jpg',
		255885: '/front/images/community-badge-terraria.jpg',
		509: '/front/images/community-badge-harry-potter.jpg',
		2188: '/front/images/community-badge-battlefront.jpg',
		321995: '/front/images/community-badge-ahs.jpg',
		2233: '/front/images/community-badge-marvel.jpg',
		2237: '/front/images/community-badge-dc.jpg',
		604797: '/front/images/community-badge-destiny.jpg',
		1074920: '/front/images/community-badge-weihnachts.jpg',
		3676: '/front/images/community-badge-ja-halo.jpg',
		1147260: '/front/images/community-badge-ja-ajin.jpg',
		1144697: '/front/images/community-badge-ja-knights-of-sidonia.jpg'
	},

	wikiImageUrl: Ember.computed('squareDimension', function () {
		let imageUrl = this.get('badgeImages')[Ember.get(Mercury, 'wiki.id')];

		if (Ember.isEmpty(imageUrl)) {
			// get wiki image
			imageUrl = Ember.getWithDefault(Mercury, 'wiki.image', '/front/images/brackets.svg');
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
