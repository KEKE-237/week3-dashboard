// api.js — handles all data fetching

const CITIES = [
  { name: "Yaounde", lat: 3.866, lon: 11.51 },
  { name: "Bamenda", lat: 5.9597, lon: 10.14597 },
  { name: "New York", lat: 40.71, lon: -74.01 },
  { name: "Tokyo", lat: 35.68, lon: 139.69 },
  { name: "Paris", lat: 48.85, lon: 2.35 },
  { name: "Dubai", lat: 25.2, lon: 55.27 },
  { name: "Sydney", lat: -33.87, lon: 151.21 },
  { name: "Cairo", lat: 30.06, lon: 31.25 },
];

function buildURL(city) {
  return `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code`;
}

function weatherLabel(code) {
  if (code === 0) return "Clear Sky ☀️";
  if (code <= 3) return "Partly Cloudy ⛅";
  if (code <= 48) return "Foggy 🌫️";
  if (code <= 67) return "Rainy 🌧️";
  if (code <= 77) return "Snowy ❄️";
  if (code <= 82) return "Showers 🌦️";
  if (code <= 99) return "Thunderstorm ⛈️";
  return "Unknown";
}

async function fetchCity(city) {
  const res = await fetch(buildURL(city));
  if (!res.ok) throw new Error(`Failed to fetch ${city.name}`);
  const data = await res.json();
  const c = data.current;
  return {
    name: city.name,
    temperature: c.temperature_2m,
    wind: c.wind_speed_10m,
    humidity: c.relative_humidity_2m,
    condition: weatherLabel(c.weather_code),
  };
}

export async function fetchAllCities() {
  return Promise.all(CITIES.map(fetchCity));
}
