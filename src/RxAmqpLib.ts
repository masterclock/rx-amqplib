import * as AmqpLib from 'amqplib';
import { Connection } from 'amqplib';
import * as Rx from 'rxjs/Rx';
import RxConnection from './RxConnection';

/**
 * Factory for RxAmqpLib.
 */
export class RxAmqpLib {

  /**
   * Create a new instance of RxConnection, which wraps the amqplib Connection obj.
   *
   * @param url URL to AMQP host. eg: amqp://localhost/
   * @param options Custom AMQP options
   * @returns {RxConnection}
   */
  public static newConnection(url: string, options?: any): Rx.Observable<RxConnection> {

    // Doing it like this to make it a cold observable. When starting with the promise directly, the node application
    // stays open as AmqpLib connects straight away, and not when you subscribe to the stream.
    return Rx.Observable
      .defer(() => AmqpLib.connect(url, options))
      .flatMap((conn: Connection) => {
        const connectionDisposer = new Rx.Subscription(() => { console.log('dispose'); conn.close(); });
        // New RxConnection stream
        const sourceConnection = Rx.Observable.of(new RxConnection(conn));
        // Stream of close events from connection
        const closeEvents = Rx.Observable.fromEvent(conn, 'close');
        // Stream of Errors from error connection event
        const errorEvents = Rx.Observable.fromEvent(conn, 'error')
          .flatMap((error: any) => Rx.Observable.throw(error));
        // Stream of open connections, that will emit RxConnection until a close event
        const connection = Rx.Observable
          .merge(sourceConnection, errorEvents)
          .takeUntil(closeEvents);

        // Return the disposable connection resource
        return Rx.Observable.using(
          () => connectionDisposer,
          () => connection,
        );
      });
  }
}

export default RxAmqpLib;
