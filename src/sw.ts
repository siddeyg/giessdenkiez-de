/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import type { WorkboxPlugin } from "workbox-core";

declare const self: ServiceWorkerGlobalScope;

// ---------------------------------------------------------------------------
// App shell precaching
// vite-plugin-pwa injects the asset manifest here at build time.
// Content-hashed JS/CSS chunks are precached and updated automatically.
// ---------------------------------------------------------------------------
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// ---------------------------------------------------------------------------
// Update handling
// With registerType: 'autoUpdate', vite-plugin-pwa sends SKIP_WAITING
// automatically when a new SW version is waiting.
// ---------------------------------------------------------------------------
self.addEventListener("message", (event) => {
	if (event.data?.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});

// ---------------------------------------------------------------------------
// Shared plugin: strip Mapbox session params from cache keys.
// access_token and sku change every browser session — if included in the
// cache key, no tile is ever a cache hit. Stripping them means z/x/y
// coordinates (the actual tile identity) form the stable cache key.
// ---------------------------------------------------------------------------
const makeMapboxKeyPlugin = (): WorkboxPlugin => ({
	cacheKeyWillBeUsed: async ({ request }) => {
		const url = new URL(request.url);
		url.searchParams.delete("access_token");
		url.searchParams.delete("sku");
		url.searchParams.delete("SKU");
		return url.href;
	},
});

// ---------------------------------------------------------------------------
// Route 1: Mapbox vector tiles (.pbf)
// Strategy: CacheFirst — tile content is deterministic for a given z/x/y.
// TTL: 24h — matches GdK's daily tileset regeneration via DWD harvester.
//   (Using 7d would serve stale rain/watering data for up to a week.)
// Max entries: 500 — covers ~22 tiles/view × ~20 viewport positions.
// ---------------------------------------------------------------------------
registerRoute(
	({ url }) =>
		url.hostname === "api.mapbox.com" &&
		url.pathname.includes(".vector.pbf"),
	new CacheFirst({
		cacheName: "mapbox-tiles",
		plugins: [
			makeMapboxKeyPlugin(),
			new ExpirationPlugin({
				maxEntries: 500,
				maxAgeSeconds: 24 * 60 * 60, // 24h — daily tileset updates
				purgeOnQuotaError: true,
			}),
		],
	}),
);

// ---------------------------------------------------------------------------
// Route 2: Mapbox 3D GLB model files
// Strategy: CacheFirst — GLB models are static binary assets that rarely
// change. These files block map.on("load") in Mapbox Standard style even
// when show3dTrees=false — caching them is the highest single-resource win:
// ~300 KB + 12 round-trips eliminated on warm visits.
// TTL: 30 days (within Mapbox ToS 30-day device cache limit).
// ---------------------------------------------------------------------------
registerRoute(
	({ url }) =>
		url.hostname === "api.mapbox.com" &&
		url.pathname.endsWith(".glb"),
	new CacheFirst({
		cacheName: "mapbox-models",
		plugins: [
			makeMapboxKeyPlugin(),
			new ExpirationPlugin({
				maxEntries: 30,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
				purgeOnQuotaError: true,
			}),
		],
	}),
);

// ---------------------------------------------------------------------------
// Route 3: Mapbox style JSON, sprites, and glyph/font PBFs
// Strategy: StaleWhileRevalidate — serve cached immediately (fast startup),
// refresh in background so style updates propagate on the next visit.
// ---------------------------------------------------------------------------
registerRoute(
	({ url }) =>
		url.hostname === "api.mapbox.com" &&
		(url.pathname.startsWith("/styles/v1/") ||
			url.pathname.startsWith("/fonts/v1/")),
	new StaleWhileRevalidate({
		cacheName: "mapbox-style-assets",
		plugins: [
			makeMapboxKeyPlugin(),
			new ExpirationPlugin({
				maxEntries: 50,
				maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
				purgeOnQuotaError: true,
			}),
		],
	}),
);

// ---------------------------------------------------------------------------
// NOT cached (handled by network only, implicit in SW):
// - Supabase auth (/auth/v1/*) — must always be fresh
// - Supabase REST mutations (POST /rest/v1/*) — never cache writes
// - Mapbox geocoding (/geocoding/v5/*) — access_token embedded, user-specific
// - Mapbox telemetry (events.mapbox.com) — analytics, not intercepted
// ---------------------------------------------------------------------------
