/**
 * Sanitize a user-provided string before storing in the database.
 * - Trims whitespace
 * - Strips control characters (keeps newlines/tabs for multiline fields)
 * - Enforces a max length
 * - Returns null for empty strings when nullable is true
 */
export function sanitizeText(
  value: string | null | undefined,
  options: { maxLength?: number; nullable?: boolean; multiline?: boolean } = {}
): string | null {
  const { maxLength = 2000, nullable = true, multiline = false } = options;

  if (value == null) return nullable ? null : "";

  // Strip control chars except newline (\n) and tab (\t) when multiline
  let cleaned = multiline
    ? value.replace(/[^\P{C}\n\t]/gu, "")
    : value.replace(/\p{C}/gu, "");

  cleaned = cleaned.trim();

  if (cleaned.length === 0) return nullable ? null : "";

  // Enforce max length
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength);
  }

  return cleaned;
}

/**
 * Sanitize an email address.
 */
export function sanitizeEmail(value: string): string {
  return value.trim().toLowerCase().slice(0, 255);
}
