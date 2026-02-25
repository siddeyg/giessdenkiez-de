import * as mapboxgl from "mapbox-gl";
import React, { useEffect } from "react";
import { useMapStore } from "../map-store";
import { useTreeCircleStyle } from "./use-tree-circle-style";
import { useMapConstants } from "./use-map-constants";
import { useMapTreesInteraction } from "./use-map-trees-interaction";
import { useMapPumpsInteraction } from "./use-map-pumps-interaction";
import { useFilterStore } from "../../filter/filter-store";
import { usePumpIconStyle } from "./use-pump-icon-style";
import { useMapInteraction } from "./use-map-interaction";
import { useTreeStore } from "../../tree-detail/stores/tree-store";
import { AccumulatedTreeWateringData } from "../../tree-detail/tree-types";

export function useMapSetup(
	mapContainer: React.MutableRefObject<HTMLDivElement | null>,
) {
	const {
		MAP_PITCH_DEGREES,
		MAP_MIN_ZOOM_LEVEL,
		MAP_MAX_ZOOM_LEVEL,
		MAP_INITIAL_ZOOM_LEVEL,
		MAP_CENTER_LNG,
		MAP_CENTER_LAT,
		MAP_PUMP_IMAGE_ICONS,
		MAP_LOCATION_ZOOM_LEVEL,
	} = useMapConstants();

	const { map, setMap, setIsMapLoaded } = useMapStore();

	useMapTreesInteraction(map);
	useMapPumpsInteraction(map);
	useMapInteraction(map);

	const {
		circleRadius,
		circleOpacity,
		circleStrokeColor,
		circleColor,
		circleStrokeWidth,
	} = useTreeCircleStyle();

	const { selectedPumpIcon, unselectedPumpIcon, pumpIconSize } =
		usePumpIconStyle();

	const isPumpsVisible = useFilterStore((store) => store.isPumpsVisible);

	useEffect(() => {
		if (!mapContainer.current) {
			return;
		}

		const isMobile = window.innerWidth < 768;

		const testMode = import.meta.env.VITE_PW_TEST === "true";

		const initializedMap = new mapboxgl.Map({
			container: mapContainer.current,
			style: import.meta.env.VITE_MAPBOX_STYLE_URL,
			center: [MAP_CENTER_LNG, MAP_CENTER_LAT],
			zoom: MAP_INITIAL_ZOOM_LEVEL,
			minZoom: MAP_MIN_ZOOM_LEVEL,
			maxZoom: MAP_MAX_ZOOM_LEVEL,
			pitch: isMobile ? 0 : MAP_PITCH_DEGREES,
			testMode,
		});

		initializedMap.dragRotate.disable();
		initializedMap.touchZoomRotate.disableRotation();

		// Dismiss the loading screen after 3 seconds even if the Mapbox "load"
		// event is delayed (Standard style initialization — shader compilation,
		// 3D model pipeline, CDN resources — can take 10-15s). The user sees
		// the base map immediately; the gdk-trees circle layer is added later
		// when "load" fires.
		const loadingFallbackTimeout = setTimeout(() => {
			setIsMapLoaded(true);
		}, 3000);

		initializedMap.on("load", async () => {
			clearTimeout(loadingFallbackTimeout);
			initializedMap.addSource("trees", {
				type: "vector",
				url: import.meta.env.VITE_MAPBOX_TREES_TILESET_URL,
				promoteId: "id",
			});

			initializedMap.addLayer({
				id: "trees",
				type: "circle",
				source: "trees",
				"source-layer": import.meta.env.VITE_MAPBOX_TREES_TILESET_LAYER,
				paint: {
					"circle-pitch-alignment": "map",
					"circle-radius": circleRadius,
					"circle-opacity": circleOpacity,
					"circle-stroke-color": circleStrokeColor,
					"circle-color": circleColor,
					"circle-stroke-width": circleStrokeWidth,
				},
			});

			Promise.all(
				MAP_PUMP_IMAGE_ICONS.map(
					(img) =>
						new Promise<void>((resolve) => {
							initializedMap.loadImage(img.url, function (error, image) {
								if (error || !image) {
									return;
								}
								initializedMap.addImage(img.id, image);
								resolve();
							});
						}),
				),
			).then(() => {
				initializedMap.addSource("pumps", {
					type: "geojson",
					data: import.meta.env.VITE_MAP_PUMPS_SOURCE_URL || {
						type: "FeatureCollection",
						features: [],
					},
					promoteId: "id",
				});

				initializedMap.addLayer({
					id: "pumps",
					type: "symbol",
					source: "pumps",
					layout: {
						"icon-allow-overlap": true,
						"icon-anchor": "top",
						visibility: isPumpsVisible ? "visible" : "none",
						"icon-image": unselectedPumpIcon,
						"icon-size": pumpIconSize,
					},
				});

				initializedMap.addLayer({
					id: "pumps-highlight",
					type: "symbol",
					source: "pumps",
					filter: ["==", "id", ""],
					layout: {
						"icon-allow-overlap": true,
						"icon-anchor": "top",
						visibility: isPumpsVisible ? "visible" : "none",
						"icon-image": selectedPumpIcon,
						"icon-size": pumpIconSize,
					},
				});
			});
			// Hide 3D tree models rendered by the Mapbox Standard style.
			// These come from OSM/Mapbox data and are visually confusing because
			// they look like clickable trees but are not GDK features.
			// GDK tree circles (the "trees" layer) remain unaffected.
			initializedMap
				.getStyle()
				?.layers.filter((layer) => layer.type === "model")
				.forEach((layer) => {
					try {
						initializedMap.setLayoutProperty(
							layer.id,
							"visibility",
							"none",
						);
					} catch {
						// Some Standard style layers may not support the
						// visibility property; silently ignore those.
					}
				});

			setIsMapLoaded(true);
		});

		const geoLocateControl = new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true,
			},
			// Draw an arrow next to the location dot to indicate which direction the device is heading.
			showUserHeading: true,
			showAccuracyCircle: false,
		});
		geoLocateControl.on("geolocate", function (e) {
			const { coords } = e as {
				coords: { longitude: number; latitude: number };
			};

			initializedMap.easeTo({
				center: [coords.longitude, coords.latitude],
				zoom: MAP_LOCATION_ZOOM_LEVEL,
				pitch: isMobile ? 0 : MAP_PITCH_DEGREES,
			});
		});
		initializedMap.addControl(geoLocateControl, "bottom-left");
		initializedMap.addControl(
			new mapboxgl.NavigationControl({
				showCompass: false,
				showZoom: !isMobile,
			}),
			"bottom-left",
		);

		setMap(initializedMap);

		return () => {
			clearTimeout(loadingFallbackTimeout);
		};
	}, [mapContainer]);

	const { todaysWaterings } = useTreeStore();

	useEffect(() => {
		const updateFeatureStates = (waterings: AccumulatedTreeWateringData) => {
			for (const treeId in waterings) {
				const amount = todaysWaterings[treeId];
				map?.setFeatureState(
					{
						id: treeId,
						source: "trees",
						sourceLayer: "trees",
					},
					{ todays_waterings: amount },
				);
			}
		};

		if (map && Object.keys(todaysWaterings).length > 0) {
			if (map.isStyleLoaded()) {
				updateFeatureStates(todaysWaterings);
			} else {
				map.once("idle", () => {
					updateFeatureStates(todaysWaterings);
				});
			}
		}
	}, [todaysWaterings, map]);
}
