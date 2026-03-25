import { expect, test } from "@playwright/test";

// Helper: dismiss the splash screen that blocks map interaction on first load.
async function dismissSplash(page: Parameters<typeof test>[1]["page"], isMobile: boolean) {
	if (isMobile) {
		await page.getByTestId("splash-close-button").nth(0).click();
	} else {
		await page.getByTestId("splash-close-button").nth(1).click();
	}
}

test.describe("Drought filter — Durstige Bäume", () => {
	test("filter toggle is visible in the filter panel", async ({
		page,
		isMobile,
	}) => {
		await page.goto("/map");
		await dismissSplash(page, isMobile);

		// Open the filter panel via the filter icon button.
		await page.getByTestId("filter-toggle-button").click();

		// The filter panel should be visible with the "Durstige Bäume" label.
		await expect(page.getByText("Durstige Bäume")).toBeVisible();
	});

	test("toggling 'Durstige Bäume' switch activates and deactivates the filter", async ({
		page,
		isMobile,
	}) => {
		await page.goto("/map");
		await dismissSplash(page, isMobile);

		await page.getByTestId("filter-toggle-button").click();

		// Find the switch button inside the "Durstige Bäume" row.
		const filterRow = page.getByText("Durstige Bäume").locator("..").locator("..");
		const switchBtn = filterRow.locator("button");

		// Initially the switch is off (gray border class is present).
		await expect(switchBtn).toBeVisible();
		const initialClass = await switchBtn.getAttribute("class");
		expect(initialClass).toContain("989898"); // gray = off

		// Toggle on.
		await switchBtn.click();
		const enabledClass = await switchBtn.getAttribute("class");
		expect(enabledClass).toContain("gdk-blue"); // blue = on

		// Toggle off again.
		await switchBtn.click();
		const disabledClass = await switchBtn.getAttribute("class");
		expect(disabledClass).toContain("989898"); // back to gray
	});

	test("filter badge count increases when drought filter is active", async ({
		page,
		isMobile,
	}) => {
		await page.goto("/map");
		await dismissSplash(page, isMobile);

		// Before: no badge visible (no active filters).
		await expect(page.getByTestId("filter-toggle-button").locator("div")).toHaveCount(0);

		// Open filter, enable drought filter.
		await page.getByTestId("filter-toggle-button").click();
		const filterRow = page.getByText("Durstige Bäume").locator("..").locator("..");
		await filterRow.locator("button").click();

		// Close filter panel.
		await page.getByText("Anzeigen").click();

		// Badge should now show "1".
		const badge = page.getByTestId("filter-toggle-button").locator("div div");
		await expect(badge).toBeVisible();
		await expect(badge).toHaveText("1");
	});

	test("'Zurücksetzen' clears the drought filter", async ({
		page,
		isMobile,
	}) => {
		await page.goto("/map");
		await dismissSplash(page, isMobile);

		// Enable drought filter.
		await page.getByTestId("filter-toggle-button").click();
		const filterRow = page.getByText("Durstige Bäume").locator("..").locator("..");
		const switchBtn = filterRow.locator("button");
		await switchBtn.click();

		// Verify it's on.
		const enabledClass = await switchBtn.getAttribute("class");
		expect(enabledClass).toContain("gdk-blue");

		// Reset.
		await page.getByText("Zurücksetzen").click();

		// Reopen to verify it's off.
		await page.getByTestId("filter-toggle-button").click();
		const resetClass = await switchBtn.getAttribute("class");
		expect(resetClass).toContain("989898");
	});
});
