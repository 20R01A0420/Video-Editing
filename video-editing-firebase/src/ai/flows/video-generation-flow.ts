
'use server';
/**
 * @fileOverview A video generation AI agent.
 *
 * - generateVideo - A function that handles the video generation process.
 */
import 'dotenv/config';
import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {
  GenerateVideoInputSchema,
  GenerateVideoOutputSchema,
  type GenerateVideoInput,
  type GenerateVideoOutput,
} from './video-generation-schemas';
import {MediaPart} from 'genkit';
import fetch from 'node-fetch';


async function downloadVideoAsDataURI(video: MediaPart) {
  if (!video.media?.url) {
    throw new Error('Video media URL is missing.');
  }

  // The URL from Veo is a GCS URI and needs an API key to access.
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }

  const videoDownloadResponse = await fetch(
    `${video.media.url}&key=${apiKey}`
  );

  if (!videoDownloadResponse.ok) {
    throw new Error(
      `Failed to fetch video: ${videoDownloadResponse.statusText}`
    );
  }

  const videoBuffer = await videoDownloadResponse.buffer();
  const contentType =
    video.media.contentType || videoDownloadResponse.headers.get('content-type') || 'video/mp4';

  return `data:${contentType};base64,${videoBuffer.toString('base64')}`;
}


export async function generateVideo(
  input: GenerateVideoInput
): Promise<GenerateVideoOutput> {
  return videoGenerationFlow(input);
}

const videoGenerationFlow = ai.defineFlow(
  {
    name: 'videoGenerationFlow',
    inputSchema: GenerateVideoInputSchema,
    outputSchema: GenerateVideoOutputSchema,
  },
  async (input: GenerateVideoInput) => {
    let prompt = '';
    let aspectRatio = '16:9';
    if (input.format === 'vertical') {
      prompt = `Create a short-form vertical video (like a TikTok or Reel).
      The main content is a screen recording.
      Overlay the face recording in the bottom half, on top of the provided background image.
      The overall background color of the video should be ${input.backgroundColor}.
      Screen recording is the primary focus.`;
      aspectRatio = '9:16';
    } else {
      prompt = `Create a long-form horizontal video (like a YouTube video).
      The main content is a screen recording.
      Place the face recording as a small picture-in-picture in the bottom-right corner.
      The face recording PiP should have the provided background image inside it.
      The overall background color of the video should be ${input.backgroundColor}.
      Screen recording is the primary focus.`;
      aspectRatio = '16:9';
    }

    let {operation} = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: [
        {text: prompt},
        {media: {url: input.screenRecording}},
        {media: {url: input.faceRecording}},
        {media: {url: input.backgroundImage}},
      ],
      config: {
        durationSeconds: 5,
        aspectRatio: aspectRatio,
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes.
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      // Sleep for 5 seconds before checking again.
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const videoPart = operation.output?.message?.content.find(p => !!p.media);
    if (!videoPart || !videoPart.media) {
      throw new Error('Failed to find the generated video');
    }

    const videoDataUri = await downloadVideoAsDataURI(videoPart as MediaPart);

    return {
      video: videoDataUri,
    };
  }
);
