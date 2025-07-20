'use server';

/**
 * @fileOverview Implements gesture recognition for media transfer.
 *
 * - gestureBasedMediaTransfer - A function that processes hand gestures to transfer media between devices.
 * - GestureBasedMediaTransferInput - The input type for the gestureBasedMediaTransfer function.
 * - GestureBasedMediaTransferOutput - The return type for the gestureBasedMediaTransfer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GestureBasedMediaTransferInputSchema = z.object({
  gestureType: z
    .string()
    .describe(
      'The type of hand gesture recognized (e.g., swipe left, swipe right, pinch).'
    ),
  mediaDataUri: z
    .string()
    .describe(
      'The media to be transferred, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  destinationDeviceId: z.string().describe('The ID of the device to transfer the media to.'),
});
export type GestureBasedMediaTransferInput = z.infer<
  typeof GestureBasedMediaTransferInputSchema
>;

const GestureBasedMediaTransferOutputSchema = z.object({
  transferStatus: z.string().describe('The status of the media transfer (e.g., success, failure).'),
  message: z.string().describe('A message providing details about the transfer status.'),
});
export type GestureBasedMediaTransferOutput = z.infer<
  typeof GestureBasedMediaTransferOutputSchema
>;

export async function gestureBasedMediaTransfer(
  input: GestureBasedMediaTransferInput
): Promise<GestureBasedMediaTransferOutput> {
  return gestureBasedMediaTransferFlow(input);
}

const gestureBasedMediaTransferPrompt = ai.definePrompt({
  name: 'gestureBasedMediaTransferPrompt',
  input: {schema: GestureBasedMediaTransferInputSchema},
  output: {schema: GestureBasedMediaTransferOutputSchema},
  prompt: `You are an expert in processing media transfer requests based on hand gestures.

You will receive the type of hand gesture, the media to be transferred (as a data URI), and the destination device ID.

Based on this information, simulate the transfer process and return a status indicating whether the transfer was successful or not, along with a descriptive message.

Gesture Type: {{{gestureType}}}
Media Data URI: {{media url=mediaDataUri}}
Destination Device ID: {{{destinationDeviceId}}}

Ensure the transferStatus reflects the outcome of the transfer and the message provides context.
`,
});

const gestureBasedMediaTransferFlow = ai.defineFlow(
  {
    name: 'gestureBasedMediaTransferFlow',
    inputSchema: GestureBasedMediaTransferInputSchema,
    outputSchema: GestureBasedMediaTransferOutputSchema,
  },
  async input => {
    const {output} = await gestureBasedMediaTransferPrompt(input);
    return output!;
  }
);
