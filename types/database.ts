/**
 * Typed Supabase schema.
 *
 * This mirrors the SQL migrations in `/supabase/migrations`. In a connected
 * environment it can be regenerated with:
 *   `supabase gen types typescript --linked > types/database.ts`
 *
 * Monetary columns (`amount_zar`, `price_zar`) are stored as INTEGER cents to
 * avoid floating point errors, as required by the project conventions.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'student' | 'tutor';
export type EnglishLevel = 'beginner' | 'intermediate' | 'advanced';
export type SessionDuration = 30 | 60 | 90;
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';
export type InvoiceStatus = 'draft' | 'sent' | 'paid';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: UserRole;
          language_preference: string;
          english_level: EnglishLevel | null;
          consent_given: boolean;
          consent_at: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role?: UserRole;
          language_preference?: string;
          english_level?: EnglishLevel | null;
          consent_given?: boolean;
          consent_at?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: UserRole;
          language_preference?: string;
          english_level?: EnglishLevel | null;
          consent_given?: boolean;
          consent_at?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      availability: {
        Row: {
          id: string;
          date: string;
          start_time: string;
          end_time: string;
          is_blocked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          start_time: string;
          end_time: string;
          is_blocked?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          is_blocked?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          student_id: string;
          availability_id: string | null;
          session_length_minutes: SessionDuration;
          pricing_tier: EnglishLevel;
          status: BookingStatus;
          video_link: string | null;
          cancellation_reason: string | null;
          cancelled_by: string | null;
          cancelled_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          availability_id?: string | null;
          session_length_minutes: SessionDuration;
          pricing_tier: EnglishLevel;
          status?: BookingStatus;
          video_link?: string | null;
          cancellation_reason?: string | null;
          cancelled_by?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          availability_id?: string | null;
          session_length_minutes?: SessionDuration;
          pricing_tier?: EnglishLevel;
          status?: BookingStatus;
          video_link?: string | null;
          cancellation_reason?: string | null;
          cancelled_by?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bookings_student_id_fkey';
            columns: ['student_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_availability_id_fkey';
            columns: ['availability_id'];
            referencedRelation: 'availability';
            referencedColumns: ['id'];
          },
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          student_id: string;
          plan_name: string;
          sessions_per_month: number | null;
          status: SubscriptionStatus;
          start_date: string;
          end_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          plan_name: string;
          sessions_per_month?: number | null;
          status?: SubscriptionStatus;
          start_date: string;
          end_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          plan_name?: string;
          sessions_per_month?: number | null;
          status?: SubscriptionStatus;
          start_date?: string;
          end_date?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_student_id_fkey';
            columns: ['student_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      invoices: {
        Row: {
          id: string;
          student_id: string;
          booking_id: string | null;
          amount_zar: number;
          status: InvoiceStatus;
          pdf_url: string | null;
          issued_at: string | null;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          booking_id?: string | null;
          amount_zar: number;
          status?: InvoiceStatus;
          pdf_url?: string | null;
          issued_at?: string | null;
          due_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          booking_id?: string | null;
          amount_zar?: number;
          status?: InvoiceStatus;
          pdf_url?: string | null;
          issued_at?: string | null;
          due_date?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'invoices_student_id_fkey';
            columns: ['student_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invoices_booking_id_fkey';
            columns: ['booking_id'];
            referencedRelation: 'bookings';
            referencedColumns: ['id'];
          },
        ];
      };
      session_feedback: {
        Row: {
          id: string;
          booking_id: string;
          author_id: string;
          recipient_id: string;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          author_id: string;
          recipient_id: string;
          message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          author_id?: string;
          recipient_id?: string;
          message?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'session_feedback_booking_id_fkey';
            columns: ['booking_id'];
            referencedRelation: 'bookings';
            referencedColumns: ['id'];
          },
        ];
      };
      progress_notes: {
        Row: {
          id: string;
          student_id: string;
          tutor_id: string;
          note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          tutor_id: string;
          note: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          tutor_id?: string;
          note?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'progress_notes_student_id_fkey';
            columns: ['student_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      files: {
        Row: {
          id: string;
          uploader_id: string;
          recipient_id: string;
          booking_id: string | null;
          file_name: string;
          file_url: string;
          file_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          uploader_id: string;
          recipient_id: string;
          booking_id?: string | null;
          file_name: string;
          file_url: string;
          file_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          uploader_id?: string;
          recipient_id?: string;
          booking_id?: string | null;
          file_name?: string;
          file_url?: string;
          file_type?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'files_booking_id_fkey';
            columns: ['booking_id'];
            referencedRelation: 'bookings';
            referencedColumns: ['id'];
          },
        ];
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      pricing_config: {
        Row: {
          id: string;
          level: EnglishLevel;
          duration_minutes: SessionDuration;
          price_zar: number;
        };
        Insert: {
          id?: string;
          level: EnglishLevel;
          duration_minutes: SessionDuration;
          price_zar?: number;
        };
        Update: {
          id?: string;
          level?: EnglishLevel;
          duration_minutes?: SessionDuration;
          price_zar?: number;
        };
        Relationships: [];
      };
      app_settings: {
        Row: {
          id: number;
          subscriber_discount_pct: number;
          default_sessions_per_month: number | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          subscriber_discount_pct?: number;
          default_sessions_per_month?: number | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          subscriber_discount_pct?: number;
          default_sessions_per_month?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      user_role: UserRole;
      english_level: EnglishLevel;
      booking_status: BookingStatus;
      subscription_status: SubscriptionStatus;
      invoice_status: InvoiceStatus;
    };
    CompositeTypes: Record<never, never>;
  };
}

/** Convenience helpers for extracting row types. */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
