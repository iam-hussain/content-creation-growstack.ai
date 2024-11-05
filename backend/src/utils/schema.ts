import { z } from 'zod';

export const generateContent = z.object({
  body: z.object({
    email: z.string().nonempty('Email address is required.').email('Please enter a valid email address.'),
    keywords: z.array(z.string()).nonempty('Please enter at least one keyword or URL to proceed.'),
    audience: z.array(z.string()).nonempty('Please select at least one audience segment.'),
    lang: z.array(z.string()).nonempty('Please select at least one language.'),
    tone: z.array(z.string()).nonempty('Please select at least one tone for the content.'),
  }),
});
