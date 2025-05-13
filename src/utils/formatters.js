// utils/formatters.js
export function formatarValorMonetario(valor) {
  const parsed = Number(valor);
  if (isNaN(parsed)) return "R$ 0,00";

  return parsed.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}
