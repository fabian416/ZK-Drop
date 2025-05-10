// lib/regions.ts

export type Region =
  | "North America"
  | "South America"
  | "Europe"
  | "Africa"
  | "Asia"
  | "Oceania"
  | "Unknown"

export function detectRegion(lat: number, lon: number): Region {
  if (lat >= 15 && lat <= 72 && lon >= -170 && lon <= -50) return "North America"
  if (lat >= -60 && lat < 15 && lon >= -90 && lon <= -30) return "South America"
  if (lat >= 35 && lat <= 70 && lon >= -25 && lon <= 60) return "Europe"
  if (lat >= -35 && lat <= 37 && lon >= -20 && lon <= 55) return "Africa"
  if (lat >= 5 && lat <= 80 && lon >= 25 && lon <= 180) return "Asia"
  if (lat >= -50 && lat <= 10 && lon >= 110 && lon <= 180) return "Oceania"
  return "Unknown"
}