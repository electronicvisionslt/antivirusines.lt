const lithuanianMap: Record<string, string> = {
  'ą': 'a', 'č': 'c', 'ę': 'e', 'ė': 'e', 'į': 'i', 'š': 's',
  'ų': 'u', 'ū': 'u', 'ž': 'z',
  'Ą': 'a', 'Č': 'c', 'Ę': 'e', 'Ė': 'e', 'Į': 'i', 'Š': 's',
  'Ų': 'u', 'Ū': 'u', 'Ž': 'z',
};

export function generateSlug(text: string): string {
  return text
    .split('')
    .map(c => lithuanianMap[c] || c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
