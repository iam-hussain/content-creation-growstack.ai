import aiEventEmitter from '@/providers/events';

import { extractChoice, extractMultiChoice, fetchBlogSocialPost, fetchTrendingTopics } from './prompt';

aiEventEmitter.on('generate-topics', async ({ inputs }) => {
  fetchTrendingTopics(inputs.keywords)
    .then((response) => {
      const trending = extractMultiChoice(response);
      const viral = trending[0];
      aiEventEmitter.emit('generate-post', { inputs, trending, viral });
    })
    .catch((error) => {
      console.error(`Error at generate-topics: ${JSON.stringify(inputs)}`);
      console.error(error);
    });
});

aiEventEmitter.on('generate-post', async ({ inputs, trending, viral }) => {
  Promise.all(fetchBlogSocialPost(viral, inputs.tone, inputs.language))
    .then((response) => response.map(extractChoice))
    .then(([blog, social]) => {
      aiEventEmitter.emit('personalize', { inputs, trending, viral, blog, social });
    })
    .catch((error) => {
      console.error(`Error at generate-post: ${JSON.stringify(inputs)}`);
      console.error(error);
    });
});



// aiEventEmitter.on('personalize', async ({ inputs, trending, viral, blog, social }) => {
//     Promise.all([personalizeContent()])
//       .then((response) => response.map(extractChoice))
//       .then(([blog, social]) => {
//         aiEventEmitter.emit('generate-seo', { inputs, trending, viral, blog, social });
//       })
//       .catch((error) => {
//         console.error(`Error at generate-post: ${JSON.stringify(inputs)}`);
//         console.error(error);
//       });
//   });
  