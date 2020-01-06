import Mixin from '@ember/object/mixin';
import { trackMarkAllAsRead } from '../utils/notifications-tracker';

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create(
  {
    actions: {
      markAllAsRead() {
        trackMarkAllAsRead();
        this.notifications.markAllAsRead();
      },
    },
  },
);
