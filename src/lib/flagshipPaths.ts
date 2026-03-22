export const flagshipPaths = new Set([
  '/antivirusines-programos',
  '/antivirusines-programos/nemokamos',
  '/antivirusines-programos/telefonui',
  '/antivirusines-programos/kompiuteriui',
  '/tevu-kontrole',
  '/slaptazodziu-saugumas',
  '/slaptazodziu-saugumas/slaptazodziu-tvarkykles',
  '/slaptazodziu-saugumas/kaip-pakeisti-gmail-slaptazodi',
  '/slaptazodziu-saugumas/kaip-pakeisti-wifi-slaptazodi',
  '/slaptazodziu-saugumas/ka-daryti-pamirsus-slaptazodi',
  '/virusai/kompiuterinis-virusas',
  '/virusai/virusas-telefone',
  '/virusai/kaip-patikrinti-ar-kompiuteryje-yra-virusas',
  '/virusai/reklamos-virusas-telefone',
]);

export function isFlagshipPath(path: string) {
  return flagshipPaths.has(path);
}