import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { isDemoMode } from '@/lib/demo/config';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { documentUploadSchema } from '@/lib/validation/referral';
import { documentsService, referralsService } from '@/services';
import { DOCUMENTS_BUCKET } from '@/services/documents.service';

/**
 * Handles clinical document uploads for a referral. Files are written to a
 * private Supabase Storage bucket (never public) and only metadata is
 * returned to the client — the file is later fetched via a short-lived
 * signed URL (see services/documents.service.ts#getSignedDownloadUrl), not
 * a public path.
 */
export async function POST(request: Request) {
  const user = await requireUser();

  const formData = await request.formData();
  const referralId = String(formData.get('referralId') ?? '');
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  const parsed = documentUploadSchema.safeParse({
    referralId,
    fileName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid file.' }, { status: 400 });
  }

  const referral = await referralsService.getReferral(user, referralId);
  if (!referral) {
    return NextResponse.json({ error: 'Referral not found or you do not have access to it.' }, { status: 404 });
  }

  const storagePath = `${referralId}/${Date.now()}-${file.name}`;

  if (!isDemoMode()) {
    const supabase = createServerSupabaseClient();
    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage.from(DOCUMENTS_BUCKET).upload(storagePath, bytes, {
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }
  }

  const document = await documentsService.recordDocumentUpload(user, referralId, {
    fileName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    storagePath,
  });

  return NextResponse.json({ document });
}
