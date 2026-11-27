// Rendering for Lantern Deals: turns a deal list into cards and keeps the
// counts, the top-deal strip and the empty state in step with the filters.

import { money, moneyFull, discountPct, savedAmount, verdictLabel } from "./prices.js";
import { CHECKED_LABEL } from "./deals.js";

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function verdictClass(verdict) {
  return "badge badge-" + verdict;
}

export function dealCard(deal) {
  const card = el("article", "card");
  const top = el("div", "card-top");
  top.append(el("span", "cat", deal.category));
  top.append(el("span", verdictClass(deal.verdict), verdictLabel(deal.verdict)));
  card.append(top);

  card.append(el("h3", "name", deal.product));

  const storeRow = el("p", "store");
  storeRow.append(el("span", "store-name", deal.store));
  storeRow.append(document.createTextNode(" · Black Friday 2026"));
  card.append(storeRow);

  const priceRow = el("p", "prices");
  priceRow.append(el("span", "sale", money(deal.sale)));
  priceRow.append(el("span", "usual", moneyFull(deal.usual)));
  priceRow.append(el("span", "off", "-" + discountPct(deal) + "%"));
  card.append(priceRow);

  card.append(el("p", "save", "You save " + money(savedAmount(deal)) + " vs the usual price."));

  const ev = el("p", "evidence");
  ev.append(el("strong", null, "Is it really a deal? "));
  ev.append(document.createTextNode(deal.evidence));
  card.append(ev);

  if (deal.note) card.append(el("p", "note", deal.note));

  const meta = el("p", "meta");
  meta.append(document.createTextNode(CHECKED_LABEL + " · Source: " + deal.source));
  card.append(meta);

  const link = el("a", "buy", "View at " + deal.store + " →");
  link.href = deal.link;
  link.target = "_blank";
  link.rel = "noopener";
  card.append(link);
  return card;
}

export function renderDeals(container, deals) {
  container.textContent = "";
  if (deals.length === 0) {
    const empty = el("div", "empty");
    empty.append(el("h3", null, "No deals match those filters."));
    empty.append(el("p", null, "Try a different search word, a lower discount, or another store."));
    container.append(empty);
    return;
  }
  for (const deal of deals) container.append(dealCard(deal));
}

export function renderCounts(countEl, shown, total, state) {
  let text = shown + " of " + total + " deals";
  const active = [];
  if (state.category !== "All") active.push(state.category);
  if (state.store !== "All") active.push(state.store);
  if (state.minDiscount > 0) active.push(state.minDiscount + "% off or more");
  if (state.query.trim()) active.push('matching "' + state.query.trim() + '"');
  if (active.length) text += " — " + active.join(" · ");
  countEl.textContent = text;
}

export function renderTopStrip(strip, deals) {
  strip.textContent = "";
  const best = deals.slice().sort((a, b) => discountPct(b) - discountPct(a)).slice(0, 3);
  for (const deal of best) {
    const chip = el("div", "top-chip");
    chip.append(el("span", "top-pct", "-" + discountPct(deal) + "%"));
    chip.append(el("span", "top-name", deal.product));
    chip.append(el("span", "top-price", money(deal.sale) + " at " + deal.store));
    strip.append(chip);
  }
}

export function renderSummary(summaryEl, deals) {
  const totalSaved = deals.reduce((sum, d) => sum + savedAmount(d), 0);
  const newLows = deals.filter((d) => d.verdict === "new-low").length;
  summaryEl.textContent =
    deals.length +
    " deals · " +
    newLows +
    " new lows · " +
    money(totalSaved) +
    " total savings if you bought one of each";
}
