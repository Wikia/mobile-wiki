import Ember from 'ember';
import ViewportMixin from '../mixins/viewport';

export default Ember.Component.extend(ViewportMixin, {
	classNames: ['discussion-hero-unit'],
	contentClassNames: 'background-theme-color',
	attributeBindings: ['style'],

	overlay: false,
	style: null,

	headerImages: {
		24357: 'discussion-header-adventure-time.jpg',
		8390: 'discussion-header-cocktails.jpg',
		3035: 'discussion-header-fallout.jpg',
		119235: 'discussion-header-hawaii-five-o.jpg',
		35171: 'discussion-header-hunger-games.jpg',
		203914: 'discussion-header-one-direction.jpg',
		147: 'discussion-header-star-wars.jpg',
		750: 'discussion-header-star-wars.jpg',
		916: 'discussion-header-star-wars.jpg',
		1473: 'discussion-header-star-wars.jpg',
		1530: 'discussion-header-star-wars.jpg',
		1707: 'discussion-header-star-wars.jpg',
		3786: 'discussion-header-star-wars.jpg',
		5931: 'discussion-header-star-wars.jpg',
		280741: 'discussion-header-star-wars.jpg',
		13346: 'discussion-header-walking-dead.jpg',
		504037: 'discussion-header-de-walking-dead.jpg',
		558247: 'discussion-header-clash-clans.jpg',
		586931: 'discussion-header-clash-clans.jpg',
		2714: 'discussion-header-smash-bros.jpg',
		3124: 'discussion-header-en-ben-10.jpg',
		5918: 'discussion-header-pt-ben-10.jpg',
		130814: 'discussion-header-got.jpg',
		443588: 'discussion-header-got.jpg',
		4541: 'discussion-header-gta.jpg',
		1706: 'discussion-header-elder-scrolls.jpg',
		74: 'discussion-header-pokemon.jpg',
		544934: 'discussion-header-warframe.jpg',
		685207: 'discussion-header-ru-warframe.jpg',
		750724: 'discussion-header-zh-warframe.jpg',
		841905: 'discussion-header-brave-frontier.jpg',
		1081: 'discussion-header-one-piece.jpg',
		12113: 'discussion-header-pt-one-piece.jpg',
		6083: 'discussion-header-zh-one-piece.jpg',
		410: 'discussion-header-yu-gi-oh.jpg',
		949: 'discussion-header-mortal-kombat.jpg',
		255885: 'discussion-header-terraria.jpg',
		509: 'discussion-header-harry-potter.jpg',
		12318: 'discussion-header-harry-potter.jpg',
		865669: 'discussion-header-zh-harry-potter.jpg',
		1139: 'discussion-header-battlefield.jpg',
		2188: 'discussion-header-battlefront.jpg',
		321995: 'discussion-header-ahs.jpg',
		2233: 'discussion-header-marvel.jpg',
		183473: 'discussion-header-marvel.jpg',
		536148: 'discussion-header-marvel.jpg',
		2237: 'discussion-header-dc.jpg',
		604797: 'discussion-header-destiny.jpg',
		1074920: 'discussion-header-weihnachts.jpg',
		3676: 'discussion-header-ja-halo.jpg',
		1147260: 'discussion-header-ja-ajin.jpg',
		1144697: 'discussion-header-ja-knights-of-sidonia.jpg',
		1233861: 'discussion-header-community-connect.jpg',
		671485: 'discussion-header-tekken.jpg',
		198492: 'discussion-header-xcom.jpg',
		1322734: 'discussion-header-league-of-legends.jpg',
		595609: 'discussion-header-pt-league-of-legends.jpg',
		1015917: 'discussion-header-love-live.jpg',
		260936: 'discussion-header-teen-wolf.jpg',
		174: 'discussion-header-final-fantasy.jpg',
		3313: 'discussion-header-riordan.jpg',
		1353547: 'discussion-header-ja-seiken.jpg',
		650858: 'discussion-header-ja-dont-starve.jpg',
		638551: 'discussion-header-ru-dont-starve.jpg',
		749375: 'discussion-header-zh-dont-starve.jpg',
		125: 'discussion-header-tardis.jpg',
		537616: 'discussion-header-creepy-pasta.jpg',
		7474: 'discussion-header-de-animanga.jpg',
		83115: 'discussion-header-de-the-vampire-diaries.jpg',
		1043693: 'discussion-header-zh-terrabattle.jpg',
		848428: 'discussion-header-zh-kancolle.jpg',
		89404: 'discussion-header-pt-assassins-creed.jpg',
		366313: 'discussion-header-zh-assassins-creed.jpg',
		681646: 'discussion-header-zh-tower-of-saviors.jpg',
		501184: 'discussion-header-zh-puzzle-and-dragons.jpg',
		7060: 'discussion-header-gran-turismo.png',
		558403: 'discussion-header-pt-dragonball.jpg',
		231674: 'discussion-header-ru-my-little-pony.jpg',
		486874: 'discussion-header-ru-angry-birds.jpg'
	},

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		this.viewportChangeObserver();
	},

	/**
	 * Observes for change in visibility state of the component
	 * if it shows up and it didn't load the image style before,
	 * it constructs the style attribute with an approppriate image
	 * (This component is always loaded, but hidden in CSS for mobile res,
	 * so this will check if the browser width changed from mobile to desktop
	 * and then lazy-load the image)
	 */
	viewportChangeObserver: Ember.observer('viewportDimensions.width', function () {
		const visibleElement = this.$(':visible'),
			isShown = Boolean(visibleElement && visibleElement.length),
			image = this.get('headerImages')[Ember.get(Mercury, 'wiki.id')];

		if (!this.get('style') && isShown && image) {
			this.set('style',
				new Ember.Handlebars.SafeString(`background: #fff url(/front/common/images/${image}) center no-repeat;`));
			this.set('contentClassNames', 'background-alpha-theme-color');
		}
	}),
});
