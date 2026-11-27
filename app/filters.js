// Filtering and sorting for Lantern Deals. Pure functions over the deal
// list: given a state, return the deals to show, in display order.

import { discountPct } from "./prices.js";

export function blankState() {
  return { query: "", category: "All", store: "All", minDiscount: 0, sort: "best" };
}

export function applyFilters(deals, state) {
  const q = state.query.trim().toLowerCase();
  return deals.filter((deal) => {
    if (state.category !== "All" && deal.category !== state.category) return false;
    if (state.store !== "All" && deal.store !== state.store) return false;
    if (discountPct(deal) < state.minDiscount) return false;
    if (q) {
      const hay = (deal.product + " " + deal.store + " " + deal.category).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sortDeals(deals, sort) {
  const list = deals.slice();
  if (sort === "best") {
    list.sort((a, b) => discountPct(b) - discountPct(a) || a.sale - b.sale);
  } else if (sort === "saving") {
    list.sort((a, b) => b.usual - b.sale - (a.usual - a.sale));
  } else if (sort === "low") {
    list.sort((a, b) => a.sale - b.sale);
  } else if (sort === "high") {
    list.sort((a, b) => b.sale - a.sale);
  }
  return list;
}

export function visibleDeals(deals, state) {
  return sortDeals(applyFilters(deals, state), state.sort);
}
