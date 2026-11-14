// ui.js — handles all rendering and DOM interaction

import { fetchAllCities } from "./api.js";

const grid = document.getElementById("grid");
const searchBox = document.getElementById("search");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const stats = document.getElementById("stats");

let allCities = [];

// ── Render ────────────────────────────────────────────────────────────────────

function renderStats(cities) {
  if (!cities.length) {
    stats.textContent = "";
    return;
  }

  // reduce → average temperature
  const avgTemp = (
    cities.reduce((sum, c) => sum + c.temperature, 0) / cities.length
  ).toFixed(1);

  // sort → hottest city
  const hottest = [...cities].sort((a, b) => b.temperature - a.temperature)[0];

  // find → first city with high wind (> 20 km/h)
  const windy = cities.find((c) => c.wind > 20);

  stats.innerHTML =
    `<span>Avg temp: <strong>${avgTemp} °C</strong></span>` +
    `<span>Hottest: <strong>${hottest.name} (${hottest.temperature} °C)</strong></span>` +
    (windy
      ? `<span>High wind: <strong>${windy.name} (${windy.wind} km/h)</strong></span>`
      : "");
}

function renderCards(cities) {
  grid.innerHTML = cities
    .map(
      (c) => `
      <div class="card">
        <h2>${c.name}</h2>
        <p class="condition">${c.condition}</p>
        <div class="metrics">
          <div class="metric"><span class="label">Temp</span><span class="value">${c.temperature} °C</span></div>
          <div class="metric"><span class="label">Wind</span><span class="value">${c.wind} km/h</span></div>
          <div class="metric"><span class="label">Humidity</span><span class="value">${c.humidity} %</span></div>
        </div>
      </div>`,
    )
    .join("");
}

function applyFilter() {
  const q = searchBox.value.trim().toLowerCase();
  // filter array method
  const filtered = allCities.filter((c) => c.name.toLowerCase().includes(q));
  renderCards(filtered);
  renderStats(filtered);

  if (!filtered.length) {
    grid.innerHTML = `<p class="empty">No cities match "<strong>${q}</strong>".</p>`;
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

async function init() {
  loading.hidden = false;
  error.hidden = true;
  grid.innerHTML = "";
  stats.textContent = "";

  try {
    allCities = await fetchAllCities();
    renderCards(allCities);
    renderStats(allCities);
  } catch (e) {
    error.hidden = false;
    error.textContent =
      "⚠ Could not load weather data. Check your connection and try again.";
  } finally {
    loading.hidden = true;
  }
}
//
searchBox.addEventListener("input", applyFilter);
document.getElementById("retry").addEventListener("click", init);

init();
