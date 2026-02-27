import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { App } from "./app";
import "mapbox-gl/dist/mapbox-gl.css";
import "./index.css";

// Register service worker for Mapbox tile + GLB model caching.
// autoUpdate: SW activates immediately on next page load when a new version deploys.
registerSW({ immediate: true });

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
