import Ember from 'ember';
import InfoboxBuilderEditItemMixin from '../mixins/infobox-builder-edit-item';
import InfoboxBuilderSidebarOptionsMixin from '../mixins/infobox-builder-sidebar-options';
import InfoboxBuilderInputAutoFocusMixin from '../mixins/infobox-builder-input-auto-focus';
import generateGuid from '../utils/generate-guid';

export default Ember.Component.extend(
	InfoboxBuilderSidebarOptionsMixin,
	InfoboxBuilderEditItemMixin,
	InfoboxBuilderInputAutoFocusMixin,
	{
		// params required for tracking edit actions
		headerValueFocusTrackingKey: 'header-value',
		headerValueOnFocus: null,
		wasHeaderValueAltered: false,

		value: Ember.computed('item.data', {
			get() {
				return this.get('item.data');
			},
			set(key, value) {
				// check if user interacted with header value input
				this.set('wasHeaderValueAltered', true);

				this.get('editSectionHeaderItem')(this.get('item'), {data: value});
				return value;
			}
		}),

		/**
		 * liquid-fire requires all ids have to be unique in order to not
		 * have two the same id's in view at a time
		 */
		textInputId: Ember.computed(() => {
			return generateGuid('infoboxSectionHeader');
		}),

		checkboxInputId: Ember.computed(() => {
			return generateGuid('isCollapsible');
		}),

		isCollapsible: Ember.computed('item.collapsible', {
			get() {
				return this.get('item.collapsible');
			},
			set(key, value) {
				this.trackEditItemOption('change', 'collapsible');
				this.get('editSectionHeaderItem')(this.get('item'), {collapsible: value});
				return value;
			}
		}),

		actions: {
			onHeaderValueInputFocus() {
				this.handleInputFocus(
					'headerValueOnFocus',
					this.get('value'),
					this.get('headerValueFocusTrackingKey')
				);
			},

			onHeaderValueInputBlur() {
				this.handleInputBlur(
					'wasHeaderValueAltered',
					this.get('headerValueOnFocus'),
					this.get('value'),
					this.get('headerValueFocusTrackingKey')
				);
			}
		}
	}
);
