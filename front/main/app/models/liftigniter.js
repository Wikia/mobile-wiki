import Ember from 'ember';
import Thumbnailer from 'common/modules/thumbnailer';

const LiftigniterModel = Ember.Object.extend({
	widget: null,
	max: 5,
	thumbWidth: 120,
	thumbHeight: 120,

	init() {
		this._super(...arguments);
		this.items = [];
	},

	title: Ember.computed('widget', function () {
		if (this.get('widget') === 'fandom-rec') {
			return 'Trending on Fandom';
		} else {
			return 'Related Articles';
		}
	}),

	/**
	 * @returns {Ember.RSVP.Promise} model
	 */
	load() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const registerOptions = {
				max: this.get('max'),
				widget: this.get('widget'),
				callback: (data) => {
					const formatted = this.formatData(data);
					this.setProperties(formatted);
					resolve(this);
				}
			};

			if (!window.$p) {
				return;
			}

			if (this.get('widget') === 'fandom-rec') {
				registerOptions.opts = {
					resultType: 'fandom'
				};
			}

			// Callback renders and injects results into the placeholder.
			window.$p('register', registerOptions);

			// Executes the registered call.
			window.$p('fetch');
		});
	},

	formatData(data) {
		let items = [];

		Ember.$.each(data.items, (index, item) => {
			item.index = index;

			if (this.get('widget') === 'fandom-rec') {
				item.title = item.title.replace(' - Fandom - Powered by Wikia', '');
			} else {
				item.thumbnail = Thumbnailer.getThumbURL(item.thumbnail, {
					mode: Thumbnailer.mode.zoomCrop,
					height: this.get('thumbHeight'),
					width: this.get('thumbWidth')
				});
			}

			items.push(item);
		});

		return {
			items
		};
	},

	afterRender(component) {
		if (!window.$p) {
			return;
		}

		const elements = component.$('.title-thumbnail').get(),
			widget = this.get('widget'),
			trackOptions = {
				elements,
				name: widget,
				source: 'LI'
			};

		if (widget === 'fandom-rec') {
			trackOptions.opts = {
				resultType: 'fandom'
			};
		}

		window.$p('track', trackOptions);
	}
});

export default LiftigniterModel;
