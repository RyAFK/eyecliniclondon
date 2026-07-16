'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { usersService } from '@/services';
import { updateOwnProfileSchema, type UpdateOwnProfileInput } from '@/lib/validation/profile';

export interface UpdateOwnProfileResult {
  error?: string;
}

export async function updateOwnProfileAction(input: UpdateOwnProfileInput): Promise<UpdateOwnProfileResult> {
  const user = await requireUser();
  try {
    const parsed = updateOwnProfileSchema.parse(input);
    await usersService.updateOwnProfile(user, parsed);
    revalidatePath('/dashboard/account');
    revalidatePath('/dashboard');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Could not update your profile. Please try again.' };
  }
}
