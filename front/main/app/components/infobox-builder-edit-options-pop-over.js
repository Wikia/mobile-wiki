import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';


export default Ember.Component.extend(
	TrackClickMixin,
	{
		classNames: ['infobox-builder-edit-options-pop-over', 'pop-over', 'orient-left', 'pointer-center'],
		targetPosX: null,
		targetPosY: null,
		targetHeight: null,
		popOverHeight: null,
		popOverWidth: null,
		popOverElementClassName: 'pop-over-compass',
		didAttrsChange: false,
		posX: Ember.computed('targetPosX', 'popOverWidth', 'offsetX', function () {
			return this.get('targetPosX') - this.get('popOverWidth') - this.get('offsetX');
		}),
		posY: Ember.computed('targetPosY', 'targetHeight', 'popOverHeight', function () {
			return this.get('targetPosY') + this.get('targetHeight') / 2 - this.get('popOverHeight') / 2;
		}),
		shouldUpdatePosition: Ember.computed.and('visible', 'didAttrsChange'),

		didUpdateAttrs() {
			this._super(...arguments);

			this.set('didAttrsChange', true);

			if (this.get('visible') === false) {
				this.resetDataForCalculationComponentPosition();
			}
		},

		didRender() {
			this._super(...arguments);

			if (this.get('shouldUpdatePosition')) {
				// delayed position to after render in order to get proper target item DOM position
				Ember.run.scheduleOnce('afterRender', this, function () {
					this.setDataForCalculationComponentPosition();
					this.setComponentCSSPosition();
					this.set('didAttrsChange', false);
				});
			}
		},

		/**
		 * Sets data required for calculation pop over position based on DOM position
		 * and dimensions on target element and pop over itself.
		 * Need to do it on the DOM level after render to have access to rendered pop over DOM element dimensions.
		 * @returns {void}
		 */
		setDataForCalculationComponentPosition() {
			const $popOver = this.$(`.${this.get('popOverElementClassName')}`),
				targetItem = this.get('targetItem'),
				$targetItem = Ember.$(`#${targetItem.infoboxBuilderData.id}`),
				position = $targetItem.position();

			this.setProperties({
				popOverHeight: $popOver.outerHeight(),
				popOverWidth: $popOver.outerWidth(),
				targetHeight: $targetItem.outerHeight(),
				targetPosX: position.left,
				targetPosY: position.top
			});
		},

		/**
		 * Resets data required for pop over position calculation to it's initial state
		 * @returns {void}
		 */
		resetDataForCalculationComponentPosition() {
			this.setProperties({
				popOverHeight: null,
				popOverWidth: null,
				targetHeight: null,
				targetPosX: null,
				targetPosY: null
			});
		},

		/**
		 * Sets position of pop over DOM element
		 * @returns {void}
		 */
		setComponentCSSPosition() {
			this.$().css({
				left: this.get('posX'),
				top: this.get('posY')
			});
		},

		actions: {
			removeItem() {
				const item = this.get('targetItem');

				this.trackClick('infobox-builder', `edit-options-pop-over-delete-item-${item.type}`);
				this.get('onDeleteItem')(item);
			}
		}
	}
);
