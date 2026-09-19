const BD_COURIER_PHONE_REGEX = /^01\d{9}$/;

/** Client-safe phone normalizer for BD Courier checks. */
export function normalizeBdCourierPhoneClient(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  if (digits.length === 11 && BD_COURIER_PHONE_REGEX.test(digits)) {
    return digits;
  }

  if (digits.length === 13 && digits.startsWith("880")) {
    const local = `0${digits.slice(3)}`;
    return BD_COURIER_PHONE_REGEX.test(local) ? local : null;
  }

  if (digits.length === 10 && digits.startsWith("1")) {
    const local = `0${digits}`;
    return BD_COURIER_PHONE_REGEX.test(local) ? local : null;
  }

  return null;
}
