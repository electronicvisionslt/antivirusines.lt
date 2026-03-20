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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      article_categories: {
        Row: {
          article_id: string
          category_id: string
        }
        Insert: {
          article_id: string
          category_id: string
        }
        Update: {
          article_id?: string
          category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_categories_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      article_products: {
        Row: {
          article_id: string
          product_id: string
        }
        Insert: {
          article_id: string
          product_id: string
        }
        Update: {
          article_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_products_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          article_type: string | null
          author_id: string | null
          body: string | null
          canonical_url: string | null
          category_id: string | null
          cons: string[] | null
          created_at: string
          excerpt: string | null
          faq: Json | null
          featured_image: string | null
          featured_image_alt: string | null
          id: string
          last_reviewed_at: string | null
          meta_description: string | null
          noindex: boolean | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          path: string
          pros: string[] | null
          published_at: string | null
          read_time: string | null
          related_article_ids: string[] | null
          sections: Json | null
          seo_title: string | null
          show_toc: boolean | null
          slug: string
          status: Database["public"]["Enums"]["article_status"]
          title: string
          updated_at: string
          verdict: string | null
        }
        Insert: {
          article_type?: string | null
          author_id?: string | null
          body?: string | null
          canonical_url?: string | null
          category_id?: string | null
          cons?: string[] | null
          created_at?: string
          excerpt?: string | null
          faq?: Json | null
          featured_image?: string | null
          featured_image_alt?: string | null
          id?: string
          last_reviewed_at?: string | null
          meta_description?: string | null
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          path: string
          pros?: string[] | null
          published_at?: string | null
          read_time?: string | null
          related_article_ids?: string[] | null
          sections?: Json | null
          seo_title?: string | null
          show_toc?: boolean | null
          slug: string
          status?: Database["public"]["Enums"]["article_status"]
          title: string
          updated_at?: string
          verdict?: string | null
        }
        Update: {
          article_type?: string | null
          author_id?: string | null
          body?: string | null
          canonical_url?: string | null
          category_id?: string | null
          cons?: string[] | null
          created_at?: string
          excerpt?: string | null
          faq?: Json | null
          featured_image?: string | null
          featured_image_alt?: string | null
          id?: string
          last_reviewed_at?: string | null
          meta_description?: string | null
          noindex?: boolean | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          path?: string
          pros?: string[] | null
          published_at?: string | null
          read_time?: string | null
          related_article_ids?: string[] | null
          sections?: Json | null
          seo_title?: string | null
          show_toc?: boolean | null
          slug?: string
          status?: Database["public"]["Enums"]["article_status"]
          title?: string
          updated_at?: string
          verdict?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          expertise: string[] | null
          id: string
          initials: string | null
          meta_description: string | null
          name: string
          seo_title: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          expertise?: string[] | null
          id?: string
          initials?: string | null
          meta_description?: string | null
          name: string
          seo_title?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          expertise?: string[] | null
          id?: string
          initials?: string | null
          meta_description?: string | null
          name?: string
          seo_title?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          canonical_url: string | null
          created_at: string
          description: string | null
          faq: Json | null
          id: string
          meta_description: string | null
          name: string
          parent_id: string | null
          path: string
          seo_title: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          description?: string | null
          faq?: Json | null
          id?: string
          meta_description?: string | null
          name: string
          parent_id?: string | null
          path: string
          seo_title?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          description?: string | null
          faq?: Json | null
          id?: string
          meta_description?: string | null
          name?: string
          parent_id?: string | null
          path?: string
          seo_title?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          affiliate_disclosure: string | null
          affiliate_url: string | null
          best_for: string | null
          brand: string | null
          canonical_url: string | null
          cons: string[] | null
          created_at: string
          features: Json | null
          free_version: boolean | null
          hero_image_url: string | null
          id: string
          logo_url: string | null
          long_description: string | null
          meta_description: string | null
          name: string
          pricing_summary: string | null
          pros: string[] | null
          rating: number | null
          seo_title: string | null
          short_description: string | null
          slug: string
          supported_platforms: string[] | null
          trial_available: boolean | null
          updated_at: string
          verdict: string | null
        }
        Insert: {
          affiliate_disclosure?: string | null
          affiliate_url?: string | null
          best_for?: string | null
          brand?: string | null
          canonical_url?: string | null
          cons?: string[] | null
          created_at?: string
          features?: Json | null
          free_version?: boolean | null
          hero_image_url?: string | null
          id?: string
          logo_url?: string | null
          long_description?: string | null
          meta_description?: string | null
          name: string
          pricing_summary?: string | null
          pros?: string[] | null
          rating?: number | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          supported_platforms?: string[] | null
          trial_available?: boolean | null
          updated_at?: string
          verdict?: string | null
        }
        Update: {
          affiliate_disclosure?: string | null
          affiliate_url?: string | null
          best_for?: string | null
          brand?: string | null
          canonical_url?: string | null
          cons?: string[] | null
          created_at?: string
          features?: Json | null
          free_version?: boolean | null
          hero_image_url?: string | null
          id?: string
          logo_url?: string | null
          long_description?: string | null
          meta_description?: string | null
          name?: string
          pricing_summary?: string | null
          pros?: string[] | null
          rating?: number | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          supported_platforms?: string[] | null
          trial_available?: boolean | null
          updated_at?: string
          verdict?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
      article_status: "draft" | "published" | "archived"
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
  public: {
    Enums: {
      app_role: ["admin", "editor"],
      article_status: ["draft", "published", "archived"],
    },
  },
} as const
