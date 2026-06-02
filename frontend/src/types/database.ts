export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      carts: {
        Row: {
          created_at: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      carts_products: {
        Row: {
          cart_id: string
          category: string | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          price: number
          product_id: number
          quantity: number
          title: string | null
        }
        Insert: {
          cart_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          price: number
          product_id: number
          quantity: number
          title?: string | null
        }
        Update: {
          cart_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          price?: number
          product_id?: number
          quantity?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_products_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carts_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          cart_id: string
          created_at: string
          delivery_carrier: string
          delivery_date: string
          delivery_price: number
          delivery_status: Database["public"]["Enums"]["delivery_status"] | null
          id: string
          payment_ID: string | null
          payment_method: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          products_price: number
          stripe_event_id: string | null
          total_price: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cart_id?: string
          created_at?: string
          delivery_carrier: string
          delivery_date: string
          delivery_price: number
          delivery_status?:
            | Database["public"]["Enums"]["delivery_status"]
            | null
          id?: string
          payment_ID?: string | null
          payment_method: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          products_price: number
          stripe_event_id?: string | null
          total_price: number
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          cart_id?: string
          created_at?: string
          delivery_carrier?: string
          delivery_date?: string
          delivery_price?: number
          delivery_status?:
            | Database["public"]["Enums"]["delivery_status"]
            | null
          id?: string
          payment_ID?: string | null
          payment_method?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          products_price?: number
          stripe_event_id?: string | null
          total_price?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: true
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_stock: {
        Row: {
          id: number
          product_id: number
          quantity: number | null
          updated_at: string
        }
        Insert: {
          id?: number
          product_id: number
          quantity?: number | null
          updated_at?: string
        }
        Update: {
          id?: number
          product_id?: number
          quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_stock_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          archived: boolean
          category: Database["public"]["Enums"]["categories"]
          description: string | null
          id: number
          image: string | null
          price: number
          title: string
        }
        Insert: {
          archived?: boolean
          category: Database["public"]["Enums"]["categories"]
          description?: string | null
          id?: number
          image?: string | null
          price: number
          title: string
        }
        Update: {
          archived?: boolean
          category?: Database["public"]["Enums"]["categories"]
          description?: string | null
          id?: number
          image?: string | null
          price?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "product_stock"
            referencedColumns: ["product_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_products_categories: { Args: never; Returns: Json }
    }
    Enums: {
      cart_status: "active" | "abandoned" | "converted"
      categories:
        | "electronics"
        | "jewelery"
        | "mens clothing"
        | "womens clothing"
      delivery_status:
        | "processing"
        | "shipped"
        | "in_delivery"
        | "delivered"
        | "returned"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      cart_status: ["active", "abandoned", "converted"],
      categories: [
        "electronics",
        "jewelery",
        "mens clothing",
        "womens clothing",
      ],
      delivery_status: [
        "processing",
        "shipped",
        "in_delivery",
        "delivered",
        "returned",
      ],
      payment_status: ["pending", "paid", "failed", "refunded"],
      user_role: ["user", "admin"],
    },
  },
} as const

