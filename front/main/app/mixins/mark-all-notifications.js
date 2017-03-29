import Ember from 'ember';
import {trackMarkAllAsRead} from '../utils/notifications-tracker';

const {Mixin} = Ember;

/**
 * @typedef {Object} ImageCropData
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

export default Mixin.create(
	{
		actions: {
			markAllAsRead() {
				trackMarkAllAsRead();

				this.get('notifications').markAllAsRead();
			}
		}
	}
);
