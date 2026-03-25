import { describe, expect, it } from "vitest";
import {
	DROUGHT_THRESHOLDS,
	isTreeThirsty,
} from "../../src/utils/drought-thresholds";

describe("DROUGHT_THRESHOLDS", () => {
	it("baby threshold is 100 (= 10 mm rain)", () => {
		expect(DROUGHT_THRESHOLDS.baby).toBe(100);
	});
	it("junior threshold is 200 (= 20 mm rain)", () => {
		expect(DROUGHT_THRESHOLDS.junior).toBe(200);
	});
	it("senior threshold is 300 (= 30 mm rain)", () => {
		expect(DROUGHT_THRESHOLDS.senior).toBe(300);
	});
});

describe("isTreeThirsty — unknown age", () => {
	it('returns false when age is "" (unknown)', () => {
		expect(isTreeThirsty("", 0)).toBe(false);
	});
	it('returns false for "" even with zero rainfall', () => {
		expect(isTreeThirsty("", 50)).toBe(false);
	});
});

describe("isTreeThirsty — baby trees (age 0–5)", () => {
	it("is thirsty when radolan_sum is below baby threshold", () => {
		expect(isTreeThirsty(3, 99)).toBe(true);
	});
	it("is NOT thirsty when radolan_sum equals baby threshold", () => {
		expect(isTreeThirsty(3, 100)).toBe(false);
	});
	it("is NOT thirsty when radolan_sum is above baby threshold", () => {
		expect(isTreeThirsty(3, 150)).toBe(false);
	});
	it("age 0 is treated as baby", () => {
		expect(isTreeThirsty(0, 50)).toBe(true);
	});
	it("age 5 is the last baby year", () => {
		expect(isTreeThirsty(5, 50)).toBe(true);
	});
});

describe("isTreeThirsty — junior trees (age 6–10)", () => {
	it("age 6 is the first junior year", () => {
		expect(isTreeThirsty(6, 150)).toBe(true);
	});
	it("is thirsty when radolan_sum is below junior threshold", () => {
		expect(isTreeThirsty(7, 199)).toBe(true);
	});
	it("is NOT thirsty when radolan_sum equals junior threshold", () => {
		expect(isTreeThirsty(7, 200)).toBe(false);
	});
	it("is NOT thirsty when radolan_sum is above junior threshold", () => {
		expect(isTreeThirsty(7, 250)).toBe(false);
	});
	it("age 10 is the last junior year", () => {
		expect(isTreeThirsty(10, 150)).toBe(true);
	});
});

describe("isTreeThirsty — senior trees (age > 10)", () => {
	it("age 11 is the first senior year", () => {
		expect(isTreeThirsty(11, 250)).toBe(true);
	});
	it("is thirsty when radolan_sum is below senior threshold", () => {
		expect(isTreeThirsty(50, 299)).toBe(true);
	});
	it("is NOT thirsty when radolan_sum equals senior threshold", () => {
		expect(isTreeThirsty(50, 300)).toBe(false);
	});
	it("is NOT thirsty when radolan_sum is above senior threshold", () => {
		expect(isTreeThirsty(100, 400)).toBe(false);
	});
	it("works for very old trees", () => {
		expect(isTreeThirsty(172, 150)).toBe(true);
	});
});

describe("isTreeThirsty — tier boundary consistency", () => {
	it("age 5 (baby) uses baby threshold, NOT junior", () => {
		// baby threshold=100; junior threshold=200
		// at radolan_sum=150: baby would be NOT thirsty, junior would be thirsty
		expect(isTreeThirsty(5, 150)).toBe(false); // baby: 150 >= 100 → not thirsty
	});
	it("age 6 (junior) uses junior threshold, NOT baby", () => {
		expect(isTreeThirsty(6, 150)).toBe(true); // junior: 150 < 200 → thirsty
	});
	it("age 10 (junior) uses junior threshold, NOT senior", () => {
		// junior threshold=200; senior threshold=300
		// at radolan_sum=250: junior would be NOT thirsty, senior would be thirsty
		expect(isTreeThirsty(10, 250)).toBe(false); // junior: 250 >= 200 → not thirsty
	});
	it("age 11 (senior) uses senior threshold, NOT junior", () => {
		expect(isTreeThirsty(11, 250)).toBe(true); // senior: 250 < 300 → thirsty
	});
});
