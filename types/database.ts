/**
 * Hand-authored mirror of the Supabase schema (supabase/migrations/*.sql).
 * Column names are snake_case to match Postgres; the service layer
 * (services/*.ts) maps rows to the camelCase app types in types/*.ts so the
 * rest of the app never touches snake_case directly.
 *
 * Regenerate/replace with `supabase gen types typescript` once the project
 * is linked to a real Supabase instance — the shape below is kept in sync
 * with the migrations by hand until then.
 */
export interface Database {
  public: {
    Tables: {
      practices: {
        Row: {
          id: string;
          name: string;
          address_line1: string | null;
          address_line2: string | null;
          city: string | null;
          postcode: string | null;
          phone: string | null;
          email: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['practices']['Row']> & { name: string };
        Update: Partial<Database['public']['Tables']['practices']['Row']>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'partner_user' | 'partner_admin' | 'ecl_staff' | 'ecl_admin';
          practice_id: string | null;
          active: boolean;
          notification_preferences: { referralUpdates: boolean; cpdInvitations: boolean; clinicNews: boolean };
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string; email: string; role: string };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
        Relationships: [];
      };
      referrals: {
        Row: {
          id: string;
          reference: string;
          practice_id: string;
          created_by_user_id: string;
          patient_first_name: string;
          patient_last_name: string;
          patient_dob: string;
          patient_phone: string;
          patient_email: string | null;
          preferred_contact_method: 'phone' | 'email' | 'either';
          patient_consent: boolean;
          consent_confirmed_at: string | null;
          treatment_type: string;
          referral_reason: string | null;
          presenting_symptoms: string | null;
          unaided_visual_acuity: string | null;
          best_corrected_visual_acuity: string | null;
          journey_status: string;
          outcome: string | null;
          source: 'direct' | 'referral_assistant';
          fee_amount: number;
          fee_status: 'not_eligible' | 'pending' | 'invoiced' | 'paid';
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['referrals']['Row']> & {
          practice_id: string;
          created_by_user_id: string;
          patient_first_name: string;
          patient_last_name: string;
          patient_dob: string;
          patient_phone: string;
          treatment_type: string;
          patient_consent: boolean;
        };
        Update: Partial<Database['public']['Tables']['referrals']['Row']>;
        Relationships: [];
      };
      referral_status_history: {
        Row: {
          id: string;
          referral_id: string;
          from_status: string | null;
          to_status: string;
          outcome: string | null;
          note: string | null;
          changed_by_user_id: string;
          changed_at: string;
        };
        Insert: Partial<Database['public']['Tables']['referral_status_history']['Row']> & {
          referral_id: string;
          to_status: string;
          changed_by_user_id: string;
        };
        Update: Partial<Database['public']['Tables']['referral_status_history']['Row']>;
        Relationships: [];
      };
      referral_documents: {
        Row: {
          id: string;
          referral_id: string;
          storage_path: string;
          file_name: string;
          mime_type: string;
          size_bytes: number;
          uploaded_by_user_id: string;
          uploaded_at: string;
        };
        Insert: Partial<Database['public']['Tables']['referral_documents']['Row']> & {
          referral_id: string;
          storage_path: string;
          file_name: string;
          mime_type: string;
          size_bytes: number;
          uploaded_by_user_id: string;
        };
        Update: Partial<Database['public']['Tables']['referral_documents']['Row']>;
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          priority: 'low' | 'medium' | 'high';
          status: 'open' | 'in_progress' | 'done';
          referral_id: string | null;
          practice_id: string | null;
          assigned_to_user_id: string;
          created_by_user_id: string;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['tasks']['Row']> & {
          title: string;
          assigned_to_user_id: string;
          created_by_user_id: string;
        };
        Update: Partial<Database['public']['Tables']['tasks']['Row']>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          referral_id: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['notifications']['Row']> & {
          user_id: string;
          type: string;
          title: string;
          body: string;
        };
        Update: Partial<Database['public']['Tables']['notifications']['Row']>;
        Relationships: [];
      };
      education_resources: {
        Row: {
          id: string;
          type: string;
          title: string;
          description: string | null;
          url: string;
          cpd_points: number | null;
          event_date: string | null;
          event_location: string | null;
          speakers: string | null;
          published_at: string;
        };
        Insert: Partial<Database['public']['Tables']['education_resources']['Row']> & { type: string; title: string; url: string };
        Update: Partial<Database['public']['Tables']['education_resources']['Row']>;
        Relationships: [];
      };
      education_module_progress: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          knowledge_check_score: number | null;
          knowledge_check_total: number | null;
          completed: boolean;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['education_module_progress']['Row']> & { user_id: string; module_id: string };
        Update: Partial<Database['public']['Tables']['education_module_progress']['Row']>;
        Relationships: [];
      };
      audit_log: {
        Row: {
          id: string;
          actor_user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          practice_id: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['audit_log']['Row']> & {
          action: string;
          entity_type: string;
          entity_id: string;
        };
        Update: Partial<Database['public']['Tables']['audit_log']['Row']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
