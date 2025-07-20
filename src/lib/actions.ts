'use server';

import { gestureBasedMediaTransfer } from '@/ai/flows/gesture-recognition';
import { z } from 'zod';

export const transferSchema = z.object({
  gestureType: z.string().min(1, 'Gesture is required.'),
  destinationDeviceId: z.string().min(1, 'Destination device ID is required.'),
});

export async function handleGestureTransfer(
    mediaDataUri: string,
    values: z.infer<typeof transferSchema>
) {
  try {
    const validatedFields = transferSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: 'Invalid input.' };
    }

    if (!mediaDataUri || !mediaDataUri.startsWith('data:image')) {
        return { error: 'Valid media data is required.'}
    }

    const result = await gestureBasedMediaTransfer({
        ...validatedFields.data,
        mediaDataUri,
    });

    if (result.transferStatus.toLowerCase() === 'success') {
      return { success: result.message };
    } else {
      return { error: result.message };
    }
  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred during the transfer. Please try again.' };
  }
}
