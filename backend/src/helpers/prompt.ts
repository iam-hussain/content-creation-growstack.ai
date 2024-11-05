import apiClient from "./api-clinet";

export const extractChoice = (response: any) => {
    return response?.data?.choices[0]?.text?.trim() || ''
}

export const extractMultiChoice = (response: any) => {
  return response?.data?.choices[0]?.text?.trim().split(",") || []
}

export function fetchTrendingTopics(keywords: string[]) {
   const trendingPrompt = `Identify trending topics based on the following keywords: "${keywords.join(", ")}".`;

   return apiClient.post("/completions", {
    model: "text-davinci-003",
    prompt: trendingPrompt,
    max_tokens: 100,
  })
}

export function fetchPost(viralTopic: string, tone:string[], language: string[]) {
  const blogPrompt = `Create a ${tone.join(", ")} social media post in ${language.join(", ")} on the topic "${viralTopic}".`;
  const socialPrompt = `Create a ${tone.join(", ")} social media post in ${language.join(", ")} on the topic "${viralTopic}".`;

  return [ apiClient.post("/completions", {
    model: "text-davinci-003",
    prompt: blogPrompt,
    max_tokens: 100,
  }),  apiClient.post("/completions", {
    model: "text-davinci-003",
    prompt: socialPrompt,
    max_tokens: 100,
  })]
}

export async function personalizeContent(content: string, audience: string[]) {
  const personalizePrompt = `Customize the following content for a ${audience.join(", ")} audience: "${content}"`;
  return apiClient.post("/completions", {
    model: "text-davinci-003",
    prompt: personalizePrompt,
    max_tokens: 200,
  });

}

export async function seoOptimizeContent(content: string) {
  const seoPrompt = `Proofread and SEO optimize the following content for keyword density and readability: "${content}"`;
  return apiClient.post("https://api.openai.com/v1/completions", {
    model: "text-davinci-003",
    prompt: seoPrompt,
    max_tokens: 200,
  });
}
