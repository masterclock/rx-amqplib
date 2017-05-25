import {Replies} from 'amqplib/properties';
import RxChannel from '../RxChannel';

export class PurgeQueueReply implements Replies.PurgeQueue {
  public channel: RxChannel;
  public messageCount: number;

  constructor(channel: RxChannel, deleteQueue: Replies.PurgeQueue) {
    this.channel = channel;
    this.messageCount = deleteQueue.messageCount;
  }
}

export default PurgeQueueReply;
