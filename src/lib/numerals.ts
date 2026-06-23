const BENGALI_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Convert Bengali numerals in a string to English (0-9). */
export function toEnglishDigits(value: string | number): string {
  const text = String(value);
  return text.replace(/[০-৯]/g, (digit) =>
    String(BENGALI_DIGITS.indexOf(digit))
  );
}
