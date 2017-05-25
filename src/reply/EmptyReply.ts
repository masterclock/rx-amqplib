import {Replies} from 'amqplib/properties';
import RxChannel from '../RxChannel';

class EmptyReply implements Replies.Empty {
  public channel: RxChannel;

  constructor(channel: RxChannel) {
    this.channel = channel;
  }
}

export default EmptyReply;
