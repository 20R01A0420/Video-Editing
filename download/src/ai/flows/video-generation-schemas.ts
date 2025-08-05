
/**
 * @fileOverview Schemas and types for the video generation flow.
 *
 * - GenerateVideoInput - The input type for the generateVideo function.
 * - GenerateVideoOutput - The return type for the generateVideo function.
 */

import {z} from 'genkit';

export const GenerateVideoInputSchema = z.object({
  screenRecording: z
    .string()
    .describe(
      "The user's screen recording as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  faceRecording: z
    .string()
    .describe(
      "The user's face recording as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  backgroundImage: z
    .string()
    .describe(
      "The background image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  backgroundColor: z
    .string()
    .describe('The background color in hex format.'),
  format: z.enum(['vertical', 'horizontal']),
});

export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

export const GenerateVideoOutputSchema = z.object({
  video: z
    .string()
    .describe(
      "The generated video as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;
