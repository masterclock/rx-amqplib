import {Replies} from 'amqplib/properties';
import RxChannel from '../RxChannel';

export class EmptyReply implements Replies.Empty {
  public channel: RxChannel;

  constructor(channel: RxChannel) {
    this.channel = channel;
  }
}

export default EmptyReply;
