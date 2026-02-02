export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
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
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
