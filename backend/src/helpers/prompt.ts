import env from '@/providers/env-config';

import apiClient from './api-client';

export const extractChoice = (response: any) => {
  console.log(JSON.stringify(response));
  return response?.data?.choices[0]?.message?.content?.trim() || '';
};

export const extractMultiChoices = (response: any) => {
  return (
    response?.data?.choices[0]?.message?.content?.split('\n').map((item: string) => {
      return item.replace(/^\d+\.\s*/, '').trim();
    }) || []
  );
};

export function fetchTrendingTopics(keywords: string) {
  const trendingPrompt = `Identify trending topics based on the following keywords: "${keywords}". Return the topics list.`;

  return apiClient.post('/chat/completions', {
    model: env.CHATGPT_MODAL_NAME,
    messages: [{ role: 'user', content: trendingPrompt }],
    max_tokens: 100,
  });
}

export function fetchContentPost(viralTopic: string, tone: string, language: string, length: number = 500) {
  const blogPrompt = `Write a ${tone} blog for the social media post in ${language} on the topic "${viralTopic}" with ${length} characters.`;

  return apiClient.post('/chat/completions', {
    model: env.CHATGPT_MODAL_NAME,
    messages: [{ role: 'user', content: blogPrompt }],
    max_tokens: 700,
  });
}

export async function personalizeContent(content: string, audience: string[], length: number = 500) {
  const personalizePrompt = `Customize the following content for a ${audience} audience: "${content}" with ${length} characters.`;
  return apiClient.post('/chat/completions', {
    model: env.CHATGPT_MODAL_NAME,
    messages: [{ role: 'user', content: personalizePrompt }],
    max_tokens: 200,
  });
}

export async function seoOptimizeContent(content: string, length: number = 500) {
  const seoPrompt = `Proofread and SEO optimize the following content for keyword density and readability: "${content}" with ${length} characters.`;
  return apiClient.post('/chat/completions', {
    model: env.CHATGPT_MODAL_NAME,
    messages: [{ role: 'user', content: seoPrompt }],
    max_tokens: 200,
  });
}
