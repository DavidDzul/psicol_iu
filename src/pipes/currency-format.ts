export const currencyFormat = (cost: number) => Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(cost)
