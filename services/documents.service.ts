import 'server-only';
import { isDemoMode } from '@/lib/demo/config';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { canAccessPractice } from '@/lib/auth';
import type { UserProfile } from '@/types/user';
import type { ReferralDocument } from '@/types/referral';
import type { Database } from '@/types/database';
import { getReferral } from '@/services/referrals.service';

export const DOCUMENTS_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_DOCUMENTS_BUCKET || 'referral-documents';

function mapRow(row: Database['public']['Tables']['referral_documents']['Row']): ReferralDocument {
  return {
    id: row.id,
    referralId: row.referral_id,
    storagePath: row.storage_path,
    fileName: row.file_name,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    uploadedByUserId: row.uploaded_by_user_id,
    uploadedAt: row.uploaded_at,
  };
}

// In-memory metadata for demo mode — see lib/demo/store.ts for the pattern this follows.
const demoDocuments = new Map<string, ReferralDocument[]>();

export async function listDocuments(user: UserProfile, referralId: string): Promise<ReferralDocument[]> {
  const referral = await getReferral(user, referralId);
  if (!referral) return [];

  if (isDemoMode()) {
    return demoDocuments.get(referralId) ?? [];
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('referral_documents').select('*').eq('referral_id', referralId).order('uploaded_at');
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

/**
 * Records document metadata after the file bytes have already been written
 * to the private storage bucket (live mode) or accepted in-memory (demo
 * mode). Never generates or returns a public URL — see getSignedDownloadUrl.
 */
export async function recordDocumentUpload(
  user: UserProfile,
  referralId: string,
  file: { fileName: string; mimeType: string; sizeBytes: number; storagePath: string }
): Promise<ReferralDocument> {
  const referral = await getReferral(user, referralId);
  if (!referral || !canAccessPractice(user, referral.practiceId)) {
    throw new Error('You do not have permission to upload documents to this referral.');
  }

  const now = new Date().toISOString();

  if (isDemoMode()) {
    const doc: ReferralDocument = {
      id: crypto.randomUUID(),
      referralId,
      storagePath: file.storagePath,
      fileName: file.fileName,
      mimeType: file.mimeType,
      sizeBytes: file.sizeBytes,
      uploadedByUserId: user.id,
      uploadedAt: now,
    };
    const existing = demoDocuments.get(referralId) ?? [];
    demoDocuments.set(referralId, [...existing, doc]);
    return doc;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('referral_documents')
    .insert({
      referral_id: referralId,
      storage_path: file.storagePath,
      file_name: file.fileName,
      mime_type: file.mimeType,
      size_bytes: file.sizeBytes,
      uploaded_by_user_id: user.id,
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapRow(data);
}

/** Short-lived signed URL — the only way a clinical document is ever fetched, never a public path. */
export async function getSignedDownloadUrl(user: UserProfile, documentId: string): Promise<string | null> {
  if (isDemoMode()) return null; // no real file bytes exist in demo mode

  const supabase = createServerSupabaseClient();
  const { data: doc, error: docError } = await supabase.from('referral_documents').select('*').eq('id', documentId).single();
  if (docError || !doc) return null;

  const referral = await getReferral(user, doc.referral_id);
  if (!referral) return null; // RLS/canAccessPractice already implicitly checked via getReferral

  const { data, error } = await supabase.storage.from(DOCUMENTS_BUCKET).createSignedUrl(doc.storage_path, 60);
  if (error) return null;
  return data.signedUrl;
}
