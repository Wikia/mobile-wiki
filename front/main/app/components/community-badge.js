import Ember from 'ember';
import Thumbnailer from 'common/modules/thumbnailer';

export default Ember.Component.extend({
	classNames: ['community-badge'],
	squareDimension: 125,

	badgeImages: {
		24357: '/front/common/images/community-badge-adventure-time.png',
		8390: '/front/common/images/community-badge-cocktails.png',
		3035: '/front/common/images/community-badge-fallout.png',
		119235: '/front/common/images/community-badge-hawaii-five-o.png',
		35171: '/front/common/images/community-badge-hunger-games.png',
		203914: '/front/common/images/community-badge-one-direction.png',
		147: '/front/common/images/community-badge-star-wars-en.png',
		750: '/front/common/images/community-badge-star-wars.png',
		916: '/front/common/images/community-badge-star-wars.png',
		1473: '/front/common/images/community-badge-star-wars.png',
		1530: '/front/common/images/community-badge-star-wars.png',
		1707: '/front/common/images/community-badge-star-wars.png',
		3786: '/front/common/images/community-badge-star-wars.png',
		5931: '/front/common/images/community-badge-star-wars.png',
		280741: '/front/common/images/community-badge-star-wars.png',
		13346: '/front/common/images/community-badge-walking-dead.png',
		504037: '/front/common/images/community-badge-de-walking-dead.jpg',
		558247: '/front/common/images/community-badge-clash-clans.jpg',
		586931: '/front/common/images/community-badge-clash-clans.jpg',
		2714: '/front/common/images/community-badge-smash-bros.jpg',
		3124: '/front/common/images/community-badge-en-ben-10.jpg',
		5918: '/front/common/images/community-badge-pt-ben-10.jpg',
		130814: '/front/common/images/community-badge-got.jpg',
		443588: '/front/common/images/community-badge-got.jpg',
		4541: '/front/common/images/community-badge-gta.jpg',
		1706: '/front/common/images/community-badge-elder-scrolls.jpg',
		74: '/front/common/images/community-badge-pokemon.jpg',
		544934: '/front/common/images/community-badge-warframe.jpg',
		750724: '/front/common/images/community-badge-zh-warframe.jpg',
		841905: '/front/common/images/community-badge-brave-frontier.jpg',
		1081: '/front/common/images/community-badge-one-piece.jpg',
		12113: '/front/common/images/community-badge-pt-one-piece.png',
		6083: '/front/common/images/community-badge-zh-one-piece.jpg',
		410: '/front/common/images/community-badge-yu-gi-oh.jpg',
		949: '/front/common/images/community-badge-mortal-kombat.jpg',
		255885: '/front/common/images/community-badge-terraria.jpg',
		509: '/front/common/images/community-badge-harry-potter.jpg',
		12318: '/front/common/images/community-badge-harry-potter.jpg',
		865669: '/front/common/images/community-badge-zh-harry-potter.jpg',
		1139: '/front/common/images/community-badge-battlefied.jpg',
		2188: '/front/common/images/community-badge-battlefront.jpg',
		321995: '/front/common/images/community-badge-ahs.jpg',
		2233: '/front/common/images/community-badge-marvel.jpg',
		183473: '/front/common/images/community-badge-marvel.jpg',
		536148: '/front/common/images/community-badge-marvel.jpg',
		2237: '/front/common/images/community-badge-dc.jpg',
		604797: '/front/common/images/community-badge-destiny.jpg',
		1074920: '/front/common/images/community-badge-weihnachts.jpg',
		3676: '/front/common/images/community-badge-ja-halo.jpg',
		1147260: '/front/common/images/community-badge-ja-ajin.jpg',
		1144697: '/front/common/images/community-badge-ja-knights-of-sidonia.jpg',
		1233861: '/front/common/images/community-badge-connect.jpg',
		671485: '/front/common/images/community-badge-tekken.jpg',
		198492: '/front/common/images/community-badge-xcom.jpg',
		1350187: '/front/common/images/community-badge-head-fi.jpg',
		1322734: '/front/common/images/community-badge-league-of-legends.jpg',
		595609: '/front/common/images/community-badge-pt-league-of-legends.jpg',
		1015917: '/front/common/images/community-badge-love-live.jpg',
		260936: '/front/common/images/community-badge-teen-wolf.jpg',
		174: '/front/common/images/community-badge-final-fantasy.jpg',
		3313: '/front/common/images/community-badge-riordan.jpg',
		1353547: '/front/common/images/community-badge-ja-seiken.jpg',
		650858: '/front/common/images/community-badge-ja-dont-starve.jpg',
		749375: '/front/common/images/community-badge-zh-dont-starve.jpg',
		125: '/front/common/images/community-badge-tardis.jpg',
		537616: '/front/common/images/community-badge-creepy-pasta.jpg',
		7474: '/front/common/images/community-badge-de-animanga.jpg',
		83115: '/front/common/images/community-badge-de-the-vampire-diaries.jpg',
		1043693: '/front/common/images/community-badge-zh-terrabattle.jpg',
		848428: '/front/common/images/community-badge-zh-kancolle.jpg',
		89404: '/front/common/images/community-badge-pt-assassins-creed.jpg',
		366313: '/front/common/images/community-badge-zh-assassins-creed.jpg',
		681646: '/front/common/images/community-badge-zh-tower-of-saviors.jpg',
		501184: '/front/common/images/community-badge-zh-puzzle-and-dragons.jpg',
		7060: '/front/common/images/community-badge-gran-turismo.png',
		558403: '/front/common/images/community-badge-pt-dragonball.jpg',
		231674: '/front/common/images/community-badge-ru-my-little-pony.jpg'
	},

	wikiImageUrl: Ember.computed('squareDimension', function () {
		let imageUrl = this.get('badgeImages')[Ember.get(Mercury, 'wiki.id')];

		if (Ember.isEmpty(imageUrl)) {
			// get wiki image
			imageUrl = Ember.getWithDefault(Mercury, 'wiki.image', '/front/common/symbols/brackets.svg');
		}

		return Thumbnailer.getThumbURL(
			imageUrl,
			{
				mode: Thumbnailer.mode.topCrop,
				width: this.get('squareDimension'),
				height: this.get('squareDimension')
			}
		);
	}),

	wikiName: Ember.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
});
