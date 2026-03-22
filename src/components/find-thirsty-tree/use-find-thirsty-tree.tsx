import { useState } from "react";
import { supabaseClient } from "../../auth/supabase-client";

export interface ThirstyTree {
	id: string;
	lat: number;
	lng: number;
	radolan_sum: number;
	pflanzjahr: number | null;
	art_dtsch: string | null;
	distance_m: number;
	last_watered: string | null;
}

type Status = "idle" | "locating" | "loading" | "done" | "error";

interface FindThirstyTreeState {
	status: Status;
	results: ThirstyTree[];
	errorMessage: string | undefined;
	find: () => void;
	clear: () => void;
}

export function useFindThirstyTree(): FindThirstyTreeState {
	const [status, setStatus] = useState<Status>("idle");
	const [results, setResults] = useState<ThirstyTree[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();

	const find = () => {
		if (!navigator.geolocation) {
			setErrorMessage("Geolocation is not supported by your browser.");
			setStatus("error");
			return;
		}

		setStatus("locating");
		setResults([]);
		setErrorMessage(undefined);

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				setStatus("loading");
				const { latitude, longitude } = position.coords;

				const { data, error } = await supabaseClient
					.rpc("get_trees_needing_water", {
						p_lat: latitude,
						p_lng: longitude,
						radius_m: 550,
						max_results: 5,
					})
					.select("*");

				if (error) {
					setErrorMessage(error.message);
					setStatus("error");
					return;
				}

				setResults((data as ThirstyTree[]) ?? []);
				setStatus("done");
			},
			(_err) => {
				setErrorMessage("Location access denied.");
				setStatus("error");
			},
			{ timeout: 10000 },
		);
	};

	const clear = () => {
		setStatus("idle");
		setResults([]);
		setErrorMessage(undefined);
	};

	return { status, results, errorMessage, find, clear };
}
