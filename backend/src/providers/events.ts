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

class AIEmitter extends EventEmitter {}

const aiEventEmitter = new AIEmitter();

aiEventEmitter.on('generate-topics', ({ inputs }) => {
  console.log({ inputs });
  fetchTrendingTopics(inputs.keywords)
    .then((response) => {
      const trending = extractMultiChoices(response);
      const viral = trending[0];
      console.log({ viral, trending });
      aiEventEmitter.emit('generate-blog', { inputs, trending, viral });
    })
    .catch((error) => {
      console.error(`Error at generate-topics: ${JSON.stringify(inputs)}`);
      console.error(error);
    });
});

aiEventEmitter.on('generate-blog', ({ inputs, trending, viral }) => {
  fetchContentPost(viral, inputs.tone, inputs.language, 500)
    .then(extractChoice)
    .then((blog) => {
      console.log({ blog });
      aiEventEmitter.emit('generate-social-post', { inputs, trending, viral, blog });
    })
    .catch((error) => {
      console.error(`Error at generate-blog: ${JSON.stringify(inputs)}`);
      console.error(error);
    });
});

aiEventEmitter.on('generate-social-post', ({ inputs, blog }) => {
  Promise.all([
    eachSocialItem(blog, inputs.audience, 240),
    eachSocialItem(blog, inputs.audience, 1500),
    eachSocialItem(blog, inputs.audience, 200),
    eachSocialItem(blog, inputs.audience, 150),
    eachSocialItem(blog, inputs.audience, 350),
  ])
    .then((e) => e.map(extractChoice))
    .then(([twitter, linkedin, facebook, instagram, threads]) => {
      console.log({ twitter, linkedin, facebook, instagram, threads });
      return database.generatedContent.create({
        data: { twitter, linkedin, facebook, instagram, threads, userInputId: inputs.id as number },
      });
    })
    .catch((error) => {
      console.error(`Error at generate-blog: ${JSON.stringify(inputs)}`);
      console.error(error);
    });
});

export async function eachSocialItem(content: string, audience: string[], length: number = 500) {
  return personalizeContent(content, audience, length)
    .then(extractChoice)
    .then((data) => seoOptimizeContent(data, length))
    .then(extractChoice)
    .catch((error) => {
      console.error(`Error at eachSocialItem: ${JSON.stringify({ content, audience, length })}`);
      console.error(error);
      return '';
    });
}

export default aiEventEmitter;
