'use strict';

const RxAmqpLib = require('../dist/index.js').RxAmqpLib;
const RxAmqp = require('../dist/index.js');

const config = {
  queue: 'test_queue',
  host: 'amqp://thinkontrol.com'
};

// Process stream
// RxAmqpLib.newConnection(config.host)
//   .flatMap(connection => connection
//     .createChannel()
//     .flatMap(channel => channel.assertQueue(config.queue, { durable: false }))
//     .doOnNext(reply => reply.channel.sendToQueue(config.queue, new Buffer('Test message')))
//     .flatMap(reply => reply.channel.close())
//     .flatMap(() => connection.close())
//   )
//   .subscribe(() => console.log('Message sent'));

const sub = RxAmqpLib.newConnection(config.host)
  .do(c => console.log('c: ', c))
  .switchMap(conn => conn.createConfirmChannel())
  .mergeMap((channel) => {
    console.log('channel: ', channel.assertQueue);
    return channel.assertQueue(config.queue);
  })
  .mergeMap(reply => reply.channel.publish('amq.topic', 'config.queue', new Buffer('test')))
  .take(1)
  .subscribe({
    next: res => {
      console.log('res: ', res, sub);
      // sub.unsubscribe();
    },
    error: error => console.log('error: ', error),
    complete: () => console.log('complete'),
  });

// setTimeout(function() {
//   console.log('unsubscribe');
//   sub.unsubscribe();
// }, 10000);
