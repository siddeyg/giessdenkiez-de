/**
 * Drought threshold constants and helper for the "Durstige Bäume" feature.
 *
 * radolan_sum is stored in 0.1 mm units (e.g. 100 = 10 mm of rain).
 * These thresholds match the water-needs model in use-tree-water-needs-data.tsx.
 */
export const DROUGHT_THRESHOLDS = {
	baby: 100,   // age 0–5 y  → thirsty when < 10 mm rain
	junior: 200, // age 6–10 y → thirsty when < 20 mm rain
	senior: 300, // age > 10 y → thirsty when < 30 mm rain
} as const;

/**
 * Returns true when a tree is considered drought-stressed based on its age
 * and the accumulated rainfall in the last 30 days.
 *
 * Mirrors the Mapbox expression in use-tree-circle-style.tsx so both the
 * map filter and this utility always apply the same thresholds.
 *
 * @param age - tree age in years, or "" when unknown (pflanzjahr missing)
 * @param radolan_sum - accumulated rainfall in 0.1 mm units
 */
export function isTreeThirsty(age: number | "", radolan_sum: number): boolean {
	if (age === "") return false; // unknown age: never shown as thirsty
	if (age >= 0 && age <= 5) return radolan_sum < DROUGHT_THRESHOLDS.baby;
	if (age > 5 && age <= 10) return radolan_sum < DROUGHT_THRESHOLDS.junior;
	if (age > 10) return radolan_sum < DROUGHT_THRESHOLDS.senior;
	return false;
}
