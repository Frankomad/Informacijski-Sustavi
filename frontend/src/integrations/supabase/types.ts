export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cryptocurrencies: {
        Row: {
          created_at: string
          current_price: number | null
          id: string
          last_updated: string | null
          name: string
          price_change_24h: number | null
          symbol: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_price?: number | null
          id?: string
          last_updated?: string | null
          name: string
          price_change_24h?: number | null
          symbol: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_price?: number | null
          id?: string
          last_updated?: string | null
          name?: string
          price_change_24h?: number | null
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          created_at: string
          datum_kreiranja: string
          id: string
          naziv: string
          strategija: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          datum_kreiranja?: string
          id?: string
          naziv: string
          strategija?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          datum_kreiranja?: string
          id?: string
          naziv?: string
          strategija?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      risk_types: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          cijena: number
          created_at: string
          cryptocurrency_id: string
          datum: string
          id: string
          kolicina: number
          portfolio_id: string
          risk_type_id: string
          tip_transakcije: string
          updated_at: string
        }
        Insert: {
          cijena: number
          created_at?: string
          cryptocurrency_id: string
          datum?: string
          id?: string
          kolicina: number
          portfolio_id: string
          risk_type_id: string
          tip_transakcije: string
          updated_at?: string
        }
        Update: {
          cijena?: number
          created_at?: string
          cryptocurrency_id?: string
          datum?: string
          id?: string
          kolicina?: number
          portfolio_id?: string
          risk_type_id?: string
          tip_transakcije?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_cryptocurrency_id_fkey"
            columns: ["cryptocurrency_id"]
            isOneToOne: false
            referencedRelation: "cryptocurrencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_performance"
            referencedColumns: ["portfolio_id"]
          },
          {
            foreignKeyName: "transactions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_risk_type_id_fkey"
            columns: ["risk_type_id"]
            isOneToOne: false
            referencedRelation: "risk_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      portfolio_performance: {
        Row: {
          current_value: number | null
          portfolio_id: string | null
          portfolio_name: string | null
          profit_loss: number | null
          strategija: string | null
          total_holdings: number | null
          total_invested: number | null
          total_transactions: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      update_crypto_price: {
        Args: { crypto_symbol: string; new_price: number; price_change: number }
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
