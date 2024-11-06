import database from '@/providers/database';

// Subscription events
const CONTENT_GENERATED = 'CONTENT_GENERATED';
const SCHEDULE_TRIGGERED = 'SCHEDULE_TRIGGERED';

export default {
  Query: {
    userInputs: async () => {
      return await database.userInput.findMany();
    },
    contentByUserInput: async (_, { userInputId }) => {
      return await database.content.findMany({
        where: { userInputId },
      });
    },
  },

  Mutation: {
    createUserInput: async (_, { email, keywords, audience, language, tone }) => {
      return await database.userInput.create({
        data: { email, keywords, audience, language, tone },
      });
    },
    updateContent: async (_, { id, blog, twitter, facebook, linkedin, instagram, threads }) => {
      const updatedContent = await database.content.update({
        where: { id },
        data: { blog, twitter, facebook, linkedin, instagram, threads },
      });
      pubsub.publish(CONTENT_GENERATED, { contentGeneratedByAI: updatedContent });
      return updatedContent;
    },
    createSchedule: async (_, { contentId, blog, twitter, facebook, linkedin, instagram, threads }) => {
      const newSchedule = await database.schedule.create({
        data: { contentId, blog, twitter, facebook, linkedin, instagram, threads },
      });
      pubsub.publish(SCHEDULE_TRIGGERED, { scheduleTriggered: newSchedule });
      return newSchedule;
    },
  },

  Subscription: {
    contentGeneratedByAI: {
      subscribe: () => pubsub.asyncIterator([CONTENT_GENERATED]),
    },
    scheduleTriggered: {
      subscribe: () => pubsub.asyncIterator([SCHEDULE_TRIGGERED]),
    },
  },

  UserInput: {
    outputs: async (parent) => {
      return await database.content.findMany({
        where: { userInputId: parent.id },
      });
    },
  },

  Content: {
    userInput: async (parent) => {
      return await database.userInput.findUnique({
        where: { id: parent.userInputId },
      });
    },
    schedule: async (parent) => {
      return await database.schedule.findMany({
        where: { contentId: parent.id },
      });
    },
  },

  Schedule: {
    content: async (parent) => {
      return await database.content.findUnique({
        where: { id: parent.contentId },
      });
    },
  },
};
