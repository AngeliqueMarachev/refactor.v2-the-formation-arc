

## Plan: Track Formation Behaviors with Atomic Increments

### Task 1 — Database migration

Add column and create RPC function:

```sql
-- New column
ALTER TABLE public.usage_stats
  ADD COLUMN anchor_recall_count integer NOT NULL DEFAULT 0;

-- Atomic increment with allow-list validation
CREATE OR REPLACE FUNCTION public.increment_stat(stat_name text, user_id_input uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF stat_name NOT IN ('reorient_return_count', 'anchors_created', 'anchor_recall_count') THEN
    RAISE EXCEPTION 'Invalid stat name: %', stat_name;
  END IF;

  EXECUTE format(
    'UPDATE public.usage_stats SET %I = %I + 1 WHERE user_id = $1',
    stat_name, stat_name
  ) USING user_id_input;
END;
$$;
```

### Task 2 — Increment logic

| File | Where | Call |
|---|---|---|
| `src/pages/DailyFormation.tsx` | After successful `anchor_entries.insert()` in `handleSaveAnchor` (new anchors only) | `supabase.rpc('increment_stat', { stat_name: 'anchors_created', user_id_input: user.id })` |
| `src/pages/Anchors.tsx` | In `handleRecallDone`, after `session_count` update | `supabase.rpc('increment_stat', { stat_name: 'anchor_recall_count', user_id_input: user.id })` |
| `src/pages/Activated.tsx` | Replace existing read-then-write with same RPC pattern | `supabase.rpc('increment_stat', { stat_name: 'reorient_return_count', user_id_input: user.id })` |

### Task 3 — Progress card UI (`src/pages/Index.tsx`)

- Add `anchor_recall_count` to the fetched fields (query already selects `*`).
- Display 3 horizontal metrics: **Reorientations**, **Anchors**, **Recalls** — same circle-indicator style, adjusted gap.

### Files changed

| File | Change |
|---|---|
| Migration (new) | Add column + `increment_stat` RPC with allow-list |
| `src/pages/DailyFormation.tsx` | Increment `anchors_created` after insert |
| `src/pages/Anchors.tsx` | Increment `anchor_recall_count` in `handleRecallDone` |
| `src/pages/Activated.tsx` | Migrate to atomic RPC |
| `src/pages/Index.tsx` | Show 3 metrics |

