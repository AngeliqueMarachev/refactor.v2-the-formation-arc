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
 * Sanitize text while the user is typing without trimming meaningful spaces.
 */
export function sanitizeTextInput(
  value: string,
  options: { maxLength?: number; multiline?: boolean } = {}
): string {
  const { maxLength = 2000, multiline = false } = options;
  const cleaned = multiline
    ? value.replace(/[^\P{C}\n\t]/gu, "")
    : value.replace(/\p{C}/gu, "");

  return cleaned.slice(0, maxLength);
}

/**
 * Keep passwords bounded and free of control characters without trimming or changing case.
 */
export function sanitizePasswordInput(value: string): string {
  return value.replace(/\p{C}/gu, "").slice(0, 128);
}

/**
 * Sanitize an email address.
 */
export function sanitizeEmail(value: string): string {
  return value.replace(/\p{C}/gu, "").trim().toLowerCase().slice(0, 255);
}
