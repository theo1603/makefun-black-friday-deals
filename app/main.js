// Boot for Lantern Deals: wires the controls to the deal list, reads the
// starting filters from the page address (?q=, ?cat=, ?store=, ?min=, ?sort=)
// so a shared link opens the same filtered view, and re-renders on change.

import { DEALS, CATEGORIES, STORES, CHECKED_AT } from "./deals.js";
import { blankState, visibleDeals } from "./filters.js";
import { renderDeals, renderCounts, renderTopStrip, renderSummary } from "./render.js";

const state = blankState();
const params = new URLSearchParams(window.location.search);
if (params.get("q")) state.query = params.get("q");
if (params.get("cat") && (params.get("cat") === "All" || CATEGORIES.includes(params.get("cat")))) {
  state.category = params.get("cat");
}
if (params.get("store") && (params.get("store") === "All" || STORES.includes(params.get("store")))) {
  state.store = params.get("store");
}
const min = parseInt(params.get("min") || "0", 10);
if (!Number.isNaN(min) && min >= 0 && min <= 60) state.minDiscount = min;
if (["best", "saving", "low", "high"].includes(params.get("sort"))) state.sort = params.get("sort");

const searchInput = document.getElementById("search");
const categoryRow = document.getElementById("categories");
const storeSelect = document.getElementById("store");
const discountSelect = document.getElementById("discount");
const sortSelect = document.getElementById("sort");
const grid = document.getElementById("grid");
const countEl = document.getElementById("count");
const strip = document.getElementById("top-strip");
const summaryEl = document.getElementById("summary");
const checkedEl = document.getElementById("checked-at");

checkedEl.textContent = "All prices checked " + CHECKED_AT + " — re-check before you buy, prices move fast on Black Friday.";
renderTopStrip(strip, DEALS);
renderSummary(summaryEl, DEALS);

for (const store of STORES) {
  const opt = document.createElement("option");
  opt.value = store;
  opt.textContent = store;
  storeSelect.append(opt);
}

function pill(label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "pill" + (state.category === label ? " active" : "");
  button.textContent = label;
  button.setAttribute("aria-pressed", state.category === label ? "true" : "false");
  button.addEventListener("click", () => {
    state.category = label;
    syncPills();
    refresh();
  });
  return button;
}

function syncPills() {
  const buttons = categoryRow.querySelectorAll("button");
  buttons.forEach((button) => {
    const on = button.textContent === state.category;
    button.classList.toggle("active", on);
    button.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

categoryRow.append(pill("All"));
for (const cat of CATEGORIES) categoryRow.append(pill(cat));

searchInput.value = state.query;
storeSelect.value = state.store;
discountSelect.value = String(state.minDiscount);
sortSelect.value = state.sort;

searchInput.addEventListener("input", () => {
  state.query = searchInput.value;
  refresh();
});
storeSelect.addEventListener("change", () => {
  state.store = storeSelect.value;
  refresh();
});
discountSelect.addEventListener("change", () => {
  state.minDiscount = parseInt(discountSelect.value, 10);
  refresh();
});
sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  refresh();
});

function refresh() {
  const shown = visibleDeals(DEALS, state);
  renderDeals(grid, shown);
  renderCounts(countEl, shown.length, DEALS.length, state);
}

refresh();
