import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		// Run `ANALYZE=true npm run build` to generate stats.html with chunk sizes.
		process.env.ANALYZE === "true" &&
			visualizer({ open: true, filename: "stats.html", gzipSize: true }),
		VitePWA({
			// InjectManifest mode: we provide our own sw.ts with custom Workbox
			// routing (Mapbox tile caching with token-stripping cache keys).
			// generateSW mode cannot support custom cacheKeyWillBeUsed plugins.
			strategies: "injectManifest",
			srcDir: "src",
			filename: "sw.ts",

			// autoUpdate: new SW activates immediately on next page load.
			// No UI prompt needed — the app has no user-initiated sessions that
			// would be disrupted by a reload.
			registerType: "autoUpdate",

			injectManifest: {
				// Precache: JS/CSS chunks (content-hashed), HTML, fonts.
				// Images are NOT precached upfront — they are cached on first use
				// by the browser's HTTP cache (pump PNGs are preloaded in index.html).
				// Leaf/species PNGs (~590 KB total) are too large to precache.
				globPatterns: ["**/*.{js,css,html,woff2}"],
				globIgnores: ["**/node_modules/**", "**/*.map", "**/stats.html"],
			},

			manifest: {
				name: "Gieß den Kiez",
				short_name: "GdK",
				description: "Water your neighborhood — track tree watering in your city",
				theme_color: "#ffffff",
				background_color: "#ffffff",
				display: "standalone",
				start_url: "/map",
				icons: [
					{
						src: "/images/icon-tree.svg",
						sizes: "any",
						type: "image/svg+xml",
						purpose: "any",
					},
				],
			},

			devOptions: {
				// Enable SW in dev mode so caching behaviour can be tested locally.
				// Disable if the SW interferes with hot-module replacement.
				enabled: false,
				type: "module",
			},
		}),
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					"vendor-d3": ["d3", "d3-contour"],
					"vendor-supabase": ["@supabase/supabase-js"],
				},
			},
		},
	},
});
