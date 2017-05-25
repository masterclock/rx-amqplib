'use strict';

const RxAmqpLib = require('../');

const config = {
  queue: 'test_queue',
  host: 'amqp://thinkontrol.com'
};

// Process stream
RxAmqpLib.newConnection(config.host)
  .flatMap(connection => connection.createChannel())
  .flatMap(channel => channel.assertQueue(config.queue, { durable: false }))
  .flatMap(reply => reply.channel.consume(config.queue, { noAck: true }))
  .subscribe({
    next: message => console.log(message.content.toString()),
    error: error => console.log(error),
    complete: () => console.log('complete'),
  });
