import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client with proper typing
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("communities")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Supabase connection error:", error);
      return { connected: false, error: error.message };
    }

    console.log("✅ Successfully connected to Supabase database");
    return { connected: true, data };
  } catch (err) {
    console.error("Connection test failed:", err);
    return {
      connected: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

// Helper functions for database operations
export const dbHelpers = {
  // Get all communities with member counts
  getCommunities: async () => {
    const { data, error } = await supabase
      .from("communities")
      .select("*")
      .order("created_at", { ascending: false });

    return { data, error };
  },

  // Get topics with filters
  getTopics: async (filters?: {
    featured?: boolean;
    isNew?: boolean;
    communityId?: string;
  }) => {
    let query = supabase
      .from("topics")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.featured !== undefined) {
      query = query.eq("is_featured", filters.featured);
    }
    if (filters?.isNew !== undefined) {
      query = query.eq("is_new", filters.isNew);
    }
    if (filters?.communityId) {
      query = query.eq("community_id", filters.communityId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Get user's community memberships
  getUserCommunities: async (userId: string) => {
    const { data, error } = await supabase
      .from("community_memberships")
      .select(
        `
        *,
        communities (*)
      `,
      )
      .eq("user_id", userId);

    return { data, error };
  },

  // Create a new topic
  createTopic: async (topic: {
    title: string;
    content: string;
    author_id: string;
    author_name: string;
    author_avatar?: string;
    community: string;
    sub_community: string;
    community_id: string;
  }) => {
    const { data, error } = await supabase
      .from("topics")
      .insert([topic])
      .select();

    return { data, error };
  },

  // Join a community
  joinCommunity: async (
    userId: string,
    communityId: string,
    subscriptionType: "free" | "paid" | "introductory" = "free",
  ) => {
    const { data, error } = await supabase
      .from("community_memberships")
      .insert([
        {
          user_id: userId,
          community_id: communityId,
          subscription_type: subscriptionType,
        },
      ])
      .select();

    return { data, error };
  },
};
