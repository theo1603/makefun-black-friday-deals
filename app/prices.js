// Price maths for Lantern Deals. Every figure shown comes from these
// functions, so a discount can never disagree with its two prices.

export function money(value) {
  return "$" + value.toFixed(2).replace(/\.00$/, "");
}

export function moneyFull(value) {
  return "$" + value.toFixed(2);
}

export function discountPct(deal) {
  return Math.round((1 - deal.sale / deal.usual) * 100);
}

export function savedAmount(deal) {
  return deal.usual - deal.sale;
}

export function verdictLabel(verdict) {
  if (verdict === "new-low") return "New low";
  if (verdict === "strong") return "Strong price";
  return "Routine sale";
}
