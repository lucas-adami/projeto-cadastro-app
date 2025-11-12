const palette = [
  "#455A64", // cinza escuro
  "#1976D2", // azul
  "#388E3C", // verde
  "#FBC02D", // amarelo
  "#E64A19", // laranja
  "#7B1FA2", // roxo
  "#0288D1", // azul claro
  "#C2185B", // rosa
];

export function getColorByIndex(index: number) {
  return palette[index % palette.length];
}