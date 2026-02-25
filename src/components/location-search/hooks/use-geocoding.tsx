import { useRef, useState } from "react";

export interface GeocodingResult {
	id: string;
	place_name_de: string;
	geometry: {
		coordinates: [number, number];
	};
}

export interface GeocodingResultState {
	geocodingResults: GeocodingResult[];
	clearGeocodingResults: () => void;
	fetchGeocodingResults: (search: string) => void;
}

export function useGeocoding(): GeocodingResultState {
	const [geocodingResults, setGeocodingResults] = useState<GeocodingResult[]>(
		[],
	);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const abortRef = useRef<AbortController | null>(null);

	const clearGeocodingResults = () => {
		setGeocodingResults([]);
	};

	const fetchGeocodingResults = (search: string) => {
		if (search.trim().length < 2) {
			setGeocodingResults([]);
			return;
		}

		if (debounceRef.current) clearTimeout(debounceRef.current);

		debounceRef.current = setTimeout(async () => {
			if (abortRef.current) abortRef.current.abort();
			abortRef.current = new AbortController();

			try {
				const geocodingUrl = `${
					import.meta.env.VITE_MAPBOX_API_ENDPOINT
				}/geocoding/v5/mapbox.places/${search}.json?autocomplete=true&language=de&country=de&bbox=${
					import.meta.env.VITE_MAP_BOUNDING_BOX
				}&access_token=${import.meta.env.VITE_MAPBOX_API_KEY}`;
				const res = await fetch(geocodingUrl, {
					signal: abortRef.current.signal,
				});
				if (!res.ok) {
					return;
				}
				const json = (await res.json()) as { features: GeocodingResult[] };
				setGeocodingResults(json.features);
			} catch (e) {
				if (e instanceof DOMException && e.name === "AbortError") return;
				setGeocodingResults([]);
			}
		}, 300);
	};

	return { geocodingResults, clearGeocodingResults, fetchGeocodingResults };
}
