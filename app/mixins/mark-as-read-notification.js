import Mixin from '@ember/object/mixin';
import { trackMarkAsRead } from '../utils/notifications-tracker';

export default Mixin.create(
	{
		actions: {
			markAsRead(notification) {
				trackMarkAsRead(notification);
				this.notifications.markAsRead(notification);
			},
		},
	},
);
