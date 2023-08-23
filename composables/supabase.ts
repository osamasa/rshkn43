export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      game_record: {
        Row: {
          created_at: string | null
          game_id: number
          game_no: number
          id: number
          modified_at: string
          player_1: number | null
          player_2: number | null
          player_3: number | null
          player_4: number | null
          score_1: number
          score_2: number
        }
        Insert: {
          created_at?: string | null
          game_id: number
          game_no: number
          id?: number
          modified_at?: string
          player_1?: number | null
          player_2?: number | null
          player_3?: number | null
          player_4?: number | null
          score_1?: number
          score_2?: number
        }
        Update: {
          created_at?: string | null
          game_id?: number
          game_no?: number
          id?: number
          modified_at?: string
          player_1?: number | null
          player_2?: number | null
          player_3?: number | null
          player_4?: number | null
          score_1?: number
          score_2?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_record_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          }
        ]
      }
      game_user: {
        Row: {
          created_at: string | null
          game_id: number
          id: number
          modified_at: string
          player_name: string | null
          player_no: number
        }
        Insert: {
          created_at?: string | null
          game_id: number
          id?: number
          modified_at?: string
          player_name?: string | null
          player_no: number
        }
        Update: {
          created_at?: string | null
          game_id?: number
          id?: number
          modified_at?: string
          player_name?: string | null
          player_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_user_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          }
        ]
      }
      games: {
        Row: {
          coat_num: number
          created_at: string | null
          dobules_flg: boolean
          id: number
          modified_at: string | null
          player_num: number
        }
        Insert: {
          coat_num?: number
          created_at?: string | null
          dobules_flg?: boolean
          id?: number
          modified_at?: string | null
          player_num?: number
        }
        Update: {
          coat_num?: number
          created_at?: string | null
          dobules_flg?: boolean
          id?: number
          modified_at?: string | null
          player_num?: number
        }
        Relationships: []
      }
      random_number_table: {
        Row: {
          created_at: string | null
          id: number
          no: number | null
          p1: number
          p2: number
          person_num: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          no?: number | null
          p1: number
          p2: number
          person_num?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          no?: number | null
          p1?: number
          p2?: number
          person_num?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          id: number
          login_type: number
          loginid: string | null
          modified_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          login_type?: number
          loginid?: string | null
          modified_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          login_type?: number
          loginid?: string | null
          modified_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hello_world: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      makenewgame: {
        Args: {
          _userid: number
          _person_num: number
          _coat_num: number
          _dobules_flg: boolean
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
