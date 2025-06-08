import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// For client-side usage
export const createSupabaseClient = () => {
  return createClientComponentClient()
}

// For server-side usage
export const createSupabaseServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          date_of_birth: string | null
          gender: string | null
          phone: string | null
          address: string | null
          emergency_contact: string | null
          role: 'patient' | 'doctor' | 'admin'
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          gender?: string | null
          phone?: string | null
          address?: string | null
          emergency_contact?: string | null
          role?: 'patient' | 'doctor' | 'admin'
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          gender?: string | null
          phone?: string | null
          address?: string | null
          emergency_contact?: string | null
          role?: 'patient' | 'doctor' | 'admin'
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      conditions: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          symptoms: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          symptoms?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          symptoms?: string[]
          created_at?: string
        }
      }
      treatments: {
        Row: {
          id: string
          name: string
          type: 'medication' | 'therapy' | 'lifestyle' | 'alternative'
          description: string | null
          side_effects: string[]
          contraindications: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'medication' | 'therapy' | 'lifestyle' | 'alternative'
          description?: string | null
          side_effects?: string[]
          contraindications?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'medication' | 'therapy' | 'lifestyle' | 'alternative'
          description?: string | null
          side_effects?: string[]
          contraindications?: string[]
          created_at?: string
        }
      }
      user_treatments: {
        Row: {
          id: string
          user_id: string
          treatment_id: string
          condition_id: string
          start_date: string
          end_date: string | null
          dosage: string | null
          frequency: string | null
          effectiveness_rating: number | null
          side_effects_experienced: string[]
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          treatment_id: string
          condition_id: string
          start_date: string
          end_date?: string | null
          dosage?: string | null
          frequency?: string | null
          effectiveness_rating?: number | null
          side_effects_experienced?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          treatment_id?: string
          condition_id?: string
          start_date?: string
          end_date?: string | null
          dosage?: string | null
          frequency?: string | null
          effectiveness_rating?: number | null
          side_effects_experienced?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      symptoms: {
        Row: {
          id: string
          name: string
          description: string | null
          severity_scale: string
          measurement_unit: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          severity_scale: string
          measurement_unit?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          severity_scale?: string
          measurement_unit?: string | null
          created_at?: string
        }
      }
      user_symptoms: {
        Row: {
          id: string
          user_id: string
          symptom_id: string
          severity: number
          notes: string | null
          triggers: string[]
          duration_minutes: number | null
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          symptom_id: string
          severity: number
          notes?: string | null
          triggers?: string[]
          duration_minutes?: number | null
          logged_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          symptom_id?: string
          severity?: number
          notes?: string | null
          triggers?: string[]
          duration_minutes?: number | null
          logged_at?: string
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string | null
          title: string
          description: string | null
          appointment_date: string
          duration_minutes: number
          status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          location: string | null
          type: 'in_person' | 'video_call' | 'phone_call'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id?: string | null
          title: string
          description?: string | null
          appointment_date: string
          duration_minutes?: number
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          location?: string | null
          type?: 'in_person' | 'video_call' | 'phone_call'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string | null
          title?: string
          description?: string | null
          appointment_date?: string
          duration_minutes?: number
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          location?: string | null
          type?: 'in_person' | 'video_call' | 'phone_call'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      forums: {
        Row: {
          id: string
          name: string
          description: string | null
          condition_id: string | null
          moderator_ids: string[]
          rules: string | null
          is_private: boolean
          member_count: number
          post_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          condition_id?: string | null
          moderator_ids?: string[]
          rules?: string | null
          is_private?: boolean
          member_count?: number
          post_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          condition_id?: string | null
          moderator_ids?: string[]
          rules?: string | null
          is_private?: boolean
          member_count?: number
          post_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          forum_id: string
          author_id: string
          title: string
          content: string
          tags: string[]
          vote_score: number
          view_count: number
          comment_count: number
          is_pinned: boolean
          is_locked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          forum_id: string
          author_id: string
          title: string
          content: string
          tags?: string[]
          vote_score?: number
          view_count?: number
          comment_count?: number
          is_pinned?: boolean
          is_locked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          forum_id?: string
          author_id?: string
          title?: string
          content?: string
          tags?: string[]
          vote_score?: number
          view_count?: number
          comment_count?: number
          is_pinned?: boolean
          is_locked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          content: string
          parent_id: string | null
          vote_score: number
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          content: string
          parent_id?: string | null
          vote_score?: number
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          content?: string
          parent_id?: string | null
          vote_score?: number
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
