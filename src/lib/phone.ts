const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  if (digits.length === 11 && BD_PHONE_REGEX.test(digits)) {
    return digits;
  }

  if (digits.length === 13 && digits.startsWith("880")) {
    const local = `0${digits.slice(3)}`;
    return BD_PHONE_REGEX.test(local) ? local : null;
  }

  if (digits.length === 10 && digits.startsWith("1")) {
    const local = `0${digits}`;
    return BD_PHONE_REGEX.test(local) ? local : null;
  }

  return null;
}

export function isValidBdPhone(input: string): boolean {
  return normalizePhone(input) !== null;
}
