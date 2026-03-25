import { expect, test } from "@playwright/test";

// Grant geolocation permission for these tests. Coordinates are Bonn city centre.
// Playwright injects this location when the page calls navigator.geolocation.getCurrentPosition().
test.use({
	permissions: ["geolocation"],
	geolocation: { latitude: 50.73438, longitude: 7.09548 },
});

async function dismissSplash(page: Parameters<typeof test>[1]["page"], isMobile: boolean) {
	if (isMobile) {
		await page.getByTestId("splash-close-button").nth(0).click();
	} else {
		await page.getByTestId("splash-close-button").nth(1).click();
	}
}

test.describe("Find thirsty tree — Durstig button", () => {
	test("clicking 'Durstig' opens the find-thirsty-tree drawer", async ({
		page,
		isMobile,
	}) => {
		await page.goto("/map");
		await dismissSplash(page, isMobile);

		// Click the Durstig button (identified by its title attribute).
		await page.getByTitle("Durstig").click();

		// The drawer has role="dialog" and aria-label "Durstige Bäume in der Nähe".
		const drawer = page.getByRole("dialog", {
			name: "Durstige Bäume in der Nähe",
		});
		await expect(drawer).toBeVisible();
	});

	test("drawer shows a status message while locating / after done", async ({
		page,
		isMobile,
	}) => {
		await page.goto("/map");
		await dismissSplash(page, isMobile);

		await page.getByTitle("Durstig").click();

		const drawer = page.getByRole("dialog", {
			name: "Durstige Bäume in der Nähe",
		});
		await expect(drawer).toBeVisible();

		// One of three possible end states must appear within 10 s:
		//   1. Results list (at least one tree name visible)
		//   2. "Keine durstigen Bäume …" (no thirsty trees nearby)
		//   3. "Standort konnte nicht ermittelt werden." (location error)
		await expect(
			drawer.getByText(/Keine durstigen Bäume|durstigen Bäume in der Nähe|Standort konnte nicht|Jungbaum|Besonders durstig/),
		).toBeVisible({ timeout: 10000 });
	});

	test("closing the drawer hides it", async ({ page, isMobile }) => {
		await page.goto("/map");
		await dismissSplash(page, isMobile);

		await page.getByTitle("Durstig").click();

		const drawer = page.getByRole("dialog", {
			name: "Durstige Bäume in der Nähe",
		});
		await expect(drawer).toBeVisible();

		// The button that opened the drawer acts as the close toggle.
		await page.getByTitle("Durstig").click();
		await expect(drawer).not.toBeVisible();
	});
});
