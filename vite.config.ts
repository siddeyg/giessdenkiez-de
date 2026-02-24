import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
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
