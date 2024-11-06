import { Resolvers } from '@/generated/graphql';
import database from '@/providers/database';
import eventEmitter from '@/providers/events';
import { CONTENT_GENERATED, pubsub, SCHEDULE_TRIGGERED, STATUS_UPDATE } from '@/providers/pubsub';

const resolvers: Resolvers = {
  Query: {
    userInputs: async () => {
      return (await database.userInput.findMany()) as any;
    },
    contentByUserInput: async (_, { userInputId }) => {
      return (await database.content.findMany({
        where: { userInputId },
      })) as any;
    },
  },

  Mutation: {
    createUserInput: async (_, { email, keywords, audience, language, tone }) => {
      const created = (await database.userInput.create({
        data: {
          email,
          keywords,
          audience,
          language,
          tone,
        },
      })) as any;

      eventEmitter.emit('generate-topics', { inputs: created });
      return created;
    },
    updateContent: async (_, { id, blog, twitter, facebook, linkedin, instagram, threads }) => {
      const updatedContent = (await database.content.update({
        where: { id },
        data: { blog, twitter, facebook, linkedin, instagram, threads },
      })) as any;
      pubsub.publish(CONTENT_GENERATED, { contentGeneratedByAI: updatedContent });
      return updatedContent;
    },
    createSchedule: async (_, { contentId, blog, twitter, facebook, linkedin, instagram, threads }) => {
      const newSchedule = (await database.schedule.create({
        data: { contentId, blog, twitter, facebook, linkedin, instagram, threads },
      })) as any;
      pubsub.publish(SCHEDULE_TRIGGERED, { scheduleTriggered: newSchedule });
      return newSchedule;
    },
  },

  Subscription: {
    contentGeneratedByAI: {
      subscribe: (): AsyncIterable<any> => pubsub.asyncIterator([CONTENT_GENERATED]) as unknown as AsyncIterable<any>,
    },
    scheduleTriggered: {
      subscribe: (): AsyncIterable<any> => pubsub.asyncIterator([SCHEDULE_TRIGGERED]) as unknown as AsyncIterable<any>,
    },
    statusUpdater: {
      subscribe: (): AsyncIterable<any> => pubsub.asyncIterator([STATUS_UPDATE]) as unknown as AsyncIterable<any>,
    },
  },

  UserInput: {
    outputs: async (parent) => {
      return (await database.content.findMany({
        where: { userInputId: parent.id },
      })) as any;
    },
  },

  Content: {
    userInput: async (parent) => {
      return (await database.userInput.findUnique({
        where: { id: parent.userInputId },
      })) as any;
    },
    schedule: async (parent) => {
      return (await database.schedule.findMany({
        where: { contentId: parent.id },
      })) as any;
    },
  },

  Schedule: {
    content: async (parent) => {
      return (await database.content.findUnique({
        where: { id: parent.contentId },
      })) as any;
    },
  },
};

export default resolvers;
