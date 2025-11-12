export function isExpirado(timestamp: number, validadeMinutos: number): boolean {
  const agora = Date.now();
  const diffMinutos = (agora - timestamp) / 1000 / 60;
  return diffMinutos > validadeMinutos;
}
