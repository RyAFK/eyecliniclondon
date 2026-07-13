'use server';

import { requireUser } from '@/lib/auth';
import { documentsService } from '@/services';

/** Returns a short-lived signed URL for a private clinical document — never a public path. */
export async function getDocumentUrlAction(documentId: string): Promise<{ url?: string; error?: string }> {
  const user = await requireUser();
  const url = await documentsService.getSignedDownloadUrl(user, documentId);
  if (!url) return { error: 'This document is not available to view (demo mode has no real file storage).' };
  return { url };
}
