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
          routine_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_free?: boolean
          plan_id?: string | null
          routine_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_free?: boolean
          plan_id?: string | null
          routine_id?: string | null
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
          {
            foreignKeyName: "calendar_days_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          equipment: Database["public"]["Enums"]["exercise_equipment"]
          id: string
          muscle_group: Database["public"]["Enums"]["exercise_muscle_group"]
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          equipment: Database["public"]["Enums"]["exercise_equipment"]
          id?: string
          muscle_group: Database["public"]["Enums"]["exercise_muscle_group"]
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          equipment?: Database["public"]["Enums"]["exercise_equipment"]
          id?: string
          muscle_group?: Database["public"]["Enums"]["exercise_muscle_group"]
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          source_reference_food_id: string | null
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
          source_reference_food_id?: string | null
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
          source_reference_food_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "foods_source_reference_food_id_fkey"
            columns: ["source_reference_food_id"]
            isOneToOne: false
            referencedRelation: "reference_foods"
            referencedColumns: ["id"]
          },
        ]
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
      nutrients: {
        Row: {
          created_at: string
          id: string
          name: string
          name_es: string | null
          rank: number | null
          unit: string
          usda_nutrient_id: number | null
          usda_nutrient_nbr: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_es?: string | null
          rank?: number | null
          unit: string
          usda_nutrient_id?: number | null
          usda_nutrient_nbr: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_es?: string | null
          rank?: number | null
          unit?: string
          usda_nutrient_id?: number | null
          usda_nutrient_nbr?: string
        }
        Relationships: []
      }
      plan_item_completions: {
        Row: {
          calendar_day_id: string
          created_at: string
          id: string
          plan_item_id: string
        }
        Insert: {
          calendar_day_id: string
          created_at?: string
          id?: string
          plan_item_id: string
        }
        Update: {
          calendar_day_id?: string
          created_at?: string
          id?: string
          plan_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_item_completions_calendar_day_id_fkey"
            columns: ["calendar_day_id"]
            isOneToOne: false
            referencedRelation: "calendar_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_item_completions_plan_item_id_fkey"
            columns: ["plan_item_id"]
            isOneToOne: false
            referencedRelation: "plan_items"
            referencedColumns: ["id"]
          },
        ]
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
      reference_food_nutrients: {
        Row: {
          amount: number
          created_at: string
          derivation_code: string | null
          flag_reason: string | null
          id: string
          is_flagged: boolean
          nutrient_id: string
          reference_basis: string
          reference_food_id: string
          source: Database["public"]["Enums"]["food_source"]
          source_food_id: string
          unit: string
        }
        Insert: {
          amount: number
          created_at?: string
          derivation_code?: string | null
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean
          nutrient_id: string
          reference_basis?: string
          reference_food_id: string
          source: Database["public"]["Enums"]["food_source"]
          source_food_id: string
          unit: string
        }
        Update: {
          amount?: number
          created_at?: string
          derivation_code?: string | null
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean
          nutrient_id?: string
          reference_basis?: string
          reference_food_id?: string
          source?: Database["public"]["Enums"]["food_source"]
          source_food_id?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "reference_food_nutrients_nutrient_id_fkey"
            columns: ["nutrient_id"]
            isOneToOne: false
            referencedRelation: "nutrients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reference_food_nutrients_reference_food_id_fkey"
            columns: ["reference_food_id"]
            isOneToOne: false
            referencedRelation: "reference_foods"
            referencedColumns: ["id"]
          },
        ]
      }
      reference_foods: {
        Row: {
          category: Database["public"]["Enums"]["food_category"]
          created_at: string
          ean_barcode: string | null
          flag_reason: string | null
          id: string
          imported_at: string
          is_flagged: boolean
          name_es: string | null
          name_original: string
          serving_type: Database["public"]["Enums"]["food_serving_type"]
          source: Database["public"]["Enums"]["food_source"]
          source_dataset: string | null
          source_dataset_version: string | null
          source_id: string
          updated_at: string
          usda_food_category_raw: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["food_category"]
          created_at?: string
          ean_barcode?: string | null
          flag_reason?: string | null
          id?: string
          imported_at?: string
          is_flagged?: boolean
          name_es?: string | null
          name_original: string
          serving_type?: Database["public"]["Enums"]["food_serving_type"]
          source: Database["public"]["Enums"]["food_source"]
          source_dataset?: string | null
          source_dataset_version?: string | null
          source_id: string
          updated_at?: string
          usda_food_category_raw?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["food_category"]
          created_at?: string
          ean_barcode?: string | null
          flag_reason?: string | null
          id?: string
          imported_at?: string
          is_flagged?: boolean
          name_es?: string | null
          name_original?: string
          serving_type?: Database["public"]["Enums"]["food_serving_type"]
          source?: Database["public"]["Enums"]["food_source"]
          source_dataset?: string | null
          source_dataset_version?: string | null
          source_id?: string
          updated_at?: string
          usda_food_category_raw?: string | null
        }
        Relationships: []
      }
      routine_exercise_completions: {
        Row: {
          calendar_day_id: string
          created_at: string
          id: string
          routine_exercise_id: string
        }
        Insert: {
          calendar_day_id: string
          created_at?: string
          id?: string
          routine_exercise_id: string
        }
        Update: {
          calendar_day_id?: string
          created_at?: string
          id?: string
          routine_exercise_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_exercise_completions_calendar_day_id_fkey"
            columns: ["calendar_day_id"]
            isOneToOne: false
            referencedRelation: "calendar_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_exercise_completions_routine_exercise_id_fkey"
            columns: ["routine_exercise_id"]
            isOneToOne: false
            referencedRelation: "routine_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_exercises: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          reps: number
          routine_id: string
          sets: number
          sort_order: number
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          reps: number
          routine_id: string
          sets: number
          sort_order?: number
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          reps?: number
          routine_id?: string
          sets?: number
          sort_order?: number
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "routine_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_exercises_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
      routines: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
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
      exercise_equipment:
        | "bodyweight"
        | "free_weights"
        | "machine"
        | "bands"
        | "cardio_machine"
        | "other"
      exercise_muscle_group:
        | "chest"
        | "back"
        | "shoulders"
        | "arms"
        | "legs"
        | "core"
        | "cardio"
        | "full_body"
        | "other"
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
        | "dairy"
        | "legumes"
        | "tubers"
        | "oils_fats"
      food_serving_type: "per_100g" | "per_unit"
      food_source: "usda_foundation_foods" | "usda_sr_legacy" | "mercadona"
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
      exercise_equipment: [
        "bodyweight",
        "free_weights",
        "machine",
        "bands",
        "cardio_machine",
        "other",
      ],
      exercise_muscle_group: [
        "chest",
        "back",
        "shoulders",
        "arms",
        "legs",
        "core",
        "cardio",
        "full_body",
        "other",
      ],
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
        "dairy",
        "legumes",
        "tubers",
        "oils_fats",
      ],
      food_serving_type: ["per_100g", "per_unit"],
      food_source: ["usda_foundation_foods", "usda_sr_legacy", "mercadona"],
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
