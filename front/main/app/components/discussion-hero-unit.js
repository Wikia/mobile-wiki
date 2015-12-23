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
		558247: 'discussion-header-clash-clans.jpg',
		2714: 'discussion-header-smash-bros.jpg',
		3124: 'discussion-header-ben-10.jpg',
		4541: 'discussion-header-gta.jpg',
		1706: 'discussion-header-elder-scrolls.jpg',
		74: 'discussion-header-pokemon.jpg',
		544934: 'discussion-header-warframe.jpg',
		841905: 'discussion-header-brave-frontier.jpg',
		1081: 'discussion-header-one-piece.jpg',
		410: 'discussion-header-yu-gi-oh.jpg',
		949: 'discussion-header-mortal-kombat.jpg',
		255885: 'discussion-header-terraria.jpg',
		509: 'discussion-header-harry-potter.jpg',
		2188: 'discussion-header-battlefront.jpg',
		321995: 'discussion-header-ahs.jpg',
		2233: 'discussion-header-marvel.jpg',
		2237: 'discussion-header-dc.jpg',
		604797: 'discussion-header-destiny.jpg',
		1074920: 'discussion-header-weihnachts.jpg',
		3676: 'discussion-header-ja-halo.jpg',
		1147260: 'discussion-header-ja-ajin.jpg',
		1144697: 'discussion-header-ja-knights-of-sidonia.jpg'
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
				new Ember.Handlebars.SafeString(`background: #fff url(/front/images/${image}) center no-repeat;`));
			this.set('contentClassNames', 'background-alpha-theme-color');
		}
	}),
});
