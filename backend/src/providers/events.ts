import EventEmitter from 'events';

import {
  extractChoice,
  extractMultiChoices,
  fetchContentPost,
  fetchTrendingTopics,
  personalizeContent,
  seoOptimizeContent,
} from '../helpers/prompt';
import database from './database';
import { CONTENT_GENERATED, pubsub, STATUS_UPDATE } from './pubsub';

class Emitter extends EventEmitter {}

const eventEmitter = new Emitter();

async function logError(context: string, error: unknown, additionalData: any = {}) {
  console.error(`Error at ${context}: ${JSON.stringify(additionalData)}`);
  console.error(error);
  return pubsub.publish(STATUS_UPDATE, {
    statusUpdater: { id: additionalData?.input?.id || 0, success: true, message: 'error', stage: context },
  });
}

// Handler for the `generate-topics` event
async function handleGenerateTopics({ inputs }: any) {
  console.log({ inputs });

  try {
    const response = await fetchTrendingTopics(inputs.keywords);
    const trending = extractMultiChoices(response);
    const viral = trending[0];
    console.log({ viral, trending });

    pubsub.publish(STATUS_UPDATE, {
      statusUpdater: { id: inputs.id, success: true, message: 'success', stage: 'generate-topics' },
    });
    eventEmitter.emit('generate-blog', { inputs, trending, viral });
  } catch (error) {
    logError('generate-topics', error, { inputs });
  }
}

// Handler for the `generate-blog` event
function handleGenerateBlog({ inputs, trending, viral }: any) {
  fetchContentPost(viral, inputs.tone, inputs.language, 500)
    .then(extractChoice)
    .then((blog) => {
      console.log({ blog });
      eventEmitter.emit('generate-social-post', { inputs, trending, viral, blog });
    })
    .then(() => {
      return pubsub.publish(STATUS_UPDATE, {
        statusUpdater: { id: inputs.id, success: true, message: 'success', stage: 'generate-blog' },
      });
    })
    .catch((error) => logError('generate-blog', error, { inputs }));
}

// Handler for the `generate-social-post` event
function handleGenerateSocialPost({ inputs, blog }: any) {
  const lengths = [240, 1500, 200, 150, 350];

  Promise.all(lengths.map((len) => eachSocialItem(blog, inputs.audience, len)))
    .then((posts) => posts.map(extractChoice))
    .then(([twitter, linkedin, facebook, instagram, threads]) => {
      console.log({ twitter, linkedin, facebook, instagram, threads });

      return database.content.create({
        data: {
          blog,
          twitter,
          linkedin,
          facebook,
          instagram,
          threads,
          userInputId: inputs.id as number,
        },
      });
    })
    .then((created) => {
      pubsub.publish(CONTENT_GENERATED, {
        contentGeneratedByAI: created,
      });
      return pubsub.publish(STATUS_UPDATE, {
        statusUpdater: { id: inputs.id, success: true, message: 'success', stage: 'generate-social-post' },
      });
    })
    .catch((error) => logError('generate-social-post', error, { inputs }));
}

// Function to personalize and optimize content for each social platform
async function eachSocialItem(content: string, audience: string[], length: number) {
  try {
    const personalizedContent = await personalizeContent(content, audience, length).then(extractChoice);
    const optimizedContent = await seoOptimizeContent(personalizedContent, length).then(extractChoice);
    return optimizedContent;
  } catch (error) {
    logError('eachSocialItem', error, { content, audience, length });
    return '';
  }
}

// Register event handlers
eventEmitter.on('generate-topics', handleGenerateTopics);
eventEmitter.on('generate-blog', handleGenerateBlog);
eventEmitter.on('generate-social-post', handleGenerateSocialPost);

export { eachSocialItem, eventEmitter };
export default eventEmitter;
