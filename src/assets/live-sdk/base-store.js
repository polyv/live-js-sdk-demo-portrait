import PubSub from 'jraiser/pubsub/1.2/pubsub';
import PlayEvents from './player-evt';
import { bus, UPDATE_PLAYER_STATE } from '../utils/event-bus';

const eventObj = {
  [PlayEvents.PLAYING]: () => {
    bus.$emit(UPDATE_PLAYER_STATE, 'playerStatus', 'playing');
    bus.$emit(UPDATE_PLAYER_STATE, 'isPlayed', true);
  },
  [PlayEvents.PAUSE]: () => bus.$emit(UPDATE_PLAYER_STATE, 'playerStatus', 'stoped'),
  [PlayEvents.PLAY_FAILE]: () => bus.$emit(UPDATE_PLAYER_STATE, 'playerStatus', 'stoped'),
  [PlayEvents.MODE_CHANGE]: ({ mode }) => bus.$emit(UPDATE_PLAYER_STATE, 'playerMode', mode),
  [PlayEvents.LEVEL_CHANGE]: ({ definition }) => bus.$emit(UPDATE_PLAYER_STATE, 'currentDefinition', definition),
  [PlayEvents.STATUS_CHANGE]: ({ status }) => bus.$emit(UPDATE_PLAYER_STATE, 'liveStatus', status),
  [PlayEvents.RATE_CHANGE]: ({ rate }) => bus.$emit(UPDATE_PLAYER_STATE, 'currentRate', rate),
};

class BaseStore extends PubSub {
  constructor(options) {
    super();
    this.bindStoreEvent();
  }

  bindStoreEvent() {
    for (const event in eventObj) {
      this.on(event, eventObj[event]);
    }
  }
}

export default BaseStore;
