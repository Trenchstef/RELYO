export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      artisan_profiles: {
        Row: {
          id: string
          company_name: string | null
          logo_url: string | null
          google_place_id: string | null
          google_place_label: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          company_name?: string | null
          logo_url?: string | null
          google_place_id?: string | null
          google_place_label?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_name?: string | null
          logo_url?: string | null
          google_place_id?: string | null
          google_place_label?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          created_at: string
          artisan_id: string | null
          client_name: string | null
          client_phone: string | null
          token: string | null
          rating: number | null
          comment: string | null
          status: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          artisan_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          token?: string | null
          rating?: number | null
          comment?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          artisan_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          token?: string | null
          rating?: number | null
          comment?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
