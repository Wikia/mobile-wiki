import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import { dasherize } from '@ember/string';
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import RenderComponentMixin from '../../mixins/render-component';

export default Component.extend(RenderComponentMixin, {
	ads: service(),

	isVisible: false,
	name: 'INVISIBLE_HIGH_IMPACT_2',

	noAds: readOnly('ads.noAds'),
	nameLowerCase: computed('name', function () {
		return dasherize(this.name.toLowerCase());
	}),

	didInsertElement() {
		this._super(...arguments);

		this.get('ads.module').onReady(() => {
			window.getInstantGlobal('wgAdDriverHighImpact2SlotCountries', (highImpactCountries) => {
				if (this.isEnabled(highImpactCountries) && !this.isDestroyed) {
					this.set('isVisible', true);
					this.get('ads.module').pushSlotToQueue(this.name);
				}
			});
		});
	},

	willDestroyElement() {
		this._super(...arguments);

		if (this.isEnabled()) {
			this.get('ads.module').removeSlot(this.name);
		}
	},

	isProperGeo(param) {
		const isProperGeo = get(Wikia, 'geo.isProperGeo');
		return typeof isProperGeo === 'function' && isProperGeo(param);
	},

	isEnabled(highImpactCountries) {
		return this.isProperGeo(highImpactCountries);
	}
});
