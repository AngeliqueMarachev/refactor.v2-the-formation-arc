import { supabase } from "@/integrations/supabase/client";

export type UsageStatName = "reorient_return_count" | "anchors_created" | "anchor_recall_count";

export const ensureUsageStats = async (userId: string) => {
  const { error } = await supabase.from("usage_stats").upsert(
    {
      user_id: userId,
      reorient_return_count: 0,
      anchors_created: 0,
      anchor_recall_count: 0,
      last_active_at: null,
    },
    { onConflict: "user_id", ignoreDuplicates: true },
  );

  if (error) {
    console.error("Failed to ensure usage_stats row", error);
    return false;
  }

  return true;
};

export const incrementUsageStat = async (statName: UsageStatName, userId: string) => {
  await ensureUsageStats(userId);

  const { error } = await supabase.rpc("increment_stat", {
    stat_name: statName,
    user_id_input: userId,
  });

  if (error) {
    console.error(`Failed to increment ${statName}`, error);
    return false;
  }

  return true;
};