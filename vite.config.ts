import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		// Run `ANALYZE=true npm run build` to generate stats.html with chunk sizes.
		process.env.ANALYZE === "true" &&
			visualizer({ open: true, filename: "stats.html", gzipSize: true }),
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
