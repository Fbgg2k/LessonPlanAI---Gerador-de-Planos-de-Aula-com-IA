import { config } from 'dotenv';
config();

import '@/ai/flows/generate-lesson-plan.ts';
import '@/ai/flows/summarize-feedback-and-suggest-improvements.ts';