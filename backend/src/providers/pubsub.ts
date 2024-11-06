import { PubSub } from 'graphql-subscriptions';

class PubSubSingleton {
  private static instance: PubSub;

  private constructor() {} // Prevent direct instantiation

  public static getInstance(): PubSub {
    if (!PubSubSingleton.instance) {
      PubSubSingleton.instance = new PubSub();
    }
    return PubSubSingleton.instance;
  }
}

export const pubsub = PubSubSingleton.getInstance();

export const CONTENT_GENERATED = 'CONTENT_GENERATED';
export const SCHEDULE_TRIGGERED = 'SCHEDULE_TRIGGERED';
export const STATUS_UPDATE = 'STATUS_UPDATE';
