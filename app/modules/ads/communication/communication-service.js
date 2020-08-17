import { Communicator, setupPostQuecast } from '@wikia/post-quecast';

class CommunicationService {
  constructor() {
    if (typeof FastBoot === 'undefined') {
      setupPostQuecast();
      this.communicator = new Communicator();
    }
  }

  addListener(cb) {
    if (this.communicator) {
      this.communicator.addListener(cb);
    }
  }

  removeListener(cb) {
    if (this.communicator) {
      this.communicator.removeListener(cb);
    }
  }

  dispatch(action) {
    if (this.communicator) {
      action.__global = true;
      this.communicator.dispatch(action);
    }
  }
}

export const communicationService = new CommunicationService();

export default communicationService;
