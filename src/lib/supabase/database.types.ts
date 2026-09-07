// Auto-generated from the Supabase schema via the Supabase MCP `generate_typescript_types` tool.
// Regenerate after every migration instead of hand-editing.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      calendar_days: {
        Row: {
          created_at: string
          date: string
          id: string
          is_free: boolean
          plan_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_free?: boolean
          plan_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_free?: boolean
          plan_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          caffeine_mg: number | null
          calcium_mg: number | null
          carbs_g: number
          category: Database["public"]["Enums"]["food_category"]
          cholesterol_mg: number | null
          created_at: string
          energy_kcal: number
          fat_g: number
          fiber_g: number | null
          id: string
          iron_mg: number | null
          magnesium_mg: number | null
          monounsaturated_fat_g: number | null
          name: string
          omega3_g: number | null
          phosphorus_mg: number | null
          polyunsaturated_fat_g: number | null
          potassium_mg: number | null
          protein_g: number
          salt_g: number | null
          saturated_fat_g: number | null
          serving_type: Database["public"]["Enums"]["food_serving_type"]
          sodium_mg: number | null
          sugar_g: number | null
          updated_at: string
          user_id: string
          vitamin_a_mcg: number | null
          vitamin_b1_mg: number | null
          vitamin_b12_mcg: number | null
          vitamin_b2_mg: number | null
          vitamin_b3_mg: number | null
          vitamin_b5_mg: number | null
          vitamin_b6_mg: number | null
          vitamin_b7_mcg: number | null
          vitamin_b8_mcg: number | null
          vitamin_c_mg: number | null
          vitamin_d_mcg: number | null
          vitamin_e_mcg: number | null
          vitamin_k_mcg: number | null
          zinc_mg: number | null
        }
        Insert: {
          caffeine_mg?: number | null
          calcium_mg?: number | null
          carbs_g: number
          category: Database["public"]["Enums"]["food_category"]
          cholesterol_mg?: number | null
          created_at?: string
          energy_kcal: number
          fat_g: number
          fiber_g?: number | null
          id?: string
          iron_mg?: number | null
          magnesium_mg?: number | null
          monounsaturated_fat_g?: number | null
          name: string
          omega3_g?: number | null
          phosphorus_mg?: number | null
          polyunsaturated_fat_g?: number | null
          potassium_mg?: number | null
          protein_g: number
          salt_g?: number | null
          saturated_fat_g?: number | null
          serving_type: Database["public"]["Enums"]["food_serving_type"]
          sodium_mg?: number | null
          sugar_g?: number | null
          updated_at?: string
          user_id: string
          vitamin_a_mcg?: number | null
          vitamin_b1_mg?: number | null
          vitamin_b12_mcg?: number | null
          vitamin_b2_mg?: number | null
          vitamin_b3_mg?: number | null
          vitamin_b5_mg?: number | null
          vitamin_b6_mg?: number | null
          vitamin_b7_mcg?: number | null
          vitamin_b8_mcg?: number | null
          vitamin_c_mg?: number | null
          vitamin_d_mcg?: number | null
          vitamin_e_mcg?: number | null
          vitamin_k_mcg?: number | null
          zinc_mg?: number | null
        }
        Update: {
          caffeine_mg?: number | null
          calcium_mg?: number | null
          carbs_g?: number
          category?: Database["public"]["Enums"]["food_category"]
          cholesterol_mg?: number | null
          created_at?: string
          energy_kcal?: number
          fat_g?: number
          fiber_g?: number | null
          id?: string
          iron_mg?: number | null
          magnesium_mg?: number | null
          monounsaturated_fat_g?: number | null
          name?: string
          omega3_g?: number | null
          phosphorus_mg?: number | null
          polyunsaturated_fat_g?: number | null
          potassium_mg?: number | null
          protein_g?: number
          salt_g?: number | null
          saturated_fat_g?: number | null
          serving_type?: Database["public"]["Enums"]["food_serving_type"]
          sodium_mg?: number | null
          sugar_g?: number | null
          updated_at?: string
          user_id?: string
          vitamin_a_mcg?: number | null
          vitamin_b1_mg?: number | null
          vitamin_b12_mcg?: number | null
          vitamin_b2_mg?: number | null
          vitamin_b3_mg?: number | null
          vitamin_b5_mg?: number | null
          vitamin_b6_mg?: number | null
          vitamin_b7_mcg?: number | null
          vitamin_b8_mcg?: number | null
          vitamin_c_mg?: number | null
          vitamin_d_mcg?: number | null
          vitamin_e_mcg?: number | null
          vitamin_k_mcg?: number | null
          zinc_mg?: number | null
        }
        Relationships: []
      }
      meal_items: {
        Row: {
          created_at: string
          food_id: string
          id: string
          is_variable: boolean
          meal_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          food_id: string
          id?: string
          is_variable?: boolean
          meal_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          food_id?: string
          id?: string
          is_variable?: boolean
          meal_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "meal_items_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          category: Database["public"]["Enums"]["meal_category"]
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["meal_category"]
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["meal_category"]
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plan_item_foods: {
        Row: {
          created_at: string
          food_id: string
          id: string
          is_variable: boolean
          plan_item_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          food_id: string
          id?: string
          is_variable: boolean
          plan_item_id: string
          quantity: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          food_id?: string
          id?: string
          is_variable?: boolean
          plan_item_id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_item_foods_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_item_foods_plan_item_id_fkey"
            columns: ["plan_item_id"]
            isOneToOne: false
            referencedRelation: "plan_items"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_items: {
        Row: {
          created_at: string
          id: string
          meal_id: string
          plan_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          meal_id: string
          plan_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          meal_id?: string
          plan_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_items_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          calories_target: number | null
          carbs_g_target: number | null
          created_at: string
          fat_g_target: number | null
          id: string
          is_special: boolean
          name: string
          protein_g_target: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calories_target?: number | null
          carbs_g_target?: number | null
          created_at?: string
          fat_g_target?: number | null
          id?: string
          is_special?: boolean
          name: string
          protein_g_target?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calories_target?: number | null
          carbs_g_target?: number | null
          created_at?: string
          fat_g_target?: number | null
          id?: string
          is_special?: boolean
          name?: string
          protein_g_target?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          bmi: number | null
          body_fat_pct: number | null
          calories_target: number | null
          carbs_g_target: number | null
          created_at: string
          extended: Json
          fat_g_target: number | null
          goal: Database["public"]["Enums"]["goal_type"] | null
          height_cm: number | null
          id: string
          macros_auto_calculated: boolean
          onboarding_completed: boolean
          pace_kg_per_week: number | null
          protein_g_target: number | null
          sex: Database["public"]["Enums"]["sex_type"] | null
          target_weight_kg: number | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          age?: number | null
          bmi?: number | null
          body_fat_pct?: number | null
          calories_target?: number | null
          carbs_g_target?: number | null
          created_at?: string
          extended?: Json
          fat_g_target?: number | null
          goal?: Database["public"]["Enums"]["goal_type"] | null
          height_cm?: number | null
          id: string
          macros_auto_calculated?: boolean
          onboarding_completed?: boolean
          pace_kg_per_week?: number | null
          protein_g_target?: number | null
          sex?: Database["public"]["Enums"]["sex_type"] | null
          target_weight_kg?: number | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          age?: number | null
          bmi?: number | null
          body_fat_pct?: number | null
          calories_target?: number | null
          carbs_g_target?: number | null
          created_at?: string
          extended?: Json
          fat_g_target?: number | null
          goal?: Database["public"]["Enums"]["goal_type"] | null
          height_cm?: number | null
          id?: string
          macros_auto_calculated?: boolean
          onboarding_completed?: boolean
          pace_kg_per_week?: number | null
          protein_g_target?: number | null
          sex?: Database["public"]["Enums"]["sex_type"] | null
          target_weight_kg?: number | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      food_category:
        | "fruit"
        | "vegetable"
        | "fish"
        | "meat"
        | "grains_pasta"
        | "nuts"
        | "sweets"
        | "beverages"
        | "supplements"
        | "other"
      food_serving_type: "per_100g" | "per_unit"
      goal_type: "lose" | "maintain" | "gain"
      meal_category:
        | "main"
        | "breakfast"
        | "pre_workout"
        | "post_workout"
        | "snack"
      sex_type: "male" | "female"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      food_category: [
        "fruit",
        "vegetable",
        "fish",
        "meat",
        "grains_pasta",
        "nuts",
        "sweets",
        "beverages",
        "supplements",
        "other",
      ],
      food_serving_type: ["per_100g", "per_unit"],
      goal_type: ["lose", "maintain", "gain"],
      meal_category: [
        "main",
        "breakfast",
        "pre_workout",
        "post_workout",
        "snack",
      ],
      sex_type: ["male", "female"],
    },
  },
} as const
